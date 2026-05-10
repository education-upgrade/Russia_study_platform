export const alexanderIIWiderReformsLessonTitle = 'How far did Alexander II modernise Russia through reform?';
export const alexanderIIWiderReformsPathwaySlug = 'alexander-ii-wider-reforms';

export const pathwayAlexanderIIWiderReformsLessonSections = [
  {
    heading: 'The reform era',
    body: 'After the Crimean War and emancipation, Alexander II continued a broad programme of reform. The aim was not to create democracy, but to modernise Russia and strengthen the Tsarist system. Many reforms improved efficiency and administration, yet autocracy remained central.',
    question: 'Why did Alexander II continue reform after emancipation?',
    taskType: 'explain',
  },
  {
    heading: 'Zemstva reforms',
    body: 'The zemstva were elected local councils created in 1864. They dealt with roads, schools, healthcare and local services. This improved local administration and encouraged limited participation by educated Russians, but the Tsar still controlled national government.',
    question: 'How did the zemstva modernise local government?',
    taskType: 'explain',
    visual: {
      type: 'comparison',
      title: 'Before and after zemstva',
      leftTitle: 'Before reform',
      rightTitle: 'After reform',
      rows: [
        { left: 'Local government inefficient', right: 'Elected councils managed local services' },
        { left: 'Poor roads and healthcare', right: 'Improved local administration' },
        { left: 'Little participation', right: 'Some educated Russians gained experience' }
      ]
    }
  },
  {
    heading: 'Judicial reform',
    body: 'Judicial reforms introduced more modern courts, trained judges and trial by jury. Courts became more open and legal procedures more consistent. However, political cases could still be treated differently when the regime felt threatened.',
    question: 'Why were judicial reforms considered modern?',
    taskType: 'explain'
  },
  {
    heading: 'Military reform',
    body: 'Military reform aimed to improve Russia after defeat in the Crimean War. Conscription was reduced from 25 years to shorter service periods, training improved and the army became more professional. This strengthened Russia militarily and reduced some social burdens.',
    question: 'How did military reform modernise Russia?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'Why military reform happened',
      steps: ['Crimean War defeat exposed weakness', 'Army reforms introduced', 'Training and organisation improved', 'Russia became militarily stronger']
    }
  },
  {
    heading: 'Education and censorship',
    body: 'Education expanded during the reform period and censorship became less strict for a time. Universities gained more freedom and literacy slowly increased. However, the state still feared radical ideas and reforms could be reversed if opposition grew.',
    question: 'Why did reform create risks for the Tsarist state?',
    taskType: 'explain'
  },
  {
    heading: 'Limits of reform',
    body: 'Despite reform, Russia remained an autocracy. The Tsar still controlled national government, political opposition was restricted and many peasants remained poor. Reform aimed to strengthen the system, not replace it with democracy.',
    question: 'What were the main limits of Alexander II’s reforms?',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'How modern was Russia by the 1870s?',
      leftLabel: 'Still backward',
      rightLabel: 'Clearly modernising',
      markerLabel: 'Partial modernisation',
      markerPosition: 60,
      prompt: 'Russia modernised in important ways, but autocracy and social inequality remained.'
    }
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander II’s reforms modernised important parts of Russia including local government, the legal system, the army and education. However, reform was limited because autocracy remained intact and many social problems continued. Reform changed Russia, but not enough to remove tension and opposition.',
    question: 'How far did Alexander II modernise Russia through reform?',
    taskType: 'judgement'
  }
];

export const pathwayAlexanderIIWiderReformsQuizQuestions = [
  { id: 'zemstva-date', question: 'When were the zemstva introduced?', options: ['1861', '1864', '1881', '1905'], correct: '1864' },
  { id: 'zemstva-role', question: 'What did the zemstva mainly deal with?', options: ['Local government services', 'Foreign policy', 'Secret policing', 'National elections'], correct: 'Local government services' },
  { id: 'judicial-reform', question: 'Which feature was introduced in judicial reform?', options: ['Trial by jury', 'Collectivisation', 'Soviets', 'Martial law'], correct: 'Trial by jury' },
  { id: 'military-reason', question: 'Why were military reforms introduced?', options: ['Crimean War weakness', 'Bolshevik pressure', 'Industrial collapse', 'World War One'], correct: 'Crimean War weakness' },
  { id: 'military-change', question: 'How did military service change?', options: ['Service periods were reduced', 'The army was abolished', 'Only nobles served', 'Conscription ended immediately'], correct: 'Service periods were reduced' },
  { id: 'education', question: 'What happened to education under Alexander II?', options: ['It expanded gradually', 'All universities closed', 'Literacy disappeared', 'Education was fully privatised'], correct: 'It expanded gradually' },
  { id: 'censorship', question: 'How did censorship change?', options: ['It became less strict for a time', 'All censorship ended permanently', 'Newspapers were banned completely', 'Foreign books became illegal'], correct: 'It became less strict for a time' },
  { id: 'autocracy', question: 'What remained unchanged despite reform?', options: ['Autocratic rule', 'Industrialisation', 'The army', 'Peasant taxation'], correct: 'Autocratic rule' },
  { id: 'reform-purpose', question: 'What was the main aim of reform?', options: ['To strengthen Russia and preserve the regime', 'To create communism', 'To abolish government', 'To introduce full democracy'], correct: 'To strengthen Russia and preserve the regime' },
  { id: 'overall', question: 'Which judgement is strongest?', options: ['Russia modernised in important ways but remained autocratic', 'Reform completely democratised Russia', 'Reform had no effect at all', 'Russia became fully liberal'], correct: 'Russia modernised in important ways but remained autocratic' }
];

export const pathwayAlexanderIIWiderReformsFlashcards = [
  { id: 'zemstva', front: 'Zemstva', back: 'Elected local councils created in 1864 to improve local administration.' },
  { id: 'judicial', front: 'Judicial reform', back: 'Modern courts, trained judges and trial by jury improved the legal system.' },
  { id: 'military', front: 'Military reform', back: 'Army reforms after the Crimean War improved training and reduced service terms.' },
  { id: 'education', front: 'Education reform', back: 'Universities and schools gained greater freedom and education expanded.' },
  { id: 'censorship', front: 'Censorship', back: 'Restrictions eased temporarily, but the state still feared opposition.' },
  { id: 'limits', front: 'Limits of reform', back: 'Autocracy remained and political opposition was still restricted.' },
  { id: 'modernisation', front: 'Modernisation', back: 'Reforms improved efficiency and administration in several areas of Russia.' },
  { id: 'overall', front: 'Best judgement', back: 'Alexander II modernised Russia significantly, but reform remained limited by autocracy.' }
];

export const pathwayAlexanderIIWiderReformsPeelContent = {
  question: 'Explain one way in which Alexander II modernised Russia through reform.',
  stretchQuestion: '“Alexander II modernised Russia, but not enough to change the nature of Tsarist rule.” Assess the validity of this view.',
  scaffold: [
    'Point: identify one major reform.',
    'Evidence: use precise examples such as zemstva, judicial reform or military reform.',
    'Explain: show how the reform modernised Russia.',
    'Limit: explain what remained unchanged.',
    'Link judgement: decide how far reform truly modernised Russia.'
  ]
};

export const pathwayAlexanderIIWiderReformsConfidenceContent = {
  prompt: 'How confident are you explaining Alexander II’s wider reforms?',
  leastSecureOptions: ['Zemstva', 'Judicial reform', 'Military reform', 'Education reform', 'Limits of reform', 'Overall judgement'],
  scale: [1,2,3,4,5]
};
