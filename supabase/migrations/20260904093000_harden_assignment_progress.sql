drop function if exists public.save_assignment_activity_progress(uuid,text,text,numeric,numeric,integer,jsonb);

create function public.save_assignment_activity_progress(
  assignment_id_input uuid,
  activity_type_input text,
  status_input text default 'in_progress',
  score_input numeric default null,
  max_score_input numeric default null,
  confidence_input integer default null,
  position_input jsonb default '{}'::jsonb,
  new_attempt_input boolean default false
)
returns public.assignment_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  target_assignment public.classroom_assignments;
  required_count integer;
  completed_count integer;
  aggregate_row public.assignment_progress;
begin
  select * into target_assignment
  from public.classroom_assignments
  where id = assignment_id_input and status = 'published';

  if target_assignment.id is null or not public.is_assignment_recipient(assignment_id_input) then
    raise exception 'Published assignment not found or access denied';
  end if;

  if not (activity_type_input = any(target_assignment.required_activity_types)) then
    raise exception 'Activity is not required for this assignment';
  end if;

  if status_input not in ('not_started','in_progress','complete') then
    raise exception 'Activity status is not recognised';
  end if;

  insert into public.student_activity_progress (
    assignment_id,
    student_id,
    activity_type,
    status,
    attempt_count,
    score,
    max_score,
    confidence,
    position,
    started_at,
    completed_at,
    last_saved_at
  ) values (
    assignment_id_input,
    auth.uid(),
    activity_type_input,
    status_input,
    case when status_input in ('in_progress','complete') then 1 else 0 end,
    score_input,
    max_score_input,
    confidence_input,
    coalesce(position_input, '{}'::jsonb),
    case when status_input in ('in_progress','complete') then timezone('utc', now()) else null end,
    case when status_input = 'complete' then timezone('utc', now()) else null end,
    timezone('utc', now())
  )
  on conflict (assignment_id, student_id, activity_type) do update set
    status = case
      when public.student_activity_progress.status = 'complete' and excluded.status <> 'complete'
        then public.student_activity_progress.status
      else excluded.status
    end,
    attempt_count = greatest(
      public.student_activity_progress.attempt_count,
      case when excluded.status in ('in_progress','complete') then 1 else 0 end
    ) + case when new_attempt_input then 1 else 0 end,
    score = case
      when public.student_activity_progress.status = 'complete' and excluded.status <> 'complete'
        then public.student_activity_progress.score
      else coalesce(excluded.score, public.student_activity_progress.score)
    end,
    max_score = case
      when public.student_activity_progress.status = 'complete' and excluded.status <> 'complete'
        then public.student_activity_progress.max_score
      else coalesce(excluded.max_score, public.student_activity_progress.max_score)
    end,
    confidence = case
      when public.student_activity_progress.status = 'complete' and excluded.status <> 'complete'
        then public.student_activity_progress.confidence
      else coalesce(excluded.confidence, public.student_activity_progress.confidence)
    end,
    position = case
      when public.student_activity_progress.status = 'complete' and excluded.status <> 'complete'
        then public.student_activity_progress.position
      else excluded.position
    end,
    started_at = coalesce(public.student_activity_progress.started_at, excluded.started_at),
    completed_at = case
      when public.student_activity_progress.status = 'complete'
        then public.student_activity_progress.completed_at
      when excluded.status = 'complete'
        then coalesce(public.student_activity_progress.completed_at, timezone('utc', now()))
      else public.student_activity_progress.completed_at
    end,
    last_saved_at = timezone('utc', now());

  required_count := cardinality(target_assignment.required_activity_types);

  select count(*) into completed_count
  from public.student_activity_progress
  where assignment_id = assignment_id_input
    and student_id = auth.uid()
    and status = 'complete'
    and activity_type = any(target_assignment.required_activity_types);

  insert into public.assignment_progress (
    assignment_id,
    student_id,
    status,
    completed_activity_count,
    total_activity_count,
    progress_percent,
    current_activity_type,
    started_at,
    completed_at,
    last_activity_at,
    updated_at
  ) values (
    assignment_id_input,
    auth.uid(),
    case when completed_count >= required_count and required_count > 0 then 'complete' else 'in_progress' end,
    completed_count,
    required_count,
    case when required_count = 0 then 0 else round(completed_count * 100.0 / required_count)::integer end,
    activity_type_input,
    timezone('utc', now()),
    case when completed_count >= required_count and required_count > 0 then timezone('utc', now()) else null end,
    timezone('utc', now()),
    timezone('utc', now())
  )
  on conflict (assignment_id, student_id) do update set
    status = excluded.status,
    completed_activity_count = excluded.completed_activity_count,
    total_activity_count = excluded.total_activity_count,
    progress_percent = excluded.progress_percent,
    current_activity_type = excluded.current_activity_type,
    started_at = coalesce(public.assignment_progress.started_at, excluded.started_at),
    completed_at = case
      when public.assignment_progress.status = 'complete'
        then public.assignment_progress.completed_at
      else excluded.completed_at
    end,
    last_activity_at = excluded.last_activity_at,
    updated_at = excluded.updated_at
  returning * into aggregate_row;

  return aggregate_row;
end;
$$;

revoke execute on function public.save_assignment_activity_progress(uuid,text,text,numeric,numeric,integer,jsonb,boolean) from public, anon;
grant execute on function public.save_assignment_activity_progress(uuid,text,text,numeric,numeric,integer,jsonb,boolean) to authenticated;
