-- Capacity hardening applied to production on 2026-09-11.
-- Add covering indexes for growth-sensitive relationships and avoid per-row
-- auth.uid() re-evaluation in hot RLS policies.

create index if not exists assignment_progress_student_idx on public.assignment_progress(student_id);
create index if not exists student_activity_progress_student_idx on public.student_activity_progress(student_id);
create index if not exists assignment_resources_resource_idx on public.assignment_resources(resource_id);
create index if not exists assignment_resources_attached_by_idx on public.assignment_resources(attached_by);
create index if not exists teacher_student_notes_student_idx on public.teacher_student_notes(student_id);
create index if not exists teacher_student_notes_created_by_idx on public.teacher_student_notes(created_by);
create index if not exists teaching_classes_created_by_idx on public.teaching_classes(created_by);
create index if not exists schools_created_by_idx on public.schools(created_by);
create index if not exists activities_unit_idx on public.activities(unit_id);
create index if not exists lessons_unit_idx on public.lessons(unit_id);
create index if not exists units_course_idx on public.units(course_id);

alter policy "school members can read schools" on public.schools using (
  exists (
    select 1 from public.teaching_classes c
    where c.school_id = schools.id
      and (public.is_class_teacher(c.id) or public.is_class_student(c.id))
  ) or created_by = (select auth.uid())
);

alter policy "class members can read memberships" on public.class_memberships using (
  public.is_class_teacher(class_id) or student_id = (select auth.uid())
);

alter policy "students read own assignment recipient row" on public.assignment_recipients using (
  student_id = (select auth.uid())
);

alter policy "students read own assignment progress" on public.assignment_progress using (
  student_id = (select auth.uid())
);

alter policy "students read own activity progress" on public.student_activity_progress using (
  student_id = (select auth.uid())
);

alter policy "Teachers manage own lesson resources" on public.lesson_resources
using (
  created_by = (select auth.uid())
  or exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'::public.app_role
      and p.status = 'active'::public.account_status
  )
)
with check (
  created_by = (select auth.uid())
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = any(array['teacher'::public.app_role,'admin'::public.app_role])
      and p.status = 'active'::public.account_status
  )
);

alter policy "Class teachers create student notes" on public.teacher_student_notes
with check (
  created_by = (select auth.uid())
  and public.is_class_teacher(class_id)
  and exists (
    select 1 from public.class_memberships membership
    where membership.class_id = teacher_student_notes.class_id
      and membership.student_id = teacher_student_notes.student_id
  )
  and (
    assignment_id is null
    or exists (
      select 1
      from public.classroom_assignments assignment
      join public.assignment_recipients recipient on recipient.assignment_id = assignment.id
      where assignment.id = teacher_student_notes.assignment_id
        and assignment.class_id = teacher_student_notes.class_id
        and recipient.student_id = teacher_student_notes.student_id
    )
  )
);

alter policy "Authors update own student notes" on public.teacher_student_notes
using (created_by = (select auth.uid()) and public.is_class_teacher(class_id))
with check (created_by = (select auth.uid()) and public.is_class_teacher(class_id));

alter policy "Authors delete own student notes" on public.teacher_student_notes
using (created_by = (select auth.uid()) and public.is_class_teacher(class_id));
