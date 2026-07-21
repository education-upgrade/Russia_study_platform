-- Basic post-publication assignment management for class teachers.
-- Keeps all writes behind trusted security-definer functions.

create or replace function public.update_class_assignment_details(
  assignment_id_input uuid,
  instructions_input text default null,
  due_at_input timestamptz default null
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

  update public.classroom_assignments
  set instructions = nullif(trim(instructions_input), ''),
      due_at = due_at_input,
      updated_at = timezone('utc', now())
  where id = assignment_id_input;
end;
$$;

create or replace function public.sync_class_assignment_recipients(
  assignment_id_input uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  target_assignment public.classroom_assignments;
  recipient_total integer;
begin
  select * into target_assignment
  from public.classroom_assignments
  where id = assignment_id_input;

  if target_assignment.id is null or not public.is_assignment_teacher(assignment_id_input) then
    raise exception 'Assignment not found or access denied';
  end if;

  if target_assignment.status <> 'published' then
    raise exception 'Only published assignments can receive new students';
  end if;

  insert into public.assignment_recipients (assignment_id, student_id, status)
  select assignment_id_input, membership.student_id, 'assigned'
  from public.class_memberships membership
  where membership.class_id = target_assignment.class_id
    and membership.status = 'active'
  on conflict (assignment_id, student_id)
  do update set status = 'assigned';

  select count(*)::integer into recipient_total
  from public.assignment_recipients
  where assignment_id = assignment_id_input
    and status = 'assigned';

  return recipient_total;
end;
$$;

grant execute on function public.update_class_assignment_details(uuid, text, timestamptz) to authenticated;
grant execute on function public.sync_class_assignment_recipients(uuid) to authenticated;
