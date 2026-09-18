-- Prevent accidental cascade deletion of real student evidence.
-- Assignments with saved activity or assignment progress must be archived instead.

create or replace function public.delete_class_assignment(assignment_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if assignment_id_input is null or not public.is_assignment_teacher(assignment_id_input) then
    raise exception 'Assignment not found or access denied';
  end if;

  if exists (
    select 1 from public.student_activity_progress
    where assignment_id = assignment_id_input
  ) or exists (
    select 1 from public.assignment_progress
    where assignment_id = assignment_id_input
  ) then
    raise exception 'This assignment contains student progress/evidence and cannot be permanently deleted. Archive it instead.';
  end if;

  delete from public.classroom_assignments
  where id = assignment_id_input;

  if not found then
    raise exception 'Assignment not found or access denied';
  end if;
end;
$$;

revoke all on function public.delete_class_assignment(uuid) from public, anon;
grant execute on function public.delete_class_assignment(uuid) to authenticated, service_role;
