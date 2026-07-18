-- Architecture Step 4A: real assignments attached to authenticated teachers,
-- teaching classes and student recipients.

create table if not exists public.classroom_assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teaching_classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 2 and 160),
  pathway_slug text not null check (char_length(trim(pathway_slug)) between 2 and 160),
  lesson_title text not null check (char_length(trim(lesson_title)) between 2 and 200),
  mode text not null check (mode in ('full_guided_study', 'exam_practice', 'recap', 'confidence_repair')),
  required_activity_types text[] not null check (cardinality(required_activity_types) > 0),
  instructions text,
  due_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assignment_recipients (
  assignment_id uuid not null references public.classroom_assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assigned_at timestamptz not null default timezone('utc', now()),
  status text not null default 'assigned' check (status in ('assigned', 'removed')),
  primary key (assignment_id, student_id)
);

create index if not exists classroom_assignments_class_idx on public.classroom_assignments(class_id);
create index if not exists classroom_assignments_teacher_idx on public.classroom_assignments(teacher_id);
create index if not exists classroom_assignments_status_due_idx on public.classroom_assignments(status, due_at);
create index if not exists assignment_recipients_student_idx on public.assignment_recipients(student_id);

alter table public.classroom_assignments enable row level security;
alter table public.assignment_recipients enable row level security;

create or replace function public.is_assignment_teacher(target_assignment uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classroom_assignments a
    where a.id = target_assignment
      and (a.teacher_id = auth.uid() or public.is_class_teacher(a.class_id))
  );
$$;

create or replace function public.is_assignment_recipient(target_assignment uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignment_recipients r
    where r.assignment_id = target_assignment
      and r.student_id = auth.uid()
      and r.status = 'assigned'
  );
$$;

create policy "teachers read own classroom assignments"
on public.classroom_assignments
for select to authenticated
using (public.is_class_teacher(class_id));

create policy "students read published assigned work"
on public.classroom_assignments
for select to authenticated
using (
  status = 'published'
  and public.is_assignment_recipient(id)
);

create policy "teachers read assignment recipients"
on public.assignment_recipients
for select to authenticated
using (public.is_assignment_teacher(assignment_id));

create policy "students read own assignment recipient row"
on public.assignment_recipients
for select to authenticated
using (student_id = auth.uid());

create or replace function public.create_class_assignment(
  class_id_input uuid,
  title_input text,
  pathway_slug_input text,
  lesson_title_input text,
  mode_input text,
  required_activity_types_input text[],
  instructions_input text default null,
  due_at_input timestamptz default null,
  publish_now_input boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_profile public.profiles;
  target_class public.teaching_classes;
  new_assignment_id uuid;
begin
  select * into caller_profile from public.profiles where id = auth.uid();
  if caller_profile.id is null
     or caller_profile.status <> 'active'
     or caller_profile.role not in ('teacher', 'admin') then
    raise exception 'Only active teachers can create assignments';
  end if;

  select * into target_class
  from public.teaching_classes
  where id = class_id_input and is_active = true;

  if target_class.id is null or not public.is_class_teacher(class_id_input) then
    raise exception 'You do not have access to this active class';
  end if;

  if char_length(trim(title_input)) < 2
     or char_length(trim(pathway_slug_input)) < 2
     or char_length(trim(lesson_title_input)) < 2 then
    raise exception 'Assignment title and lesson are required';
  end if;

  if mode_input not in ('full_guided_study', 'exam_practice', 'recap', 'confidence_repair') then
    raise exception 'Assignment mode is not recognised';
  end if;

  if required_activity_types_input is null or cardinality(required_activity_types_input) = 0 then
    raise exception 'Choose at least one activity';
  end if;

  insert into public.classroom_assignments (
    class_id, teacher_id, title, pathway_slug, lesson_title, mode,
    required_activity_types, instructions, due_at, status, published_at
  ) values (
    class_id_input, auth.uid(), trim(title_input), trim(pathway_slug_input),
    trim(lesson_title_input), mode_input, required_activity_types_input,
    nullif(trim(instructions_input), ''), due_at_input,
    case when publish_now_input then 'published' else 'draft' end,
    case when publish_now_input then timezone('utc', now()) else null end
  ) returning id into new_assignment_id;

  if publish_now_input then
    insert into public.assignment_recipients (assignment_id, student_id)
    select new_assignment_id, membership.student_id
    from public.class_memberships membership
    where membership.class_id = class_id_input
      and membership.status = 'active'
    on conflict (assignment_id, student_id) do nothing;
  end if;

  return new_assignment_id;
end;
$$;

create or replace function public.set_class_assignment_status(
  assignment_id_input uuid,
  status_input text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_assignment public.classroom_assignments;
begin
  select * into target_assignment
  from public.classroom_assignments
  where id = assignment_id_input;

  if target_assignment.id is null or not public.is_assignment_teacher(assignment_id_input) then
    raise exception 'Assignment not found or access denied';
  end if;

  if status_input not in ('draft', 'published', 'archived') then
    raise exception 'Assignment status is not recognised';
  end if;

  update public.classroom_assignments
  set status = status_input,
      published_at = case
        when status_input = 'published' then coalesce(published_at, timezone('utc', now()))
        else published_at
      end,
      updated_at = timezone('utc', now())
  where id = assignment_id_input;

  if status_input = 'published' then
    insert into public.assignment_recipients (assignment_id, student_id)
    select assignment_id_input, membership.student_id
    from public.class_memberships membership
    where membership.class_id = target_assignment.class_id
      and membership.status = 'active'
    on conflict (assignment_id, student_id)
    do update set status = 'assigned';
  end if;
end;
$$;

grant execute on function public.create_class_assignment(uuid, text, text, text, text, text[], text, timestamptz, boolean) to authenticated;
grant execute on function public.set_class_assignment_status(uuid, text) to authenticated;
revoke all on function public.is_assignment_teacher(uuid) from public;
revoke all on function public.is_assignment_recipient(uuid) from public;