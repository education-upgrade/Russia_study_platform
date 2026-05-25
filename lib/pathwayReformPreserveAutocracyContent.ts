export const reformPreserveAutocracyPathwaySlug = 'reform-preserve-autocracy';
export const reformPreserveAutocracySeedLessonTitle = 'Reform to preserve autocracy';
export const reformPreserveAutocracyEnquiry = 'To what extent were Alexander II reforms designed to preserve autocracy?';

export const pathwayReformPreserveAutocracyLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander II introduced major reforms, but he did not intend to create democracy or weaken autocracy fundamentally. This pathway asks whether reform was mainly a tool to modernise Russia, or a way to preserve the authority of the Tsarist state.',
    question: 'Why might reform strengthen rather than weaken autocracy?',
    taskType: 'judgement',
    visual: { type: 'judgementScale', title: 'Reform and autocracy', leftLabel: 'Genuine transformation', rightLabel: 'Preserve Tsarist power', markerLabel: 'Mixed motives', markerPosition: 62, prompt: 'Alexander II modernised selected areas while keeping political power firmly autocratic.' }
  },
  {
    heading: 'Reform from above',
    body: 'Alexander II and his advisers believed it was safer to reform from above than wait for pressure from below. Reform could reduce instability, improve efficiency and prevent more radical demands from peasants, liberals or revolutionaries.',
    question: 'What does reform from above mean?',
    taskType: 'explain'
  },
  {
    heading: 'Emancipation and control',
    body: 'The emancipation of the serfs legally freed peasants, but the settlement protected landowners and the state. Redemption payments, the mir and limited land allotments meant peasants remained controlled and economically restricted.',
    question: 'How did emancipation preserve elements of the old social order?',
    taskType: 'explain'
  },
  {
    heading: 'Local government without national power',
    body: 'The zemstva created local self-government in 1864, but they had limited powers and were dominated by the nobility. They could improve roads, schools and healthcare, but they did not become a national parliament or challenge the Tsar’s authority.',
    question: 'Why did the zemstva not seriously threaten autocracy?',
    taskType: 'explain'
  },
  {
    heading: 'Legal and military reform',
    body: 'Judicial reform introduced more modern courts and military reform made the army more efficient. These reforms strengthened the state by making government more effective, but they did not make Russia politically liberal overall.',
    question: 'How could modernising reform strengthen the autocratic state?',
    taskType: 'explain'
  },
  {
    heading: 'Limits and reaction',
    body: 'After the 1866 assassination attempt, reform slowed and repression increased. Censorship tightened and the regime became more cautious. This suggests that Alexander II’s commitment to reform had clear limits when autocracy felt threatened.',
    question: 'What does the reaction after 1866 suggest about Alexander II’s priorities?',
    taskType: 'judgement'
  },
  {
    heading: 'Overall judgement',
    body: 'The best answer is balanced. Alexander II’s reforms did modernise Russia in important ways, but they were carefully limited. They were designed to make the autocratic state stronger, more efficient and more secure rather than to replace autocracy.',
    question: 'Overall, were Alexander II’s reforms more about modernisation or preserving autocracy?',
    taskType: 'judgement'
  }
];

export const pathwayReformPreserveAutocracyTimelineContent = {
  events: [
    { date: '1856', title: 'Crimean War defeat', detail: 'Defeat increased pressure for reform from above.' },
    { date: '1861', title: 'Emancipation Edict', detail: 'Serfs legally freed, but settlement protected state and noble interests.' },
    { date: '1864', title: 'Zemstva and judicial reforms', detail: 'Local government and courts modernised without creating national democracy.' },
    { date: '1866', title: 'Assassination attempt', detail: 'Reform slowed and repression increased.' },
    { date: '1874', title: 'Military reform', detail: 'Army modernised to strengthen the state.' },
    { date: '1881', title: 'Alexander II assassinated', detail: 'Reactionary policy strengthened under Alexander III.' }
  ]
};

export const pathwayReformPreserveAutocracyCardSortContent = {
  cards: [
    { id: 'zemstva', text: 'Zemstva gave some local self-government but were dominated by nobles.', category: 'limited reform' },
    { id: 'judicial', text: 'Judicial reform introduced trial by jury and equality before the law.', category: 'genuine modernisation' },
    { id: 'mir', text: 'The mir helped keep peasants tied to village control after emancipation.', category: 'preserved control' },
    { id: 'redemption', text: 'Redemption payments burdened peasants and compensated landowners.', category: 'preserved control' },
    { id: 'military', text: 'Military reform made the army more efficient after Crimea.', category: 'strengthened state' },
    { id: 'censorship', text: 'Censorship tightened after the 1866 assassination attempt.', category: 'reaction' }
  ],
  categories: ['genuine modernisation', 'limited reform', 'preserved control', 'strengthened state', 'reaction']
};

export const pathwayReformPreserveAutocracyPeelContent = {
  question: 'Alexander II reformed in order to preserve autocracy. Assess the validity of this view.',
  stretchQuestion: 'Plan a balanced 25-mark answer weighing reform, continuity and motive.',
  scaffold: [
    'Point: Make a clear judgement about whether reform preserved autocracy.',
    'Evidence: Use precise examples such as emancipation, zemstva, judicial reform or reaction after 1866.',
    'Explain: Show how the reform either modernised Russia or protected Tsarist power.',
    'Limit: Recognise evidence on the other side of the argument.',
    'Link: Return to the question with a balanced judgement.'
  ]
};

export const pathwayReformPreserveAutocracyConfidenceContent = {
  prompt: 'How confident are you explaining how reform and autocracy coexisted under Alexander II?',
  leastSecureOptions: ['Reform from above', 'Emancipation limits', 'Zemstva', 'Judicial reform', 'Reaction after 1866', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5]
};
