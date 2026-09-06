-- Ensure active students can recover any published assignment recipient rows
-- that are missing for classes they already belong to.

create or replace function public.sync_my_assignment_recipients()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and profile.role = 'student'
      and profile.status = 'active'
  ) then
    raise exception 'Only active students can sync assignments';
  end if;

  insert into public.assignment_recipients (assignment_id, student_id, status)
  select assignment.id, auth.uid(), 'assigned'
  from public.class_memberships membership
  join public.classroom_assignments assignment
    on assignment.class_id = membership.class_id
  where membership.student_id = auth.uid()
    and membership.status = 'active'
    and assignment.status = 'published'
  on conflict (assignment_id, student_id) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function public.sync_my_assignment_recipients() from public;
revoke all on function public.sync_my_assignment_recipients() from anon;
grant execute on function public.sync_my_assignment_recipients() to authenticated;
