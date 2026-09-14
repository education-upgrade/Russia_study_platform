-- Recall levels/rewards mirror the GCSE app's progression rule: Level 1 starts at 0 correct,
-- and every 50 correct answers raises the level and creates a pending teacher reward.
-- These tables are additive and do not touch guided-study progress.

create table if not exists public.student_recall_stats (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  total_attempts integer not null default 0 check (total_attempts >= 0),
  total_correct integer not null default 0 check (total_correct >= 0 and total_correct <= total_attempts),
  current_level integer not null default 1 check (current_level >= 1),
  updated_at timestamptz not null default now()
);

create table if not exists public.recall_reward_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  level_reached integer not null check (level_reached >= 2),
  threshold_correct integer not null check (threshold_correct > 0),
  status text not null default 'pending' check (status in ('pending','given')),
  reached_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid references public.profiles(id) on delete set null,
  unique (student_id, level_reached)
);

create index if not exists recall_reward_events_pending_idx
  on public.recall_reward_events (status, reached_at) where status = 'pending';

alter table public.student_recall_stats enable row level security;
alter table public.recall_reward_events enable row level security;

revoke all on table public.student_recall_stats from anon;
revoke all on table public.recall_reward_events from anon;
revoke insert, update, delete on table public.student_recall_stats from authenticated;
revoke insert, delete on table public.recall_reward_events from authenticated;
grant select on table public.student_recall_stats to authenticated;
grant select, update on table public.recall_reward_events to authenticated;

-- Students can read their own progression.
drop policy if exists "Students read own recall totals" on public.student_recall_stats;
create policy "Students read own recall totals"
  on public.student_recall_stats for select to authenticated
  using ((select auth.uid()) = student_id);

-- Teachers can read levels for active students in classes they teach; admins can read all.
drop policy if exists "Staff read student recall totals" on public.student_recall_stats;
create policy "Staff read student recall totals"
  on public.student_recall_stats for select to authenticated
  using (
    exists (
      select 1
      from public.profiles me
      where me.id = (select auth.uid()) and me.role = 'admin'
    )
    or exists (
      select 1
      from public.class_memberships m
      join public.class_teachers ct on ct.class_id = m.class_id
      where m.student_id = student_recall_stats.student_id
        and m.status = 'active'
        and ct.teacher_id = (select auth.uid())
    )
  );

-- Students may see their own reward history.
drop policy if exists "Students read own recall rewards" on public.recall_reward_events;
create policy "Students read own recall rewards"
  on public.recall_reward_events for select to authenticated
  using ((select auth.uid()) = student_id);

-- Teachers see and can acknowledge rewards for students they currently teach; admins can manage all.
drop policy if exists "Staff read recall rewards" on public.recall_reward_events;
create policy "Staff read recall rewards"
  on public.recall_reward_events for select to authenticated
  using (
    exists (
      select 1 from public.profiles me
      where me.id = (select auth.uid()) and me.role = 'admin'
    )
    or exists (
      select 1
      from public.class_memberships m
      join public.class_teachers ct on ct.class_id = m.class_id
      where m.student_id = recall_reward_events.student_id
        and m.status = 'active'
        and ct.teacher_id = (select auth.uid())
    )
  );

drop policy if exists "Staff acknowledge recall rewards" on public.recall_reward_events;
create policy "Staff acknowledge recall rewards"
  on public.recall_reward_events for update to authenticated
  using (
    exists (
      select 1 from public.profiles me
      where me.id = (select auth.uid()) and me.role = 'admin'
    )
    or exists (
      select 1
      from public.class_memberships m
      join public.class_teachers ct on ct.class_id = m.class_id
      where m.student_id = recall_reward_events.student_id
        and m.status = 'active'
        and ct.teacher_id = (select auth.uid())
    )
  )
  with check (
    status in ('pending','given')
    and (
      exists (
        select 1 from public.profiles me
        where me.id = (select auth.uid()) and me.role = 'admin'
      )
      or exists (
        select 1
        from public.class_memberships m
        join public.class_teachers ct on ct.class_id = m.class_id
        where m.student_id = recall_reward_events.student_id
          and m.status = 'active'
          and ct.teacher_id = (select auth.uid())
      )
    )
  );

-- Rebuildable totals mean old Recall answers are not lost when this feature is introduced.
insert into public.student_recall_stats (student_id, total_attempts, total_correct, current_level, updated_at)
select
  student_id,
  count(*)::integer,
  count(*) filter (where is_correct)::integer,
  floor((count(*) filter (where is_correct))::numeric / 50)::integer + 1,
  now()
from public.recall_responses
group by student_id
on conflict (student_id) do update
set total_attempts = excluded.total_attempts,
    total_correct = excluded.total_correct,
    current_level = excluded.current_level,
    updated_at = excluded.updated_at;

-- If any student already passed a reward threshold, preserve that achievement.
insert into public.recall_reward_events (student_id, level_reached, threshold_correct, reached_at)
select s.student_id, level_no, (level_no - 1) * 50, now()
from public.student_recall_stats s
cross join lateral generate_series(2, s.current_level) as level_no
on conflict (student_id, level_reached) do nothing;

create or replace function public.update_recall_level_after_response()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total integer;
  v_level integer;
begin
  insert into public.student_recall_stats (student_id, total_attempts, total_correct, current_level, updated_at)
  values (
    new.student_id,
    1,
    case when new.is_correct then 1 else 0 end,
    1,
    now()
  )
  on conflict (student_id) do update
  set total_attempts = public.student_recall_stats.total_attempts + 1,
      total_correct = public.student_recall_stats.total_correct + case when excluded.total_correct = 1 then 1 else 0 end,
      current_level = floor((public.student_recall_stats.total_correct + case when excluded.total_correct = 1 then 1 else 0 end)::numeric / 50)::integer + 1,
      updated_at = now()
  returning total_correct, current_level into v_total, v_level;

  if new.is_correct and v_total > 0 and mod(v_total, 50) = 0 then
    insert into public.recall_reward_events (student_id, level_reached, threshold_correct, reached_at)
    values (new.student_id, v_level, v_total, new.answered_at)
    on conflict (student_id, level_reached) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists recall_responses_update_level on public.recall_responses;
create trigger recall_responses_update_level
after insert on public.recall_responses
for each row execute function public.update_recall_level_after_response();

revoke all on function public.update_recall_level_after_response() from public, anon, authenticated;
