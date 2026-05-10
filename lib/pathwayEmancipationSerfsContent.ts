export const emancipationSerfsLessonTitle = 'How far did emancipation improve the lives of Russian peasants?';
export const emancipationSerfsPathwaySlug = 'emancipation-serfs';

export const pathwayEmancipationSerfsLessonSections = [
  {
    heading: 'The enquiry',
    body: 'The Emancipation Edict of 1861 was one of the most important reforms in nineteenth-century Russia. It ended the legal ownership of serfs by landowners, but it did not create full social or economic freedom. Peasants gained personal freedom, yet many remained trapped by land shortages, redemption payments and control by the village commune.',
    question: 'In one sentence, explain why emancipation was both a major reform and a limited reform.',
    taskType: 'judgement',
    visual: {
      type: 'judgementScale',
      title: 'How far did emancipation improve peasant lives?',
      leftLabel: 'Limited change',
      rightLabel: 'Major improvement',
      markerLabel: 'Mixed impact',
      markerPosition: 55,
      prompt: 'Best judgement: emancipation was legally significant, but economically and socially limited for many peasants.',
    },
  },
  {
    heading: 'What was serfdom?',
    body: 'Before 1861, millions of Russian peasants were serfs. They were tied to estates, owed labour or payments to landowners, and had limited freedom of movement. Serfdom was a social, economic and political problem because it kept peasants dependent, reduced productivity and created resentment.',
    question: 'Why was serfdom a problem for both peasants and the Tsarist state?',
    taskType: 'explain',
    visual: {
      type: 'conceptMap',
      title: 'Why serfdom mattered',
      centre: 'Serfdom before 1861',
      branches: [
        { label: 'Social control', note: 'Peasants were tied to estates and landowners.' },
        { label: 'Economic weakness', note: 'Labour was inefficient and mobility was limited.' },
        { label: 'Political danger', note: 'Peasant resentment risked unrest from below.' },
      ],
    },
  },
  {
    heading: 'The Emancipation Edict, 1861',
    body: 'The Emancipation Edict gave serfs personal freedom. They could marry without landowner permission, own property, trade, and bring cases to court. This was a major legal change because peasants were no longer the property of landowners.',
    question: 'Identify two freedoms gained by former serfs after 1861.',
    taskType: 'recall',
    visual: {
      type: 'comparison',
      title: 'Before and after emancipation',
      leftTitle: 'Before 1861',
      rightTitle: 'After 1861',
      rows: [
        { left: 'Serfs tied to landowners', right: 'Former serfs gained personal legal freedom' },
        { left: 'Limited movement and legal rights', right: 'Could marry, trade, own property and use courts' },
        { left: 'Landowner authority central', right: 'Village commune became more important' },
      ],
    },
  },
  {
    heading: 'Land and redemption payments',
    body: 'Emancipation did not simply give peasants free land. Peasants usually received allotments, but these were often smaller or poorer than the land they had used before. The state compensated landowners, and peasants had to repay the state through redemption payments over many years. This limited the economic benefit of freedom.',
    question: 'How did redemption payments limit the benefits of emancipation?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'How redemption payments worked',
      steps: ['Landowners lost legal control over serfs', 'State compensated landowners', 'Peasants received allotments', 'Peasants repaid the state through redemption payments', 'Peasant poverty and debt continued'],
    },
  },
  {
    heading: 'The mir and village control',
    body: 'The village commune, or mir, controlled land redistribution and helped collect payments. This gave peasants some local collective organisation, but it also restricted individual freedom. The mir could limit movement and discouraged innovation because land could be periodically redistributed.',
    question: 'Why did the mir limit the freedom of former serfs?',
    taskType: 'explain',
  },
  {
    heading: 'Impact on landowners and the state',
    body: 'Landowners received compensation, but many lost labour control and struggled to adapt. The state hoped emancipation would modernise Russia, improve productivity and reduce unrest. However, because the settlement disappointed many peasants, it did not remove rural tension.',
    question: 'Why did emancipation not fully solve the problem of rural unrest?',
    taskType: 'explain',
  },
  {
    heading: 'Overall judgement',
    body: 'Emancipation was a turning point because it ended the legal basis of serfdom and changed the relationship between peasants, landowners and the state. However, it was limited because peasants often remained poor, indebted and controlled by the mir. The reform improved legal status more than living standards.',
    question: 'How far did emancipation improve the lives of Russian peasants? Give a brief judgement.',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Success or limitation?',
      leftTitle: 'Evidence of improvement',
      rightTitle: 'Evidence of limitation',
      rows: [
        { left: 'Personal freedom from landowners', right: 'Redemption payments created long-term debt' },
        { left: 'Right to own property and use courts', right: 'Land allotments were often inadequate' },
        { left: 'Major legal break with serfdom', right: 'Mir continued to restrict peasant independence' },
      ],
    },
  },
];

export const pathwayEmancipationSerfsQuizQuestions = [
  { id: 'edict-date', question: 'When was the Emancipation Edict issued?', options: ['1855', '1861', '1881', '1905'], correct: '1861' },
  { id: 'edict-main-change', question: 'What was the main legal change created by emancipation?', options: ['Serfs gained personal freedom', 'The Duma was created', 'The Tsar abdicated', 'Collectivisation began'], correct: 'Serfs gained personal freedom' },
  { id: 'serfdom-definition', question: 'What was serfdom?', options: ['A system tying peasants to landowners and estates', 'A workers’ council', 'A secret police force', 'An elected parliament'], correct: 'A system tying peasants to landowners and estates' },
  { id: 'personal-freedom', question: 'Which right did former serfs gain after emancipation?', options: ['The right to own property', 'The right to elect the Tsar', 'The right to abolish taxes', 'The right to avoid all payments'], correct: 'The right to own property' },
  { id: 'redemption-payments', question: 'What were redemption payments?', options: ['Payments peasants made to repay the state for land compensation', 'Wages paid by factories', 'Taxes paid by nobles only', 'Money paid to soldiers after war'], correct: 'Payments peasants made to repay the state for land compensation' },
  { id: 'land-problem', question: 'Why were peasant land allotments often a problem?', options: ['They were often too small or poor quality', 'They gave peasants too much political power', 'They abolished all rural poverty', 'They removed the mir immediately'], correct: 'They were often too small or poor quality' },
  { id: 'mir', question: 'What was the mir?', options: ['The village commune', 'The secret police', 'The Tsar’s palace', 'The national parliament'], correct: 'The village commune' },
  { id: 'mir-limitation', question: 'How could the mir limit freedom?', options: ['It controlled land redistribution and could restrict movement', 'It made peasants nobles', 'It ended all payments', 'It created full democracy'], correct: 'It controlled land redistribution and could restrict movement' },
  { id: 'state-aim', question: 'Why did the state support emancipation?', options: ['To modernise Russia and reduce the risk of unrest', 'To end autocracy immediately', 'To give power to the Bolsheviks', 'To abandon agriculture completely'], correct: 'To modernise Russia and reduce the risk of unrest' },
  { id: 'legal-vs-economic', question: 'Which judgement best describes emancipation?', options: ['A major legal change but limited economic improvement', 'A complete social revolution', 'A reform with no significance at all', 'The creation of Soviet rule'], correct: 'A major legal change but limited economic improvement' },
  { id: 'landowner-compensation', question: 'Who received compensation after emancipation?', options: ['Landowners', 'Factory workers', 'The Bolsheviks', 'The Duma deputies'], correct: 'Landowners' },
  { id: 'peasant-disappointment', question: 'Why were many peasants disappointed by emancipation?', options: ['They expected more land and fewer financial burdens', 'They wanted serfdom to continue', 'They received full control of the state', 'They were forced into collectivisation'], correct: 'They expected more land and fewer financial burdens' },
  { id: 'continuity', question: 'Which factor shows continuity after emancipation?', options: ['Peasants remained poor and tied to village obligations', 'Landowners disappeared completely', 'Russia became democratic', 'There was no rural control'], correct: 'Peasants remained poor and tied to village obligations' },
  { id: 'change', question: 'Which factor shows change after emancipation?', options: ['Peasants were no longer legally owned by landowners', 'Peasants became industrial workers overnight', 'The Tsar gave up autocracy', 'All land was nationalised'], correct: 'Peasants were no longer legally owned by landowners' },
  { id: 'best-overall', question: 'Which overall judgement is strongest?', options: ['Emancipation improved legal status but left many economic problems unresolved', 'Emancipation solved all peasant grievances', 'Emancipation had no effect on Russia', 'Emancipation ended Tsarism'], correct: 'Emancipation improved legal status but left many economic problems unresolved' },
];

export const pathwayEmancipationSerfsFlashcards = [
  { id: 'emancipation-edict', front: 'Emancipation Edict', back: 'The 1861 reform that ended the legal ownership of serfs by landowners.' },
  { id: 'serfs', front: 'Serfs', back: 'Peasants tied to landowners and estates before 1861, with limited freedom of movement and legal rights.' },
  { id: '1861', front: '1861', back: 'Year of the Emancipation Edict.' },
  { id: 'personal-freedom', front: 'Personal freedom', back: 'Former serfs could marry, trade, own property and use courts without landowner permission.' },
  { id: 'redemption-payments', front: 'Redemption payments', back: 'Payments made by peasants to the state to cover compensation paid to landowners for land.' },
  { id: 'land-allotments', front: 'Land allotments', back: 'Land given to peasants after emancipation; often too small or poor quality to support families properly.' },
  { id: 'mir', front: 'Mir', back: 'The village commune that controlled land redistribution and helped collect payments.' },
  { id: 'mir-limits', front: 'How the mir limited freedom', back: 'It could restrict movement and discouraged individual enterprise because land could be redistributed.' },
  { id: 'landowners', front: 'Impact on landowners', back: 'Landowners received compensation but lost direct control over serf labour.' },
  { id: 'legal-change', front: 'Legal significance', back: 'Emancipation ended the legal basis of serfdom and changed the formal status of millions of peasants.' },
  { id: 'economic-limits', front: 'Economic limits', back: 'Peasants often remained poor because of debt, land shortage and continued village obligations.' },
  { id: 'rural-unrest', front: 'Rural unrest', back: 'Emancipation did not remove peasant resentment because many felt the land settlement was unfair.' },
  { id: 'state-aim', front: 'State aim', back: 'The Tsarist state hoped emancipation would modernise Russia and reduce the risk of revolution from below.' },
  { id: 'turning-point', front: 'Why emancipation was a turning point', back: 'It ended serfdom, changed social relations and became the foundation for later reform.' },
  { id: 'limited-reform', front: 'Why emancipation was limited', back: 'It improved legal status more than living standards; peasants remained indebted and constrained.' },
  { id: 'best-judgement', front: 'Best judgement line', back: 'Emancipation was a major legal reform but a limited social and economic improvement for many peasants.' },
];

export const pathwayEmancipationSerfsPeelContent = {
  question: 'Explain one way in which emancipation improved the lives of Russian peasants.',
  stretchQuestion: '“Emancipation improved the legal position of peasants more than their living standards.” Assess the validity of this view in one paragraph.',
  scaffold: [
    'Point: identify one clear improvement or limitation of emancipation.',
    'Evidence: use precise evidence such as personal freedom, redemption payments, the mir, or land allotments.',
    'Explain: show how this changed or failed to change peasant lives.',
    'Limit/counter: test your point by considering what remained limited after 1861.',
    'Link judgement: decide whether emancipation was more significant legally, socially or economically.',
  ],
};

export const pathwayEmancipationSerfsConfidenceContent = {
  prompt: 'How confident are you explaining the impact of emancipation on Russian peasants?',
  leastSecureOptions: ['Personal freedom', 'Redemption payments', 'Land allotments', 'The mir', 'Impact on landowners', 'Overall judgement'],
  scale: [1, 2, 3, 4, 5],
};
