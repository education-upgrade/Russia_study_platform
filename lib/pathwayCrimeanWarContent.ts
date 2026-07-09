export const crimeanWarLessonTitle = 'Why did the Crimean War expose the weaknesses of Tsarist Russia?';
export const crimeanWarPathwaySlug = 'crimean-war';

export const pathwayCrimeanWarLessonSections = [
  {
    heading: 'The enquiry',
    body: 'The Crimean War was a major turning point for Tsarist Russia because it exposed weaknesses that had been hidden by the size and reputation of the empire. Defeat showed that Russia’s army, transport, administration and economy were not modern enough to compete with Britain and France.',
    question: 'Why did defeat in the Crimean War matter so much for Russia?',
    taskType: 'explain',
    visual: { type: 'flow', title: 'From defeat to reform', steps: ['War exposed weakness', 'Army and transport looked outdated', 'Russia’s great-power status was damaged', 'Alexander II faced pressure to reform'] }
  },
  {
    heading: 'The Crimean War, 1853–56',
    body: 'The war was fought between Russia and an alliance including Britain, France and the Ottoman Empire. Russia expected to act as a major European power, but defeat revealed that it had fallen behind its rivals in military organisation and industrial capacity.',
    question: 'Who defeated Russia in the Crimean War?',
    taskType: 'recall'
  },
  {
    heading: 'Military weakness',
    body: 'Russia had a huge army, but it was poorly organised, badly supplied and dependent on outdated systems. Long service, weak training and poor equipment made the army less effective than its size suggested.',
    question: 'Why did Russia’s large army not guarantee military strength?',
    taskType: 'explain'
  },
  {
    heading: 'Transport and communication problems',
    body: 'Russia’s size became a weakness during the war. The railway network was very limited, making it hard to move troops, weapons and supplies. Poor communications also made administration slow and inefficient.',
    question: 'How did poor transport make Russia harder to defend?',
    taskType: 'explain',
    visual: { type: 'comparison', title: 'Scale as strength and weakness', leftTitle: 'Strength', rightTitle: 'Weakness', rows: [{ left: 'Huge empire and population', right: 'Difficult to move troops and supplies' }, { left: 'Large army', right: 'Poor logistics and outdated equipment' }, { left: 'Great-power image', right: 'Defeat exposed backwardness' }] }
  },
  {
    heading: 'Economic backwardness',
    body: 'The war showed that Russia’s economy could not support modern warfare effectively. Limited industry, weak railways and dependence on agriculture made it harder to produce and transport weapons and supplies.',
    question: 'Why did economic backwardness weaken Russia during the war?',
    taskType: 'explain'
  },
  {
    heading: 'Administrative problems',
    body: 'The Tsarist state relied on a large but inefficient bureaucracy. During the war, poor organisation and slow decision-making made Russia’s weaknesses more obvious. Defeat suggested that the state itself needed reform.',
    question: 'How did the war expose administrative weakness?',
    taskType: 'explain'
  },
  {
    heading: 'Overall judgement',
    body: 'The Crimean War did not create all of Russia’s problems, but it exposed them dramatically. It made reform urgent because Russia could no longer assume that autocracy, size and tradition were enough to preserve great-power status.',
    question: 'Was the Crimean War the main reason Alexander II had to reform Russia? Give a brief judgement.',
    taskType: 'judgement',
    visual: { type: 'judgementScale', title: 'How important was the Crimean War?', leftLabel: 'One problem among many', rightLabel: 'Main turning point', markerLabel: 'Major trigger', markerPosition: 75, prompt: 'The war was a trigger because it exposed deeper structural weaknesses.' }
  }
];

export const pathwayCrimeanWarFlashcards = [
  { id: 'crimean-war', front: 'Crimean War', back: 'War from 1853 to 1856 in which Russia was defeated by Britain, France and the Ottoman Empire.' },
  { id: '1853-56', front: '1853–56', back: 'Dates of the Crimean War.' },
  { id: 'great-power-status', front: 'Great-power status', back: 'Russia’s reputation as a major European power was damaged by defeat.' },
  { id: 'military-weakness', front: 'Military weakness', back: 'Russia’s army was large but badly organised, supplied and equipped.' },
  { id: 'transport', front: 'Transport weakness', back: 'Limited railways made it hard to move troops, supplies and weapons.' },
  { id: 'economic-backwardness', front: 'Economic backwardness', back: 'Limited industry and dependence on agriculture weakened Russia’s war effort.' },
  { id: 'bureaucracy', front: 'Bureaucracy', back: 'The state administration was slow and inefficient, making wartime problems worse.' },
  { id: 'reform-pressure', front: 'Pressure for reform', back: 'Defeat convinced many that Russia had to modernise to survive as a great power.' },
  { id: 'alexander-ii', front: 'Alexander II', back: 'Inherited a weakened Russia in 1855 during the Crimean War.' },
  { id: 'best-judgement', front: 'Best judgement', back: 'The Crimean War was a trigger for reform because it exposed deeper weaknesses.' }
];

export const pathwayCrimeanWarQuizQuestions = [
  { id: 'dates', question: 'When was the Crimean War?', options: ['1853–56', '1856–61', '1877–78', '1904–05'], correct: '1853–56' },
  { id: 'opponents', question: 'Which powers defeated Russia?', options: ['Prussia, Austria and Italy', 'Britain, France and the Ottomans', 'Germany, Japan and Austria', 'Austria, Prussia and Britain'], correct: 'Britain, France and the Ottomans' },
  { id: 'main-impact', question: 'What weakness did the war expose?', options: ['Autocracy had become fully secure', 'Russia had modernised too quickly', 'Russia lagged behind major powers', 'Peasants had gained political power'], correct: 'Russia lagged behind major powers' },
  { id: 'transport', question: 'Why were poor railways a problem?', options: ['They slowed troops and supplies', 'They weakened Orthodox authority', 'They reduced peasant taxation', 'They strengthened local zemstva'], correct: 'They slowed troops and supplies' },
  { id: 'army', question: 'Why was the army less effective than its size suggested?', options: ['It relied on elected officers', 'It lacked organisation and supply', 'It refused to defend Sevastopol', 'It was controlled by the nobles'], correct: 'It lacked organisation and supply' },
  { id: 'economy', question: 'How did the economy weaken Russia’s war effort?', options: ['Industry and railways were limited', 'Agriculture had modernised fully', 'Foreign trade funded the army', 'Factories supplied equipment quickly'], correct: 'Industry and railways were limited' },
  { id: 'bureaucracy', question: 'What did the war reveal about administration?', options: ['Bureaucracy was slow and inefficient', 'Ministers controlled elected parliaments', 'Local government was fully democratic', 'Officials answered directly to peasants'], correct: 'Bureaucracy was slow and inefficient' },
  { id: 'reform', question: 'Why did defeat encourage reform?', options: ['It showed modernisation was urgent', 'It proved autocracy no longer existed', 'It made peasant communes powerful', 'It gave Russia new European allies'], correct: 'It showed modernisation was urgent' },
  { id: 'alexander', question: 'Which Tsar inherited the war in 1855?', options: ['Nicholas I', 'Alexander II', 'Alexander III', 'Nicholas II'], correct: 'Alexander II' },
  { id: 'judgement', question: 'Which judgement is strongest?', options: ['Defeat exposed problems but did not create them', 'Defeat made Russia politically democratic', 'Defeat removed the need for reform', 'Defeat mainly strengthened serfdom'], correct: 'Defeat exposed problems but did not create them' }
];

export const pathwayCrimeanWarPeelContent = {
  question: 'Explain why defeat in the Crimean War exposed weakness in Tsarist Russia.',
  stretchQuestion: '“The Crimean War was the main reason Alexander II had to reform Russia.” Assess the validity of this view in one paragraph.',
  scaffold: [
    'Point: identify one weakness exposed by defeat.',
    'Evidence: use specific examples such as poor railways, military weakness or economic backwardness.',
    'Explain: show how this made Russia look backward or vulnerable.',
    'Limit: explain that the war exposed deeper problems rather than creating them.',
    'Judgement: decide how important the Crimean War was as a trigger for reform.'
  ]
};

export const pathwayCrimeanWarConfidenceContent = {
  prompt: 'How confident are you explaining why the Crimean War exposed Russia’s weaknesses?',
  leastSecureOptions: ['Military weakness', 'Transport problems', 'Economic backwardness', 'Administration', 'Great-power status', 'Link to reform'],
  scale: [1,2,3,4,5]
};
