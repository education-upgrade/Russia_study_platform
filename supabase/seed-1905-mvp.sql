-- Seed data for the first Russia Study Platform MVP pathway.
-- Run this after supabase/schema.sql.
-- This creates the AQA Russia course, the 1905 Revolution unit, one lesson and five activities.

insert into courses (title, exam_board, specification)
select
  'AQA A-Level History: Tsarist and Communist Russia, 1855-1964',
  'AQA',
  '7042 Component 1H'
where not exists (
  select 1 from courses where specification = '7042 Component 1H'
);

insert into units (course_id, title, period, theme, sequence_order, year_group)
select
  c.id,
  'The 1905 Revolution',
  '1894-1917',
  'political authority; opposition; reform and reaction',
  1,
  'Y12'
from courses c
where c.specification = '7042 Component 1H'
and not exists (
  select 1 from units u where u.title = 'The 1905 Revolution'
);

insert into lessons (unit_id, title, enquiry_question, estimated_minutes, lesson_type)
select
  u.id,
  'Was the 1905 Revolution a turning point for Tsarist Russia?',
  'How significant was the 1905 Revolution in weakening Tsarist authority?',
  45,
  'guided_study'
from units u
where u.title = 'The 1905 Revolution'
and not exists (
  select 1 from lessons l where l.title = 'Was the 1905 Revolution a turning point for Tsarist Russia?'
);

insert into activities (unit_id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  u.id,
  l.id,
  'lesson_content',
  'Lesson introduction: 1905 Revolution',
  'AO1 contextual understanding',
  'secure',
  8,
  '{
    "sections": [
      {"heading": "The enquiry", "body": "Was the 1905 Revolution a turning point for Tsarist Russia?"},
      {"heading": "Context", "body": "Nicholas II faced pressure from military defeat, economic hardship, political opposition and social unrest."},
      {"heading": "Key judgement", "body": "1905 weakened the legitimacy of Tsardom and forced concessions, but autocracy survived through repression, division of opponents and the Fundamental Laws."}
    ]
  }'::jsonb
from units u
join lessons l on l.unit_id = u.id
where u.title = 'The 1905 Revolution'
and not exists (select 1 from activities a where a.title = 'Lesson introduction: 1905 Revolution');

insert into activities (unit_id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  u.id,
  l.id,
  'quiz',
  'Retrieval quiz: 1905 Revolution',
  'AO1 retrieval',
  'secure',
  10,
  '{
    "questions": [
      {"id": "q1905-01", "question": "In which year did Bloody Sunday take place?", "options": ["1904", "1905", "1906", "1917"], "correct": "1905"},
      {"id": "q1905-02", "question": "Which war exposed the weakness of the Tsarist regime in 1904-05?", "options": ["Crimean War", "First World War", "Russo-Japanese War", "Civil War"], "correct": "Russo-Japanese War"},
      {"id": "q1905-03", "question": "What did the October Manifesto promise?", "options": ["An end to autocracy", "Civil liberties and an elected Duma", "Immediate land redistribution", "A socialist republic"], "correct": "Civil liberties and an elected Duma"},
      {"id": "q1905-04", "question": "What did the Fundamental Laws of 1906 reassert?", "options": ["The full power of the Duma", "The authority of the Tsar", "The abolition of censorship", "The independence of Poland"], "correct": "The authority of the Tsar"}
    ]
  }'::jsonb
from units u
join lessons l on l.unit_id = u.id
where u.title = 'The 1905 Revolution'
and not exists (select 1 from activities a where a.title = 'Retrieval quiz: 1905 Revolution');

insert into activities (unit_id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  u.id,
  l.id,
  'flashcards',
  'Flashcards: 1905 Revolution key knowledge',
  'AO1 knowledge security',
  'secure',
  10,
  '{
    "cards": [
      {"id": "fc1905-01", "front": "Bloody Sunday", "back": "January 1905 event where peaceful protesters were shot by troops, damaging the Tsar image as Little Father."},
      {"id": "fc1905-02", "front": "October Manifesto", "back": "Promise of civil liberties and an elected Duma, issued to divide opposition and restore order."},
      {"id": "fc1905-03", "front": "Fundamental Laws", "back": "1906 laws that reasserted the Tsar autocratic authority and limited the Duma."},
      {"id": "fc1905-04", "front": "St Petersburg Soviet", "back": "Workers council showing organised revolutionary activity in 1905."}
    ]
  }'::jsonb
from units u
join lessons l on l.unit_id = u.id
where u.title = 'The 1905 Revolution'
and not exists (select 1 from activities a where a.title = 'Flashcards: 1905 Revolution key knowledge');

insert into activities (unit_id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  u.id,
  l.id,
  'peel_response',
  'PEEL response: weakening Tsarist authority',
  'AO1 written argument and judgement',
  'secure',
  12,
  '{
    "question": "Explain one way in which the 1905 Revolution weakened Tsarist authority.",
    "stretchQuestion": "How significant was the 1905 Revolution in weakening Tsarist authority?",
    "scaffold": ["Point", "Evidence", "Explain", "Link judgement"]
  }'::jsonb
from units u
join lessons l on l.unit_id = u.id
where u.title = 'The 1905 Revolution'
and not exists (select 1 from activities a where a.title = 'PEEL response: weakening Tsarist authority');

insert into activities (unit_id, lesson_id, activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
select
  u.id,
  l.id,
  'confidence_exit_ticket',
  'Confidence exit ticket: 1905 Revolution',
  'reflection and self-assessment',
  'secure',
  5,
  '{
    "prompt": "How confident are you with the 1905 Revolution?",
    "scale": [1, 2, 3, 4, 5],
    "leastSecureOptions": ["Causes", "Events", "October Manifesto", "Duma/Fundamental Laws", "Significance judgement"]
  }'::jsonb
from units u
join lessons l on l.unit_id = u.id
where u.title = 'The 1905 Revolution'
and not exists (select 1 from activities a where a.title = 'Confidence exit ticket: 1905 Revolution');
