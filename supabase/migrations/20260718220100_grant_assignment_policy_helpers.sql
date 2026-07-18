-- The assignment RLS policies call these helper functions as authenticated users.
grant execute on function public.is_assignment_teacher(uuid) to authenticated;
grant execute on function public.is_assignment_recipient(uuid) to authenticated;
