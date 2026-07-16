export const powerIdeologyControlPathwaySlug = 'power-ideology-control';

export const powerIdeologyControlLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Tsarist Russia was governed through a combination of supreme monarchical power, religious legitimacy, Russian nationalism, bureaucracy, censorship and coercion. These pillars helped preserve order across a vast empire, but they also made the system rigid and dependent on the competence of the ruler and his officials.',
    question: 'Which method of control was most important in sustaining Tsarism in 1855?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'How Tsarist control worked',
      steps: ['Autocracy concentrated authority', 'Orthodoxy and Nationality justified obedience', 'Bureaucracy implemented policy', 'Censorship and police defended the system'],
    },
  },
  {
    heading: 'Autocracy',
    body: 'The Tsar was sovereign and claimed authority by divine right. There was no national elected parliament, ministers were appointed by and responsible to the ruler, and laws were issued in his name. Autocracy could produce decisive action, but it made the quality of government heavily dependent on one individual and discouraged open criticism.',
    question: 'How did autocracy create both strength and vulnerability?',
    taskType: 'explain',
    visual: {
      type: 'comparison',
      title: 'Autocracy: strength and weakness',
      leftTitle: 'Strength',
      rightTitle: 'Weakness',
      rows: [
        { left: 'Decisions could be imposed quickly', right: 'Poor decisions were difficult to challenge' },
        { left: 'A single centre of authority', right: 'Government depended on the Tsar’s ability' },
        { left: 'No legal national opposition', right: 'Opposition was driven underground' },
      ],
    },
  },
  {
    heading: 'Orthodoxy',
    body: 'The Russian Orthodox Church taught that the Tsar ruled by God’s authority and that obedience formed part of a Christian duty. Priests reinforced hierarchy, tradition and loyalty, particularly in rural communities. Yet the Church was closely tied to the state and could lose credibility when it appeared to defend poverty, inequality and repression.',
    question: 'How did Orthodoxy turn political loyalty into a moral obligation?',
    taskType: 'explain',
  },
  {
    heading: 'Nationality',
    body: 'Official Nationality promoted loyalty to Russian language, culture, dynasty and empire. It rejected Western liberalism and presented unity as dependent on obedience to the Tsar. This could strengthen Russian identity, but the empire contained Poles, Finns, Ukrainians, Baltic peoples, Jews and many other groups who could resent pressure to conform.',
    question: 'Why was Nationality both a unifying and divisive force?',
    taskType: 'explain',
  },
  {
    heading: 'The bureaucracy',
    body: 'Ministers, provincial governors and thousands of officials transmitted orders from St Petersburg and administered taxation, policing, justice and local affairs. Bureaucracy was essential in a huge empire, but low pay, poor communications, corruption and overlapping responsibilities often weakened implementation.',
    question: 'Why was the bureaucracy indispensable but unreliable?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'The chain of authority',
      steps: ['Tsar and central ministries', 'Provincial governors', 'District and local officials', 'Policies applied to subjects of the empire'],
    },
  },
  {
    heading: 'Censorship and education',
    body: 'The state supervised newspapers, books, universities and schools to restrict criticism and revolutionary ideas. Censorship reduced the public circulation of opposition, while education promoted loyalty and Orthodox values. However, restrictions frustrated educated Russians and encouraged illegal publications, private discussion circles and underground organisation.',
    question: 'How could censorship suppress criticism while also intensifying resentment?',
    taskType: 'explain',
  },
  {
    heading: 'Political police and repression',
    body: 'The Third Section monitored suspected opponents, intercepted correspondence and coordinated surveillance. The state could imprison, exile or place individuals under police supervision. Repression disrupted opposition networks, but its selective reach and reliance on informers also revealed limits in the regime’s ability to secure willing consent.',
    question: 'Was repression evidence of Tsarist strength or insecurity?',
    taskType: 'judgement',
  },
  {
    heading: 'The army and social hierarchy',
    body: 'The army defended the dynasty, suppressed unrest and symbolised imperial authority. The nobility dominated senior offices and owned much of the land, while peasants were expected to remain deferential. This hierarchy supported the regime, but serfdom and privilege also contributed to military inefficiency, social resentment and economic backwardness.',
    question: 'Why could the traditional social order protect autocracy while weakening Russia?',
    taskType: 'explain',
  },
  {
    heading: 'Overall judgement',
    body: 'Tsarism survived because its methods of control reinforced one another. Autocracy supplied authority; Orthodoxy and Nationality legitimised it; bureaucracy, governors and the army implemented it; censorship and political policing defended it. The system was effective in normal conditions but structurally fragile because it resisted criticism and adapted slowly when war or unrest exposed its weaknesses.',
    question: 'Which pillar of control mattered most, and under what conditions?',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'How secure was Tsarist control in 1855?',
      leftLabel: 'Fundamentally weak',
      rightLabel: 'Highly secure',
      markerLabel: 'Secure but rigid',
      markerPosition: 62,
      prompt: 'The regime possessed powerful institutions of control, but many depended on obedience rather than broad political consent.',
    },
  },
];

export const powerIdeologyControlTimeline = {
  events: [
    { id: '1825', date: '1825', title: 'Decembrist Revolt', detail: 'The failed officers’ revolt encouraged Nicholas I to strengthen policing, censorship and ideological control.' },
    { id: '1826', date: '1826', title: 'Third Section established', detail: 'A political police body was created to monitor opposition, correspondence and political reliability.' },
    { id: '1832', date: '1832', title: 'Fundamental Laws restated', detail: 'The laws affirmed the Tsar as an autocratic and unlimited monarch.' },
    { id: '1833', date: '1833', title: 'Official Nationality', detail: 'Sergei Uvarov articulated Orthodoxy, Autocracy and Nationality as the ideological basis of the regime.' },
    { id: '1835', date: '1835', title: 'University controls tightened', detail: 'The state restricted university autonomy and sought closer supervision of teaching and students.' },
    { id: '1848', date: '1848', title: 'Reaction to European revolutions', detail: 'Nicholas I tightened censorship and surveillance in response to revolutionary upheaval abroad.' },
    { id: '1849', date: '1849', title: 'Petrashevsky Circle suppressed', detail: 'Members of a discussion circle, including Dostoevsky, were arrested, demonstrating the reach of political policing.' },
    { id: '1855', date: '1855', title: 'Alexander II becomes Tsar', detail: 'He inherited a system based on autocracy, hierarchy and coercion, but one weakened by Crimean War failure.' },
  ],
};

export const powerIdeologyControlFlashcards = [
  { id: 'autocracy', front: 'Autocracy', back: 'A system in which the Tsar held supreme political and legislative authority without a national elected parliament limiting him.' },
  { id: 'divine-right', front: 'Divine right', back: 'The belief that the Tsar’s authority came from God and that obedience was therefore a religious as well as political duty.' },
  { id: 'orthodoxy', front: 'Orthodoxy', back: 'The Russian Orthodox Church reinforced loyalty, hierarchy and traditional values in support of the Tsarist state.' },
  { id: 'nationality', front: 'Nationality', back: 'The promotion of Russian identity, imperial unity and suspicion of Western liberal and nationalist ideas.' },
  { id: 'uvarov', front: 'Sergei Uvarov', back: 'Minister of Education associated with the 1833 doctrine of Orthodoxy, Autocracy and Nationality.' },
  { id: 'bureaucracy', front: 'Bureaucracy', back: 'The network of ministers, governors and officials who transmitted and implemented Tsarist policy.' },
  { id: 'governor', front: 'Provincial governor', back: 'An appointed official representing central authority and supervising administration and policing in a province.' },
  { id: 'third-section', front: 'Third Section', back: 'The political police created under Nicholas I to monitor suspected opposition and political reliability.' },
  { id: 'censorship', front: 'Censorship', back: 'State restriction and supervision of publications, education and ideas to limit criticism.' },
  { id: 'exile', front: 'Administrative exile', back: 'Removal of suspects to distant regions, often Siberia, without the protections of a full public trial.' },
  { id: 'army', front: 'Army', back: 'A defender of the empire and dynasty that could also be deployed to suppress internal unrest.' },
  { id: 'nobility', front: 'Nobility', back: 'The privileged landowning elite that supplied many senior officials and officers and formed a traditional support base of autocracy.' },
  { id: 'legitimacy', front: 'Legitimacy', back: 'The belief that rule is rightful; Tsarism drew legitimacy from religion, dynasty, tradition and imperial identity.' },
  { id: 'coercion', front: 'Coercion', back: 'The use or threat of force, surveillance, imprisonment or exile to secure obedience.' },
  { id: 'rigidity', front: 'Rigidity', back: 'The inability or unwillingness of the system to adapt readily to criticism, social change or crisis.' },
  { id: 'judgement', front: 'Overall judgement', back: 'Tsarist control was powerful because ideology, administration and repression worked together, but the system remained rigid and crisis-prone.' },
];

export const powerIdeologyControlQuiz = [
  { id: 'q1', question: 'What did autocracy mean in Tsarist Russia?', options: ['The Tsar held supreme authority', 'Governors elected the ruler', 'The Church controlled parliament', 'Ministers were chosen by voters'], correct: 'The Tsar held supreme authority' },
  { id: 'q2', question: 'Which phrase summarised the official ideology associated with Uvarov?', options: ['Peace, Land and Bread', 'Orthodoxy, Autocracy and Nationality', 'Liberty, Equality and Fraternity', 'Order, Reform and Representation'], correct: 'Orthodoxy, Autocracy and Nationality' },
  { id: 'q3', question: 'How did Orthodoxy support Tsarism?', options: ['It presented obedience as a religious duty', 'It created elected national councils', 'It ended censorship', 'It limited the Tsar’s powers'], correct: 'It presented obedience as a religious duty' },
  { id: 'q4', question: 'Why was the bureaucracy essential?', options: ['It carried out central orders across the empire', 'It elected the Tsar', 'It replaced provincial government', 'It gave peasants national representation'], correct: 'It carried out central orders across the empire' },
  { id: 'q5', question: 'Which was a major weakness of the bureaucracy?', options: ['Corruption and slow communication', 'Excessive democratic accountability', 'Complete independence from the Tsar', 'Control by elected peasants'], correct: 'Corruption and slow communication' },
  { id: 'q6', question: 'What was the Third Section?', options: ['A political police body', 'A peasant commune', 'A military district', 'A church council'], correct: 'A political police body' },
  { id: 'q7', question: 'Why did censorship help the regime?', options: ['It restricted the public spread of criticism', 'It created legal opposition parties', 'It made universities independent', 'It transferred power to writers'], correct: 'It restricted the public spread of criticism' },
  { id: 'q8', question: 'Why could Nationality create tension?', options: ['Non-Russian peoples could resent imposed Russian identity', 'It abolished Russian identity', 'It ended imperial rule', 'It guaranteed minorities autonomy'], correct: 'Non-Russian peoples could resent imposed Russian identity' },
  { id: 'q9', question: 'What role did provincial governors perform?', options: ['They represented central authority in the provinces', 'They served as elected national legislators', 'They appointed the Tsar', 'They controlled foreign policy independently'], correct: 'They represented central authority in the provinces' },
  { id: 'q10', question: 'How did the army support political authority?', options: ['It defended the dynasty and could suppress unrest', 'It elected ministers', 'It abolished the nobility', 'It guaranteed freedom of speech'], correct: 'It defended the dynasty and could suppress unrest' },
  { id: 'q11', question: 'Why did the nobility matter to autocracy?', options: ['It supplied landowners, officials and officers loyal to hierarchy', 'It formed a democratic opposition', 'It controlled an elected parliament', 'It abolished serfdom before 1855'], correct: 'It supplied landowners, officials and officers loyal to hierarchy' },
  { id: 'q12', question: 'Which development followed the European revolutions of 1848?', options: ['Nicholas I tightened censorship and surveillance', 'Russia introduced universal suffrage', 'The Third Section was abolished', 'Universities became fully independent'], correct: 'Nicholas I tightened censorship and surveillance' },
  { id: 'q13', question: 'Why could repression indicate weakness as well as strength?', options: ['It suggested obedience was not based entirely on consent', 'It proved all opposition had vanished', 'It made administration unnecessary', 'It transferred authority to the public'], correct: 'It suggested obedience was not based entirely on consent' },
  { id: 'q14', question: 'What was a structural weakness of autocracy?', options: ['The system depended heavily on the ruler’s competence', 'Ministers could dismiss the Tsar', 'Parliament regularly blocked policy', 'Local voters controlled taxation'], correct: 'The system depended heavily on the ruler’s competence' },
  { id: 'q15', question: 'Which judgement best explains how Tsarism maintained control?', options: ['Ideology, administration and coercion reinforced one another', 'Only the army mattered', 'The regime depended on elections', 'Control rested entirely on economic success'], correct: 'Ideology, administration and coercion reinforced one another' },
];

export const powerIdeologyControlJudgement = {
  question: 'Rank the pillars of Tsarist control from most to least important. Which was most effective in normal conditions, and which mattered most during crisis?',
  factors: [
    { id: 'autocracy', title: 'Autocracy', detail: 'Placed supreme authority in the hands of the Tsar and prevented legal national opposition.' },
    { id: 'orthodoxy', title: 'Orthodoxy', detail: 'Gave religious legitimacy to obedience, hierarchy and dynasty.' },
    { id: 'nationality', title: 'Nationality', detail: 'Promoted imperial unity and Russian identity, but risked alienating non-Russian peoples.' },
    { id: 'bureaucracy', title: 'Bureaucracy and governors', detail: 'Implemented central authority across the empire but suffered from corruption and inefficiency.' },
    { id: 'censorship', title: 'Censorship and education', detail: 'Restricted criticism and promoted loyalty, while encouraging some opposition underground.' },
    { id: 'repression', title: 'Political police and repression', detail: 'Disrupted organised opposition through surveillance, arrest and exile.' },
    { id: 'army', title: 'Army', detail: 'Protected the empire and dynasty and could suppress serious unrest when other controls failed.' },
  ],
};

export const powerIdeologyControlAO3 = {
  question: 'Which interpretation is most convincing about the stability of Tsarist political authority by 1855?',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Tsarism remained stable because Orthodoxy, dynasty and Official Nationality created genuine loyalty and made autocratic rule appear natural to much of the population.' },
    { historian: 'Interpretation B', argument: 'The regime depended less on popular loyalty than on bureaucracy, censorship, the army and political policing, which contained criticism and prevented opposition from organising openly.' },
    { historian: 'Interpretation C', argument: 'Tsarist authority was effective in ordinary conditions but structurally weak because autocracy, administrative inefficiency and resistance to criticism made the state slow to adapt when crisis exposed military, economic or social weakness.' },
  ],
};

export const powerIdeologyControlPeel = {
  question: 'Explain one way in which the Tsarist state maintained political authority.',
  stretchQuestion: '“Repression was the most important basis of Tsarist control by 1855.” Assess the validity of this view in one developed paragraph.',
  scaffold: [
    'Point: make a direct claim about one method of control.',
    'Evidence: use precise knowledge such as the Fundamental Laws, Official Nationality, provincial governors, censorship, the Third Section or the army.',
    'Explain: show how the evidence strengthened political authority.',
    'Counter: explain the importance of a competing method or a limitation of the chosen factor.',
    'Judgement: decide how important the factor was compared with alternatives and whether its importance changed in a crisis.',
  ],
};

export const powerIdeologyControlConfidence = {
  prompt: 'How confident are you explaining how the Tsarist state maintained political authority by 1855?',
  leastSecureOptions: ['Autocracy and divine right', 'Orthodoxy', 'Nationality', 'Bureaucracy and governors', 'Censorship and education', 'Third Section and repression', 'Army and nobility', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5],
};

export const powerIdeologyControlFallbacks: Record<string, any> = {
  lesson_content: { sections: powerIdeologyControlLessonSections },
  timeline: powerIdeologyControlTimeline,
  flashcards: { cards: powerIdeologyControlFlashcards },
  quiz: { questions: powerIdeologyControlQuiz },
  judgement_ranking: powerIdeologyControlJudgement,
  ao3_interpretation: powerIdeologyControlAO3,
  peel_response: powerIdeologyControlPeel,
  confidence_exit_ticket: powerIdeologyControlConfidence,
};
