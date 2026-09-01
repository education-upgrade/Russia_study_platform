-- Allow Supabase Auth users to be deleted without destroying shared teaching data.
--
-- Student-linked rows (memberships, recipients, progress and responses) already
-- use ON DELETE CASCADE through profiles. The remaining blocker is staff
-- ownership metadata: schools/classes/assignments currently require the creator
-- profile to continue existing. When a staff account is permanently deleted we
-- preserve those teaching records, remove the deleted user from class_teachers
-- via its existing cascade, and clear only the historical ownership pointer.

-- A school may outlive the account that originally created it.
alter table public.schools
  alter column created_by drop not null;

alter table public.schools
  drop constraint if exists schools_created_by_fkey;

alter table public.schools
  add constraint schools_created_by_fkey
  foreign key (created_by)
  references public.profiles(id)
  on delete set null;

-- A teaching class may remain for another linked teacher, or for historical
-- records, after the creator account is removed.
alter table public.teaching_classes
  alter column created_by drop not null;

alter table public.teaching_classes
  drop constraint if exists teaching_classes_created_by_fkey;

alter table public.teaching_classes
  add constraint teaching_classes_created_by_fkey
  foreign key (created_by)
  references public.profiles(id)
  on delete set null;

-- Assignment evidence should not disappear merely because the teacher account
-- that originally set the work is later removed.
alter table public.classroom_assignments
  alter column teacher_id drop not null;

alter table public.classroom_assignments
  drop constraint if exists classroom_assignments_teacher_id_fkey;

alter table public.classroom_assignments
  add constraint classroom_assignments_teacher_id_fkey
  foreign key (teacher_id)
  references public.profiles(id)
  on delete set null;

comment on column public.schools.created_by is
  'Original creator profile when still present. Cleared if that account is permanently deleted.';

comment on column public.teaching_classes.created_by is
  'Original creator profile when still present. Cleared if that account is permanently deleted.';

comment on column public.classroom_assignments.teacher_id is
  'Teacher who originally created the assignment when still present. Cleared if that account is permanently deleted; assignment evidence is retained.';
