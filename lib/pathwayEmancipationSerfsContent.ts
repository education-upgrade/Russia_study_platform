export const emancipationSerfsLessonTitle = 'How far did emancipation improve the lives of Russian peasants?';
export const emancipationSerfsPathwaySlug = 'emancipation-serfs';

export const pathwayEmancipationSerfsLessonSections = [
  {
    heading: 'The enquiry',
    body: 'The Emancipation Edict of 1861 was one of the most important reforms in nineteenth-century Russia. It ended the legal ownership of serfs by landowners, but it did not create full social or economic freedom. Peasants gained personal freedom, yet many remained trapped by land shortages, redemption payments and control by the village commune.',
    question: 'In one sentence, explain why emancipation was both a major reform and a limited reform.',
    taskType: 'judgement'
  },
  {
    heading: 'What was serfdom?',
    body: 'Before 1861, millions of Russian peasants were serfs. They were tied to estates, owed labour or payments to landowners, and had limited freedom of movement. Serfdom was a social, economic and political problem because it kept peasants dependent, reduced productivity and created resentment.',
    question: 'Why was serfdom a problem for both peasants and the Tsarist state?',
    taskType: 'explain'
  },
  {
    heading: 'The Emancipation Edict, 1861',
    body: 'The Edict gave serfs personal freedom. They could marry without landowner permission, own property, trade and bring cases to court. This was a major legal change because peasants were no longer the property of landowners.',
    question: 'Identify two freedoms gained by former serfs after 1861.',
    taskType: 'recall'
  },
  {
    heading: 'Land and redemption payments',
    body: 'Emancipation did not simply give peasants free land. Peasants usually received allotments, but these were often smaller or poorer than the land they had used before. The state compensated landowners, and peasants repaid the state through redemption payments over many years.',
    question: 'How did redemption payments limit the benefits of emancipation?',
    taskType: 'explain'
  },
  {
    heading: 'The mir and village control',
    body: 'The village commune, or mir, controlled land redistribution and helped collect payments. This gave peasants some local collective organisation, but it also restricted individual freedom. The mir could limit movement and discourage innovation because land could be periodically redistributed.',
    question: 'Why did the mir limit the freedom of former serfs?',
    taskType: 'explain'
  },
  {
    heading: 'Impact on landowners and the state',
    body: 'Landowners received compensation, but many lost labour control and struggled to adapt. The state hoped emancipation would modernise Russia, improve productivity and reduce unrest. However, because the settlement disappointed many peasants, it did not remove rural tension.',
    question: 'Why did emancipation not fully solve the problem of rural unrest?',
    taskType: 'explain'
  },
  {
    heading: 'Overall judgement',
    body: 'Emancipation was a turning point because it ended the legal basis of serfdom and changed the relationship between peasants, landowners and the state. However, peasants often remained poor, indebted and controlled by the mir. The reform improved legal status more than living standards.',
    question: 'How far did emancipation improve the lives of Russian peasants? Give a brief judgement.',
    taskType: 'judgement'
  }
];

export const pathwayEmancipationSerfsTimeline = {
  events: [
    { id: '1856-speech', date: '1856', title: 'Reform from above', detail: 'Alexander II warned that it was better to abolish serfdom from above than wait for it to end through revolt from below.' },
    { id: '1857-secret-committee', date: '1857', title: 'Secret Committee formed', detail: 'The government began formal planning for emancipation while trying to protect noble interests.' },
    { id: '1858-rescripts', date: '1858', title: 'Provincial committees established', detail: 'Noble committees were asked to consider how emancipation might work in practice.' },
    { id: '1861-edict', date: '1861', title: 'Emancipation Edict issued', detail: 'Serfs gained personal legal freedom, though the land settlement remained restrictive.' },
    { id: '1861-temporary-obligation', date: '1861', title: 'Temporary obligation begins', detail: 'Many peasants continued labour or payment duties until land settlements were finalised.' },
    { id: '1863-state-peasants', date: '1863', title: 'Further emancipation measures', detail: 'State peasants gained improved legal arrangements after the original Edict.' },
    { id: '1881-temporary-obligation-ended', date: '1881', title: 'Temporary obligation ended', detail: 'Remaining former serfs were required to enter redemption arrangements.' },
    { id: '1907-redemption-ended', date: '1907', title: 'Redemption payments abolished', detail: 'The state finally ended the long-term payments imposed after emancipation.' }
  ]
};

export const pathwayEmancipationSerfsFlashcards = [
  { id: 'edict', front: 'Emancipation Edict', back: 'The 1861 reform that ended the legal ownership of serfs by landowners.' },
  { id: 'serfs', front: 'Serfs', back: 'Peasants tied to landowners and estates before 1861, with limited freedom and legal rights.' },
  { id: '1861', front: '1861', back: 'Year of the Emancipation Edict.' },
  { id: 'personal-freedom', front: 'Personal freedom', back: 'Former serfs could marry, trade, own property and use courts without landowner permission.' },
  { id: 'redemption', front: 'Redemption payments', back: 'Long-term payments made by peasants to the state for the land settlement.' },
  { id: 'allotments', front: 'Land allotments', back: 'Land assigned to peasants after emancipation; often too small or poor quality.' },
  { id: 'mir', front: 'Mir', back: 'The village commune that redistributed land, collected payments and restricted movement.' },
  { id: 'temporary-obligation', front: 'Temporary obligation', back: 'Period when peasants still owed labour or payments before redemption arrangements were settled.' },
  { id: 'landowners', front: 'Impact on landowners', back: 'Landowners received compensation but lost direct legal control over serf labour.' },
  { id: 'legal-change', front: 'Legal significance', back: 'Emancipation ended the legal basis of serfdom for millions of peasants.' },
  { id: 'economic-limits', front: 'Economic limitations', back: 'Debt, poor allotments and village obligations restricted improvements in living standards.' },
  { id: 'judgement', front: 'Best judgement', back: 'Emancipation was a major legal reform but a limited economic improvement for many peasants.' }
];

export const pathwayEmancipationSerfsQuizQuestions = [
  { id: 'date', question: 'When was the Emancipation Edict issued?', options: ['1856', '1858', '1861', '1864'], correct: '1861' },
  { id: 'legal-change', question: 'What was the main legal effect of emancipation?', options: ['Landowners gained stronger legal powers', 'Former serfs gained personal freedom', 'Peasants gained votes in national elections', 'The mir was immediately abolished'], correct: 'Former serfs gained personal freedom' },
  { id: 'rights', question: 'Which right did former serfs gain after 1861?', options: ['Freedom from all taxation', 'Automatic ownership of noble estates', 'The right to own property', 'The right to elect the Tsar'], correct: 'The right to own property' },
  { id: 'redemption', question: 'What were redemption payments?', options: ['Payments funding noble military service', 'Payments repaying the state for land', 'Payments supporting local zemstva', 'Payments ending temporary obligation'], correct: 'Payments repaying the state for land' },
  { id: 'allotments', question: 'Why did land allotments disappoint many peasants?', options: ['They were often too small or poor', 'They were controlled by urban workers', 'They removed all village obligations', 'They transferred power to the zemstva'], correct: 'They were often too small or poor' },
  { id: 'mir', question: 'How could the mir restrict former serfs?', options: ['It controlled movement and redistributed land', 'It controlled national laws and taxation', 'It appointed ministers and army officers', 'It owned all noble estates directly'], correct: 'It controlled movement and redistributed land' },
  { id: 'temporary', question: 'What did temporary obligation mean?', options: ['Peasants still owed duties before settlement', 'Landowners lost all compensation rights', 'The state cancelled redemption payments', 'Peasants gained immediate freehold land'], correct: 'Peasants still owed duties before settlement' },
  { id: 'landowners', question: 'How did the settlement protect landowners?', options: ['They kept permanent ownership of serfs', 'They received compensation from the state', 'They gained control of provincial zemstva', 'They avoided all future taxation'], correct: 'They received compensation from the state' },
  { id: 'state-aim', question: 'Why did the state support emancipation?', options: ['To preserve serfdom under new rules', 'To modernise Russia and reduce unrest', 'To introduce parliamentary government', 'To remove the nobility from society'], correct: 'To modernise Russia and reduce unrest' },
  { id: 'judgement', question: 'Which judgement best evaluates emancipation?', options: ['It changed legal status more than living standards', 'It removed all rural poverty and unrest', 'It transferred political power to peasants', 'It ended autocracy through social reform'], correct: 'It changed legal status more than living standards' }
];

export const pathwayEmancipationSerfsJudgement = {
  question: 'Rank the consequences of emancipation for Russian peasants. Which consequence mattered most?',
  factors: [
    { id: 'legal-freedom', title: 'Personal legal freedom', detail: 'Former serfs could marry, trade, own property and use courts without landowner permission.' },
    { id: 'land', title: 'Land allotments', detail: 'Peasants gained access to land, but allotments were often inadequate or poor quality.' },
    { id: 'redemption', title: 'Redemption payments', detail: 'Long-term payments created debt and reduced the economic value of freedom.' },
    { id: 'mir', title: 'Control by the mir', detail: 'The commune organised village life but restricted movement and individual independence.' },
    { id: 'unrest', title: 'Continued rural unrest', detail: 'Disappointment with the settlement meant emancipation did not remove peasant resentment.' },
    { id: 'state', title: 'Stronger state control', detail: 'The reform modernised legal relations while preserving autocracy and administrative oversight.' }
  ]
};

export const pathwayEmancipationSerfsAO3 = {
  question: 'Which interpretation is most convincing about the significance of emancipation?',
  interpretations: [
    { historian: 'View A', argument: 'Emancipation was a major turning point because it ended the legal ownership of millions of serfs.' },
    { historian: 'View B', argument: 'Emancipation was limited because redemption payments and poor allotments prevented real economic freedom.' },
    { historian: 'View C', argument: 'Emancipation mainly strengthened the state by modernising Russia without weakening autocracy.' }
  ]
};

export const pathwayEmancipationSerfsPeelContent = {
  question: 'Explain one way in which emancipation improved the lives of Russian peasants.',
  stretchQuestion: '“Emancipation improved the legal position of peasants more than their living standards.” Assess the validity of this view in one paragraph.',
  scaffold: [
    'Point: identify one clear improvement or limitation.',
    'Evidence: use precise evidence such as personal freedom, redemption payments, the mir or land allotments.',
    'Explain: show how this changed or failed to change peasant lives.',
    'Counter: test your point by considering what remained limited after 1861.',
    'Judgement: decide whether emancipation was more significant legally, socially or economically.'
  ]
};

export const pathwayEmancipationSerfsConfidenceContent = {
  prompt: 'How confident are you explaining the impact of emancipation on Russian peasants?',
  leastSecureOptions: ['Personal freedom', 'Redemption payments', 'Land allotments', 'The mir', 'Impact on landowners', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5]
};

export const pathwayEmancipationSerfsFallbacks: Record<string, any> = {
  lesson_content: { sections: pathwayEmancipationSerfsLessonSections },
  timeline: pathwayEmancipationSerfsTimeline,
  flashcards: { cards: pathwayEmancipationSerfsFlashcards },
  quiz: { questions: pathwayEmancipationSerfsQuizQuestions },
  judgement_ranking: pathwayEmancipationSerfsJudgement,
  ao3_interpretation: pathwayEmancipationSerfsAO3,
  peel_response: pathwayEmancipationSerfsPeelContent,
  confidence_exit_ticket: pathwayEmancipationSerfsConfidenceContent,
};
