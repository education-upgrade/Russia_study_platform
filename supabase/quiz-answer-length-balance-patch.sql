-- Quiz answer length balance patch
-- Purpose: reduce accidental answer patterns where the correct answer is often the longest option.
-- Run this in Supabase SQL Editor after the 1855 and 1905 pathways have been seeded.

update activities
set content_json = jsonb_set(
  content_json,
  '{questions}',
  jsonb_build_array(
    jsonb_build_object('id','bloody-sunday-date','question','When did Bloody Sunday take place?','options',jsonb_build_array('January 1905','June 1905','October 1905','April 1906'),'correct','January 1905'),
    jsonb_build_object('id','father-gapon','question','Who led the workers’ petition to the Winter Palace on Bloody Sunday?','options',jsonb_build_array('Father Gapon','Sergei Witte','Leon Trotsky','Vladimir Lenin'),'correct','Father Gapon'),
    jsonb_build_object('id','little-father','question','What image of the Tsar was damaged by Bloody Sunday?','options',jsonb_build_array('Little Father','Iron Minister','Red Tsar','Duma Builder'),'correct','Little Father'),
    jsonb_build_object('id','russo-japanese-war','question','Which war exposed the weakness of the Tsarist regime in 1904–05?','options',jsonb_build_array('Russo-Japanese War','First World War','Crimean War','Russian Civil War'),'correct','Russo-Japanese War'),
    jsonb_build_object('id','tsushima','question','Which naval defeat humiliated Russia during the Russo-Japanese War?','options',jsonb_build_array('Tsushima','Sevastopol','Kronstadt','Borodino'),'correct','Tsushima'),
    jsonb_build_object('id','long-term-weakness-workers','question','Which pressure made urban workers more receptive to protest by 1905?','options',jsonb_build_array('Poor pay and conditions','High wages and security','Full union protection','Equal political rights'),'correct','Poor pay and conditions'),
    jsonb_build_object('id','peasant-pressure','question','Which issue helps explain continuing peasant unrest before and during 1905?','options',jsonb_build_array('Land hunger','Factory closure','Party voting','Duma power'),'correct','Land hunger'),
    jsonb_build_object('id','potemkin','question','What did the Potemkin mutiny reveal in 1905?','options',jsonb_build_array('Fragile military loyalty','Total peasant loyalty','Strong Duma authority','Immediate Tsarist collapse'),'correct','Fragile military loyalty'),
    jsonb_build_object('id','october-strike','question','Which event placed the regime under intense pressure in October 1905?','options',jsonb_build_array('A general strike','A palace coup','A land decree','A party congress'),'correct','A general strike'),
    jsonb_build_object('id','st-petersburg-soviet-role','question','Why was the St Petersburg Soviet significant?','options',jsonb_build_array('It coordinated worker action','It protected noble privilege','It commanded the army','It appointed the Tsar'),'correct','It coordinated worker action'),
    jsonb_build_object('id','october-manifesto','question','What did the October Manifesto promise?','options',jsonb_build_array('Civil liberties and a Duma','Peace terms and land reform','Collectivisation and terror','Abdication and republic'),'correct','Civil liberties and a Duma'),
    jsonb_build_object('id','october-manifesto-impact','question','How did the October Manifesto help the regime survive?','options',jsonb_build_array('It split moderate liberals','It united all opponents','It abolished autocracy','It armed the soviets'),'correct','It split moderate liberals'),
    jsonb_build_object('id','duma','question','What was the Duma?', 'options',jsonb_build_array('Elected legislative assembly','Secret police organisation','Peasant village commune','Workers’ strike militia'),'correct','Elected legislative assembly'),
    jsonb_build_object('id','witte-role','question','What was Sergei Witte’s significance in 1905?','options',jsonb_build_array('Advised tactical concessions','Led the Potemkin mutiny','Abolished the secret police','Commanded Bolshevik forces'),'correct','Advised tactical concessions'),
    jsonb_build_object('id','army-loyalty','question','Why was army loyalty crucial to the survival of Tsarism in 1905?','options',jsonb_build_array('It enabled repression later','It gave workers control','It forced abdication','It made the Duma sovereign'),'correct','It enabled repression later'),
    jsonb_build_object('id','survival-factor','question','Which factor most helped the Tsarist regime survive 1905?','options',jsonb_build_array('Divided opposition and loyal army','United opposition and weak army','Full democracy and land reform','Immediate abdication by Nicholas'),'correct','Divided opposition and loyal army'),
    jsonb_build_object('id','turning-point-judgement','question','Which judgement best fits the significance of 1905?', 'options',jsonb_build_array('It weakened but did not destroy Tsarism','It had no political significance','It created immediate communist rule','It ended the Romanov dynasty'),'correct','It weakened but did not destroy Tsarism'),
    jsonb_build_object('id','best-evidence-weakening','question','Which evidence best supports the argument that 1905 weakened Tsarist authority?','options',jsonb_build_array('Nicholas issued the Manifesto','Nicholas began collectivisation','Bolsheviks controlled the Duma','Russia defeated Japan easily'),'correct','Nicholas issued the Manifesto')
  )
)
where activity_type = 'quiz'
  and lesson_id = (select id from lessons where title = 'Was the 1905 Revolution a turning point for Tsarist Russia?' limit 1);

update activities
set content_json = jsonb_set(
  content_json,
  '{questions}',
  jsonb_build_array(
    jsonb_build_object('id','tsar-1855','question','Who became Tsar of Russia in 1855?','options',jsonb_build_array('Alexander II','Nicholas II','Alexander III','Vladimir Lenin'),'correct','Alexander II'),
    jsonb_build_object('id','autocracy-definition','question','What does autocracy mean?','options',jsonb_build_array('Rule by one ultimate ruler','Rule by elected deputies','Rule by local councils','Rule by worker unions'),'correct','Rule by one ultimate ruler'),
    jsonb_build_object('id','main-population','question','Which group made up the majority of Russia’s population in 1855?','options',jsonb_build_array('Peasants','Factory workers','Middle-class liberals','Professional soldiers'),'correct','Peasants'),
    jsonb_build_object('id','serfdom-definition','question','What was serfdom?','options',jsonb_build_array('Peasants tied to landowners','Officials elected by peasants','Factories inspected by state','Military alliance with Europe'),'correct','Peasants tied to landowners'),
    jsonb_build_object('id','orthodox-role','question','How did the Orthodox Church support Tsarism?','options',jsonb_build_array('Promoted obedience to the Tsar','Organised legal trade unions','Elected members of the Duma','Ended the system of serfdom'),'correct','Promoted obedience to the Tsar'),
    jsonb_build_object('id','vast-empire','question','Why did Russia’s size make government difficult?','options',jsonb_build_array('Communication and control were harder','Bureaucracy was no longer needed','All nationalities became equal','Industry spread evenly everywhere'),'correct','Communication and control were harder'),
    jsonb_build_object('id','multi-national','question','Why did Russia’s multi-national character matter?','options',jsonb_build_array('Diversity made uniform control difficult','Everyone spoke the same language','Religious authority disappeared','Russia became fully democratic'),'correct','Diversity made uniform control difficult'),
    jsonb_build_object('id','economic-backwardness','question','Which phrase best describes Russia’s economy in 1855?','options',jsonb_build_array('Mostly rural and agricultural','Fully industrial and urban','Based on collectivised farms','Dominated by service work'),'correct','Mostly rural and agricultural'),
    jsonb_build_object('id','weak-transport','question','Why were weak transport links a problem?','options',jsonb_build_array('Trade, movement and control were harder','Rail coverage expanded rapidly','Serfdom became unnecessary','Parliament became stronger'),'correct','Trade, movement and control were harder'),
    jsonb_build_object('id','bureaucracy-problem','question','What was a common problem with the Tsarist bureaucracy?','options',jsonb_build_array('Slow, inefficient and corrupt','Chosen by universal suffrage','More powerful than the Tsar','Able to abolish local rule'),'correct','Slow, inefficient and corrupt'),
    jsonb_build_object('id','nobility','question','Who were the nobility?','options',jsonb_build_array('The landowning elite','Factory wage labourers','Revolutionary socialists','Urban police officers'),'correct','The landowning elite'),
    jsonb_build_object('id','middle-class','question','Why was Russia’s small middle class significant?','options',jsonb_build_array('It limited liberal pressure','It made Russia democratic','It controlled the army','It abolished autocracy'),'correct','It limited liberal pressure'),
    jsonb_build_object('id','crimean-war','question','Which war exposed Russia’s weakness in the 1850s?','options',jsonb_build_array('Crimean War','Russo-Japanese War','Russian Civil War','First World War'),'correct','Crimean War'),
    jsonb_build_object('id','crimean-war-weakness','question','What did the Crimean War reveal?','options',jsonb_build_array('Military and transport weakness','Successful collectivised farming','A powerful elected Duma','The immediate end of autocracy'),'correct','Military and transport weakness'),
    jsonb_build_object('id','theoretical-power','question','Why was Tsarist power sometimes stronger in theory than practice?','options',jsonb_build_array('Weak administration made control uneven','The Tsar possessed no authority','The Church openly opposed the Tsar','Russia had no officials at all'),'correct','Weak administration made control uneven'),
    jsonb_build_object('id','best-judgement','question','Which judgement best explains why Russia was difficult to govern in 1855?','options',jsonb_build_array('Weaknesses reinforced each other','Only the Church caused problems','Russia was already democratic','Workers controlled the state'),'correct','Weaknesses reinforced each other')
  )
)
where activity_type = 'quiz'
  and lesson_id = (select id from lessons where title = 'Why was Russia difficult to govern in 1855?' limit 1);

-- Quick check: the correct option should no longer be routinely the longest option.
select
  l.title,
  a.activity_type,
  jsonb_array_length(a.content_json -> 'questions') as question_count
from activities a
join lessons l on l.id = a.lesson_id
where a.activity_type = 'quiz'
  and l.title in (
    'Was the 1905 Revolution a turning point for Tsarist Russia?',
    'Why was Russia difficult to govern in 1855?'
  );
