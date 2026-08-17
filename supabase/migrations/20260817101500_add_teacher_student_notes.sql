-- Private teacher notes attached either to a student generally or to one assignment.
-- Progress/history remains derived from existing assignment data.

create table if not exists public.teacher_student_notes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teaching_classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.classroom_assignments(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists teacher_student_notes_class_student_idx
  on public.teacher_student_notes(class_id, student_id, created_at desc);
create index if not exists teacher_student_notes_assignment_idx
  on public.teacher_student_notes(assignment_id)
  where assignment_id is not null;

alter table public.teacher_student_notes enable row level security;

create policy "Class teachers read student notes"
on public.teacher_student_notes
for select
to authenticated
using (public.is_class_teacher(class_id));

create policy "Class teachers create student notes"
on public.teacher_student_notes
for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.is_class_teacher(class_id)
  and exists (
    select 1 from public.class_memberships membership
    where membership.class_id = teacher_student_notes.class_id
      and membership.student_id = teacher_student_notes.student_id
  )
  and (
    assignment_id is null
    or exists (
      select 1 from public.classroom_assignments assignment
      join public.assignment_recipients recipient on recipient.assignment_id = assignment.id
      where assignment.id = teacher_student_notes.assignment_id
        and assignment.class_id = teacher_student_notes.class_id
        and recipient.student_id = teacher_student_notes.student_id
    )
  )
);

create policy "Authors update own student notes"
on public.teacher_student_notes
for update
to authenticated
using (created_by = auth.uid() and public.is_class_teacher(class_id))
with check (created_by = auth.uid() and public.is_class_teacher(class_id));

create policy "Authors delete own student notes"
on public.teacher_student_notes
for delete
to authenticated
using (created_by = auth.uid() and public.is_class_teacher(class_id));

grant select, insert, update, delete on public.teacher_student_notes to authenticated;
