export const ao3ReformReactionOppositionPathwaySlug = 'ao3-reform-reaction-opposition';

export const ao3ReformReactionOppositionLessonSections = [
  {
    heading: 'The enquiry',
    body: 'AQA AO3 requires you to assess the value of each interpretation in isolation. You must identify the historian’s argument, test it against precise contextual knowledge and reach a supported judgement about how convincing it is. This lesson applies that process to reform, reaction and opposition between 1855 and 1894.',
    question: 'What makes an interpretation convincing rather than simply accurate?',
    taskType: 'judgement',
    visual: { type: 'flow', title: 'AO3 evaluation sequence', steps: ['Identify the argument', 'Select relevant evidence', 'Test supporting evidence', 'Test limitations', 'Judge overall value'] },
  },
  {
    heading: 'Step 1: identify the interpretation',
    body: 'Begin by stating the historian’s central argument in your own words. Avoid copying the extract or listing details. A strong opening explains what the historian believes was most important, how change occurred and where responsibility lies.',
    question: 'How can you reduce a long extract to one precise argument?',
    taskType: 'explain',
  },
  {
    heading: 'Step 2: select precise contextual knowledge',
    body: 'Choose evidence that directly tests the argument. Useful knowledge includes emancipation in 1861, the zemstva and legal reforms, repression after 1866, the Land Captains, Russification, the Going to the People campaign, the 1879 populist split and the assassination of Alexander II. Evidence must be accurate, relevant and explained.',
    question: 'Why is relevant evidence more valuable than simply using lots of evidence?',
    taskType: 'explain',
  },
  {
    heading: 'Step 3: support the interpretation',
    body: 'Explain which evidence strengthens the historian’s view. For example, an interpretation stressing reform from above is supported by emancipation, independent courts and military modernisation. The key is to explain how the evidence validates the argument rather than merely attaching a fact.',
    question: 'How does explanation turn factual knowledge into AO3 evaluation?',
    taskType: 'analysis',
  },
  {
    heading: 'Step 4: test the limits',
    body: 'A convincing interpretation can still be incomplete. Test what it underplays, exaggerates or overlooks. An interpretation presenting Alexander II as a liberal reformer may understate redemption payments, continued autocracy and repression after 1866. A view stressing reaction under Alexander III may overlook administrative stability or the limited popular reach of opposition.',
    question: 'How can an interpretation be partly convincing but still limited?',
    taskType: 'judgement',
  },
  {
    heading: 'Step 5: use provenance carefully',
    body: 'AQA does not reward generic comments about bias. Use provenance only when it helps explain the interpretation’s emphasis. Consider the historian’s focus, period of writing, purpose or wider school of thought, but connect this directly to the argument and contextual evidence.',
    question: 'Why is “the historian may be biased” usually weak AO3?',
    taskType: 'explain',
  },
  {
    heading: 'Interpretation A: reform preserved autocracy',
    body: 'This interpretation argues that Alexander II’s reforms were designed primarily to strengthen and preserve autocracy. It is supported by reform from above, the absence of a national parliament and the continued authority of the Tsar. However, the independent judiciary, zemstva and expansion of education created genuine change that the state could not fully control.',
    question: 'How convincing is the claim that reform was chiefly a method of preserving autocracy?',
    taskType: 'ao3',
  },
  {
    heading: 'Interpretation B: reaction secured Alexander III',
    body: 'This interpretation argues that Alexander III restored stability through repression, centralisation and ideological control. Land Captains, censorship, police powers and Russification support this view. Yet opposition survived underground, industrial and social change continued, and coercion may have stored up longer-term hostility.',
    question: 'Did reaction solve opposition or merely suppress it temporarily?',
    taskType: 'ao3',
  },
  {
    heading: 'Interpretation C: opposition was weak before 1894',
    body: 'This interpretation argues that radical opposition remained too divided and socially narrow to threaten Tsarism seriously. The failure of Going to the People, the split in Land and Liberty and the small size of early Marxism support this. However, People’s Will assassinated Alexander II and revolutionary ideas established organisations and methods that later movements inherited.',
    question: 'Should effectiveness be judged by immediate success or long-term influence?',
    taskType: 'ao3',
  },
  {
    heading: 'Overall AO3 judgement',
    body: 'The strongest AO3 answers do not search for a completely right or wrong interpretation. They decide how far the argument explains the period, supported by precise evidence and qualified by what it neglects. Each extract must receive its own balanced judgement before any overall comparison.',
    question: 'Which criteria should determine the value of an interpretation?',
    taskType: 'judgement',
    visual: { type: 'comparison', title: 'Testing an interpretation', leftTitle: 'Strengthens value', rightTitle: 'Limits value', rows: [
      { left: 'Precise evidence directly supports the central claim', right: 'Important developments are omitted or understated' },
      { left: 'The argument explains causation and significance', right: 'The argument confuses short-term impact with long-term importance' },
      { left: 'The emphasis fits the wider historical context', right: 'The emphasis depends on an overly narrow focus' },
    ] },
  },
];

export const ao3ReformReactionOppositionTimeline = {
  events: [
    { id: '1855-accession', date: '1855', title: 'Alexander II becomes Tsar', detail: 'Military defeat and administrative weakness created pressure for reform.' },
    { id: '1861-emancipation', date: '1861', title: 'Emancipation', detail: 'Serfs gained legal freedom, but redemption payments and the mir restricted change.' },
    { id: '1864-reforms', date: '1864', title: 'Zemstva and legal reform', detail: 'Local government and independent courts modernised administration without ending autocracy.' },
    { id: '1866-repression', date: '1866', title: 'Repression intensifies', detail: 'Karakozov’s assassination attempt encouraged censorship and tighter control.' },
    { id: '1874-people', date: '1874', title: 'Going to the People', detail: 'Populists failed to mobilise peasants and many activists were arrested.' },
    { id: '1879-split', date: '1879', title: 'Land and Liberty splits', detail: 'Black Repartition favoured propaganda while People’s Will adopted terrorism.' },
    { id: '1881-assassination', date: '1881', title: 'Alexander II assassinated', detail: 'People’s Will killed the Tsar but failed to trigger a mass revolution.' },
    { id: '1889-land-captains', date: '1889', title: 'Land Captains introduced', detail: 'Alexander III strengthened noble and central control over the countryside.' },
  ],
};

export const ao3ReformReactionOppositionFlashcards = [
  { id: 'ao3', front: 'AO3', back: 'Analysis and evaluation of historical interpretations using contextual knowledge.' },
  { id: 'central-argument', front: 'Central argument', back: 'The historian’s main explanation or judgement about the issue.' },
  { id: 'contextual-knowledge', front: 'Contextual knowledge', back: 'Precise own knowledge used to test the interpretation.' },
  { id: 'validity', front: 'Validity', back: 'The extent to which an interpretation is convincing and supported.' },
  { id: 'provenance', front: 'Provenance', back: 'Information about authorship, purpose or context used only when relevant to the argument.' },
  { id: 'support', front: 'Supporting evidence', back: 'Knowledge that strengthens the interpretation’s central claim.' },
  { id: 'limitation', front: 'Limitation', back: 'Evidence or reasoning that reveals what the interpretation overlooks or exaggerates.' },
  { id: 'isolation', front: 'In isolation', back: 'Each AQA extract must be evaluated separately rather than directly compared throughout.' },
  { id: 'reform-above', front: 'Reform from above', back: 'State-directed reform intended to prevent uncontrolled change from below.' },
  { id: 'counter-reform', front: 'Counter-reform', back: 'Policies that restored central, noble and autocratic authority.' },
  { id: 'immediate-impact', front: 'Immediate impact', back: 'The short-term effect of an event or movement on Tsarist authority.' },
  { id: 'long-term-significance', front: 'Long-term significance', back: 'The later influence of ideas, organisations or policies beyond their immediate results.' },
];

export const ao3ReformReactionOppositionQuiz = [
  { id: 'q1', question: 'What should an AO3 paragraph identify first?', options: ['The interpretation’s central argument', 'Every date in the extract', 'The historian’s nationality', 'A comparison with another extract'], correct: 'The interpretation’s central argument' },
  { id: 'q2', question: 'How should contextual knowledge be used?', options: ['To test the argument directly', 'To replace discussion of the extract', 'To list everything remembered', 'To describe provenance only'], correct: 'To test the argument directly' },
  { id: 'q3', question: 'What makes evidence analytical?', options: ['Explaining how it supports or limits the view', 'Using the longest possible quotation', 'Adding several unrelated facts', 'Calling the historian biased'], correct: 'Explaining how it supports or limits the view' },
  { id: 'q4', question: 'Which is a valid limitation of a reform interpretation?', options: ['It may overlook continued autocracy and repression', 'It was written by a historian', 'It contains an argument', 'It mentions Alexander II'], correct: 'It may overlook continued autocracy and repression' },
  { id: 'q5', question: 'When is provenance useful?', options: ['When linked to the historian’s emphasis and evidence', 'Whenever the author has an opinion', 'Instead of contextual knowledge', 'Only in the conclusion'], correct: 'When linked to the historian’s emphasis and evidence' },
  { id: 'q6', question: 'Which evidence supports genuine reform under Alexander II?', options: ['Independent courts and zemstva', 'Land Captains', 'Russification', 'The Statute of State Security'], correct: 'Independent courts and zemstva' },
  { id: 'q7', question: 'Which evidence supports reaction under Alexander III?', options: ['Land Captains and censorship', 'The October Manifesto', 'The Duma', 'War Communism'], correct: 'Land Captains and censorship' },
  { id: 'q8', question: 'What limits the claim that opposition was powerful before 1894?', options: ['Its division and narrow social support', 'The existence of revolutionary ideas', 'The assassination of Alexander II', 'The formation of People’s Will'], correct: 'Its division and narrow social support' },
  { id: 'q9', question: 'How does AQA expect extracts to be assessed?', options: ['Each in isolation', 'Only by comparing authors', 'Only through provenance', 'As primary sources'], correct: 'Each in isolation' },
  { id: 'q10', question: 'What is the strongest final judgement?', options: ['A qualified decision based on argument and evidence', 'The extract is completely right', 'The historian is biased', 'Both sides are equally valid'], correct: 'A qualified decision based on argument and evidence' },
];

export const ao3ReformReactionOppositionJudgement = {
  question: 'Rank these criteria from most to least important when judging an interpretation. Justify your top three.',
  factors: [
    { id: 'argument', title: 'Clarity of argument', detail: 'How clearly the interpretation explains causation, change or significance.' },
    { id: 'supporting-evidence', title: 'Supporting evidence', detail: 'The amount and quality of precise evidence that validates the claim.' },
    { id: 'counter-evidence', title: 'Counter-evidence', detail: 'Evidence revealing omissions, exaggeration or imbalance.' },
    { id: 'chronology', title: 'Chronological coverage', detail: 'Whether the interpretation explains the whole period rather than one moment.' },
    { id: 'short-long', title: 'Short- and long-term distinction', detail: 'Whether immediate impact is separated from longer-term significance.' },
    { id: 'social-range', title: 'Range of groups considered', detail: 'Whether peasants, nobles, officials, radicals and minorities are adequately represented.' },
    { id: 'provenance', title: 'Relevant provenance', detail: 'Whether authorship or purpose helps explain the interpretation’s emphasis.' },
    { id: 'overall-explanation', title: 'Explanatory power', detail: 'How well the interpretation accounts for the main developments of the period.' },
  ],
};

export const ao3ReformReactionOppositionAO3 = {
  question: 'Assess the value of each interpretation in explaining reform, reaction and opposition between 1855 and 1894. Evaluate each interpretation in isolation.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Alexander II’s reforms were primarily conservative measures intended to modernise the state without weakening autocratic authority.' },
    { historian: 'Interpretation B', argument: 'Alexander III’s reaction restored effective control and left organised opposition weaker by 1894 than it had been in 1881.' },
    { historian: 'Interpretation C', argument: 'Although radical opposition failed in the short term, it created the ideas and organisations that made future revolution possible.' },
  ],
};

export const ao3ReformReactionOppositionPeel = {
  question: 'Evaluate Interpretation A: “Alexander II’s reforms were primarily conservative measures intended to preserve autocracy.”',
  stretchQuestion: 'Plan a full 30-mark AQA interpretations response evaluating all three extracts separately, with a supported judgement on each.',
  scaffold: [
    'Argument: state precisely what the interpretation claims.',
    'Support: use at least two pieces of directly relevant contextual knowledge.',
    'Explain: show how that knowledge strengthens the interpretation.',
    'Limit: use precise counter-evidence to test what the interpretation overlooks.',
    'Provenance: use authorship or emphasis only where it genuinely adds value.',
    'Judgement: decide how convincing the interpretation is overall and explain why.',
  ],
};

export const ao3ReformReactionOppositionConfidence = {
  prompt: 'How confident are you evaluating AQA interpretations on reform, reaction and opposition?',
  leastSecureOptions: ['Identifying the central argument', 'Selecting contextual knowledge', 'Explaining supporting evidence', 'Testing limitations', 'Using provenance', 'Avoiding generic bias comments', 'Evaluating extracts in isolation', 'Reaching a qualified judgement', 'Reform under Alexander II', 'Reaction under Alexander III', 'Opposition before 1894'],
  scale: [1, 2, 3, 4, 5],
};

export const ao3ReformReactionOppositionFallbacks: Record<string, any> = {
  lesson_content: { sections: ao3ReformReactionOppositionLessonSections },
  timeline: ao3ReformReactionOppositionTimeline,
  flashcards: { cards: ao3ReformReactionOppositionFlashcards },
  quiz: { questions: ao3ReformReactionOppositionQuiz },
  judgement_ranking: ao3ReformReactionOppositionJudgement,
  ao3_interpretation: ao3ReformReactionOppositionAO3,
  peel_response: ao3ReformReactionOppositionPeel,
  confidence_exit_ticket: ao3ReformReactionOppositionConfidence,
};
