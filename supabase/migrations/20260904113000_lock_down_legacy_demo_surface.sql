-- Stage 2 production hardening.
--
-- The original prototype tables are retained for now so historic/demo data is
-- not destroyed, but direct browser access is removed. Transitional self-study
-- persistence uses an authenticated server route + service role instead.

-- Retire public access to the obsolete class-joining model.
drop policy if exists "Public can read class joining metadata" on public.classes;
revoke select, insert, update, delete on public.classes from anon, authenticated;

-- Retire direct access to the prototype guided-study assignment store.
drop policy if exists "public insert guided study assignments" on public.guided_study_assignments;
drop policy if exists "public read guided study assignments" on public.guided_study_assignments;
drop policy if exists "public update guided study assignments" on public.guided_study_assignments;
revoke select, insert, update, delete on public.guided_study_assignments from anon, authenticated;

-- Retire direct access to shared demo response rows. Independent self-study
-- can still persist through authenticated server endpoints during transition.
drop policy if exists "demo public can insert student responses" on public.student_responses;
drop policy if exists "demo public can read student responses" on public.student_responses;
drop policy if exists "demo public can update student responses" on public.student_responses;
revoke select, insert, update, delete on public.student_responses from anon, authenticated;

-- Activities remain publicly readable content, but browsers may no longer
-- materialise or mutate activities directly.
drop policy if exists "anonymous activity materialisation insert" on public.activities;
revoke insert, update, delete on public.activities from anon, authenticated;

-- SECURITY DEFINER functions must not inherit PostgreSQL's default PUBLIC
-- execute grant. All classroom/RLS helpers are authenticated-only; trigger
-- functions remain callable by PostgreSQL as triggers without a client grant.
do $$
declare
  target record;
begin
  for target in
    select p.oid, n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as identity_args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
  loop
    execute format(
      'revoke execute on function %I.%I(%s) from public, anon',
      target.nspname,
      target.proname,
      target.identity_args
    );
  end loop;
end;
$$;

-- Explicit authenticated grants for functions used by the live app and RLS.
grant execute on function public.can_student_read_assignment_resource(uuid, uuid) to authenticated;
grant execute on function public.can_student_read_lesson_resource(uuid) to authenticated;
grant execute on function public.create_class_assignment(uuid, text, text, text, text, text[], text, timestamptz, boolean) to authenticated;
grant execute on function public.create_classroom(text, text, text) to authenticated;
grant execute on function public.is_assignment_recipient(uuid) to authenticated;
grant execute on function public.is_assignment_teacher(uuid) to authenticated;
grant execute on function public.is_class_student(uuid) to authenticated;
grant execute on function public.is_class_teacher(uuid) to authenticated;
grant execute on function public.join_class_by_code(text) to authenticated;
grant execute on function public.save_assignment_activity_progress(uuid, text, text, numeric, numeric, integer, jsonb, boolean) to authenticated;
grant execute on function public.set_class_assignment_status(uuid, text) to authenticated;
grant execute on function public.sync_class_assignment_recipients(uuid) to authenticated;
grant execute on function public.update_class_assignment_details(uuid, text, timestamptz) to authenticated;

-- Trigger function is not a client RPC.
revoke execute on function public.handle_new_user_profile() from authenticated, anon, public;
