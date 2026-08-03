-- Lesson-linked resources and per-assignment attachments.
-- Resources belong to the existing pathway registry rather than a parallel library.

create table if not exists public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  pathway_slug text not null,
  title text not null,
  description text,
  resource_type text not null check (resource_type in ('slides', 'worksheet', 'exam_question', 'mark_scheme', 'model_answer', 'video', 'website', 'reading', 'other')),
  resource_url text not null,
  visibility text not null default 'teacher' check (visibility in ('teacher', 'student')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists lesson_resources_pathway_slug_idx on public.lesson_resources(pathway_slug);
create index if not exists lesson_resources_created_by_idx on public.lesson_resources(created_by);

create table if not exists public.assignment_resources (
  assignment_id uuid not null references public.classroom_assignments(id) on delete cascade,
  resource_id uuid not null references public.lesson_resources(id) on delete cascade,
  attached_by uuid not null references public.profiles(id) on delete cascade,
  attached_at timestamptz not null default timezone('utc', now()),
  primary key (assignment_id, resource_id)
);

alter table public.lesson_resources enable row level security;
alter table public.assignment_resources enable row level security;

create policy "Teachers manage own lesson resources"
on public.lesson_resources
for all
to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'
  )
)
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('teacher', 'admin') and p.status = 'active'
  )
);

create policy "Students read visible assigned resources"
on public.lesson_resources
for select
to authenticated
using (
  visibility = 'student'
  and exists (
    select 1
    from public.assignment_resources ar
    join public.assignment_recipients recipient on recipient.assignment_id = ar.assignment_id
    join public.classroom_assignments assignment on assignment.id = ar.assignment_id
    where ar.resource_id = lesson_resources.id
      and recipient.student_id = auth.uid()
      and recipient.status = 'assigned'
      and assignment.status = 'published'
  )
);

create policy "Assignment teachers manage attachments"
on public.assignment_resources
for all
to authenticated
using (public.is_assignment_teacher(assignment_id))
with check (public.is_assignment_teacher(assignment_id));

create policy "Students read own assignment attachments"
on public.assignment_resources
for select
to authenticated
using (
  exists (
    select 1
    from public.assignment_recipients recipient
    join public.classroom_assignments assignment on assignment.id = recipient.assignment_id
    join public.lesson_resources resource on resource.id = assignment_resources.resource_id
    where recipient.assignment_id = assignment_resources.assignment_id
      and recipient.student_id = auth.uid()
      and recipient.status = 'assigned'
      and assignment.status = 'published'
      and resource.visibility = 'student'
  )
);

grant select, insert, update, delete on public.lesson_resources to authenticated;
grant select, insert, delete on public.assignment_resources to authenticated;
