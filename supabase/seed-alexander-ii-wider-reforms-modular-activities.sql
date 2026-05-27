-- Seed/update: Alexander II wider reforms modular activity rows
-- Run after the existing Alexander II wider reforms seed.

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  'b2b8f20e-1858-4261-9a2b-000000000621',
  l.id,
  'judgement_ranking',
  'Judgement ranking: significance of wider reforms',
  'Significance judgement',
  'secure',
  12,
  '{"factors":[]}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a
  where a.lesson_id = l.id and a.activity_type = 'judgement_ranking'
)
limit 1;

insert into activities (id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  'b2b8f20e-1858-4261-9a2b-000000000622',
  l.id,
  'ao3_interpretation',
  'AO3 interpretations: Alexander II reforms',
  'AO3 interpretations',
  'ambition',
  15,
  '{"interpretations":[]}'::jsonb
from lessons l
where l.title = 'How far did Alexander II modernise Russia through reform?'
and not exists (
  select 1 from activities a
  where a.lesson_id = l.id and a.activity_type = 'ao3_interpretation'
)
limit 1;
