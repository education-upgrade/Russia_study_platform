create extension if not exists pgcrypto;

-- Repair Architecture Step 3 after discovering that some projects already
-- contain an unrelated public.classes table. This migration deliberately
-- leaves public.classes untouched and uses public.teaching_classes instead.

-- Remove only the Step 3 objects that may have been created before the failed
-- classes.school_id index statement. Existing legacy public.classes data is
-- never altered or dropped.
drop function if exists public.join_class_by_code(text);
drop function if exists public.create_classroom(text, text, text);
drop function if exists public.is_class_student(uuid);
drop function if exists public.is_class_teacher(uuid);
drop function if exists public.generate_class_join_code();

drop table if exists public.class_memberships cascade;
drop table if exists public.class_teachers cascade;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teaching_classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 80),
  academic_year text,
  join_code text not null unique check (join_code ~ '^[A-Z0-9]{6}$'),
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (school_id, name)
);

create table public.class_teachers (
  class_id uuid not null references public.teaching_classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (class_id, teacher_id)
);

create table public.class_memberships (
  class_id uuid not null references public.teaching_classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),
  status text not null default 'active' check (status in ('active', 'removed')),
  primary key (class_id, student_id)
);

create index if not exists class_teachers_teacher_idx on public.class_teachers(teacher_id);
create index if not exists class_memberships_student_idx on public.class_memberships(student_id);
create index if not exists teaching_classes_school_idx on public.teaching_classes(school_id);

alter table public.schools enable row level security;
alter table public.teaching_classes enable row level security;
alter table public.class_teachers enable row level security;
alter table public.class_memberships enable row level security;

drop policy if exists "school members can read schools" on public.schools;

create or replace function public.is_class_teacher(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.class_teachers
    where class_id = target_class and teacher_id = auth.uid()
  ) or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.is_class_student(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.class_memberships
    where class_id = target_class and student_id = auth.uid() and status = 'active'
  );
$$;

create policy "school members can read schools" on public.schools
for select to authenticated
using (
  exists (
    select 1 from public.teaching_classes c
    where c.school_id = schools.id
      and (public.is_class_teacher(c.id) or public.is_class_student(c.id))
  )
  or created_by = auth.uid()
);

create policy "class members can read teaching classes" on public.teaching_classes
for select to authenticated
using (public.is_class_teacher(id) or public.is_class_student(id));

create policy "teachers can update own teaching classes" on public.teaching_classes
for update to authenticated
using (public.is_class_teacher(id))
with check (public.is_class_teacher(id));

create policy "class teachers can read teacher links" on public.class_teachers
for select to authenticated
using (public.is_class_teacher(class_id) or public.is_class_student(class_id));

create policy "class members can read memberships" on public.class_memberships
for select to authenticated
using (public.is_class_teacher(class_id) or student_id = auth.uid());

create policy "teachers can update memberships" on public.class_memberships
for update to authenticated
using (public.is_class_teacher(class_id))
with check (public.is_class_teacher(class_id));

create or replace function public.generate_class_join_code()
returns text
language plpgsql
volatile
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6));
    exit when not exists (
      select 1 from public.teaching_classes where join_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

create or replace function public.create_classroom(
  school_name_input text,
  class_name_input text,
  academic_year_input text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_profile public.profiles;
  new_school_id uuid;
  new_class_id uuid;
begin
  select * into caller_profile from public.profiles where id = auth.uid();

  if caller_profile.id is null
     or caller_profile.status <> 'active'
     or caller_profile.role not in ('teacher', 'admin') then
    raise exception 'Only active teachers can create classes';
  end if;

  if char_length(trim(school_name_input)) < 2
     or char_length(trim(class_name_input)) < 2 then
    raise exception 'School and class names are required';
  end if;

  insert into public.schools(name, created_by)
  values (trim(school_name_input), auth.uid())
  returning id into new_school_id;

  insert into public.teaching_classes(
    school_id,
    name,
    academic_year,
    join_code,
    created_by
  )
  values (
    new_school_id,
    trim(class_name_input),
    nullif(trim(academic_year_input), ''),
    public.generate_class_join_code(),
    auth.uid()
  )
  returning id into new_class_id;

  insert into public.class_teachers(class_id, teacher_id)
  values (new_class_id, auth.uid());

  return new_class_id;
end;
$$;

create or replace function public.join_class_by_code(code_input text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_profile public.profiles;
  target_class_id uuid;
begin
  select * into caller_profile from public.profiles where id = auth.uid();

  if caller_profile.id is null
     or caller_profile.status <> 'active'
     or caller_profile.role <> 'student' then
    raise exception 'Only active student accounts can join classes';
  end if;

  select id into target_class_id
  from public.teaching_classes
  where join_code = upper(trim(code_input)) and is_active = true;

  if target_class_id is null then
    raise exception 'Class code not recognised';
  end if;

  insert into public.class_memberships(class_id, student_id, status)
  values (target_class_id, auth.uid(), 'active')
  on conflict (class_id, student_id)
  do update set status = 'active';

  return target_class_id;
end;
$$;

grant execute on function public.create_classroom(text, text, text) to authenticated;
grant execute on function public.join_class_by_code(text) to authenticated;
revoke all on function public.generate_class_join_code() from public;
