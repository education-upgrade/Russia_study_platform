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
  { id: 'dates', question: 'When was the Crimean War?', options: ['1853–56', '1861–64', '1881–84', '1904–05'], correct: '1853–56' },
  { id: 'opponents', question: 'Which powers helped defeat Russia?', options: ['Britain, France and the Ottoman Empire', 'Germany and Japan', 'Austria and Prussia only', 'The Bolsheviks'], correct: 'Britain, France and the Ottoman Empire' },
  { id: 'main-impact', question: 'What did the Crimean War expose?', options: ['Russia’s military, economic and administrative weaknesses', 'Russia’s democratic strength', 'The success of collectivisation', 'The strength of the Duma'], correct: 'Russia’s military, economic and administrative weaknesses' },
  { id: 'transport', question: 'Why did poor transport matter?', options: ['It slowed movement of troops and supplies', 'It made Russia more democratic', 'It ended serfdom immediately', 'It gave peasants land'], correct: 'It slowed movement of troops and supplies' },
  { id: 'army', question: 'Why was Russia’s army weaker than it appeared?', options: ['It was badly supplied and organised', 'It had no soldiers', 'It was controlled by Britain', 'It refused to fight for religious reasons'], correct: 'It was badly supplied and organised' },
  { id: 'economy', question: 'How did economic backwardness affect the war?', options: ['Russia struggled to produce and move modern supplies', 'Russia became fully industrialised', 'Russia developed universal education', 'Russia abolished taxation'], correct: 'Russia struggled to produce and move modern supplies' },
  { id: 'bureaucracy', question: 'What did the war reveal about administration?', options: ['The bureaucracy was slow and inefficient', 'The Duma controlled the army', 'Local democracy was highly effective', 'The Tsar had no power'], correct: 'The bureaucracy was slow and inefficient' },
  { id: 'reform', question: 'Why did defeat encourage reform?', options: ['It showed Russia needed to modernise', 'It proved Russia needed no change', 'It ended autocracy immediately', 'It created the Soviet Union'], correct: 'It showed Russia needed to modernise' },
  { id: 'alexander', question: 'Which Tsar inherited Russia during the Crimean War?', options: ['Alexander II', 'Alexander III', 'Nicholas II', 'Lenin'], correct: 'Alexander II' },
  { id: 'judgement', question: 'Which judgement is strongest?', options: ['The war triggered reform by exposing deeper weaknesses', 'The war solved Russia’s problems', 'The war made Russia democratic', 'The war had no importance'], correct: 'The war triggered reform by exposing deeper weaknesses' }
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
