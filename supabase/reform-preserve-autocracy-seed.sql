-- Unit 1 pathway seed: Reform to preserve autocracy?
-- Creates the lesson row and eight canonical activity rows used by the modular pathway.
-- The application supplies the audited pathway content through its fallback map, so the
-- database rows provide stable activity IDs for assignments, progress and saved responses.

create unique index if not exists lessons_title_unique_idx on lessons(title);
create unique index if not exists activities_lesson_type_unique_idx on activities(lesson_id, activity_type);

insert into lessons (
  title,
  enquiry_question,
  estimated_minutes,
  lesson_type
)
values (
  'Did Alexander II reform Russia in order to preserve autocracy?',
  'Did Alexander II reform Russia in order to preserve autocracy?',
  60,
  'guided_study'
)
on conflict (title) do update set
  enquiry_question = excluded.enquiry_question,
  estimated_minutes = excluded.estimated_minutes,
  lesson_type = excluded.lesson_type;

with pathway_lesson as (
  select id
  from lessons
  where title = 'Did Alexander II reform Russia in order to preserve autocracy?'
  limit 1
)
insert into activities (
  lesson_id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
)
select
  pathway_lesson.id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
from pathway_lesson,
(values
  ('lesson_content', 'Lesson notes: Reform to preserve autocracy?', 'AO1 contextual understanding', 'secure', 18, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('timeline', 'Timeline: Reform and reaction under Alexander II', 'Chronology and change', 'secure', 8, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('flashcards', 'Flashcards: Reform to preserve autocracy?', 'AO1 evidence recall', 'secure', 10, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('quiz', 'Retrieval quiz: Reform to preserve autocracy?', 'AO1 retrieval practice', 'secure', 12, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('judgement_ranking', 'Judgement ranking: Evidence of reform to preserve', 'Analytical judgement', 'stretch', 12, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('ao3_interpretation', 'AO3 interpretations: Alexander II''s motives', 'AO3 interpretation evaluation', 'stretch', 14, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('peel_response', 'PEEL response: Reform and autocracy', 'AO1 analytical writing', 'secure', 15, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy')),
  ('confidence_exit_ticket', 'Confidence check: Reform to preserve autocracy?', 'Metacognition', 'secure', 4, jsonb_build_object('pathwaySlug', 'reform-preserve-autocracy'))
) as activity_seed(activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
on conflict (lesson_id, activity_type) do update set
  title = excluded.title,
  skill_focus = excluded.skill_focus,
  difficulty = excluded.difficulty,
  estimated_minutes = excluded.estimated_minutes,
  content_json = excluded.content_json;

-- Verification
-- select id, title from lessons where title = 'Did Alexander II reform Russia in order to preserve autocracy?';
-- select activity_type, title from activities where lesson_id = (
--   select id from lessons where title = 'Did Alexander II reform Russia in order to preserve autocracy?' limit 1
-- );
