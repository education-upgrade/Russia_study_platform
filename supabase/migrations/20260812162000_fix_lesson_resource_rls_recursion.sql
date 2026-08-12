-- Fix recursive RLS evaluation between lesson_resources and assignment_resources.
-- Student visibility is resolved through security-definer helpers so the policy
-- engine does not recurse from one protected table into the other.

create or replace function public.can_student_read_assignment_resource(
  assignment_id_input uuid,
  resource_id_input uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignment_recipients recipient
    join public.classroom_assignments assignment
      on assignment.id = recipient.assignment_id
    join public.lesson_resources resource
      on resource.id = resource_id_input
    where recipient.assignment_id = assignment_id_input
      and recipient.student_id = auth.uid()
      and recipient.status = 'assigned'
      and assignment.status = 'published'
      and resource.visibility = 'student'
  );
$$;

create or replace function public.can_student_read_lesson_resource(
  resource_id_input uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignment_resources ar
    join public.assignment_recipients recipient
      on recipient.assignment_id = ar.assignment_id
    join public.classroom_assignments assignment
      on assignment.id = ar.assignment_id
    where ar.resource_id = resource_id_input
      and recipient.student_id = auth.uid()
      and recipient.status = 'assigned'
      and assignment.status = 'published'
  )
  and exists (
    select 1
    from public.lesson_resources resource
    where resource.id = resource_id_input
      and resource.visibility = 'student'
  );
$$;

grant execute on function public.can_student_read_assignment_resource(uuid, uuid) to authenticated;
grant execute on function public.can_student_read_lesson_resource(uuid) to authenticated;

drop policy if exists "Students read visible assigned resources" on public.lesson_resources;
drop policy if exists "Students read own assignment attachments" on public.assignment_resources;

create policy "Students read visible assigned resources"
on public.lesson_resources
for select
to authenticated
using (public.can_student_read_lesson_resource(id));

create policy "Students read own assignment attachments"
on public.assignment_resources
for select
to authenticated
using (public.can_student_read_assignment_resource(assignment_id, resource_id));
