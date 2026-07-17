export const essaySkillsAlexanderIiPathwaySlug = 'essay-skills-alexander-ii';

export const essaySkillsAlexanderIiLessonSections = [
  {
    heading: 'The enquiry',
    body: 'A strong 25-mark essay does more than list accurate facts. It answers the exact wording of the question, organises evidence into a sustained argument, tests competing explanations and reaches a judgement based on clear criteria. This pathway brings together the completed Alexander II content and focuses on how to turn secure knowledge into a convincing AQA essay.',
    question: 'What is the difference between knowing the topic and answering the question?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'The argument-building process',
      steps: ['Decode the question', 'Choose a line of argument', 'Select precise evidence', 'Test alternatives', 'Reach a supported judgement'],
    },
  },
  {
    heading: 'Decode the wording',
    body: 'Begin by identifying the debate hidden in the question. Phrases such as “how far”, “assess the validity” and “to what extent” require a judgement rather than a narrative. Identify the stated factor, the outcome being measured, the date range and the standard by which success or importance will be judged.',
    question: 'What four things should you identify before planning an essay?',
    taskType: 'explain',
  },
  {
    heading: 'Build a provisional judgement',
    body: 'A provisional judgement gives the essay direction before writing begins. It should answer the question, recognise complexity and establish criteria. For Alexander II, useful criteria might include the extent of institutional change, the preservation of autocratic authority, the impact on different social groups and the durability of reform after 1866.',
    question: 'Why is a provisional judgement more useful than deciding the answer at the end?',
    taskType: 'explain',
    visual: {
      type: 'judgementScale',
      title: 'Example line of argument',
      leftLabel: 'Fundamental transformation',
      rightLabel: 'Reform mainly preserved autocracy',
      markerLabel: 'Genuine modernisation within autocratic limits',
      markerPosition: 68,
      prompt: 'A nuanced judgement can recognise real change while arguing that political sovereignty remained intact.',
    },
  },
  {
    heading: 'Select evidence rather than download knowledge',
    body: 'Evidence earns credit when it is relevant, precise and explained. Strong selection includes dates, terms and consequences: the 1861 Emancipation Edict, redemption payments, temporary obligation, the mir, the 1864 zemstva and judicial reforms, the 1874 military reforms, the reaction after Karakozov in 1866 and the limited Loris-Melikov proposals of 1881. Avoid including facts simply because you remember them.',
    question: 'How can you test whether a fact belongs in a paragraph?',
    taskType: 'explain',
  },
  {
    heading: 'Make paragraphs analytical',
    body: 'Each paragraph should make a claim that advances the overall judgement. Use evidence to prove the claim, explain the mechanism linking evidence to the question, consider a limitation or competing factor and then make an explicit mini-judgement. A paragraph should therefore answer “so what?” and “how important?” rather than merely describe a reform.',
    question: 'Which sentence in a paragraph should show relative importance?',
    taskType: 'explain',
    visual: {
      type: 'flow',
      title: 'A developed analytical paragraph',
      steps: ['Point linked to the question', 'Precise evidence', 'Explanation of impact', 'Counter or limitation', 'Comparative mini-judgement'],
    },
  },
  {
    heading: 'Compare factors directly',
    body: 'High-level essays compare throughout rather than placing one factor in each isolated paragraph. Comparative language makes the argument visible: “more significant because”, “less durable than”, “although”, “whereas” and “ultimately”. For example, emancipation changed the legal status of millions, but the absence of constitutional reform is stronger evidence that Alexander II did not intend to surrender autocracy.',
    question: 'Why is direct comparison stronger than writing separate descriptive sections?',
    taskType: 'explain',
  },
  {
    heading: 'Use counter-argument properly',
    body: 'A counter-argument should not be a token sentence. It should present credible evidence on the other side and then explain why it changes, qualifies or fails to overturn the paragraph judgement. Alexander II’s judicial reforms created genuine legal modernisation, for example, but political cases and later reaction show that legal liberalisation remained conditional when state security was threatened.',
    question: 'What makes a counter-argument meaningful rather than decorative?',
    taskType: 'explain',
  },
  {
    heading: 'Write an introduction with purpose',
    body: 'An effective introduction defines the debate, establishes criteria and gives a clear overall judgement. It should not retell the background or list every paragraph. A strong introduction to an Alexander II question might argue that reform was substantial in administration, law and social relations, but politically limited because no national representative institution controlled ministers or restricted the Tsar.',
    question: 'What three jobs should the introduction perform?',
    taskType: 'explain',
  },
  {
    heading: 'Reach a comparative conclusion',
    body: 'The conclusion should answer the exact question and explain why one interpretation is more convincing. It should compare the weight, reach and durability of the evidence. Avoid simply repeating the introduction. The strongest conclusion may distinguish between modernisation of the state and transformation of the political system.',
    question: 'Which criteria could be used to decide whether Alexander II’s reforms were genuinely transformative?',
    taskType: 'judgement',
  },
  {
    heading: 'Overall exam method',
    body: 'The strongest essays combine precise AO1 with sustained judgement. They remain focused on the stated debate, organise evidence into analytical paragraphs, compare factors and qualify claims where necessary. Knowledge is the foundation, but selection, explanation and judgement determine how effectively that knowledge answers the question.',
    question: 'Which single improvement would most raise the quality of your next essay?',
    taskType: 'judgement',
    visual: {
      type: 'comparison',
      title: 'Descriptive and analytical writing',
      leftTitle: 'Descriptive',
      rightTitle: 'Analytical',
      rows: [
        { left: 'Explains what happened', right: 'Explains why evidence proves the argument' },
        { left: 'Treats factors separately', right: 'Compares relative importance' },
        { left: 'Adds a judgement at the end', right: 'Sustains judgement throughout' },
      ],
    },
  },
];

export const essaySkillsAlexanderIiTimeline = {
  events: [
    { id: '1855', date: '1855', title: 'Alexander II becomes Tsar', detail: 'He inherited military defeat, serfdom and administrative weakness: essential context, but not a substitute for answering the essay question.' },
    { id: '1856', date: '1856', title: 'Reform from above', detail: 'Alexander’s warning about reform from above provides evidence about motive and the preservation of order.' },
    { id: '1861', date: '1861', title: 'Emancipation Edict', detail: 'Use the legal freedom of the serfs alongside redemption payments, allotments, temporary obligation and the mir.' },
    { id: '1863', date: '1863', title: 'University Statute', detail: 'Evidence of liberalisation that can be tested against later restrictions.' },
    { id: '1864-local', date: '1864', title: 'Zemstva established', detail: 'Evidence of local participation, but not national constitutional government.' },
    { id: '1864-law', date: '1864', title: 'Judicial reform', detail: 'Evidence of genuine institutional modernisation and greater equality before the law.' },
    { id: '1866', date: '1866', title: 'Karakozov assassination attempt', detail: 'A useful turning point when judging the conditional nature of reform.' },
    { id: '1870', date: '1870', title: 'Municipal reform', detail: 'Widened local administration while preserving central autocratic authority.' },
    { id: '1874', date: '1874', title: 'Universal military service', detail: 'Modernised the army and strengthened the state after Crimean weakness.' },
    { id: '1879', date: '1879', title: 'People’s Will formed', detail: 'Continued radical opposition can be used to test claims about the success of reform.' },
    { id: '1881-proposals', date: '1881', title: 'Loris-Melikov proposals', detail: 'Limited consultation, not parliamentary sovereignty or ministerial responsibility.' },
    { id: '1881-death', date: '1881', title: 'Alexander II assassinated', detail: 'A conclusion should distinguish failure to satisfy opposition from failure to modernise institutions.' },
  ],
};

export const essaySkillsAlexanderIiFlashcards = [
  { id: 'command', front: 'Assess the validity', back: 'Test the stated view against supporting and challenging evidence before reaching a reasoned judgement.' },
  { id: 'criteria', front: 'Criteria', back: 'The standards used to make a judgement, such as reach, durability, political impact or effect on different groups.' },
  { id: 'line-argument', front: 'Line of argument', back: 'The central answer sustained from the introduction through each paragraph to the conclusion.' },
  { id: 'ao1', front: 'Precise AO1', back: 'Accurate and relevant knowledge selected to prove an argument rather than simply demonstrate recall.' },
  { id: 'analysis', front: 'Analysis', back: 'Explanation of how and why evidence supports, qualifies or challenges the judgement.' },
  { id: 'comparison', front: 'Direct comparison', back: 'Explicitly weighing one factor or interpretation against another using a common criterion.' },
  { id: 'counter', front: 'Counter-argument', back: 'Credible evidence that challenges or qualifies the claim before a reasoned response is given.' },
  { id: 'mini-judgement', front: 'Mini-judgement', back: 'A sentence deciding the significance of the paragraph’s factor relative to the question and alternatives.' },
  { id: 'introduction', front: 'Effective introduction', back: 'Defines the debate, establishes criteria and states a clear overall judgement.' },
  { id: 'conclusion', front: 'Effective conclusion', back: 'Compares the weight of evidence and explains why the final judgement is most convincing.' },
  { id: 'emancipation-evidence', front: 'Emancipation evidence', back: 'Personal freedom in 1861 versus redemption payments, inadequate allotments, temporary obligation and the mir.' },
  { id: 'local-evidence', front: 'Local-government evidence', back: 'Zemstva and municipal dumas widened participation locally but did not create a national parliament.' },
  { id: 'judicial-evidence', front: 'Judicial evidence', back: 'Open trials, trained judges, juries and greater equality before the law from 1864.' },
  { id: 'military-evidence', front: 'Military evidence', back: 'Milyutin’s reforms and universal service in 1874 strengthened state capacity.' },
  { id: 'reaction-evidence', front: 'Reaction after 1866', back: 'Tighter censorship and university controls show reform was conditional on political security.' },
  { id: 'constitution-evidence', front: 'Constitutional limitation', back: 'Alexander II never created a national representative body able to control ministers or limit sovereignty.' },
];

export const essaySkillsAlexanderIiQuiz = [
  { id: 'q1', question: 'What should be identified first in a 25-mark question?', options: ['The exact debate and command wording', 'Every date remembered from the topic', 'The longest possible introduction', 'A quotation from a historian'], correct: 'The exact debate and command wording' },
  { id: 'q2', question: 'Which is the strongest provisional judgement?', options: ['Alexander II reformed many things', 'The reforms were good and bad', 'Reform modernised major institutions but left supreme political authority autocratic', 'There were several reforms between 1861 and 1874'], correct: 'Reform modernised major institutions but left supreme political authority autocratic' },
  { id: 'q3', question: 'Which evidence most directly tests whether emancipation created full peasant independence?', options: ['Redemption payments and the mir', 'The Crimean battlefield at Sevastopol', 'The creation of People’s Will', 'The Loris-Melikov commissions'], correct: 'Redemption payments and the mir' },
  { id: 'q4', question: 'Why should evidence be selected rather than downloaded?', options: ['Only evidence relevant to the argument earns analytical value', 'Examiners award marks for the greatest number of facts', 'Dates should never be included', 'All paragraphs should use the same example'], correct: 'Only evidence relevant to the argument earns analytical value' },
  { id: 'q5', question: 'Which sentence is analytical?', options: ['The zemstva were created in 1864', 'The zemstva dealt with roads and schools', 'The zemstva widened local participation but did not limit central autocracy', 'There were zemstva in many provinces'], correct: 'The zemstva widened local participation but did not limit central autocracy' },
  { id: 'q6', question: 'What is the purpose of a mini-judgement?', options: ['To weigh the paragraph’s evidence against the question and alternatives', 'To introduce an unrelated fact', 'To repeat the paragraph opening', 'To avoid making an overall judgement'], correct: 'To weigh the paragraph’s evidence against the question and alternatives' },
  { id: 'q7', question: 'Which phrase makes direct comparison most clearly?', options: ['More significant because', 'Another thing was', 'It is also true that', 'In 1864'], correct: 'More significant because' },
  { id: 'q8', question: 'What makes a counter-argument effective?', options: ['It presents credible contrary evidence and then evaluates its weight', 'It simply begins with however', 'It contradicts the introduction completely', 'It adds a new factor without explanation'], correct: 'It presents credible contrary evidence and then evaluates its weight' },
  { id: 'q9', question: 'Which evidence most strongly supports political continuity?', options: ['No national parliament controlled ministers or limited the Tsar', 'Open trials were introduced', 'Military service was shortened', 'Universities gained autonomy in 1863'], correct: 'No national parliament controlled ministers or limited the Tsar' },
  { id: 'q10', question: 'Why is 1866 useful in an essay?', options: ['It reveals that liberalisation was restricted when security was threatened', 'It marks the legal end of serfdom', 'It created the zemstva', 'It introduced universal military service'], correct: 'It reveals that liberalisation was restricted when security was threatened' },
  { id: 'q11', question: 'What should an introduction avoid?', options: ['Narrating the whole reign before stating an argument', 'Defining the debate', 'Establishing criteria', 'Giving an overall judgement'], correct: 'Narrating the whole reign before stating an argument' },
  { id: 'q12', question: 'What should a conclusion do beyond repeating the introduction?', options: ['Compare the weight and durability of the evidence', 'Introduce several new undeveloped facts', 'Remove all qualifications', 'List the paragraph topics'], correct: 'Compare the weight and durability of the evidence' },
  { id: 'q13', question: 'Which criterion best tests whether reform was transformative?', options: ['Whether change altered political sovereignty as well as institutions', 'Whether every reform occurred in the same year', 'Whether Alexander II used the word reform', 'Whether the reforms were popular with all groups'], correct: 'Whether change altered political sovereignty as well as institutions' },
  { id: 'q14', question: 'Which paragraph plan is strongest?', options: ['Claim, precise evidence, explanation, counter, comparative judgement', 'Background, narrative, extra date, summary', 'Three facts followed by a rhetorical question', 'Introduction, conclusion and no analysis'], correct: 'Claim, precise evidence, explanation, counter, comparative judgement' },
  { id: 'q15', question: 'Which overall method produces the strongest essay?', options: ['Sustained argument supported by selected evidence and comparison', 'Maximum factual coverage without prioritisation', 'A judgement added only in the final sentence', 'Separate descriptions of each reform'], correct: 'Sustained argument supported by selected evidence and comparison' },
];

export const essaySkillsAlexanderIiJudgement = {
  question: 'Rank these features from most to least important in producing a high-level 25-mark essay. Justify the top three and explain why the lowest-ranked feature is insufficient on its own.',
  factors: [
    { id: 'focus', title: 'Precise focus on the wording', detail: 'Every paragraph addresses the stated debate, outcome and date range.' },
    { id: 'argument', title: 'Sustained line of argument', detail: 'The judgement directs the introduction, paragraph choices and conclusion.' },
    { id: 'evidence', title: 'Relevant and precise AO1', detail: 'Dates, terms and consequences are selected because they prove the argument.' },
    { id: 'analysis', title: 'Explanation of significance', detail: 'The essay explains how and why evidence affects the judgement.' },
    { id: 'comparison', title: 'Direct comparison', detail: 'Factors are weighed using shared criteria rather than treated separately.' },
    { id: 'counter', title: 'Developed counter-argument', detail: 'Credible contrary evidence is considered and evaluated.' },
    { id: 'structure', title: 'Clear paragraph structure', detail: 'Each paragraph moves logically from claim to evidence, explanation and judgement.' },
    { id: 'coverage', title: 'Large quantity of factual knowledge', detail: 'Breadth is useful only when the facts remain relevant and analytical.' },
  ],
};

export const essaySkillsAlexanderIiAO3 = {
  question: 'Which interpretation offers the most useful starting point for an essay on the purpose and impact of Alexander II’s reforms? Test each view using precise contextual knowledge.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Alexander II should be understood primarily as a liberating moderniser whose reforms broke decisively with the structures inherited from Nicholas I.' },
    { historian: 'Interpretation B', argument: 'Alexander II’s reforms were defensive measures intended to strengthen the state and preserve Romanov autocracy after the weaknesses exposed by the Crimean War.' },
    { historian: 'Interpretation C', argument: 'The reign combined genuine institutional modernisation with political caution; the depth of change varied by reform and narrowed when security appeared threatened.' },
  ],
};

export const essaySkillsAlexanderIiPeel = {
  question: 'Write one developed paragraph answering: “Alexander II’s reforms did more to strengthen than weaken autocracy.” Assess the validity of this view.',
  stretchQuestion: 'Plan and write a concise introduction, two comparative paragraphs and a conclusion for the full 25-mark question.',
  scaffold: [
    'Point: make a direct comparative claim linked to the wording of the question.',
    'Evidence: select at least two precise pieces of AO1, such as emancipation terms, zemstva limits, judicial reform, military reform, reaction after 1866 or the absence of constitutional government.',
    'Explain: show how the evidence strengthened or weakened autocratic authority.',
    'Counter: develop credible evidence on the other side of the argument.',
    'Compare: explain which evidence carries greater weight using reach, durability or political significance.',
    'Judgement: end with an explicit mini-judgement that advances the overall answer.',
  ],
};

export const essaySkillsAlexanderIiConfidence = {
  prompt: 'How confident are you turning your Alexander II knowledge into a focused and balanced 25-mark argument?',
  leastSecureOptions: ['Decoding the question', 'Creating criteria', 'Writing a provisional judgement', 'Selecting precise AO1', 'Explaining significance', 'Direct comparison', 'Counter-argument', 'Introductions', 'Conclusions', 'Managing the full essay'],
  scale: [1, 2, 3, 4, 5],
};

export const essaySkillsAlexanderIiFallbacks: Record<string, any> = {
  lesson_content: { sections: essaySkillsAlexanderIiLessonSections },
  timeline: essaySkillsAlexanderIiTimeline,
  flashcards: { cards: essaySkillsAlexanderIiFlashcards },
  quiz: { questions: essaySkillsAlexanderIiQuiz },
  judgement_ranking: essaySkillsAlexanderIiJudgement,
  ao3_interpretation: essaySkillsAlexanderIiAO3,
  peel_response: essaySkillsAlexanderIiPeel,
  confidence_exit_ticket: essaySkillsAlexanderIiConfidence,
};
