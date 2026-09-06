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

  delete from public.classroom_assignments
  where id = assignment_id_input;

  if not found then
    raise exception 'Assignment not found or access denied';
  end if;
end;
$$;

revoke all on function public.delete_class_assignment(uuid) from public;
revoke all on function public.delete_class_assignment(uuid) from anon;
grant execute on function public.delete_class_assignment(uuid) to authenticated;
grant execute on function public.delete_class_assignment(uuid) to service_role;
