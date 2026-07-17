export const laterAlexanderIiPathwaySlug = 'later-alexander-ii';

export const laterAlexanderIiLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander II began his reign as a reforming Tsar, but the later years of his rule were marked by tighter control, growing revolutionary opposition and assassination. The key issue is whether this represented a complete reversal of reform or a more limited attempt to defend autocracy when reform appeared to threaten order.',
    question: 'Did Alexander II abandon reform after 1866, or did he simply place security first?',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'The later reign of Alexander II',
      leftLabel: 'Continued reform',
      rightLabel: 'Reaction and repression',
      markerLabel: 'Selective reform under tighter political control',
      markerPosition: 68,
      prompt: 'The evidence points to a shift in emphasis rather than the total disappearance of reform.',
    },
  },
  {
    heading: 'The turning point of 1866',
    body: 'On 4 April 1866 Dmitry Karakozov attempted to assassinate Alexander II. The attempt convinced the Tsar that university radicalism, freer discussion and weak censorship had encouraged political danger. Conservative ministers gained influence, censorship tightened and universities came under closer supervision.',
    question: 'Why did the Karakozov attempt strengthen conservative influence at court?',
    taskType: 'explain',
  },
  {
    heading: 'Reaction in education and censorship',
    body: 'Dmitry Tolstoy became Minister of Education in 1866. Classical languages and discipline were emphasised in secondary schools, while access to universities was narrowed and university autonomy weakened. The press also faced closer supervision. These measures aimed to restrict the spread of radical ideas rather than reverse every earlier reform.',
    question: 'How did educational policy try to reduce political opposition?',
    taskType: 'explain',
  },
  {
    heading: 'Reform did not completely stop',
    body: 'Important reforms continued after 1866. Municipal dumas were created in 1870, military reform introduced universal conscription in 1874 and economic modernisation continued. These measures strengthened administration and state capacity, but none transferred national political sovereignty away from the Tsar.',
    question: 'Which evidence best challenges the claim that reform ended in 1866?',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Continuity and change after 1866',
      leftTitle: 'Continued reform',
      rightTitle: 'Greater reaction',
      rows: [
        { left: 'Municipal reform, 1870', right: 'Tighter censorship' },
        { left: 'Military reform, 1874', right: 'Reduced university autonomy' },
        { left: 'Economic modernisation', right: 'More policing and surveillance' },
      ],
    },
  },
  {
    heading: 'The growth of populism',
    body: 'The intelligentsia increasingly questioned autocracy and looked to the peasantry as the basis of a future socialist society. In the movement known as “going to the people” in 1874, young radicals entered the countryside to educate and mobilise peasants. Most peasants were suspicious and many activists were arrested.',
    question: 'Why did “going to the people” fail to produce a peasant revolution?',
    taskType: 'explain',
  },
  {
    heading: 'Land and Liberty divides',
    body: 'Land and Liberty was formed in 1876. It demanded land redistribution and political change, but members disagreed over tactics. In 1879 it split into Black Repartition, which continued peaceful propaganda, and People’s Will, which adopted terrorism and focused on killing leading representatives of the regime.',
    question: 'Why did some populists turn from propaganda to terrorism?',
    taskType: 'explain',
  },
  {
    heading: 'War, unrest and political pressure',
    body: 'The Russo-Turkish War of 1877–78 initially generated patriotic support, but its cost and the diplomatic settlement at the Congress of Berlin brought disappointment. Economic difficulties, political trials and revolutionary violence increased pressure on the government. The regime faced both public frustration and a highly determined terrorist minority.',
    question: 'How did the aftermath of war weaken confidence in Alexander II’s government?',
    taskType: 'explain',
  },
  {
    heading: 'Loris-Melikov and the final reform attempt',
    body: 'After the Winter Palace bombing of 1880, Alexander appointed Mikhail Loris-Melikov. He combined stronger policing with limited consultation and proposed that elected representatives from zemstva and municipal dumas should help discuss legislation. The proposal did not create a parliament or make ministers responsible to representatives.',
    question: 'Why are the Loris-Melikov proposals better described as consultation than constitutional government?',
    taskType: 'judgement',
  },
  {
    heading: 'The assassination of Alexander II',
    body: 'People’s Will made repeated attempts to kill the Tsar. On 1 March 1881 Alexander II was fatally wounded by bombs in St Petersburg. His assassination showed the effectiveness of a small terrorist organisation, but not the existence of mass revolutionary support. It also destroyed the immediate possibility of the Loris-Melikov proposals being introduced.',
    question: 'What did the assassination reveal about both the strengths and limits of revolutionary opposition?',
    taskType: 'judgement',
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander II’s later reign was more repressive than the first decade, particularly in education, censorship and policing. However, administrative and military reform continued, and the Tsar briefly considered limited consultation in 1881. The strongest judgement is that reform became increasingly defensive and conditional: Alexander modernised the state but refused to risk autocratic sovereignty.',
    question: 'How far did Alexander II become a reactionary ruler after 1866?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'The cycle of reform and reaction',
      steps: ['Reform raises expectations', 'Radical opposition grows', 'Security fears increase', 'Control tightens', 'Limited reform continues', 'Terrorism escalates'],
    },
  },
];

export const laterAlexanderIiTimeline = {
  events: [
    { id: '1866', date: '1866', title: 'Karakozov attempts to assassinate Alexander II', detail: 'The attempt strengthened conservative influence and prompted tighter control of education and the press.' },
    { id: '1866-tolstoy', date: '1866', title: 'Dmitry Tolstoy becomes Minister of Education', detail: 'Classical education, discipline and closer state supervision were used to counter radicalism.' },
    { id: '1870', date: '1870', title: 'Municipal reform', detail: 'Town dumas widened local participation but remained subordinate to autocratic government.' },
    { id: '1874-army', date: '1874', title: 'Universal military service introduced', detail: 'Milyutin’s reforms modernised recruitment and strengthened state capacity.' },
    { id: '1874-people', date: '1874', title: 'Going to the people', detail: 'Populists attempted to mobilise peasants but encountered suspicion and arrest.' },
    { id: '1876', date: '1876', title: 'Land and Liberty formed', detail: 'The organisation combined populist socialism with growing debate over violent tactics.' },
    { id: '1877', date: '1877–78', title: 'Russo-Turkish War', detail: 'Military victory was followed by diplomatic disappointment and financial strain.' },
    { id: '1879', date: '1879', title: 'Land and Liberty splits', detail: 'Black Repartition retained propaganda; People’s Will embraced political terrorism.' },
    { id: '1880', date: '1880', title: 'Loris-Melikov appointed', detail: 'He combined repression with proposals for limited consultation.' },
    { id: '1881-proposal', date: '1881', title: 'Loris-Melikov proposals considered', detail: 'Representatives would advise on legislation, but there would be no sovereign parliament.' },
    { id: '1881-death', date: '1 March 1881', title: 'Alexander II assassinated', detail: 'People’s Will killed the Tsar before the consultative proposals could be implemented.' },
  ],
};

export const laterAlexanderIiFlashcards = [
  { id: 'karakozov', front: 'Dmitry Karakozov', back: 'Radical who attempted to assassinate Alexander II in April 1866, helping trigger a more conservative phase.' },
  { id: 'tolstoy', front: 'Dmitry Tolstoy', back: 'Minister of Education from 1866 who tightened discipline, promoted classical education and reduced university freedom.' },
  { id: 'municipal', front: 'Municipal reform, 1870', back: 'Created elected town dumas, widening local administration without limiting central autocracy.' },
  { id: 'milyutin', front: 'Milyutin’s military reforms', back: 'Introduced universal conscription in 1874, reduced service and modernised the army.' },
  { id: 'populism', front: 'Populism', back: 'Radical belief that the peasantry and village commune could form the basis of a socialist society.' },
  { id: 'going-people', front: 'Going to the people', back: 'The 1874 attempt by young radicals to educate and mobilise peasants; it largely failed.' },
  { id: 'land-liberty', front: 'Land and Liberty', back: 'Populist organisation formed in 1876 that later divided over propaganda and terrorism.' },
  { id: 'black-repartition', front: 'Black Repartition', back: 'The peaceful propaganda wing created after Land and Liberty split in 1879.' },
  { id: 'peoples-will', front: 'People’s Will', back: 'Terrorist organisation formed in 1879 that aimed to destroy autocracy by assassinating leading figures.' },
  { id: 'loris', front: 'Mikhail Loris-Melikov', back: 'Minister who combined stronger security with proposals for limited representative consultation in 1880–81.' },
  { id: 'constitution', front: 'Loris-Melikov “constitution”', back: 'A misleading label: elected representatives would discuss legislation but would not control ministers or the Tsar.' },
  { id: 'assassination', front: '1 March 1881', back: 'Alexander II was killed by People’s Will in St Petersburg.' },
];

export const laterAlexanderIiQuiz = [
  { id: 'q1', question: 'Which event is commonly treated as the turning point towards reaction?', options: ['Karakozov’s assassination attempt in 1866', 'The Emancipation Edict in 1861', 'The Crimean War in 1853', 'The creation of zemstva in 1864'], correct: 'Karakozov’s assassination attempt in 1866' },
  { id: 'q2', question: 'What was Dmitry Tolstoy’s main objective in education?', options: ['To reduce radical influence through discipline and classical study', 'To introduce universal university access', 'To transfer schools to the zemstva', 'To abolish censorship'], correct: 'To reduce radical influence through discipline and classical study' },
  { id: 'q3', question: 'Which reform continued after 1866?', options: ['Municipal reform in 1870', 'A national parliament', 'Ministerial responsibility to elected deputies', 'The abolition of autocracy'], correct: 'Municipal reform in 1870' },
  { id: 'q4', question: 'What did military reform introduce in 1874?', options: ['Universal conscription', 'A volunteer-only army', 'Permanent exemption for peasants', 'Control of the army by the zemstva'], correct: 'Universal conscription' },
  { id: 'q5', question: 'Why did going to the people largely fail?', options: ['Peasants were suspicious and many activists were arrested', 'Radicals refused to enter the countryside', 'The government immediately granted land', 'Universities opposed socialism'], correct: 'Peasants were suspicious and many activists were arrested' },
  { id: 'q6', question: 'What caused Land and Liberty to split?', options: ['Disagreement over propaganda and terrorism', 'Support for Alexander III', 'A dispute over the Crimean War', 'The success of the Loris-Melikov proposals'], correct: 'Disagreement over propaganda and terrorism' },
  { id: 'q7', question: 'Which group adopted terrorism after 1879?', options: ['People’s Will', 'Black Repartition', 'The zemstva', 'The Holy Synod'], correct: 'People’s Will' },
  { id: 'q8', question: 'What was the main limitation of the Loris-Melikov proposals?', options: ['They did not create a sovereign parliament or responsible ministry', 'They abolished local government', 'They ended all consultation', 'They transferred power to People’s Will'], correct: 'They did not create a sovereign parliament or responsible ministry' },
  { id: 'q9', question: 'What happened on 1 March 1881?', options: ['Alexander II was assassinated', 'Serfdom was abolished', 'Land and Liberty was formed', 'The Russo-Turkish War began'], correct: 'Alexander II was assassinated' },
  { id: 'q10', question: 'Which is the most balanced judgement on the later reign?', options: ['Reform became more defensive and conditional while autocracy remained intact', 'All reform stopped permanently in 1866', 'Alexander II created parliamentary democracy', 'Opposition had mass peasant support'], correct: 'Reform became more defensive and conditional while autocracy remained intact' },
];

export const laterAlexanderIiJudgement = {
  question: 'Rank these factors by importance in explaining why Alexander II’s later reign became more repressive. Justify your top three and identify the strongest link between them.',
  factors: [
    { id: 'karakozov', title: 'Karakozov assassination attempt', detail: 'Convinced the Tsar that liberalisation had encouraged political danger.' },
    { id: 'radicalism', title: 'Growth of radical ideas', detail: 'Populism and socialism challenged the legitimacy of autocracy.' },
    { id: 'terrorism', title: 'Revolutionary terrorism', detail: 'Repeated attacks made security the regime’s immediate priority.' },
    { id: 'personality', title: 'Alexander II’s commitment to autocracy', detail: 'The Tsar supported modernisation but would not surrender sovereign authority.' },
    { id: 'war', title: 'War and economic pressure', detail: 'The Russo-Turkish War and diplomatic disappointment increased instability.' },
    { id: 'limits', title: 'Limits of earlier reforms', detail: 'Reforms raised expectations without creating a legitimate national political outlet.' },
  ],
};

export const laterAlexanderIiAO3 = {
  question: 'Which interpretation best explains the character of Alexander II’s later reign? Evaluate each view using evidence from 1866–81.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'After 1866 Alexander II abandoned his reforming principles and became an essentially reactionary ruler.' },
    { historian: 'Interpretation B', argument: 'The later reign remained reforming, but reform was directed towards strengthening the state rather than liberalising politics.' },
    { historian: 'Interpretation C', argument: 'Alexander II alternated between reform and repression because he wanted modernisation without any loss of autocratic sovereignty.' },
  ],
};

export const laterAlexanderIiPeel = {
  question: 'Write one developed paragraph answering: “The assassination attempt of 1866 was the main reason Alexander II became more reactionary.” Assess the validity of this view.',
  stretchQuestion: 'Plan a full 25-mark answer comparing the impact of the 1866 assassination attempt, revolutionary opposition and Alexander II’s commitment to autocracy.',
  scaffold: [
    'Point: make a direct claim about the importance of the 1866 assassination attempt.',
    'Evidence: use precise material on Karakozov, Tolstoy, censorship and university controls.',
    'Explain: show how security fears altered government policy.',
    'Counter: compare this with longer-term radicalism, terrorism or Alexander’s political beliefs.',
    'Compare: decide which explanation had greater reach and durability.',
    'Judgement: give an explicit answer linked to the wording of the question.',
  ],
};

export const laterAlexanderIiConfidence = {
  prompt: 'How confident are you explaining why Alexander II’s later reign combined continued reform with growing reaction and revolutionary violence?',
  leastSecureOptions: ['The 1866 turning point', 'Education and censorship', 'Reforms after 1866', 'Populism', 'Going to the people', 'Land and Liberty', 'People’s Will', 'Loris-Melikov', 'The assassination', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5],
};

export const laterAlexanderIiFallbacks: Record<string, any> = {
  lesson_content: { sections: laterAlexanderIiLessonSections },
  timeline: laterAlexanderIiTimeline,
  flashcards: { cards: laterAlexanderIiFlashcards },
  quiz: { questions: laterAlexanderIiQuiz },
  judgement_ranking: laterAlexanderIiJudgement,
  ao3_interpretation: laterAlexanderIiAO3,
  peel_response: laterAlexanderIiPeel,
  confidence_exit_ticket: laterAlexanderIiConfidence,
};
