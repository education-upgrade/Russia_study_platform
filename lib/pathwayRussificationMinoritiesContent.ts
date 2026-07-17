export const russificationMinoritiesPathwaySlug = 'russification-minorities';

export const russificationMinoritiesLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Russification was the attempt to strengthen the Russian Empire by spreading Russian language, culture, administration and Orthodox influence. Under Alexander III it became closely linked to the defence of autocracy. The key issue is whether Russification created greater unity or instead deepened resentment among the empire’s many national and religious minorities.',
    question: 'What evidence would show that Russification strengthened rather than weakened the empire?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'The logic of Russification',
      steps: ['Diverse empire', 'Fear of separatism', 'Russian language and Orthodoxy promoted', 'Local identities restricted', 'Unity or resentment?'],
    },
  },
  {
    heading: 'Why nationality mattered',
    body: 'The Russian Empire contained Poles, Finns, Ukrainians, Baltic peoples, Jews, Muslims, Armenians and many other groups. National identity could challenge autocracy because loyalty might be directed towards language, religion or region rather than the Tsar. Officials therefore treated cultural difference as a possible political threat.',
    question: 'Why did diversity appear dangerous to an autocratic state?',
    taskType: 'explain',
  },
  {
    heading: 'Language and administration',
    body: 'Russian was increasingly imposed in schools, universities, courts and public administration. Officials expected subjects to use Russian in dealings with the state, while local languages lost status. This made government more uniform, but it also turned language into a symbol of resistance.',
    question: 'How could language policy strengthen administration but increase opposition?',
    taskType: 'judgement',
  },
  {
    heading: 'Poland and the western borderlands',
    body: 'Poland had already experienced severe repression after the 1863 uprising. Under Alexander III, Russian control over education, government and public life continued. Polish language and Catholic influence were restricted, while Russian officials sought to weaken separate Polish identity.',
    question: 'Why was Poland treated as a particularly serious threat?',
    taskType: 'explain',
  },
  {
    heading: 'Finland and the Baltic provinces',
    body: 'Finland retained distinctive institutions and laws, while the Baltic provinces had strong German cultural influence. Russification placed growing pressure on these privileges. Russian language and central authority were promoted, creating resentment among groups that had previously accepted imperial rule in return for autonomy.',
    question: 'Why might removing local privilege weaken loyalty to the empire?',
    taskType: 'explain',
  },
  {
    heading: 'Orthodoxy and religious conformity',
    body: 'The Orthodox Church was closely connected to autocracy and Russian identity. Conversion to Orthodoxy was encouraged, while Catholic, Protestant, Jewish and other communities faced restrictions. Religious policy therefore supported the state ideologically, but often alienated minorities whose faith was central to their identity.',
    question: 'How did Orthodoxy act as both a source of unity and division?',
    taskType: 'judgement',
  },
  {
    heading: 'Jews and the Pale of Settlement',
    body: 'Most Jews were confined to the Pale of Settlement in the western empire. The May Laws of 1882 restricted Jewish settlement in rural areas and limited access to property and employment. Quotas also restricted entry to schools and universities. These measures reflected official prejudice and attempts to make Jews less visible in economic and public life.',
    question: 'How did legal discrimination affect Jewish life under Alexander III?',
    taskType: 'explain',
  },
  {
    heading: 'Pogroms and state responsibility',
    body: 'A wave of anti-Jewish pogroms followed Alexander II’s assassination. Violence was carried out by local mobs, but the authorities often failed to protect Jewish communities and later imposed discriminatory laws. Historians therefore distinguish between direct organisation by the state and state responsibility for creating a hostile climate and tolerating violence.',
    question: 'How should the responsibility of the Tsarist state for pogroms be assessed?',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'State responsibility for pogroms',
      leftLabel: 'Local disorder beyond state control',
      rightLabel: 'State-created persecution',
      markerLabel: 'Not always centrally organised, but enabled by prejudice, weak protection and discriminatory policy',
      markerPosition: 72,
      prompt: 'A strong judgement separates direct planning from wider political responsibility.',
    },
  },
  {
    heading: 'Consequences for the empire',
    body: 'Russification made the state more uniform in some areas and strengthened the symbolic connection between autocracy, Russian identity and Orthodoxy. However, it also encouraged national resentment, emigration and political opposition. Groups that might have accepted limited autonomy increasingly viewed the empire as oppressive.',
    question: 'Were the consequences of Russification more stabilising or destabilising?',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Consequences of Russification',
      leftTitle: 'Strengthened authority',
      rightTitle: 'Created weakness',
      rows: [
        { left: 'More uniform administration', right: 'Greater resentment among minorities' },
        { left: 'Russian language strengthened state control', right: 'Language became a focus for resistance' },
        { left: 'Orthodoxy reinforced official ideology', right: 'Religious discrimination alienated subjects' },
      ],
    },
  },
  {
    heading: 'Overall judgement',
    body: 'Russification strengthened the appearance and machinery of central control, but its long-term political effects were damaging. It encouraged minorities to associate the Tsarist state with cultural repression and legal inequality. The policy therefore increased administrative uniformity while weakening loyalty, making the empire less secure beneath the surface.',
    question: 'What were the most important consequences of Russification for the Russian Empire?',
    taskType: 'judgement',
  },
];

export const russificationMinoritiesTimeline = {
  events: [
    { id: '1863-polish', date: '1863–64', title: 'Polish uprising suppressed', detail: 'The revolt reinforced Russian determination to weaken Polish autonomy and identity.' },
    { id: '1881-pogroms', date: '1881', title: 'Wave of pogroms begins', detail: 'Anti-Jewish violence spread after Alexander II’s assassination, with inadequate state protection.' },
    { id: '1882-may-laws', date: '1882', title: 'May Laws', detail: 'Jewish settlement and economic activity were further restricted within the Pale.' },
    { id: '1885-education', date: '1880s', title: 'Russian expanded in education', detail: 'Schools and universities increasingly used Russian rather than local languages.' },
    { id: '1887-quotas', date: '1887', title: 'Jewish educational quotas', detail: 'Limits were imposed on the proportion of Jewish students admitted to schools and universities.' },
    { id: '1889-baltic', date: 'Late 1880s', title: 'Pressure on Baltic autonomy', detail: 'Russian language and administration increasingly displaced German influence.' },
    { id: '1890-poland', date: '1890s', title: 'Continued pressure in Poland', detail: 'Russian control of administration, education and public life remained strong.' },
    { id: '1894-legacy', date: '1894', title: 'Alexander III’s legacy', detail: 'The empire was more centralised, but minority resentment had deepened.' },
  ],
};

export const russificationMinoritiesFlashcards = [
  { id: 'definition', front: 'Russification', back: 'The promotion of Russian language, culture, administration and Orthodoxy across the empire.' },
  { id: 'purpose', front: 'Purpose of Russification', back: 'To strengthen unity, central control and loyalty to the Tsar.' },
  { id: 'diversity', front: 'Why diversity concerned the regime', back: 'National, linguistic and religious identities could compete with loyalty to autocracy.' },
  { id: 'language', front: 'Language policy', back: 'Russian was increasingly imposed in education, courts and administration.' },
  { id: 'poland', front: 'Poland', back: 'Russian rule restricted Polish language, Catholic influence and separate political identity.' },
  { id: 'finland', front: 'Finland', back: 'Its distinctive laws and autonomy came under increasing pressure from central control.' },
  { id: 'orthodoxy', front: 'Orthodoxy', back: 'The state church supported autocracy and Russian identity but alienated religious minorities.' },
  { id: 'pale', front: 'Pale of Settlement', back: 'The western region in which most Jews in the empire were required to live.' },
  { id: 'may-laws', front: 'May Laws, 1882', back: 'Restrictions on Jewish settlement in rural areas, property and economic activity.' },
  { id: 'pogroms', front: 'Pogroms', back: 'Violent attacks on Jewish communities, often tolerated or poorly prevented by authorities.' },
  { id: 'short-term', front: 'Short-term effect', back: 'Greater administrative uniformity and symbolic central control.' },
  { id: 'long-term', front: 'Long-term effect', back: 'National resentment, emigration and stronger hostility towards Tsarism.' },
];

export const russificationMinoritiesQuiz = [
  { id: 'q1', question: 'What was Russification?', options: ['Promotion of Russian language and culture', 'Creation of a federal parliament', 'Abolition of Orthodoxy', 'Expansion of local autonomy'], correct: 'Promotion of Russian language and culture' },
  { id: 'q2', question: 'Why did the regime fear national identity?', options: ['It could compete with loyalty to the Tsar', 'It strengthened autocracy automatically', 'It ended regional difference', 'It guaranteed military loyalty'], correct: 'It could compete with loyalty to the Tsar' },
  { id: 'q3', question: 'Where was Russian increasingly imposed?', options: ['Schools, courts and administration', 'Only the army', 'Only Orthodox churches', 'Only rural communes'], correct: 'Schools, courts and administration' },
  { id: 'q4', question: 'Why was Poland treated harshly?', options: ['It had a strong separate identity and history of revolt', 'It was fully loyal to the Tsar', 'It had no religious differences', 'It demanded closer union with Russia'], correct: 'It had a strong separate identity and history of revolt' },
  { id: 'q5', question: 'What was the Pale of Settlement?', options: ['The region where most Jews were required to live', 'A Finnish parliament', 'A Russian-speaking university', 'A Polish military district'], correct: 'The region where most Jews were required to live' },
  { id: 'q6', question: 'What did the May Laws of 1882 do?', options: ['Restricted Jewish settlement and economic activity', 'Ended censorship', 'Granted religious equality', 'Expanded local government'], correct: 'Restricted Jewish settlement and economic activity' },
  { id: 'q7', question: 'What were pogroms?', options: ['Violent attacks on Jewish communities', 'Meetings of the zemstva', 'Orthodox church reforms', 'Finnish legal codes'], correct: 'Violent attacks on Jewish communities' },
  { id: 'q8', question: 'What was one short-term result of Russification?', options: ['Greater administrative uniformity', 'End of all national tension', 'Creation of democracy', 'Abolition of the empire'], correct: 'Greater administrative uniformity' },
  { id: 'q9', question: 'What was one long-term consequence?', options: ['Greater minority resentment', 'Permanent national harmony', 'Complete loyalty to Orthodoxy', 'Decline of central control'], correct: 'Greater minority resentment' },
  { id: 'q10', question: 'Which judgement is strongest?', options: ['Russification strengthened control but weakened loyalty', 'Russification had no political effect', 'Russification created full unity', 'Russification reduced state authority immediately'], correct: 'Russification strengthened control but weakened loyalty' },
];

export const russificationMinoritiesJudgement = {
  question: 'Rank these consequences of Russification from most to least important for the security of the Russian Empire. Justify your top three.',
  factors: [
    { id: 'administration', title: 'Administrative uniformity', detail: 'Russian language and central rules made government more consistent.' },
    { id: 'poland', title: 'Polish resentment', detail: 'Restriction of language, religion and identity deepened hostility to Russian rule.' },
    { id: 'finland', title: 'Loss of Finnish loyalty', detail: 'Pressure on autonomy alienated previously cooperative elites.' },
    { id: 'jews', title: 'Jewish persecution', detail: 'Discriminatory laws, quotas and pogroms created insecurity and emigration.' },
    { id: 'orthodoxy', title: 'Orthodox influence', detail: 'The Church strengthened official ideology but divided religious communities.' },
    { id: 'nationalism', title: 'Growth of nationalism', detail: 'Minorities increasingly defined themselves in opposition to the Russian state.' },
    { id: 'migration', title: 'Emigration', detail: 'Persecution encouraged many subjects, especially Jews, to leave the empire.' },
    { id: 'opposition', title: 'Political opposition', detail: 'Cultural repression pushed some minorities towards organised resistance.' },
  ],
};

export const russificationMinoritiesAO3 = {
  question: 'Which interpretation best explains the consequences of Russification? Test each view with precise contextual knowledge.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Russification was a practical policy that made a vast and diverse empire easier to administer.' },
    { historian: 'Interpretation B', argument: 'Russification was primarily a coercive programme that weakened the empire by alienating national and religious minorities.' },
    { historian: 'Interpretation C', argument: 'Russification strengthened central authority in the short term, but its discriminatory methods created deeper long-term instability.' },
  ],
};

export const russificationMinoritiesPeel = {
  question: 'Write one developed paragraph answering: “Russification strengthened the Russian Empire.” Assess the validity of this view.',
  stretchQuestion: 'Plan a balanced 25-mark response comparing administrative control, national resentment, religious policy and persecution of Jews.',
  scaffold: [
    'Point: make a direct claim about whether Russification strengthened the empire.',
    'Evidence: use precise knowledge such as the May Laws, language policy, Poland, Finland or educational quotas.',
    'Explain: show how the evidence affected state control or minority loyalty.',
    'Counter: identify an opposing consequence.',
    'Compare: weigh short-term uniformity against long-term resentment.',
    'Judgement: finish with an explicit decision linked to imperial security.',
  ],
};

export const russificationMinoritiesConfidence = {
  prompt: 'How confident are you explaining the aims, methods and consequences of Russification?',
  leastSecureOptions: ['Purpose of Russification', 'Language policy', 'Poland', 'Finland and the Baltic', 'Orthodoxy', 'Pale of Settlement', 'May Laws', 'Pogroms', 'State responsibility', 'Long-term consequences'],
  scale: [1, 2, 3, 4, 5],
};

export const russificationMinoritiesFallbacks: Record<string, any> = {
  lesson_content: { sections: russificationMinoritiesLessonSections },
  timeline: russificationMinoritiesTimeline,
  flashcards: { cards: russificationMinoritiesFlashcards },
  quiz: { questions: russificationMinoritiesQuiz },
  judgement_ranking: russificationMinoritiesJudgement,
  ao3_interpretation: russificationMinoritiesAO3,
  peel_response: russificationMinoritiesPeel,
  confidence_exit_ticket: russificationMinoritiesConfidence,
};
