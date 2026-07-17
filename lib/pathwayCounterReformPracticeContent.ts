export const counterReformPracticePathwaySlug = 'counter-reform-practice';

export const counterReformPracticeLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander III’s commitment to autocracy was translated into a series of practical measures designed to restrict independent influence and reinforce central control. These counter-reforms affected local government, the countryside, universities, schools, the press and policing. The key question is whether they genuinely strengthened Tsarist authority or merely suppressed problems that remained unresolved.',
    question: 'What evidence would show that a counter-reform had strengthened Tsarist rule?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'From ideology to implementation',
      steps: ['Autocracy reaffirmed', 'Independent influence restricted', 'Officials given wider powers', 'Opposition contained', 'Underlying tensions remain'],
    },
  },
  {
    heading: 'Why introduce counter-reforms?',
    body: 'The assassination of Alexander II in 1881 convinced the new regime that reform had encouraged opposition rather than secured loyalty. Alexander III and his advisers believed that the state needed firmer supervision, stronger censorship and greater reliance on loyal officials and the nobility. Counter-reform therefore aimed to preserve autocracy by reversing or limiting the more participatory features of earlier reforms.',
    question: 'Why did the government believe tighter control was necessary after 1881?',
    taskType: 'explain',
  },
  {
    heading: 'Land Captains, 1889',
    body: 'The Land Captains Act of 1889 placed rural districts under officials appointed by the Minister of the Interior, usually drawn from the landed nobility. Land Captains could overturn decisions made by peasant institutions, impose fines and punishments, and exercise extensive administrative and judicial authority. This weakened peasant self-government and restored noble influence in the countryside.',
    question: 'How did Land Captains strengthen central and noble control over the peasantry?',
    taskType: 'explain',
  },
  {
    heading: 'The Zemstva Act, 1890',
    body: 'The Zemstva Act of 1890 increased government supervision of local government and strengthened the position of the nobility. Provincial governors gained greater power to interfere in zemstvo decisions, while representation was adjusted in favour of landowners and against peasants. Zemstva continued to provide useful local services, but their political independence was narrowed.',
    question: 'Why was the Zemstva Act a restriction rather than a complete abolition of local government?',
    taskType: 'explain',
  },
  {
    heading: 'The Municipal Government Act, 1892',
    body: 'The Municipal Government Act of 1892 raised property qualifications for voting in urban dumas. This sharply reduced the urban electorate and excluded many smaller property owners and taxpayers. Municipal government survived, but participation became narrower and central officials possessed greater supervisory power.',
    question: 'How did the 1892 Act reduce political participation in towns?',
    taskType: 'explain',
  },
  {
    heading: 'Universities and education',
    body: 'The University Statute of 1884 ended much university autonomy, allowed the state to appoint senior staff and increased official control over students. Fees were raised and student organisations were restricted. In schools, the government sought to strengthen religious and classical education and limit access for children from lower social groups, most notoriously through the 1887 circular commonly associated with “cooks’ children”.',
    question: 'Why did the regime view education as both useful and dangerous?',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Education under tighter control',
      leftTitle: 'State objective',
      rightTitle: 'Political consequence',
      rows: [
        { left: 'Train officials and professionals', right: 'Education still supported modernisation' },
        { left: 'Restrict radical ideas', right: 'University autonomy and student organisation reduced' },
        { left: 'Preserve social hierarchy', right: 'Access became more selective and unequal' },
      ],
    },
  },
  {
    heading: 'Press censorship',
    body: 'Temporary press regulations introduced in 1882 made it easier for ministers to warn, suspend or close publications regarded as dangerous. Editors could be pressured to reveal authors, and repeated warnings could lead to permanent suppression. This reduced open criticism and limited the circulation of liberal and revolutionary ideas, although illegal literature continued to spread.',
    question: 'How effective was censorship in protecting autocracy?',
    taskType: 'judgement',
  },
  {
    heading: 'Police powers and surveillance',
    body: 'The 1881 Regulation on Measures for the Preservation of State Security and Public Order allowed areas to be placed under exceptional security. Officials could ban meetings, close institutions, exile suspects administratively and increase surveillance. The political police, commonly known as the Okhrana, infiltrated opposition groups and monitored suspected activists. These methods disrupted organisations, but they also encouraged secrecy and resentment.',
    question: 'Why did police repression produce both strength and weakness for the regime?',
    taskType: 'judgement',
  },
  {
    heading: 'Who benefited?',
    body: 'Counter-reforms particularly strengthened the role of central officials, provincial governors and the landed nobility. Peasants, students, professionals and urban voters faced tighter restrictions. This helped the regime rely on traditional elites, but it also meant that political stability rested on exclusion rather than broader consent.',
    question: 'Which social groups gained and lost influence under the counter-reforms?',
    taskType: 'explain',
    visual: {
      type: 'judgementScale',
      title: 'Impact of counter-reform',
      leftLabel: 'Broader stability through consent',
      rightLabel: 'Stronger control through restriction',
      markerLabel: 'Control increased more clearly than consent',
      markerPosition: 84,
      prompt: 'The measures strengthened the machinery of autocracy, but did little to widen its social base.',
    },
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander III’s counter-reforms strengthened Tsarist rule in the short term by narrowing participation, increasing supervision and giving officials stronger coercive powers. The Land Captains and emergency regulations were particularly significant because they extended direct control into rural society and political policing. However, the reforms did not eliminate opposition or resolve economic, social and national tensions. They made autocracy more controlling, but not necessarily more secure in the long term.',
    question: 'How far did Alexander III’s counter-reforms strengthen Tsarist rule?',
    taskType: 'judgement',
  },
];

export const counterReformPracticeTimeline = {
  events: [
    { id: '1881-security', date: 'August 1881', title: 'Exceptional security regulation', detail: 'Officials received broad emergency powers to restrict meetings, publications and suspected opposition.' },
    { id: '1882-press', date: '1882', title: 'Temporary press regulations', detail: 'The state could issue warnings and close publications considered politically dangerous.' },
    { id: '1884-university', date: '1884', title: 'University Statute', detail: 'University autonomy was reduced and state supervision of staff and students increased.' },
    { id: '1887-education', date: '1887', title: 'Restrictions on secondary education', detail: 'The government discouraged the admission of children from poorer social backgrounds to gymnasia.' },
    { id: '1889-land-captains', date: '1889', title: 'Land Captains Act', detail: 'Appointed noble officials gained extensive authority over peasant communities.' },
    { id: '1890-zemstva', date: '1890', title: 'Zemstva Act', detail: 'Noble influence and government supervision of local government increased.' },
    { id: '1892-municipal', date: '1892', title: 'Municipal Government Act', detail: 'Higher property qualifications greatly reduced the urban electorate.' },
    { id: '1894-end', date: '1894', title: 'End of Alexander III’s reign', detail: 'Autocracy remained intact, but political participation was narrower and underlying tensions persisted.' },
  ],
};

export const counterReformPracticeFlashcards = [
  { id: 'counter-reform', front: 'Counter-reform', back: 'A measure designed to restrict, reverse or control the participatory effects of earlier reform.' },
  { id: 'land-captains', front: 'Land Captains Act, 1889', back: 'Created appointed officials, usually nobles, with wide administrative and judicial authority over peasants.' },
  { id: 'zemstva', front: 'Zemstva Act, 1890', back: 'Increased noble representation and strengthened government supervision of local government.' },
  { id: 'municipal', front: 'Municipal Government Act, 1892', back: 'Raised voting qualifications and greatly narrowed the urban electorate.' },
  { id: 'university', front: 'University Statute, 1884', back: 'Reduced university autonomy and increased state control over staff and students.' },
  { id: 'education', front: '1887 education circular', back: 'Discouraged access to gymnasia for children from poorer social backgrounds.' },
  { id: 'press', front: 'Temporary press regulations, 1882', back: 'Allowed warnings, suspensions and closures of politically dangerous publications.' },
  { id: 'exceptional-security', front: 'Exceptional security', back: 'Emergency status allowing expanded police and administrative powers.' },
  { id: 'okhrana', front: 'Okhrana', back: 'The political police, which monitored and infiltrated opposition groups.' },
  { id: 'nobility', front: 'Role of the nobility', back: 'Counter-reforms restored or strengthened noble authority in rural and local government.' },
  { id: 'short-term', front: 'Short-term effect', back: 'The state gained stronger control and open opposition became more difficult.' },
  { id: 'long-term', front: 'Long-term limitation', back: 'Restriction and repression did not resolve the causes of political and social discontent.' },
];

export const counterReformPracticeQuiz = [
  { id: 'q1', question: 'What was the main purpose of counter-reform?', options: ['To strengthen autocratic control', 'To create parliamentary government', 'To abolish the nobility', 'To expand universal voting'], correct: 'To strengthen autocratic control' },
  { id: 'q2', question: 'Who usually served as Land Captains?', options: ['Members of the landed nobility', 'Elected peasants', 'Factory workers', 'University students'], correct: 'Members of the landed nobility' },
  { id: 'q3', question: 'What power did Land Captains possess?', options: ['Wide authority over peasant communities', 'Control of foreign policy', 'The right to elect the Tsar', 'Command of the navy'], correct: 'Wide authority over peasant communities' },
  { id: 'q4', question: 'What did the Zemstva Act of 1890 do?', options: ['Increased noble influence and government supervision', 'Abolished provincial governors', 'Introduced universal suffrage', 'Made zemstva fully independent'], correct: 'Increased noble influence and government supervision' },
  { id: 'q5', question: 'What was the effect of the 1892 Municipal Government Act?', options: ['It reduced the urban electorate', 'It gave all workers the vote', 'It abolished property qualifications', 'It created a national parliament'], correct: 'It reduced the urban electorate' },
  { id: 'q6', question: 'What did the University Statute of 1884 reduce?', options: ['University autonomy', 'State supervision', 'Tuition fees', 'Religious influence'], correct: 'University autonomy' },
  { id: 'q7', question: 'What could happen under the 1882 press regulations?', options: ['A publication could be warned or closed', 'Censorship was abolished', 'Editors gained legal immunity', 'All newspapers became elected bodies'], correct: 'A publication could be warned or closed' },
  { id: 'q8', question: 'What was the Okhrana?', options: ['The political police', 'A peasant assembly', 'An elected urban council', 'A university senate'], correct: 'The political police' },
  { id: 'q9', question: 'Which group gained influence from the counter-reforms?', options: ['The landed nobility', 'Radical students', 'Urban workers', 'National minorities'], correct: 'The landed nobility' },
  { id: 'q10', question: 'What was the main long-term weakness of counter-reform?', options: ['It suppressed rather than resolved discontent', 'It immediately ended autocracy', 'It removed police powers', 'It transferred power to peasants'], correct: 'It suppressed rather than resolved discontent' },
];

export const counterReformPracticeJudgement = {
  question: 'Rank these counter-reforms from most to least important in strengthening Tsarist rule. Justify your top three and explain why your lowest-ranked measure had limited impact.',
  factors: [
    { id: 'security', title: 'Emergency security powers', detail: 'Gave officials broad authority to restrict meetings, exile suspects and suppress opposition.' },
    { id: 'land-captains', title: 'Land Captains', detail: 'Extended direct state and noble control over peasant communities.' },
    { id: 'zemstva', title: 'Zemstva restrictions', detail: 'Reduced independent local influence and increased supervision.' },
    { id: 'municipal', title: 'Municipal restrictions', detail: 'Narrowed political participation in towns.' },
    { id: 'universities', title: 'University controls', detail: 'Reduced autonomy and attempted to contain student radicalism.' },
    { id: 'education', title: 'Social restrictions in education', detail: 'Sought to preserve hierarchy and limit access to potentially radical education.' },
    { id: 'press', title: 'Press censorship', detail: 'Restricted open criticism and circulation of opposition ideas.' },
    { id: 'okhrana', title: 'Okhrana surveillance', detail: 'Disrupted opposition through monitoring, infiltration and arrest.' },
  ],
};

export const counterReformPracticeAO3 = {
  question: 'Which interpretation gives the most convincing assessment of Alexander III’s counter-reforms? Evaluate each interpretation separately using precise contextual knowledge.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Counter-reform restored effective government by strengthening officials, the nobility and the machinery of state control.' },
    { historian: 'Interpretation B', argument: 'The measures were politically defensive: they reduced participation but failed to address the causes of discontent.' },
    { historian: 'Interpretation C', argument: 'Counter-reform was selective rather than total, because local institutions and modern education survived but operated under much tighter supervision.' },
  ],
};

export const counterReformPracticePeel = {
  question: 'Write one developed paragraph answering: “Alexander III’s counter-reforms significantly strengthened Tsarist rule.” Assess the validity of this view.',
  stretchQuestion: 'Plan a balanced 25-mark response comparing rural control, local government, education, censorship and policing.',
  scaffold: [
    'Point: make a direct claim about the extent to which a counter-reform strengthened Tsarist authority.',
    'Evidence: use precise knowledge, including a named measure and date.',
    'Explain: show how the measure increased control, reduced participation or weakened opposition.',
    'Counter: identify a limitation or unintended consequence.',
    'Compare: weigh the measure against at least one other area of counter-reform.',
    'Judgement: decide whether the policy created durable security or mainly short-term control.',
  ],
};

export const counterReformPracticeConfidence = {
  prompt: 'How confident are you explaining how Alexander III’s counter-reforms worked and how effective they were?',
  leastSecureOptions: ['Reasons for counter-reform', 'Land Captains', 'Zemstva Act', 'Municipal Government Act', 'University Statute', 'Education restrictions', 'Press censorship', 'Emergency security powers', 'Okhrana', 'Short-term and long-term judgement'],
  scale: [1, 2, 3, 4, 5],
};

export const counterReformPracticeFallbacks: Record<string, any> = {
  lesson_content: { sections: counterReformPracticeLessonSections },
  timeline: counterReformPracticeTimeline,
  flashcards: { cards: counterReformPracticeFlashcards },
  quiz: { questions: counterReformPracticeQuiz },
  judgement_ranking: counterReformPracticeJudgement,
  ao3_interpretation: counterReformPracticeAO3,
  peel_response: counterReformPracticePeel,
  confidence_exit_ticket: counterReformPracticeConfidence,
};
