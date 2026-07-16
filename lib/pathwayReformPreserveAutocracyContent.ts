export const reformPreserveAutocracyPathwaySlug = 'reform-preserve-autocracy';

export const reformPreserveAutocracyLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander II introduced the most extensive reform programme of any nineteenth-century Tsar, but he never abandoned autocracy. The central issue is whether reform was intended to transform Russia or to strengthen the Romanov state by removing weaknesses that threatened its survival.',
    question: 'What is the difference between reforming institutions and transforming a political system?',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'What was Alexander II trying to achieve?',
      leftLabel: 'Transform Russia',
      rightLabel: 'Preserve autocracy',
      markerLabel: 'Modernise to preserve',
      markerPosition: 72,
      prompt: 'Most reforms altered institutions and practices while leaving the Tsar’s supreme political authority intact.',
    },
  },
  {
    heading: 'Why reform became necessary',
    body: 'Crimean defeat exposed military, administrative and economic weakness. Serfdom restricted labour mobility, military recruitment and agricultural development, while peasant unrest and criticism from educated elites created pressure for change. Reform from above offered the Tsar a way to modernise while controlling the direction and limits of change.',
    question: 'Why could reform be presented as a conservative strategy?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'The logic of reform from above',
      steps: ['War exposed weakness', 'Social pressure threatened stability', 'The Tsar controlled reform', 'A stronger state reduced the risk of revolution'],
    },
  },
  {
    heading: 'Emancipation and autocratic control',
    body: 'The Emancipation Edict ended the legal ownership of serfs and granted important civil rights. Yet former serfs often received inadequate allotments and faced redemption payments, temporary obligation and the authority of the mir. The settlement compensated landowners, protected noble influence and kept the state deeply involved in rural life.',
    question: 'Which features of emancipation suggest that preserving order mattered more than complete peasant freedom?',
    taskType: 'explain',
    visual: {
      type: 'comparison',
      title: 'Emancipation: freedom and control',
      leftTitle: 'Meaningful change',
      rightTitle: 'Continuing limits',
      rows: [
        { left: 'Serfs gained personal freedom', right: 'Redemption payments created long obligations' },
        { left: 'Marriage and legal rights widened', right: 'The mir restricted movement and landholding' },
        { left: 'Labour was no longer legally owned', right: 'Landowners retained influence and compensation' },
      ],
    },
  },
  {
    heading: 'Local government reform',
    body: 'The zemstva from 1864 and municipal dumas from 1870 widened participation in local administration and encouraged expertise in education, health, roads and welfare. However, property-weighted voting favoured the nobility, provincial governors retained oversight and neither institution had authority over national policy or ministers.',
    question: 'Why did local participation not amount to constitutional reform?',
    taskType: 'explain',
  },
  {
    heading: 'Judicial reform',
    body: 'The 1864 judicial reforms introduced trained judges, open trials, trial by jury and greater equality before the law. These changes enhanced professionalism and could increase respect for the state. Nevertheless, political cases and emergency measures remained vulnerable to government interference when autocracy felt threatened.',
    question: 'How could a more independent legal system strengthen an autocratic state?',
    taskType: 'explain',
  },
  {
    heading: 'Military reform',
    body: 'Dmitrii Milyutin’s reforms culminated in universal military service in 1874, replacing the unequal long-service system. Service terms were reduced, training and military education improved and conscription applied more broadly. These changes reduced some privilege and modernised the army, but their central purpose was to strengthen state power after Crimean humiliation.',
    question: 'Why is military reform strong evidence for modernisation designed to preserve the regime?',
    taskType: 'explain',
  },
  {
    heading: 'Education, censorship and reaction',
    body: 'The University Statute of 1863 expanded autonomy and the 1865 press laws relaxed pre-publication censorship for some publications. These measures encouraged intellectual activity but also widened the circulation of criticism. After Karakozov’s assassination attempt in 1866, the regime tightened supervision, appointed more conservative ministers and restricted universities and publications.',
    question: 'Why is the reaction after 1866 important when judging Alexander II’s priorities?',
    taskType: 'explain',
  },
  {
    heading: 'No constitutional government',
    body: 'Alexander II consistently refused to create a national elected assembly or make ministers accountable to representatives. The Loris-Melikov proposals of 1881 would have brought selected representatives into preparatory commissions, but they remained consultative and would not have limited the Tsar’s sovereignty.',
    question: 'Why is the absence of constitutional government central to the enquiry?',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Consultation was not constitutional government',
      leftTitle: 'What changed',
      rightTitle: 'What did not change',
      rows: [
        { left: 'Some elected local participation', right: 'No elected national parliament' },
        { left: 'Possible consultative representatives in 1881', right: 'Ministers remained responsible to the Tsar' },
        { left: 'More public legal procedures', right: 'Sovereignty remained autocratic' },
      ],
    },
  },
  {
    heading: 'Opposition and the limits of reform',
    body: 'Liberals criticised the absence of national representation, while radicals argued that reform had failed the peasantry and preserved privilege. Populist campaigns, Land and Liberty and the People’s Will developed despite reform. The assassination of Alexander II in 1881 showed that reform had neither satisfied opposition nor secured broad political loyalty.',
    question: 'Does the survival and radicalisation of opposition prove that the reforms failed?',
    taskType: 'judgement',
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander II was a genuine moderniser but not a liberal constitutionalist. His reforms changed legal relationships, institutions and administrative capacity while preserving the Tsar’s supreme authority. They weakened some traditional practices but were designed and limited so that change strengthened, rather than replaced, autocracy.',
    question: 'How far did Alexander II reform Russia in order to preserve autocracy?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'A balanced conclusion',
      steps: ['Reforms produced genuine institutional change', 'The state became more efficient and credible', 'Political sovereignty remained untouched', 'Reaction followed when reform threatened control'],
    },
  },
];

export const reformPreserveAutocracyTimeline = {
  events: [
    { id: '1855', date: '1855', title: 'Alexander II becomes Tsar', detail: 'He inherited an autocratic state weakened by war, serfdom and administrative backwardness.' },
    { id: '1856', date: '1856', title: 'Crimean defeat confirmed', detail: 'The Treaty of Paris reinforced pressure to modernise the army, economy and administration.' },
    { id: '1856-speech', date: '1856', title: 'Reform from above', detail: 'Alexander warned nobles that it was better to abolish serfdom from above than wait for it to abolish itself from below.' },
    { id: '1861', date: '1861', title: 'Emancipation Edict', detail: 'Serfs gained personal freedom, but the land settlement protected order, state revenue and noble interests.' },
    { id: '1863', date: '1863', title: 'University Statute', detail: 'Universities gained greater autonomy, widening intellectual activity without changing national political power.' },
    { id: '1864a', date: '1864', title: 'Zemstva established', detail: 'Elected local bodies widened participation while remaining under provincial and central supervision.' },
    { id: '1864b', date: '1864', title: 'Judicial reform', detail: 'A more open and professional legal system increased state effectiveness and legitimacy.' },
    { id: '1865', date: '1865', title: 'Censorship reforms', detail: 'Pre-publication censorship was relaxed for some larger publications, widening public discussion.' },
    { id: '1866', date: '1866', title: 'Karakozov assassination attempt', detail: 'The attempt was followed by tighter censorship, university controls and a more conservative direction.' },
    { id: '1870', date: '1870', title: 'Municipal reform', detail: 'Urban dumas extended local administration while central political authority remained unchanged.' },
    { id: '1874', date: '1874', title: 'Military reform', detail: 'Universal military service and improved training strengthened state and military capacity.' },
    { id: '1879', date: '1879', title: 'People’s Will formed', detail: 'Radical opposition increasingly targeted the Tsar despite two decades of reform.' },
    { id: '1880', date: '1880', title: 'Loris-Melikov appointed', detail: 'A mixture of repression and limited consultation was used in an attempt to restore stability.' },
    { id: '1881', date: '1881', title: 'Alexander II assassinated', detail: 'His death highlighted the failure of reform to reconcile opposition with autocratic government.' },
  ],
};

export const reformPreserveAutocracyFlashcards = [
  { id: 'reform-above', front: 'Reform from above', back: 'Change directed and limited by the ruler to prevent uncontrolled pressure or revolution from below.' },
  { id: 'preserve-autocracy', front: 'Reform to preserve autocracy', back: 'Modernising institutions so that the Tsarist state became stronger without surrendering supreme political authority.' },
  { id: 'emancipation', front: 'Emancipation Edict', back: 'The 1861 reform ending the legal ownership of serfs while retaining important economic and communal controls.' },
  { id: 'redemption', front: 'Redemption payments', back: 'Long-term payments for peasant land allotments that protected state and noble finances but limited peasant freedom.' },
  { id: 'temporary', front: 'Temporary obligation', back: 'The transitional status under which some former serfs continued to owe labour or dues before completing land arrangements.' },
  { id: 'mir', front: 'Mir', back: 'The village commune that redistributed land, collected payments and restricted movement, helping preserve rural order.' },
  { id: 'zemstva', front: 'Zemstva', back: 'Elected local councils responsible for services but limited by property-weighted voting and provincial supervision.' },
  { id: 'judicial', front: 'Judicial reform', back: 'The 1864 changes introducing trained judges, open trials, juries and greater equality before the law.' },
  { id: 'military', front: 'Military reform', back: 'Milyutin’s reforms culminating in universal service in 1874, shorter terms and improved training.' },
  { id: 'municipal', front: 'Municipal dumas', back: 'Urban local-government bodies introduced in 1870 without authority over national government.' },
  { id: 'university', front: 'University Statute, 1863', back: 'A reform granting universities greater autonomy before controls tightened after 1866.' },
  { id: 'press', front: 'Press laws, 1865', back: 'Measures reducing pre-publication censorship for some publications while retaining penalties and state supervision.' },
  { id: 'karakozov', front: 'Dmitrii Karakozov', back: 'The radical whose 1866 assassination attempt helped trigger a more conservative and repressive direction.' },
  { id: 'loris', front: 'Loris-Melikov proposals', back: 'Limited consultative proposals in 1881 that would not have created parliamentary sovereignty or ministerial responsibility.' },
  { id: 'peoples-will', front: 'People’s Will', back: 'A revolutionary organisation formed in 1879 that used terrorism and assassinated Alexander II.' },
  { id: 'judgement', front: 'Overall judgement', back: 'Alexander II modernised institutions and legal relationships but preserved the Tsar’s supreme political authority.' },
];

export const reformPreserveAutocracyQuiz = [
  { id: 'q1', question: 'What does reform from above mean?', options: ['Change controlled by the ruler', 'Revolution led by peasants', 'Government elected nationally', 'Reform imposed by foreign states'], correct: 'Change controlled by the ruler' },
  { id: 'q2', question: 'Why did Crimean defeat encourage domestic reform?', options: ['It exposed military and administrative weakness', 'It created a national parliament', 'It ended peasant unrest', 'It removed the nobility'], correct: 'It exposed military and administrative weakness' },
  { id: 'q3', question: 'Which feature most limited the economic freedom created by emancipation?', options: ['Redemption payments', 'Trial by jury', 'Municipal elections', 'Universal military service'], correct: 'Redemption payments' },
  { id: 'q4', question: 'How did the mir help preserve order?', options: ['It collected payments and controlled communal land and movement', 'It elected national ministers', 'It abolished noble landownership', 'It controlled foreign policy'], correct: 'It collected payments and controlled communal land and movement' },
  { id: 'q5', question: 'Why did the zemstva not end autocracy?', options: ['They dealt mainly with local administration', 'They appointed all national ministers', 'They controlled the imperial army', 'They could dismiss the Tsar'], correct: 'They dealt mainly with local administration' },
  { id: 'q6', question: 'What limited equality within the zemstva?', options: ['Property-weighted voting favoured the nobility', 'Peasants held every seat', 'Voting was entirely secret and equal', 'The Tsar had no oversight'], correct: 'Property-weighted voting favoured the nobility' },
  { id: 'q7', question: 'How did judicial reform help preserve the regime?', options: ['It made justice more credible and effective', 'It transferred sovereignty to parliament', 'It abolished central government', 'It removed provincial governors'], correct: 'It made justice more credible and effective' },
  { id: 'q8', question: 'What was introduced by the 1864 judicial reforms?', options: ['Open trials and trial by jury', 'Collective farming', 'A national legislature', 'Land Captains'], correct: 'Open trials and trial by jury' },
  { id: 'q9', question: 'What was the political significance of military reform?', options: ['It strengthened state capacity without limiting the Tsar', 'It gave soldiers control of legislation', 'It created elected army councils', 'It replaced autocracy with military rule'], correct: 'It strengthened state capacity without limiting the Tsar' },
  { id: 'q10', question: 'What did the 1874 military reform establish?', options: ['Universal military service with shorter terms', 'Permanent exemption for nobles', 'The abolition of conscription', 'Army control by zemstva'], correct: 'Universal military service with shorter terms' },
  { id: 'q11', question: 'Why is the reaction after 1866 important?', options: ['It showed reform depended on political obedience', 'It ended censorship permanently', 'It created a national parliament', 'It transferred power to universities'], correct: 'It showed reform depended on political obedience' },
  { id: 'q12', question: 'What did Alexander II consistently refuse to introduce?', options: ['A national representative parliament', 'Local government bodies', 'A reformed court system', 'Universal military service'], correct: 'A national representative parliament' },
  { id: 'q13', question: 'What best describes the Loris-Melikov proposals?', options: ['Limited consultation without parliamentary sovereignty', 'Immediate universal male suffrage', 'Full ministerial responsibility to parliament', 'The abolition of the monarchy'], correct: 'Limited consultation without parliamentary sovereignty' },
  { id: 'q14', question: 'Why did radical opposition continue after the reforms?', options: ['Many believed privilege and autocracy remained', 'All peasants became wealthy landowners', 'The state ended political policing', 'Russia adopted constitutional government'], correct: 'Many believed privilege and autocracy remained' },
  { id: 'q15', question: 'Which judgement best explains Alexander II’s reform programme?', options: ['It modernised Russia while preserving supreme Tsarist authority', 'It deliberately transferred power to elected representatives', 'It removed the nobility from Russian society', 'It replaced autocracy with liberal democracy'], correct: 'It modernised Russia while preserving supreme Tsarist authority' },
];

export const reformPreserveAutocracyJudgement = {
  question: 'Rank the evidence from strongest to weakest. Which factor most clearly demonstrates that reform was intended to preserve autocracy?',
  factors: [
    { id: 'motives', title: 'Reform from above', detail: 'The Tsar controlled the timing and direction of change to prevent revolution and restore state strength.' },
    { id: 'emancipation', title: 'The emancipation settlement', detail: 'Freedom was granted, but redemption payments, temporary obligation, the mir and land arrangements preserved order and noble interests.' },
    { id: 'zemstva', title: 'Limits of the zemstva', detail: 'Local participation expanded without national representative government or ministerial accountability.' },
    { id: 'judicial', title: 'Judicial modernisation', detail: 'More credible justice strengthened the state while leaving sovereignty unchanged.' },
    { id: 'military', title: 'Military reform', detail: 'A stronger and more efficient army increased the effectiveness and security of the autocratic state.' },
    { id: 'reaction', title: 'Reaction after 1866', detail: 'The regime restricted freedoms when reform appeared to encourage political challenge.' },
    { id: 'constitution', title: 'Rejection of constitutional government', detail: 'Alexander II never accepted that elected representatives should control ministers or limit the Tsar.' },
    { id: 'opposition', title: 'Growth of radical opposition', detail: 'Continued opposition showed that controlled reform failed to satisfy demands for deeper social and political change.' },
  ],
};

export const reformPreserveAutocracyAO3 = {
  question: 'Which interpretation is most convincing about Alexander II’s motives and the political purpose of reform?',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Alexander II was a genuine moderniser whose reforms represented a serious attempt to transform Russian institutions and release society from outdated restrictions.' },
    { historian: 'Interpretation B', argument: 'The reforms were primarily defensive measures designed to remove military, economic and administrative weaknesses and preserve Romanov autocracy.' },
    { historian: 'Interpretation C', argument: 'Alexander II wanted meaningful institutional reform, but his commitment to autocracy, noble interests and political order determined the limits and reversals of change.' },
  ],
};

export const reformPreserveAutocracyPeel = {
  question: 'Explain one way in which Alexander II’s reforms helped preserve autocracy.',
  stretchQuestion: '“Alexander II’s reforms strengthened rather than weakened autocracy.” Assess the validity of this view in one developed paragraph.',
  scaffold: [
    'Point: make a direct judgement about one reform or policy.',
    'Evidence: use precise knowledge such as redemption payments, the mir, property-weighted zemstva, judicial independence, military reform, the reaction after 1866 or the limits of the Loris-Melikov proposals.',
    'Explain: show how the reform modernised Russia or strengthened state capacity.',
    'Counter: identify a way the same reform widened freedom, weakened traditional authority or stimulated new expectations.',
    'Judgement: decide whether its overall political effect was to preserve autocracy and compare its significance with another reform.',
  ],
};

export const reformPreserveAutocracyConfidence = {
  prompt: 'How confident are you judging whether Alexander II reformed Russia to preserve autocracy?',
  leastSecureOptions: ['Motives and reform from above', 'Emancipation and rural control', 'Zemstva and municipal reform', 'Judicial reform', 'Military reform', 'Education and censorship', 'Reaction after 1866', 'Loris-Melikov proposals', 'Opposition and overall judgement'],
  scale: [1, 2, 3, 4, 5],
};

export const reformPreserveAutocracyFallbacks: Record<string, any> = {
  lesson_content: { sections: reformPreserveAutocracyLessonSections },
  timeline: reformPreserveAutocracyTimeline,
  flashcards: { cards: reformPreserveAutocracyFlashcards },
  quiz: { questions: reformPreserveAutocracyQuiz },
  judgement_ranking: reformPreserveAutocracyJudgement,
  ao3_interpretation: reformPreserveAutocracyAO3,
  peel_response: reformPreserveAutocracyPeel,
  confidence_exit_ticket: reformPreserveAutocracyConfidence,
};
