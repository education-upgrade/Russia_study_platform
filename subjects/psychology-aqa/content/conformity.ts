export const psychologyConformityPathwaySlug = 'psychology-social-influence-conformity';
export const psychologyConformityLessonTitle = 'Why do people conform?';

export const psychologyConformityLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Conformity is a change in behaviour or belief in response to real or imagined group pressure. In this pathway you will distinguish types of conformity, explain normative and informational social influence, and apply the variables investigated by Asch.',
    question: 'In one sentence, explain what psychologists mean by conformity.',
    taskType: 'recall',
  },
  {
    heading: 'Compliance and internalisation',
    body: 'Compliance is a public change in behaviour without necessarily changing private beliefs. It is usually temporary and often ends when group pressure is removed. Internalisation is a deeper form of conformity in which the person genuinely accepts the group position, so both public behaviour and private beliefs change.',
    question: 'What is the key difference between compliance and internalisation?',
    taskType: 'explain',
  },
  {
    heading: 'Normative social influence',
    body: 'Normative social influence occurs when people conform because they want social approval or want to avoid rejection. The person may go along with a group even when they privately disagree. This therefore often produces compliance.',
    question: 'Why is normative social influence commonly linked to compliance?',
    taskType: 'explain',
  },
  {
    heading: 'Informational social influence',
    body: 'Informational social influence occurs when people conform because they believe others may know better, especially when the situation is unfamiliar, ambiguous or difficult. The group is used as a source of information about reality. This can produce internalisation because the individual comes to accept the group view as correct.',
    question: 'When is informational social influence most likely to occur?',
    taskType: 'apply',
  },
  {
    heading: 'Asch: group size',
    body: 'Asch used an unambiguous line-judgement task to investigate majority influence. Conformity increased as the majority became larger, but adding more people beyond a modest majority produced much smaller additional effects. This suggests majority pressure matters, but the relationship is not simply that every extra person produces the same increase.',
    question: 'What does the effect of group size suggest about majority pressure?',
    taskType: 'explain',
  },
  {
    heading: 'Asch: unanimity',
    body: 'A unanimous majority creates strong pressure to conform. When one other person breaks the unanimity, conformity falls substantially. The dissenter does not always need to give the correct answer: simply showing that disagreement is possible can reduce the social pressure created by the majority.',
    question: 'Why does a dissenter reduce conformity?',
    taskType: 'apply',
  },
  {
    heading: 'Asch: task difficulty',
    body: 'When the judgement becomes more difficult, people become less certain that their own answer is correct and are more likely to rely on others. This supports an informational explanation because uncertainty increases the value of the group as a source of information.',
    question: 'Which explanation for conformity is most relevant when task difficulty increases, and why?',
    taskType: 'explain',
  },
  {
    heading: 'Overall judgement',
    body: 'Conformity can therefore arise for different reasons. Normative pressure is strongest when acceptance matters, whereas informational influence becomes important when people are uncertain. Asch also demonstrated that features of the social situation, especially group size, unanimity and task difficulty, alter the likelihood of conformity.',
    question: 'Which explanation do you think best accounts for conformity in an ambiguous situation? Give a brief reason.',
    taskType: 'judgement',
  },
];

export const psychologyConformityFlashcards = [
  { id: 'conformity', front: 'Conformity', back: 'A change in behaviour or belief in response to real or imagined group pressure.' },
  { id: 'compliance', front: 'Compliance', back: 'A public change in behaviour without necessarily accepting the group view privately.' },
  { id: 'internalisation', front: 'Internalisation', back: 'A genuine acceptance of the group position that changes both public behaviour and private belief.' },
  { id: 'nsi', front: 'Normative social influence (NSI)', back: 'Conforming to gain social approval or avoid rejection.' },
  { id: 'isi', front: 'Informational social influence (ISI)', back: 'Conforming because others are seen as a useful source of information about what is correct.' },
  { id: 'group-size', front: 'Group size', back: 'Asch found that a larger majority increases conformity up to a point.' },
  { id: 'unanimity', front: 'Unanimity', back: 'Agreement across the majority increases pressure; a dissenter reduces conformity.' },
  { id: 'task-difficulty', front: 'Task difficulty', back: 'Harder or more ambiguous tasks increase uncertainty and can increase informational influence.' },
  { id: 'asch', front: 'Asch', back: 'Investigated conformity using majority pressure in a line-judgement task.' },
];

export const psychologyConformityQuizQuestions = [
  { id: 'type-1', question: 'Which type of conformity involves public agreement without necessarily changing private beliefs?', options: ['Compliance', 'Internalisation', 'Obedience', 'Minority influence'], correct: 'Compliance' },
  { id: 'type-2', question: 'Which type of conformity involves genuine acceptance of the group view?', options: ['Compliance', 'Internalisation', 'Social support', 'Resistance'], correct: 'Internalisation' },
  { id: 'nsi-1', question: 'A student agrees with friends to avoid being excluded, although privately they disagree. Which explanation best fits?', options: ['Normative social influence', 'Informational social influence', 'Legitimacy of authority', 'Locus of control'], correct: 'Normative social influence' },
  { id: 'isi-1', question: 'A person copies others during an unfamiliar emergency because they assume the group knows what to do. Which explanation best fits?', options: ['Normative social influence', 'Informational social influence', 'Compliance only', 'Authoritarian personality'], correct: 'Informational social influence' },
  { id: 'unanimity', question: 'What generally happens to conformity when one person breaks a unanimous majority?', options: ['It falls', 'It always rises', 'It becomes obedience', 'It is unaffected in every case'], correct: 'It falls' },
  { id: 'difficulty', question: 'Why can a more difficult task increase conformity?', options: ['People become more uncertain and rely more on others', 'People want less social approval', 'The majority becomes physically larger', 'Compliance automatically becomes obedience'], correct: 'People become more uncertain and rely more on others' },
  { id: 'size', question: 'Which variable investigated by Asch concerns the number of people in the majority?', options: ['Group size', 'Task difficulty', 'Unanimity', 'Proximity'], correct: 'Group size' },
  { id: 'link', question: 'Which pairing is most accurate?', options: ['NSI—often compliance; ISI—can produce internalisation', 'NSI—always internalisation; ISI—always compliance', 'NSI—obedience; ISI—minority influence', 'NSI—task difficulty; ISI—group size only'], correct: 'NSI—often compliance; ISI—can produce internalisation' },
];

export const psychologyConformityApplicationSort = {
  categories: ['Normative social influence', 'Informational social influence'],
  cards: [
    { id: 'party', text: 'Sam laughs at a joke they do not find funny because everyone else is laughing and they want to fit in.', category: 'Normative social influence' },
    { id: 'restaurant', text: 'Maya chooses the busy queue at an unfamiliar food stall because she assumes the other customers know which stall is best.', category: 'Informational social influence' },
    { id: 'fashion', text: 'Alex wears a style they do not personally like because their friendship group approves of it.', category: 'Normative social influence' },
    { id: 'exam', text: 'During a confusing practice task, Priya changes her answer after seeing that every other student has chosen a different option.', category: 'Informational social influence' },
    { id: 'meeting', text: 'Jamie publicly agrees with a team decision because they do not want to be the only person objecting.', category: 'Normative social influence' },
    { id: 'emergency', text: 'In an unfamiliar emergency, Lee copies the behaviour of people nearby because they appear to understand the situation.', category: 'Informational social influence' },
  ],
};

export const psychologyConformityEvaluationRanking = {
  question: 'Rank these evaluation points from most to least useful for assessing explanations and research on conformity. Be ready to justify your top choice.',
  factors: [
    { id: 'asch-support', title: 'Asch demonstrates situational effects', detail: 'Changes to group size, unanimity and task difficulty altered conformity, showing that social context can affect behaviour.' },
    { id: 'artificial-task', title: 'Artificial task', detail: 'Judging line lengths is unlike many real-life conformity decisions, so behaviour in the study may not generalise fully to everyday settings.' },
    { id: 'individual-differences', title: 'Individual differences', detail: 'People do not respond identically to social pressure, so NSI and ISI cannot explain every person in every situation.' },
    { id: 'nsi-application', title: 'NSI has everyday relevance', detail: 'The desire for approval can explain public agreement in peer groups even when private beliefs remain unchanged.' },
    { id: 'isi-application', title: 'ISI explains uncertainty', detail: 'The informational account predicts greater conformity when a situation is ambiguous or difficult, which is consistent with the task-difficulty effect.' },
  ],
};

export const psychologyConformityWrittenResponse = {
  question: 'Explain one difference between normative social influence and informational social influence.',
  stretchQuestion: 'Discuss normative social influence and informational social influence as explanations for conformity.',
  scaffold: [
    'AO1: define normative social influence accurately and explain why it often produces compliance.',
    'AO1: define informational social influence accurately and explain why it can produce internalisation.',
    'AO2: use a brief example or scenario to show how the explanations differ.',
    'AO3: use evidence or a situational variable from conformity research to assess an explanation.',
    'AO3: consider a limitation such as artificial tasks, individual differences or the difficulty of explaining all conformity with one process.',
    'Judgement: make clear that the explanations may operate in different situations rather than treating them as mutually exclusive.',
  ],
};

export const psychologyConformityConfidence = {
  prompt: 'How confident are you explaining why people conform?',
  leastSecureOptions: ['Compliance', 'Internalisation', 'Normative social influence', 'Informational social influence', 'Group size', 'Unanimity', 'Task difficulty', 'Evaluation'],
  scale: [1, 2, 3, 4, 5],
};

export const psychologyConformityFallbacks: Record<string, any> = {
  lesson_content: { sections: psychologyConformityLessonSections },
  flashcards: { cards: psychologyConformityFlashcards },
  quiz: { questions: psychologyConformityQuizQuestions },
  card_sort: psychologyConformityApplicationSort,
  judgement_ranking: psychologyConformityEvaluationRanking,
  peel_response: psychologyConformityWrittenResponse,
  confidence_exit_ticket: psychologyConformityConfidence,
};
