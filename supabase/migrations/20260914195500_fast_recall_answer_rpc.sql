create or replace function public.save_recall_answer_fast(
  session_id_input uuid,
  question_id_input text,
  topic_id_input text,
  response_json_input jsonb,
  is_correct_input boolean
)
returns table(
  inserted_new boolean,
  answered_count integer,
  score integer,
  complete boolean,
  next_question_id text,
  total_correct integer,
  current_level integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  session_row public.recall_sessions;
  row_count integer := 0;
  attempts_count integer := 0;
  correct_count_value integer := 0;
  streak_count integer := 0;
  last_result_value boolean := null;
  last_seen_value timestamptz := null;
  answered_count_value integer := 0;
  score_value integer := 0;
  total_correct_value integer := 0;
  current_level_value integer := 1;
begin
  if caller_id is null then raise exception 'Not signed in'; end if;
  if not exists (select 1 from public.profiles where id = caller_id and role = 'student' and status = 'active') then
    raise exception 'Student access is required';
  end if;

  select * into session_row
  from public.recall_sessions
  where id = session_id_input and student_id = caller_id
  for update;
  if session_row.id is null then raise exception 'Recall session was not found'; end if;
  if not (question_id_input = any(session_row.question_ids)) then raise exception 'This question is not part of the session'; end if;

  insert into public.recall_responses(session_id,student_id,question_id,topic_id,response_json,is_correct,answered_at)
  values (session_id_input,caller_id,question_id_input,topic_id_input,coalesce(response_json_input,'{}'::jsonb),is_correct_input,timezone('utc',now()))
  on conflict (session_id,question_id) do nothing;
  get diagnostics row_count = row_count;
  inserted_new := row_count = 1;

  select count(*)::integer,
         count(*) filter (where is_correct)::integer,
         (array_agg(is_correct order by answered_at desc,id desc))[1],
         max(answered_at)
  into attempts_count,correct_count_value,last_result_value,last_seen_value
  from public.recall_responses
  where student_id = caller_id and question_id = question_id_input;

  select count(*)::integer into streak_count
  from (
    select is_correct,
           sum(case when is_correct then 0 else 1 end) over (order by answered_at desc,id desc) as failures_seen
    from public.recall_responses
    where student_id = caller_id and question_id = question_id_input
  ) recent
  where failures_seen = 0 and is_correct;

  insert into public.student_recall_question_stats(student_id,question_id,topic_id,attempts,correct_count,consecutive_correct,last_result,last_seen_at,updated_at)
  values (caller_id,question_id_input,topic_id_input,attempts_count,correct_count_value,streak_count,last_result_value,last_seen_value,timezone('utc',now()))
  on conflict (student_id,question_id) do update set
    topic_id=excluded.topic_id,attempts=excluded.attempts,correct_count=excluded.correct_count,
    consecutive_correct=excluded.consecutive_correct,last_result=excluded.last_result,
    last_seen_at=excluded.last_seen_at,updated_at=excluded.updated_at;

  select count(*)::integer,count(*) filter (where is_correct)::integer
  into answered_count_value,score_value
  from public.recall_responses
  where student_id = caller_id and session_id = session_id_input;

  complete := answered_count_value >= session_row.question_count;
  update public.recall_sessions
  set answered_count=answered_count_value,score=score_value,
      status=case when complete then 'complete' else 'in_progress' end,
      last_activity_at=timezone('utc',now()),
      completed_at=case when complete then coalesce(completed_at,timezone('utc',now())) else null end
  where id=session_id_input and student_id=caller_id;

  select q.question_id into next_question_id
  from unnest(session_row.question_ids) with ordinality as q(question_id,ord)
  left join public.recall_responses r on r.session_id=session_id_input and r.question_id=q.question_id and r.student_id=caller_id
  where r.id is null order by q.ord limit 1;

  select s.total_correct,s.current_level into total_correct_value,current_level_value
  from public.student_recall_stats s where s.student_id=caller_id;
  if total_correct_value is null then
    select count(*) filter (where is_correct)::integer into total_correct_value
    from public.recall_responses where student_id=caller_id;
    current_level_value := floor(total_correct_value / 50.0)::integer + 1;
  end if;

  answered_count := answered_count_value;
  score := score_value;
  total_correct := coalesce(total_correct_value,0);
  current_level := coalesce(current_level_value,1);
  return next;
end;
$$;

revoke all on function public.save_recall_answer_fast(uuid,text,text,jsonb,boolean) from public, anon;
grant execute on function public.save_recall_answer_fast(uuid,text,text,jsonb,boolean) to authenticated;
