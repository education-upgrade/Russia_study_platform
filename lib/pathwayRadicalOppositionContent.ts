export const radicalOppositionPathwaySlug = 'radical-opposition';

export const radicalOppositionLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Radical opposition developed because many educated Russians believed reform from above had failed. Some wanted to mobilise the peasantry, some used terrorism and others turned towards Marxism. The key issue is whether these movements seriously threatened Tsarism before 1894 or remained small, divided and easy to suppress.',
    question: 'What would make an opposition movement genuinely dangerous to an autocracy?',
    taskType: 'judgement',
    visual: { type: 'flow', title: 'From ideas to organised opposition', steps: ['Disappointment with reform', 'Search for a revolutionary force', 'Propaganda and organisation', 'Repression and division', 'Immediate failure or long-term threat?'] },
  },
  {
    heading: 'Why radicalism grew',
    body: 'The Great Reforms raised expectations but left autocracy intact. Peasants remained burdened by land hunger and redemption payments, while educated young people faced censorship and limited political participation. This encouraged some members of the intelligentsia to reject gradual reform and seek revolution.',
    question: 'Why could limited reform produce more radical opposition rather than greater loyalty?',
    taskType: 'explain',
  },
  {
    heading: 'The populist belief in the peasantry',
    body: 'Populists, or Narodniks, believed the peasantry could become the basis of a distinctive Russian socialism. They admired the communal traditions of the mir and argued that Russia might avoid western capitalism. Their weakness was that many peasants were conservative, religious and suspicious of educated outsiders.',
    question: 'Why did populists see the peasantry as both Russia’s strength and their own weakness?',
    taskType: 'judgement',
  },
  {
    heading: 'Going to the People, 1874',
    body: 'In 1874 thousands of idealistic students and activists entered the countryside to spread revolutionary ideas. Most peasants did not respond positively and some handed activists to the police. The campaign exposed the gap between revolutionary theory and peasant attitudes.',
    question: 'Why did Going to the People fail?',
    taskType: 'explain',
  },
  {
    heading: 'Land and Liberty',
    body: 'Land and Liberty was formed in 1876 to organise populist opposition. It combined propaganda among peasants and workers with resistance to the state. Its members disagreed over whether patient agitation or political violence offered the best route to revolution.',
    question: 'How did disagreement over methods weaken radical opposition?',
    taskType: 'explain',
  },
  {
    heading: 'Black Repartition and People’s Will',
    body: 'In 1879 Land and Liberty split. Black Repartition, associated with Plekhanov, continued to favour propaganda and mass mobilisation. People’s Will turned towards terrorism and aimed to destroy autocracy by assassinating the Tsar and senior officials.',
    question: 'Which wing posed the greater immediate threat, and which had greater long-term potential?',
    taskType: 'judgement',
    visual: { type: 'comparison', title: 'The 1879 split', leftTitle: 'Black Repartition', rightTitle: 'People’s Will', rows: [
      { left: 'Propaganda and organisation', right: 'Political terrorism' },
      { left: 'Build mass support', right: 'Strike directly at the regime' },
      { left: 'Limited immediate impact', right: 'High-profile short-term impact' },
    ] },
  },
  {
    heading: 'The assassination of Alexander II',
    body: 'After several failed attempts, People’s Will assassinated Alexander II in March 1881. This was a dramatic operational success, but it did not trigger a popular revolution. Instead, Alexander III strengthened repression, executed or imprisoned leading activists and abandoned further constitutional discussion.',
    question: 'Was the assassination a success or a strategic failure for radical opposition?',
    taskType: 'judgement',
    visual: { type: 'judgementScale', title: 'Impact of the assassination', leftLabel: 'Major revolutionary success', rightLabel: 'Strategic failure', markerLabel: 'Successful attack, but no mass uprising and harsher repression followed', markerPosition: 72, prompt: 'Distinguish immediate impact from longer-term consequences.' },
  },
  {
    heading: 'Repression under Alexander III',
    body: 'The regime used emergency powers, surveillance, arrest, exile and execution to crush revolutionary networks. The Okhrana infiltrated groups and activists struggled to maintain organisation. By the later 1880s, terrorism had declined and radical opposition was fragmented.',
    question: 'Why was the Tsarist state able to contain radical opposition so effectively?',
    taskType: 'explain',
  },
  {
    heading: 'The emergence of Marxism',
    body: 'Plekhanov and other exiles founded the Emancipation of Labour group in 1883. Marxists argued that industrialisation would create an urban working class capable of revolutionary action. Before 1894 their support inside Russia remained very small, but their analysis offered a more organised long-term challenge than peasant populism.',
    question: 'Why was Marxism weak before 1894 but potentially more dangerous in the future?',
    taskType: 'judgement',
  },
  {
    heading: 'Overall judgement',
    body: 'Radical opposition was not strong enough to overthrow Tsarism before 1894. It lacked mass support, suffered from ideological division and faced effective repression. Nevertheless, People’s Will demonstrated the vulnerability of the regime, while early Marxism provided ideas and organisational foundations that later revolutionaries would develop.',
    question: 'How effective was radical opposition to Tsarism before 1894?',
    taskType: 'judgement',
  },
];

export const radicalOppositionTimeline = { events: [
  { id: '1860s-populism', date: '1860s', title: 'Populist ideas spread', detail: 'Radicals increasingly looked to the peasantry as the possible basis of revolution.' },
  { id: '1874-going', date: '1874', title: 'Going to the People', detail: 'Young activists entered the countryside but failed to win significant peasant support.' },
  { id: '1876-land-liberty', date: '1876', title: 'Land and Liberty formed', detail: 'Populists attempted to organise propaganda and resistance more systematically.' },
  { id: '1879-split', date: '1879', title: 'Land and Liberty split', detail: 'Black Repartition favoured propaganda; People’s Will adopted terrorism.' },
  { id: '1881-assassination', date: '1881', title: 'Alexander II assassinated', detail: 'People’s Will killed the Tsar but failed to trigger revolution.' },
  { id: '1881-repression', date: '1881–82', title: 'Repression intensifies', detail: 'Leaders were executed or imprisoned and revolutionary networks were disrupted.' },
  { id: '1883-emancipation-labour', date: '1883', title: 'Emancipation of Labour group', detail: 'Plekhanov helped establish the first Russian Marxist organisation in exile.' },
  { id: '1894-position', date: '1894', title: 'Radical opposition remains weak', detail: 'Tsarism survived, but revolutionary ideas and organisations had not disappeared.' },
] };

export const radicalOppositionFlashcards = [
  { id: 'narodniks', front: 'Narodniks', back: 'Populists who believed the peasantry could provide the basis for a Russian socialist revolution.' },
  { id: 'mir', front: 'Why the mir mattered', back: 'Populists saw the peasant commune as evidence that Russia could develop socialism without western capitalism.' },
  { id: 'going', front: 'Going to the People, 1874', back: 'A failed attempt by radicals to spread revolutionary ideas among the peasantry.' },
  { id: 'land-liberty', front: 'Land and Liberty', back: 'A populist organisation founded in 1876 that later split over revolutionary methods.' },
  { id: 'black-repartition', front: 'Black Repartition', back: 'The faction that favoured propaganda and mass mobilisation rather than terrorism.' },
  { id: 'peoples-will', front: 'People’s Will', back: 'The faction that used political terrorism and assassinated Alexander II in 1881.' },
  { id: 'assassination', front: 'Impact of Alexander II’s assassination', back: 'It shocked the regime but produced repression rather than popular revolution.' },
  { id: 'okhrana', front: 'Okhrana', back: 'The secret police used surveillance, infiltration, arrest and exile against opposition.' },
  { id: 'ple-khanov', front: 'Georgi Plekhanov', back: 'Former populist who became a leading early Russian Marxist.' },
  { id: 'emancipation-labour', front: 'Emancipation of Labour group', back: 'The Marxist organisation founded in exile in 1883.' },
  { id: 'weakness', front: 'Main weakness before 1894', back: 'Radicals lacked mass support and were divided over ideas and methods.' },
  { id: 'long-term', front: 'Long-term importance', back: 'Radical groups developed revolutionary ideas and experience later movements could use.' },
];

export const radicalOppositionQuiz = [
  { id: 'q1', question: 'Who did the populists believe would lead revolution?', options: ['The peasantry', 'The nobility', 'The Orthodox clergy', 'The senior bureaucracy'], correct: 'The peasantry' },
  { id: 'q2', question: 'What happened during Going to the People?', options: ['Activists tried to mobilise peasants', 'Workers formed soviets', 'The Tsar granted a constitution', 'Marxists seized factories'], correct: 'Activists tried to mobilise peasants' },
  { id: 'q3', question: 'Why did Going to the People fail?', options: ['Most peasants were suspicious or uninterested', 'The army joined the radicals', 'The government supported it', 'It focused only on nobles'], correct: 'Most peasants were suspicious or uninterested' },
  { id: 'q4', question: 'Which organisation split in 1879?', options: ['Land and Liberty', 'The Okhrana', 'The zemstva', 'The Emancipation of Labour group'], correct: 'Land and Liberty' },
  { id: 'q5', question: 'Which group favoured terrorism?', options: ['People’s Will', 'Black Repartition', 'The Slavophiles', 'The zemstva'], correct: 'People’s Will' },
  { id: 'q6', question: 'What was People’s Will’s greatest success?', options: ['Assassinating Alexander II', 'Winning a peasant election', 'Creating a parliament', 'Ending redemption payments'], correct: 'Assassinating Alexander II' },
  { id: 'q7', question: 'What followed the assassination?', options: ['Harsher repression', 'A mass revolution', 'A constitution', 'The abolition of autocracy'], correct: 'Harsher repression' },
  { id: 'q8', question: 'Who helped found the Emancipation of Labour group?', options: ['Plekhanov', 'Pobedonostsev', 'Tolstoy', 'Witte'], correct: 'Plekhanov' },
  { id: 'q9', question: 'Which social group did Marxists expect to grow?', options: ['The industrial working class', 'The hereditary nobility', 'The clergy', 'The Cossacks'], correct: 'The industrial working class' },
  { id: 'q10', question: 'Which judgement is strongest?', options: ['Radical opposition was weak immediately but important in the longer term', 'Radicals controlled the peasantry by 1894', 'Terrorism overthrew autocracy', 'Marxism was already a mass movement'], correct: 'Radical opposition was weak immediately but important in the longer term' },
];

export const radicalOppositionJudgement = {
  question: 'Rank these factors from most to least important in explaining why radical opposition failed to overthrow Tsarism before 1894. Justify your top three.',
  factors: [
    { id: 'mass-support', title: 'Lack of mass support', detail: 'Peasants and workers were not yet mobilised behind revolutionary organisations.' },
    { id: 'division', title: 'Ideological division', detail: 'Populists, terrorists and Marxists disagreed about aims, agents and methods.' },
    { id: 'repression', title: 'State repression', detail: 'Police surveillance, arrest, exile and execution disrupted organisations.' },
    { id: 'peasant-attitudes', title: 'Peasant conservatism', detail: 'Many peasants remained religious, local and loyal to the Tsar.' },
    { id: 'terrorism', title: 'Limits of terrorism', detail: 'Spectacular attacks did not create a mass revolutionary movement.' },
    { id: 'organisation', title: 'Weak organisation', detail: 'Groups were small, secretive and vulnerable to infiltration.' },
    { id: 'industrialisation', title: 'Limited industrialisation', detail: 'The urban working class was not yet large enough to support Marxist expectations.' },
    { id: 'autocracy', title: 'Strength of autocracy', detail: 'The regime retained the army, bureaucracy, Church and coercive power.' },
  ],
};

export const radicalOppositionAO3 = {
  question: 'Which interpretation best explains the significance of radical opposition before 1894? Test each view with precise contextual knowledge.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Radical opposition was marginal because it lacked mass support and could be contained by police repression.' },
    { historian: 'Interpretation B', argument: 'The assassination of Alexander II showed that revolutionary terrorism posed a serious threat to the survival of autocracy.' },
    { historian: 'Interpretation C', argument: 'The immediate threat was limited, but populism and early Marxism created ideas, networks and experience of major long-term importance.' },
  ],
};

export const radicalOppositionPeel = {
  question: 'Write one developed paragraph answering: “Radical opposition posed little threat to Tsarism before 1894.” Assess the validity of this view.',
  stretchQuestion: 'Plan a balanced 25-mark response comparing lack of mass support, repression, terrorism and the emergence of Marxism.',
  scaffold: [
    'Point: make a direct claim about the seriousness of the threat.',
    'Evidence: use precise knowledge such as Going to the People, the 1879 split, the 1881 assassination or the Emancipation of Labour group.',
    'Explain: show how the evidence affected the strength or weakness of opposition.',
    'Counter: identify evidence that points in the opposite direction.',
    'Compare: distinguish immediate effectiveness from long-term significance.',
    'Judgement: decide which measure of threat is most convincing.',
  ],
};

export const radicalOppositionConfidence = {
  prompt: 'How confident are you explaining the development, methods and effectiveness of radical opposition before 1894?',
  leastSecureOptions: ['Why radicalism grew', 'Populism', 'Going to the People', 'Land and Liberty', 'Black Repartition', 'People’s Will', 'Alexander II assassination', 'Repression', 'Plekhanov', 'Early Marxism', 'Overall effectiveness'],
  scale: [1, 2, 3, 4, 5],
};

export const radicalOppositionFallbacks: Record<string, any> = {
  lesson_content: { sections: radicalOppositionLessonSections },
  timeline: radicalOppositionTimeline,
  flashcards: { cards: radicalOppositionFlashcards },
  quiz: { questions: radicalOppositionQuiz },
  judgement_ranking: radicalOppositionJudgement,
  ao3_interpretation: radicalOppositionAO3,
  peel_response: radicalOppositionPeel,
  confidence_exit_ticket: radicalOppositionConfidence,
};
