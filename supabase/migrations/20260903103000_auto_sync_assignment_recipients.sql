-- Keep assignment recipients aligned with active class membership.
-- Students who join a class after an assignment is published should receive
-- that assignment immediately, including students who belong to several classes.

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

  insert into public.assignment_recipients (assignment_id, student_id, status)
  select assignment.id, auth.uid(), 'assigned'
  from public.classroom_assignments assignment
  where assignment.class_id = target_class_id
    and assignment.status = 'published'
  on conflict (assignment_id, student_id)
  do update set status = 'assigned';

  return target_class_id;
end;
$$;

grant execute on function public.join_class_by_code(text) to authenticated;

-- Backfill students who are active class members but were not present in the
-- recipient snapshot when an existing published assignment was created.
insert into public.assignment_recipients (assignment_id, student_id, status)
select assignment.id, membership.student_id, 'assigned'
from public.classroom_assignments assignment
join public.class_memberships membership
  on membership.class_id = assignment.class_id
 and membership.status = 'active'
where assignment.status = 'published'
on conflict (assignment_id, student_id)
do update set status = 'assigned';
