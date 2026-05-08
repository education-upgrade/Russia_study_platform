-- Week 1 pathway seed: Russia in 1855
-- Run this in Supabase SQL Editor after the main schema has been created.
-- This version matches the current MVP schema: lessons has title, enquiry_question,
-- estimated_minutes and lesson_type. Extra pathway metadata lives in activity content_json.

create unique index if not exists lessons_title_unique_idx on lessons(title);
create unique index if not exists activities_lesson_type_unique_idx on activities(lesson_id, activity_type);

insert into lessons (
  title,
  enquiry_question,
  estimated_minutes,
  lesson_type
)
values (
  'Why was Russia difficult to govern in 1855?',
  'Why was Russia difficult to govern in 1855?',
  45,
  'guided_study'
)
on conflict (title) do update set
  enquiry_question = excluded.enquiry_question,
  estimated_minutes = excluded.estimated_minutes,
  lesson_type = excluded.lesson_type;

with week1_lesson as (
  select id from lessons where title = 'Why was Russia difficult to govern in 1855?' limit 1
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
  week1_lesson.id,
  activity_type,
  title,
  skill_focus,
  difficulty,
  estimated_minutes,
  content_json
from week1_lesson,
(values
  (
    'lesson_content',
    'Lesson notes: Russia in 1855',
    'AO1 contextual understanding',
    'secure',
    16,
    jsonb_build_object(
      'pathwaySlug', 'week-1-russia-1855',
      'week', 1,
      'yearGroup', 'Y12',
      'coursePhase', 'Tsarist Russia: context and reform',
      'sequence', jsonb_build_array('lesson_content', 'flashcards', 'quiz', 'peel_response', 'confidence_exit_ticket'),
      'sections', jsonb_build_array(
        jsonb_build_object('heading','The enquiry','body','Why was Russia difficult to govern in 1855? The answer is not simply that Russia was backward. Russia was vast, socially unequal, overwhelmingly rural, politically autocratic and administratively weak. These features made reform difficult, but they also explain why Tsars feared rapid change.','question','In one sentence, explain why Russia was difficult to govern in 1855.','taskType','judgement'),
        jsonb_build_object('heading','A vast multi-national empire','body','In 1855 Russia was the largest state in Europe and stretched across Europe and Asia. It contained many nationalities, languages and religions. This made communication, law enforcement and political control difficult, especially because transport and administration were underdeveloped.','question','Explain one way Russia’s size and diversity made government difficult.','taskType','explain'),
        jsonb_build_object('heading','Autocracy and the Tsar','body','Russia was an autocracy. The Tsar held ultimate political authority, appointed ministers, controlled the army and was not answerable to an elected parliament. This gave the Tsar great theoretical power, but it also meant that effective government depended heavily on the ruler and the bureaucracy beneath him.','question','Why could autocracy be both a strength and a weakness for Russia?','taskType','judgement'),
        jsonb_build_object('heading','The Orthodox Church and authority','body','The Russian Orthodox Church helped support Tsarist rule by presenting obedience to the Tsar as a religious and moral duty. This strengthened loyalty among many subjects, especially peasants, but it also encouraged conservative attitudes and resistance to rapid modernisation.','question','How did the Orthodox Church help support Tsarist authority?','taskType','explain'),
        jsonb_build_object('heading','A deeply unequal society','body','Russian society was highly hierarchical. The nobility had land, status and influence, while the vast majority of the population were peasants. There was only a small middle class and a limited industrial working class. This social structure made Russia look very different from more industrialised Western European states.','question','Identify one feature of Russian society in 1855 and explain why it mattered.','taskType','explain'),
        jsonb_build_object('heading','Serfdom','body','Around a third of Russia’s population were serfs, peasants legally tied to landowners. Serfdom restricted freedom, limited labour mobility and contributed to agricultural backwardness. It also created social resentment and made Russia appear economically and morally behind much of Europe.','question','Why was serfdom such a major problem for Russia in 1855?','taskType','explain'),
        jsonb_build_object('heading','Economic backwardness','body','Russia remained overwhelmingly rural and agricultural in 1855. Industrial development was limited, transport networks were weak and productivity was low. This mattered because economic weakness reduced state revenue, limited military capacity and made Russia less competitive with Western powers.','question','Explain how economic backwardness could weaken the Russian state.','taskType','explain'),
        jsonb_build_object('heading','Administrative weakness','body','The Tsar depended on a large bureaucracy to govern the empire, but it was often slow, inefficient and corrupt. Local government was limited and many officials were poorly paid. This meant the Tsar’s power could be impressive in theory but uneven in practice across such a large empire.','question','Why did administrative weakness limit the practical power of autocracy?','taskType','explain'),
        jsonb_build_object('heading','The Crimean War as a warning sign','body','The Crimean War exposed Russia’s weaknesses. Poor transport, outdated military systems and weak administration contributed to defeat. Although the war belongs to the next stage of the course, it is important because it showed Alexander II that reform was necessary if Russia was to remain a great power.','question','What did the Crimean War reveal about Russia’s weaknesses?','taskType','explain'),
        jsonb_build_object('heading','Overall judgement','body','Russia was difficult to govern because its autocratic system, social inequality, serfdom, economic backwardness and vast size all interacted. The Tsar had enormous authority, but the state lacked the modern structures needed to govern effectively. This tension shaped the whole period from 1855 to 1917.','question','Which factor made Russia most difficult to govern in 1855? Give a brief judgement.','taskType','judgement')
      )
    )
  ),
  (
    'flashcards',
    'Flashcards: Russia in 1855 key knowledge',
    'AO1 evidence recall',
    'secure',
    12,
    jsonb_build_object(
      'pathwaySlug', 'week-1-russia-1855',
      'cards', jsonb_build_array(
        jsonb_build_object('id','russia-1855','front','Russia in 1855','back','A vast, mostly rural, autocratic empire facing social, economic and administrative weaknesses.'),
        jsonb_build_object('id','autocracy','front','Autocracy','back','A political system where the Tsar held ultimate authority and was not answerable to an elected parliament.'),
        jsonb_build_object('id','tsar','front','Tsar','back','The emperor of Russia. In 1855 Alexander II became Tsar after Nicholas I.'),
        jsonb_build_object('id','alexander-ii','front','Alexander II','back','Tsar from 1855 to 1881. He inherited a backward empire and introduced major reforms, including emancipation.'),
        jsonb_build_object('id','orthodoxy','front','Orthodoxy','back','The Russian Orthodox Church supported Tsarist authority and encouraged loyalty and obedience.'),
        jsonb_build_object('id','nationality','front','Nationality','back','The Russian Empire contained many nationalities, languages and religions, making control difficult.'),
        jsonb_build_object('id','serfdom','front','Serfdom','back','A system tying peasants to landowners. It restricted freedom and contributed to backwardness.'),
        jsonb_build_object('id','serfs','front','Serfs','back','Peasants legally tied to the land and under the authority of landowners before emancipation.'),
        jsonb_build_object('id','nobility','front','Nobility','back','The landowning elite who had social status, influence and often relied on serf labour.'),
        jsonb_build_object('id','peasantry','front','Peasantry','back','The vast majority of the Russian population. Most lived in rural poverty and worked in agriculture.'),
        jsonb_build_object('id','middle-class','front','Small middle class','back','Russia had a limited middle class compared with Western Europe, reducing pressure for liberal reform.'),
        jsonb_build_object('id','industrial-workers','front','Limited working class','back','Industrial workers existed but were still a small proportion of the population in 1855.'),
        jsonb_build_object('id','economic-backwardness','front','Economic backwardness','back','Russia had limited industry, weak transport and low agricultural productivity compared with Western powers.'),
        jsonb_build_object('id','agriculture','front','Agricultural economy','back','Russia was overwhelmingly rural, with most people working on the land.'),
        jsonb_build_object('id','transport','front','Weak transport network','back','Poor roads and limited railways made trade, military movement and government control difficult.'),
        jsonb_build_object('id','bureaucracy','front','Bureaucracy','back','The officials who helped govern Russia. It was often slow, inefficient and corrupt.'),
        jsonb_build_object('id','corruption','front','Corruption','back','Officials could use power for personal gain, weakening effective government.'),
        jsonb_build_object('id','crimean-war','front','Crimean War','back','1853–56 war that exposed Russia’s military, transport and administrative weaknesses.'),
        jsonb_build_object('id','military-weakness','front','Military weakness','back','Russia’s army looked large but was poorly organised and technologically behind some Western powers.'),
        jsonb_build_object('id','great-power','front','Great power status','back','Russia wanted to remain a major European power, but backwardness threatened this position.'),
        jsonb_build_object('id','governing-problem','front','Main governing problem','back','The Tsar had enormous theoretical power, but Russia lacked the modern structures needed to govern effectively.'),
        jsonb_build_object('id','judgement-1855','front','Best judgement line','back','Russia was difficult to govern because autocracy, serfdom, backwardness, weak administration and vast size reinforced each other.')
      )
    )
  ),
  (
    'quiz',
    'Retrieval quiz: Russia in 1855',
    'AO1 retrieval and conceptual understanding',
    'secure',
    10,
    jsonb_build_object(
      'pathwaySlug', 'week-1-russia-1855',
      'questions', jsonb_build_array(
        jsonb_build_object('id','tsar-1855','question','Who became Tsar of Russia in 1855?','options',jsonb_build_array('Alexander II','Nicholas II','Alexander III','Lenin'),'correct','Alexander II'),
        jsonb_build_object('id','autocracy-definition','question','What does autocracy mean?','options',jsonb_build_array('Rule by an elected parliament','Rule by one ruler with ultimate authority','Rule by local councils','Rule by trade unions'),'correct','Rule by one ruler with ultimate authority'),
        jsonb_build_object('id','main-population','question','Which group made up the majority of Russia’s population in 1855?','options',jsonb_build_array('Industrial workers','Peasants','Middle-class liberals','Soldiers'),'correct','Peasants'),
        jsonb_build_object('id','serfdom-definition','question','What was serfdom?','options',jsonb_build_array('A system tying peasants to landowners','A system of elected local government','A factory inspection system','A military alliance'),'correct','A system tying peasants to landowners'),
        jsonb_build_object('id','orthodox-role','question','How did the Orthodox Church support Tsarism?','options',jsonb_build_array('By promoting obedience to the Tsar','By organising trade unions','By electing the Duma','By abolishing serfdom'),'correct','By promoting obedience to the Tsar'),
        jsonb_build_object('id','vast-empire','question','Why did Russia’s size make government difficult?','options',jsonb_build_array('It made communication and control harder','It removed the need for bureaucracy','It made all people politically equal','It created a fully industrial economy'),'correct','It made communication and control harder'),
        jsonb_build_object('id','multi-national','question','Why did Russia’s multi-national character matter?','options',jsonb_build_array('It created diversity that was difficult to control uniformly','It meant everyone spoke the same language','It ended religious authority','It made Russia democratic'),'correct','It created diversity that was difficult to control uniformly'),
        jsonb_build_object('id','economic-backwardness','question','Which phrase best describes Russia’s economy in 1855?','options',jsonb_build_array('Mostly rural and agricultural','Fully industrialised','Based on collectivisation','Dominated by service industries'),'correct','Mostly rural and agricultural'),
        jsonb_build_object('id','weak-transport','question','Why were weak transport links a problem?','options',jsonb_build_array('They made trade, military movement and control harder','They increased railway coverage','They made serfdom unnecessary','They strengthened parliament'),'correct','They made trade, military movement and control harder'),
        jsonb_build_object('id','bureaucracy-problem','question','What was a common problem with the Tsarist bureaucracy?','options',jsonb_build_array('It could be slow, inefficient and corrupt','It was elected by all peasants','It controlled the Tsar','It abolished local officials'),'correct','It could be slow, inefficient and corrupt'),
        jsonb_build_object('id','nobility','question','Who were the nobility?','options',jsonb_build_array('The landowning elite','Factory workers','Revolutionary socialists','Urban police only'),'correct','The landowning elite'),
        jsonb_build_object('id','middle-class','question','Why was Russia’s small middle class significant?','options',jsonb_build_array('It limited liberal pressure compared with Western Europe','It made Russia fully democratic','It controlled the army','It ended autocracy'),'correct','It limited liberal pressure compared with Western Europe'),
        jsonb_build_object('id','crimean-war','question','Which war exposed Russia’s weakness in the 1850s?','options',jsonb_build_array('Crimean War','Russo-Japanese War','Civil War','First World War'),'correct','Crimean War'),
        jsonb_build_object('id','crimean-war-weakness','question','What did the Crimean War reveal?','options',jsonb_build_array('Military, transport and administrative weaknesses','The success of collectivisation','The strength of the Duma','The end of autocracy'),'correct','Military, transport and administrative weaknesses'),
        jsonb_build_object('id','theoretical-power','question','Why was Tsarist power sometimes stronger in theory than practice?','options',jsonb_build_array('Weak administration made control uneven','The Tsar had no authority','The Church opposed the Tsar','Russia had no officials'),'correct','Weak administration made control uneven'),
        jsonb_build_object('id','best-judgement','question','Which judgement best explains why Russia was difficult to govern in 1855?','options',jsonb_build_array('Several weaknesses reinforced each other','Only the Church caused problems','Russia was already democratic','Industrial workers controlled the state'),'correct','Several weaknesses reinforced each other')
      )
    )
  ),
  (
    'peel_response',
    'PEEL response: Why Russia was difficult to govern',
    'AO1 explanation and judgement',
    'secure',
    12,
    jsonb_build_object(
      'pathwaySlug', 'week-1-russia-1855',
      'question', 'Explain one reason why Russia was difficult to govern in 1855.',
      'stretchQuestion', 'How important was autocracy in explaining the difficulties of governing Russia in 1855?',
      'scaffold', jsonb_build_array(
        'Point: identify one clear reason Russia was difficult to govern, such as size, autocracy, serfdom, backwardness or bureaucracy.',
        'Evidence: use precise evidence such as serfdom, weak transport, the Orthodox Church, the nobility or the Crimean War.',
        'Explain: show how this made government, reform or control more difficult.',
        'Link: judge why this reason was significant in 1855.'
      )
    )
  ),
  (
    'confidence_exit_ticket',
    'Confidence exit ticket: Russia in 1855',
    'Metacognition and teacher monitoring',
    'secure',
    4,
    jsonb_build_object(
      'pathwaySlug', 'week-1-russia-1855',
      'prompt', 'How secure do you feel explaining why Russia was difficult to govern in 1855?',
      'leastSecureOptions', jsonb_build_array('Autocracy','Serfdom','Social structure','Economic backwardness','Bureaucracy','Crimean War links')
    )
  )
) as new_activities(activity_type, title, skill_focus, difficulty, estimated_minutes, content_json)
on conflict (lesson_id, activity_type) do update set
  title = excluded.title,
  skill_focus = excluded.skill_focus,
  difficulty = excluded.difficulty,
  estimated_minutes = excluded.estimated_minutes,
  content_json = excluded.content_json;

-- Optional check queries. Run after the insert if you want to verify the seed.
-- select title, enquiry_question, estimated_minutes, lesson_type from lessons where title = 'Why was Russia difficult to govern in 1855?';
-- select activity_type, title, estimated_minutes from activities where lesson_id = (select id from lessons where title = 'Why was Russia difficult to govern in 1855?' limit 1) order by case activity_type when 'lesson_content' then 1 when 'flashcards' then 2 when 'quiz' then 3 when 'peel_response' then 4 when 'confidence_exit_ticket' then 5 else 99 end;
