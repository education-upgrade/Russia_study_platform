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
        { left: 'Little participation', right: 'Some educated Russians gained experience' },
      ],
    },
  },
  {
    heading: 'Judicial reform',
    body: 'Judicial reforms introduced more modern courts, trained judges and trial by jury. Courts became more open and legal procedures more consistent. However, political cases could still be treated differently when the regime felt threatened.',
    question: 'Why were judicial reforms considered modern?',
    taskType: 'explain',
  },
  {
    heading: 'Military reform',
    body: 'Military reform aimed to improve Russia after defeat in the Crimean War. Conscription was reduced from 25 years to shorter service periods, training improved and the army became more professional. This strengthened Russia militarily and reduced some social burdens.',
    question: 'How did military reform modernise Russia?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'Why military reform happened',
      steps: ['Crimean War defeat exposed weakness', 'Army reforms introduced', 'Training and organisation improved', 'Russia became militarily stronger'],
    },
  },
  {
    heading: 'Education and censorship',
    body: 'Education expanded during the reform period and censorship became less strict for a time. Universities gained more freedom and literacy slowly increased. However, the state still feared radical ideas and reforms could be reversed if opposition grew.',
    question: 'Why did reform create risks for the Tsarist state?',
    taskType: 'explain',
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
      prompt: 'Russia modernised in important ways, but autocracy and social inequality remained.',
    },
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander II’s reforms modernised important parts of Russia including local government, the legal system, the army and education. However, reform was limited because autocracy remained intact and many social problems continued. Reform changed Russia, but not enough to remove tension and opposition.',
    question: 'How far did Alexander II modernise Russia through reform?',
    taskType: 'judgement',
  },
];

export const pathwayAlexanderIIWiderReformsTimeline = {
  events: [
    { id: '1856-reform-era', date: '1856', title: 'Reform era begins', detail: 'Crimean defeat increased pressure to modernise Russia and strengthen the state.' },
    { id: '1863-university-statute', date: '1863', title: 'University Statute', detail: 'Universities gained greater autonomy, though the government still feared radical ideas.' },
    { id: '1864-zemstva', date: '1864', title: 'Zemstva introduced', detail: 'Elected local councils took responsibility for roads, schools, healthcare and local services.' },
    { id: '1864-judicial', date: '1864', title: 'Judicial reform', detail: 'Open courts, trained judges and trial by jury modernised legal procedure.' },
    { id: '1865-censorship', date: '1865', title: 'Censorship relaxed', detail: 'Pre-publication censorship was reduced for some larger publications, widening public debate.' },
    { id: '1870-dumas', date: '1870', title: 'Municipal dumas', detail: 'Elected councils were introduced in towns, extending limited local participation.' },
    { id: '1874-military', date: '1874', title: 'Military reform', detail: 'Universal conscription and shorter service replaced the older long-service system.' },
    { id: '1878-berlin', date: '1878', title: 'Congress of Berlin', detail: 'Russia’s military recovery was evident, but diplomatic disappointment exposed continuing limits.' },
  ],
};

export const pathwayAlexanderIIWiderReformsQuizQuestions = [
  { id: 'zemstva-date', question: 'When were the zemstva introduced?', options: ['1861', '1864', '1870', '1874'], correct: '1864' },
  { id: 'zemstva-role', question: 'What was the main role of the zemstva?', options: ['Managing local services and infrastructure', 'Directing national foreign policy', 'Controlling the secret police', 'Electing ministers to parliament'], correct: 'Managing local services and infrastructure' },
  { id: 'judicial-reform', question: 'Which feature belonged to the judicial reforms?', options: ['Open courts and trial by jury', 'Collective farming and quotas', 'Military rule in every province', 'Direct election of the Tsar'], correct: 'Open courts and trial by jury' },
  { id: 'military-reason', question: 'Why did Alexander II reform the army?', options: ['Crimean defeat exposed military weakness', 'Zemstva demanded control of defence', 'Peasants refused all forms of service', 'Russia had already defeated every rival'], correct: 'Crimean defeat exposed military weakness' },
  { id: 'military-change', question: 'What changed under the 1874 military reform?', options: ['Service became shorter and more universal', 'Conscription was abolished permanently', 'Only nobles could serve as soldiers', 'The army was placed under zemstva control'], correct: 'Service became shorter and more universal' },
  { id: 'education', question: 'How did education change during the reform era?', options: ['Universities gained greater freedom', 'All higher education was abolished', 'Only military schools remained open', 'Literacy policy was abandoned entirely'], correct: 'Universities gained greater freedom' },
  { id: 'censorship', question: 'How did censorship change in the 1860s?', options: ['Restrictions were relaxed for some publications', 'All political criticism became legal', 'Foreign books were permanently prohibited', 'Newspapers came under zemstva control'], correct: 'Restrictions were relaxed for some publications' },
  { id: 'municipal', question: 'What did the 1870 municipal reforms create?', options: ['Elected councils in towns', 'A national parliament in St Petersburg', 'Independent peasant republics', 'Military governments in major cities'], correct: 'Elected councils in towns' },
  { id: 'reform-purpose', question: 'What was the main purpose of the wider reforms?', options: ['To modernise Russia while preserving Tsarism', 'To replace autocracy with parliamentary rule', 'To transfer power to revolutionary groups', 'To remove the nobility from public life'], correct: 'To modernise Russia while preserving Tsarism' },
  { id: 'overall', question: 'Which judgement best evaluates the wider reforms?', options: ['They modernised institutions without ending autocracy', 'They fully democratised national government', 'They produced no meaningful change anywhere', 'They immediately ended social and political tension'], correct: 'They modernised institutions without ending autocracy' },
];

export const pathwayAlexanderIIWiderReformsFlashcards = [
  { id: 'zemstva', front: 'Zemstva', back: 'Elected local councils created in 1864 to manage roads, schools, healthcare and local services.' },
  { id: 'judicial', front: 'Judicial reform', back: 'The 1864 reforms introduced more open courts, trained judges and trial by jury.' },
  { id: 'military', front: 'Military reform', back: 'The 1874 reform introduced universal conscription, shorter service and improved training.' },
  { id: 'university', front: 'University Statute, 1863', back: 'Gave universities greater autonomy and widened intellectual freedom.' },
  { id: 'censorship', front: 'Censorship reform', back: 'Restrictions eased for some publications in 1865, though political control remained.' },
  { id: 'municipal', front: 'Municipal dumas', back: 'Elected town councils introduced in 1870 to improve urban administration.' },
  { id: 'local-participation', front: 'Limited participation', back: 'Local reforms allowed some elected involvement without creating national democracy.' },
  { id: 'modernisation', front: 'Modernisation', back: 'Reforms improved efficiency, professionalism and administration across several institutions.' },
  { id: 'political-limits', front: 'Political limits', back: 'The Tsar retained control of national government and could restrict reform when threatened.' },
  { id: 'social-limits', front: 'Social limits', back: 'Many peasants remained poor and unequal despite institutional reform.' },
  { id: 'preserve-autocracy', front: 'Reform to preserve autocracy', back: 'Alexander II changed institutions mainly to strengthen rather than replace Tsarist rule.' },
  { id: 'overall', front: 'Best judgement', back: 'The reforms modernised important institutions but did not change the autocratic nature of the state.' },
];

export const pathwayAlexanderIIWiderReformsJudgement = {
  question: 'Rank Alexander II’s wider reforms from most to least significant. Which changed Russia most?',
  factors: [
    { id: 'judicial', title: 'Judicial reform', detail: 'Created more open and professional courts and introduced trial by jury.' },
    { id: 'military', title: 'Military reform', detail: 'Improved readiness, widened conscription and reduced the burden of long service.' },
    { id: 'zemstva', title: 'Zemstva reform', detail: 'Improved local services and gave some educated Russians administrative experience.' },
    { id: 'education', title: 'Education reform', detail: 'Expanded educational opportunity and encouraged a more informed public.' },
    { id: 'censorship', title: 'Relaxation of censorship', detail: 'Widened debate but also increased the circulation of critical and radical ideas.' },
    { id: 'municipal', title: 'Municipal reform', detail: 'Improved urban administration through elected town councils.' },
  ],
};

export const pathwayAlexanderIIWiderReformsAO3 = {
  question: 'Which interpretation is most convincing about the significance of Alexander II’s wider reforms?',
  interpretations: [
    { historian: 'Interpretation A', argument: 'The wider reforms represented genuine modernisation because they made courts, local government, education and the army more efficient and professional.' },
    { historian: 'Interpretation B', argument: 'The reforms were fundamentally limited because the Tsar retained national political control and could reverse concessions when opposition increased.' },
    { historian: 'Interpretation C', argument: 'The reforms were significant mainly because they unintentionally created new educated groups and expectations that autocracy could not fully satisfy.' },
  ],
};

export const pathwayAlexanderIIWiderReformsPeelContent = {
  question: 'Explain one way in which Alexander II modernised Russia through reform.',
  stretchQuestion: '“Alexander II modernised Russia, but not enough to change the nature of Tsarist rule.” Assess the validity of this view.',
  scaffold: [
    'Point: identify one major reform.',
    'Evidence: use precise examples such as zemstva, judicial reform or military reform.',
    'Explain: show how the reform modernised Russia.',
    'Limit: explain what remained unchanged.',
    'Link judgement: decide how far reform truly modernised Russia.',
  ],
};

export const pathwayAlexanderIIWiderReformsConfidenceContent = {
  prompt: 'How confident are you explaining Alexander II’s wider reforms?',
  leastSecureOptions: ['Zemstva', 'Judicial reform', 'Military reform', 'Education reform', 'Censorship', 'Limits of reform', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5],
};
