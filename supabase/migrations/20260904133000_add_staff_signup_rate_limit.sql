-- Stage 3 authentication hardening.
-- Keep staff invite-code attempts behind a server-only, hashed rate limiter.

create table if not exists public.staff_signup_rate_limits (
  key_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists staff_signup_rate_limits_updated_at_idx
  on public.staff_signup_rate_limits(updated_at);

alter table public.staff_signup_rate_limits enable row level security;
revoke all privileges on public.staff_signup_rate_limits from anon, authenticated;
grant select, insert, update, delete on public.staff_signup_rate_limits to service_role;

create or replace function public.consume_staff_signup_rate_limit(
  key_hash_input text,
  max_attempts_input integer,
  window_seconds_input integer
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  now_ts timestamptz := clock_timestamp();
  row_attempts integer;
  row_started_at timestamptz;
begin
  if key_hash_input is null or length(key_hash_input) < 32 then
    raise exception 'Invalid rate-limit key';
  end if;
  if max_attempts_input < 1 or window_seconds_input < 1 then
    raise exception 'Invalid rate-limit configuration';
  end if;

  delete from public.staff_signup_rate_limits
  where updated_at < now_ts - interval '7 days';

  insert into public.staff_signup_rate_limits(key_hash, window_started_at, attempt_count, updated_at)
  values (key_hash_input, now_ts, 1, now_ts)
  on conflict (key_hash) do update
  set
    attempt_count = case
      when staff_signup_rate_limits.window_started_at <= now_ts - make_interval(secs => window_seconds_input)
        then 1
      else staff_signup_rate_limits.attempt_count + 1
    end,
    window_started_at = case
      when staff_signup_rate_limits.window_started_at <= now_ts - make_interval(secs => window_seconds_input)
        then now_ts
      else staff_signup_rate_limits.window_started_at
    end,
    updated_at = now_ts
  returning attempt_count, window_started_at
  into row_attempts, row_started_at;

  allowed := row_attempts <= max_attempts_input;
  retry_after_seconds := case
    when allowed then 0
    else greatest(
      1,
      ceil(extract(epoch from (
        row_started_at + make_interval(secs => window_seconds_input) - now_ts
      )))::integer
    )
  end;
  return next;
end;
$$;

revoke execute on function public.consume_staff_signup_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_staff_signup_rate_limit(text, integer, integer) to service_role;
