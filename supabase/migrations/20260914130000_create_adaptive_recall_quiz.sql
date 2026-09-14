-- Adaptive recall is deliberately isolated from the guided-study response engine.
-- This migration only creates new recall_* tables, indexes and RLS policies.

create table if not exists public.recall_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null check (mode in ('recommended', 'weak', 'topic', 'all')),
  topic_id text,
  question_ids text[] not null default '{}',
  question_count integer not null check (question_count between 1 and 20),
  answered_count integer not null default 0 check (answered_count >= 0),
  score integer not null default 0 check (score >= 0),
  status text not null default 'in_progress' check (status in ('in_progress', 'complete')),
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint recall_sessions_answered_not_over_total check (answered_count <= question_count),
  constraint recall_sessions_score_not_over_answered check (score <= answered_count)
);

create table if not exists public.recall_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.recall_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  response_json jsonb not null default '{}'::jsonb,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (session_id, question_id)
);

create table if not exists public.student_recall_question_stats (
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  topic_id text not null,
  attempts integer not null default 0 check (attempts >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  consecutive_correct integer not null default 0 check (consecutive_correct >= 0),
  last_result boolean,
  last_seen_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, question_id),
  constraint student_recall_correct_not_over_attempts check (correct_count <= attempts)
);

create index if not exists recall_sessions_student_started_idx
  on public.recall_sessions (student_id, started_at desc);
create index if not exists recall_sessions_student_status_idx
  on public.recall_sessions (student_id, status, last_activity_at desc);
create index if not exists recall_responses_student_answered_idx
  on public.recall_responses (student_id, answered_at desc);
create index if not exists recall_responses_session_idx
  on public.recall_responses (session_id, answered_at);
create index if not exists student_recall_stats_student_topic_idx
  on public.student_recall_question_stats (student_id, topic_id, last_seen_at);

alter table public.recall_sessions enable row level security;
alter table public.recall_responses enable row level security;
alter table public.student_recall_question_stats enable row level security;

revoke all on table public.recall_sessions from anon;
revoke all on table public.recall_responses from anon;
revoke all on table public.student_recall_question_stats from anon;

grant select, insert, update on table public.recall_sessions to authenticated;
grant select, insert on table public.recall_responses to authenticated;
grant select, insert, update on table public.student_recall_question_stats to authenticated;

drop policy if exists "Students read own recall sessions" on public.recall_sessions;
create policy "Students read own recall sessions"
  on public.recall_sessions for select
  to authenticated
  using ((select auth.uid()) = student_id);

drop policy if exists "Students create own recall sessions" on public.recall_sessions;
create policy "Students create own recall sessions"
  on public.recall_sessions for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

drop policy if exists "Students update own recall sessions" on public.recall_sessions;
create policy "Students update own recall sessions"
  on public.recall_sessions for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);

drop policy if exists "Students read own recall responses" on public.recall_responses;
create policy "Students read own recall responses"
  on public.recall_responses for select
  to authenticated
  using ((select auth.uid()) = student_id);

drop policy if exists "Students create own recall responses" on public.recall_responses;
create policy "Students create own recall responses"
  on public.recall_responses for insert
  to authenticated
  with check (
    (select auth.uid()) = student_id
    and exists (
      select 1 from public.recall_sessions s
      where s.id = session_id
        and s.student_id = (select auth.uid())
        and question_id = any(s.question_ids)
    )
  );

drop policy if exists "Students read own recall stats" on public.student_recall_question_stats;
create policy "Students read own recall stats"
  on public.student_recall_question_stats for select
  to authenticated
  using ((select auth.uid()) = student_id);

drop policy if exists "Students create own recall stats" on public.student_recall_question_stats;
create policy "Students create own recall stats"
  on public.student_recall_question_stats for insert
  to authenticated
  with check ((select auth.uid()) = student_id);

drop policy if exists "Students update own recall stats" on public.student_recall_question_stats;
create policy "Students update own recall stats"
  on public.student_recall_question_stats for update
  to authenticated
  using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);
