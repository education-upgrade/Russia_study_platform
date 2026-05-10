export const alexanderIIReformLessonTitle = 'Why did Alexander II believe Russia needed reform?';
export const alexanderIIReformPathwaySlug = 'alexander-ii-reform';

export const pathwayAlexanderIIReformLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander II became Tsar in 1855 during the Crimean War. He inherited a state that looked powerful because it was huge, but the war exposed deep weaknesses in the army, economy, transport system and administration. Reform was not mainly about creating democracy. Alexander II wanted to strengthen autocracy by modernising Russia before weakness turned into revolution.',
    question: 'In one sentence, explain why Alexander II thought reform was necessary.',
    taskType: 'judgement',
    teacherNote: 'Look for the idea that reform was designed to strengthen, not abolish, autocracy.',
    visual: {
      type: 'flow',
      title: 'Pressure for reform',
      steps: ['Crimean War defeat exposed weakness', 'Military and transport systems looked outdated', 'Serfdom restricted economic development', 'Fear of unrest made delay dangerous', 'Reform from above could preserve autocracy'],
    },
  },
  {
    heading: 'The Crimean War exposed weakness',
    body: 'The Crimean War of 1853–56 was a turning point in how Russia’s rulers viewed the state. Russia was defeated by Britain, France and the Ottoman Empire. The defeat mattered because it showed that Russia had fallen behind modern European powers in military organisation, transport, industry and administration.',
    question: 'How did the Crimean War expose the weaknesses of Tsarist Russia?',
    taskType: 'explain',
    visual: {
      type: 'statBlock',
      title: 'Why defeat mattered',
      stats: [
        { value: '1853–56', label: 'Crimean War', note: 'Russia’s defeat exposed structural weakness.' },
        { value: 'Transport', label: 'Weak logistics', note: 'Troops and supplies were difficult to move.' },
        { value: 'Prestige', label: 'Great-power status damaged', note: 'Russia looked backward compared with western powers.' },
      ],
      takeaway: 'The war made reform urgent because weakness was now visible to both rulers and critics.',
    },
  },
  {
    heading: 'Military weakness threatened Russia’s power',
    body: 'Russia had a very large army, but size did not mean efficiency. Soldiers often served for long periods, training was outdated, equipment was poor and the state struggled to move supplies across long distances. Military reform became necessary because a weak army threatened Russia’s status as a great power.',
    question: 'Why did military weakness make reform urgent after 1855?',
    taskType: 'explain',
  },
  {
    heading: 'Economic backwardness limited the state',
    body: 'Russia remained overwhelmingly agricultural in the mid-nineteenth century. Industry was limited, the railway network was small, and the state had less capacity to raise revenue or modernise quickly. This mattered because a backward economy could not easily support a modern army or compete with industrial powers.',
    question: 'How did economic backwardness weaken the Tsarist state?',
    taskType: 'explain',
    visual: {
      type: 'comparison',
      title: 'Russia and modernisation',
      leftTitle: 'Russia’s problem',
      rightTitle: 'Why it mattered',
      rows: [
        { left: 'Limited railway network', right: 'Slow movement of troops, goods and orders' },
        { left: 'Small industrial base', right: 'Weak supply of weapons and machinery' },
        { left: 'Agrarian economy', right: 'Lower productivity and weaker state revenue' },
      ],
    },
  },
  {
    heading: 'Serfdom was an economic and political problem',
    body: 'Serfdom tied millions of peasants to landowners and restricted labour mobility. It reduced agricultural efficiency, limited the growth of a flexible workforce and caused resentment among peasants. By the 1850s, serfdom appeared backward and dangerous: it weakened the economy and risked unrest from below.',
    question: 'Why was serfdom both an economic problem and a political problem?',
    taskType: 'explain',
    visual: {
      type: 'conceptMap',
      title: 'Why serfdom mattered',
      centre: 'Serfdom',
      branches: [
        { label: 'Economic', note: 'Limited productivity and labour mobility.' },
        { label: 'Military', note: 'A backward economy weakened the army.' },
        { label: 'Political', note: 'Peasant resentment made unrest more likely.' },
        { label: 'Reputation', note: 'Russia appeared backward compared with western Europe.' },
      ],
    },
  },
  {
    heading: 'Fear of unrest encouraged reform',
    body: 'Peasant unrest was a recurring fear for the Tsarist state. Alexander II understood that if the government refused to reform, pressure could build from below. His famous argument was that it was better to abolish serfdom from above than to wait for it to abolish itself from below.',
    question: 'Why did fear of unrest encourage Alexander II to reform?',
    taskType: 'explain',
  },
  {
    heading: 'Reform was meant to preserve autocracy',
    body: 'Alexander II was a reforming Tsar, but he was not trying to create a democracy. His reforms were designed to modernise Russia while preserving Tsarist authority. This creates the central tension of his reign: reform was necessary to strengthen the state, but reform also raised expectations and risked encouraging further demands.',
    question: 'Was Alexander II a liberal reformer or a cautious autocrat? Give a brief judgement.',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'How should we judge Alexander II?',
      leftLabel: 'Liberal reformer',
      rightLabel: 'Cautious autocrat',
      markerLabel: 'Reform to preserve power',
      markerPosition: 68,
      prompt: 'Best judgement: Alexander II accepted reform because it seemed necessary, but his aim was to strengthen Tsarism rather than share power.',
    },
  },
];

export const pathwayAlexanderIIReformQuizQuestions = [
  { id: 'alexander-ii-accession', question: 'When did Alexander II become Tsar?', options: ['1855', '1861', '1881', '1894'], correct: '1855' },
  { id: 'crimean-war-dates', question: 'When was the Crimean War?', options: ['1853–56', '1861–64', '1877–78', '1904–05'], correct: '1853–56' },
  { id: 'crimean-war-significance', question: 'Why was the Crimean War important for reform?', options: ['It exposed Russia’s military, transport and administrative weaknesses', 'It created the Duma', 'It abolished serfdom automatically', 'It made Russia the strongest industrial power in Europe'], correct: 'It exposed Russia’s military, transport and administrative weaknesses' },
  { id: 'reform-from-above', question: 'What does reform from above mean?', options: ['Change introduced by the ruler to prevent greater pressure from below', 'Revolution led by peasants', 'Foreign control of Russia', 'Complete democracy'], correct: 'Change introduced by the ruler to prevent greater pressure from below' },
  { id: 'serfdom-economic-problem', question: 'Why did serfdom limit economic modernisation?', options: ['It restricted labour mobility and productivity', 'It created a modern workforce', 'It made railways unnecessary', 'It gave peasants full political rights'], correct: 'It restricted labour mobility and productivity' },
  { id: 'serfdom-political-problem', question: 'Why was serfdom politically dangerous?', options: ['It caused resentment and risked peasant unrest', 'It made all peasants loyal liberals', 'It removed the power of landowners', 'It guaranteed stable democracy'], correct: 'It caused resentment and risked peasant unrest' },
  { id: 'economic-backwardness', question: 'Which feature showed Russia’s economic backwardness in the 1850s?', options: ['Limited industry and railways', 'Universal education', 'A fully mechanised agriculture sector', 'A large elected parliament'], correct: 'Limited industry and railways' },
  { id: 'military-weakness', question: 'Why was military weakness especially serious for Russia?', options: ['It threatened Russia’s great-power status', 'It made reform unnecessary', 'It meant Russia had no army', 'It allowed the Duma to command the army'], correct: 'It threatened Russia’s great-power status' },
  { id: 'transport-weakness', question: 'Why did poor transport matter?', options: ['It made moving troops, goods and orders difficult', 'It ended peasant poverty', 'It made censorship impossible', 'It created universal suffrage'], correct: 'It made moving troops, goods and orders difficult' },
  { id: 'alexander-ii-aim', question: 'What was Alexander II’s main aim in reforming Russia?', options: ['To strengthen and preserve the Tsarist state', 'To abolish autocracy immediately', 'To create Bolshevik rule', 'To end the monarchy'], correct: 'To strengthen and preserve the Tsarist state' },
  { id: 'not-democracy', question: 'Which statement best describes Alexander II’s reforms?', options: ['They modernised parts of Russia but did not create democracy', 'They gave full power to the Duma', 'They ended Tsarist authority', 'They stopped all opposition permanently'], correct: 'They modernised parts of Russia but did not create democracy' },
  { id: 'famous-argument', question: 'What was the meaning of Alexander II’s argument about abolishing serfdom from above?', options: ['The state should reform before unrest forced change from below', 'Peasants should immediately rule Russia', 'Landowners should become Tsars', 'Russia should copy Britain completely'], correct: 'The state should reform before unrest forced change from below' },
  { id: 'great-power-status', question: 'What did defeat in Crimea damage?', options: ['Russia’s prestige as a great power', 'The authority of the Bolshevik Party', 'The power of the Soviet Union', 'The New Economic Policy'], correct: 'Russia’s prestige as a great power' },
  { id: 'best-causal-chain', question: 'Which chain best explains the pressure for reform?', options: ['Crimean defeat → exposed weakness → need to modernise → reform from above', 'Duma elections → collectivisation → Civil War → emancipation', 'October Revolution → serfdom → Crimean victory → reform', 'NEP → Stalin → 1905 → Alexander II'], correct: 'Crimean defeat → exposed weakness → need to modernise → reform from above' },
  { id: 'judgement', question: 'Which judgement best fits Alexander II’s motives?', options: ['He reformed to strengthen autocracy, not to abandon it', 'He wanted immediate democracy', 'He was forced by the Bolsheviks', 'He opposed all change after 1855'], correct: 'He reformed to strengthen autocracy, not to abandon it' },
];

export const pathwayAlexanderIIReformFlashcards = [
  { id: 'alexander-ii', front: 'Alexander II', back: 'Tsar from 1855 to 1881. He introduced major reforms, but aimed to strengthen Tsarist rule rather than create democracy.' },
  { id: '1855', front: '1855', back: 'Year Alexander II became Tsar during the Crimean War. He inherited a state under pressure.' },
  { id: 'crimean-war', front: 'Crimean War', back: '1853–56 conflict in which Russia was defeated by Britain, France and the Ottoman Empire, exposing Russian weakness.' },
  { id: 'crimean-significance', front: 'Significance of the Crimean War', back: 'It exposed weaknesses in the army, transport, industry and administration, making reform appear urgent.' },
  { id: 'reform-from-above', front: 'Reform from above', back: 'Change introduced by the ruler to prevent more dangerous pressure or revolution from below.' },
  { id: 'autocracy', front: 'Autocracy', back: 'A system where the Tsar held supreme power. Alexander II’s reforms did not abolish autocracy.' },
  { id: 'serfdom', front: 'Serfdom', back: 'System tying peasants to landowners. It limited freedom, productivity and labour mobility.' },
  { id: 'labour-mobility', front: 'Labour mobility', back: 'The ability of workers to move where work is needed. Serfdom restricted this and slowed economic development.' },
  { id: 'economic-backwardness', front: 'Economic backwardness', back: 'Russia remained heavily agricultural, with limited industry and railways compared with western Europe.' },
  { id: 'railway-weakness', front: 'Railway weakness', back: 'Russia’s limited railway network made it hard to move troops, supplies, goods and information across the empire.' },
  { id: 'military-weakness', front: 'Military weakness', back: 'Russia’s large army was poorly organised and supplied, which became obvious during the Crimean War.' },
  { id: 'great-power-status', front: 'Great-power status', back: 'Russia wanted to remain a major European power, but defeat in Crimea showed it was falling behind.' },
  { id: 'peasant-unrest', front: 'Peasant unrest', back: 'A repeated fear for the Tsarist regime. Reform was partly intended to reduce the risk of revolt.' },
  { id: 'from-below', front: 'Revolution from below', back: 'Uncontrolled change forced by popular unrest. Alexander II wanted to avoid this by reforming from above.' },
  { id: 'modernisation', front: 'Modernisation', back: 'Updating the state, economy, army and administration so Russia could compete more effectively.' },
  { id: 'preserve-autocracy', front: 'Reform to preserve autocracy', back: 'Key judgement: Alexander II reformed because he believed change was necessary to protect the Tsarist system.' },
  { id: 'reform-risk', front: 'Why reform was risky', back: 'Reform could raise expectations and encourage people to demand further political change.' },
  { id: 'overall-judgement', front: 'Overall judgement', back: 'Alexander II was a reforming Tsar, but a cautious one: he modernised to strengthen the state, not to share power.' },
];

export const pathwayAlexanderIIReformPeelContent = {
  question: 'Explain why the Crimean War encouraged Alexander II to reform Russia.',
  stretchQuestion: '“The Crimean War was the main reason Alexander II reformed Russia.” Assess the validity of this view in one paragraph.',
  scaffold: [
    'Point: make a clear causal claim about why the Crimean War encouraged reform.',
    'Evidence: use precise evidence such as defeat in 1853–56, weak transport, military backwardness or damaged great-power status.',
    'Explain: show how this made reform necessary for strengthening the Tsarist state.',
    'Limit/counter: explain that other pressures, especially serfdom and fear of unrest, also made reform urgent.',
    'Link judgement: decide whether the Crimean War was the main trigger or one part of a wider reform crisis.',
  ],
};

export const pathwayAlexanderIIReformConfidenceContent = {
  prompt: 'How confident are you explaining why Alexander II believed Russia needed reform?',
  leastSecureOptions: ['Crimean War defeat', 'Military weakness', 'Economic backwardness', 'Serfdom', 'Fear of unrest', 'Reform from above'],
  scale: [
    { value: 1, label: 'I need to revisit most of this.' },
    { value: 2, label: 'I understand some reasons but cannot link them clearly.' },
    { value: 3, label: 'I can explain the main reasons with some evidence.' },
    { value: 4, label: 'I can explain and link the causes of reform securely.' },
    { value: 5, label: 'I can make a judgement about the main reason reform was needed.' },
  ],
};
