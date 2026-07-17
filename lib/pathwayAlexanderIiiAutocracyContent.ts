export const alexanderIiiAutocracyPathwaySlug = 'alexander-iii-autocracy';

export const alexanderIiiAutocracyLessonSections = [
  {
    heading: 'The enquiry',
    body: 'Alexander III came to the throne in March 1881 after the assassination of Alexander II. His reign is often described as a period of reaction, but the key issue is whether his policies merely reversed reform or more effectively strengthened autocratic rule. This pathway examines his beliefs, advisers, early decisions and the political consequences of his approach.',
    question: 'What criteria could be used to judge whether Alexander III strengthened autocracy?',
    taskType: 'judgement',
    visual: {
      type: 'flow',
      title: 'From assassination to reaction',
      steps: ['Alexander II assassinated', 'Fear of revolutionary instability', 'Constitutional proposals rejected', 'Autocracy reaffirmed', 'Central control strengthened'],
    },
  },
  {
    heading: 'Alexander III’s personality and beliefs',
    body: 'Alexander III was physically imposing, personally conservative and deeply committed to the principle of hereditary autocracy. He distrusted liberalism, representative government and the idea that reform should weaken the authority of the Tsar. Unlike his father, he had little interest in balancing reform with consultation and believed that firm rule was essential to preserve order.',
    question: 'How did Alexander III’s beliefs shape the direction of his reign?',
    taskType: 'explain',
  },
  {
    heading: 'The impact of assassination',
    body: 'The assassination of Alexander II convinced Alexander III that reform had encouraged rather than reduced opposition. The fact that People’s Will killed a Tsar who had emancipated the serfs and introduced major reforms appeared to prove that concessions invited further demands. This strengthened the case for repression and made political liberalisation seem dangerous.',
    question: 'Why did the assassination of Alexander II reinforce conservative attitudes?',
    taskType: 'explain',
  },
  {
    heading: 'Rejecting Loris-Melikov',
    body: 'Before his death, Alexander II had approved Loris-Melikov’s proposal for limited elected participation in advisory commissions. The proposal did not create a parliament or restrict the Tsar’s sovereignty, but Alexander III rejected it. This decision was symbolically important because it closed even a cautious route towards consultation at the centre of government.',
    question: 'Why was the rejection of the Loris-Melikov proposals politically significant?',
    taskType: 'explain',
  },
  {
    heading: 'The Manifesto of Unshakeable Autocracy',
    body: 'In April 1881 Alexander III issued the Manifesto of Unshakeable Autocracy. It declared his intention to maintain the power and authority of autocratic rule. The manifesto signalled that constitutional change would not follow the assassination and that the state would defend traditional authority rather than compromise with liberal pressure.',
    question: 'What message did the manifesto send to supporters and opponents of the regime?',
    taskType: 'explain',
    visual: {
      type: 'judgementScale',
      title: 'Meaning of the 1881 manifesto',
      leftLabel: 'Temporary response to crisis',
      rightLabel: 'Clear ideological commitment to reaction',
      markerLabel: 'A deliberate rejection of constitutional development',
      markerPosition: 78,
      prompt: 'The manifesto mattered because it set the political direction of the reign, even before later counter-reforms were introduced.',
    },
  },
  {
    heading: 'Pobedonostsev’s influence',
    body: 'Konstantin Pobedonostsev, tutor to Alexander III and later Procurator of the Holy Synod, was one of the most influential conservative thinkers of the reign. He regarded democracy, a free press and representative institutions as dangerous illusions. He supported autocracy, Orthodoxy and a strong state, helping to provide an ideological justification for repression and resistance to liberal reform.',
    question: 'How far was Pobedonostsev influential rather than simply reflecting Alexander III’s own views?',
    taskType: 'judgement',
  },
  {
    heading: 'Repression and emergency powers',
    body: 'The Regulation on Measures for the Preservation of State Security and Public Order in 1881 gave officials broad emergency powers. Governors could declare areas under exceptional security, restrict meetings, close institutions and increase police control. These measures strengthened the coercive capacity of the state and made repression more systematic.',
    question: 'How did the 1881 security measures strengthen autocratic control?',
    taskType: 'explain',
  },
  {
    heading: 'Continuity as well as reaction',
    body: 'Alexander III did not simply reverse everything associated with his father. Russia continued to modernise economically and administratively, and some institutions created under Alexander II survived. The important distinction is that modernisation continued where it strengthened the state, while political participation and independent influence were restricted.',
    question: 'Why is it misleading to describe Alexander III’s reign as complete reversal?',
    taskType: 'explain',
    visual: {
      type: 'comparison',
      title: 'Alexander II and Alexander III',
      leftTitle: 'Alexander II',
      rightTitle: 'Alexander III',
      rows: [
        { left: 'Used reform to modernise and stabilise', right: 'Used reaction to reinforce order and authority' },
        { left: 'Allowed limited local participation', right: 'Restricted independent influence and centralised control' },
        { left: 'Considered cautious consultation in 1881', right: 'Rejected constitutional development' },
      ],
    },
  },
  {
    heading: 'How secure was autocracy?',
    body: 'In the short term Alexander III’s policies reduced open revolutionary activity and restored confidence among conservatives. However, repression did not remove the underlying causes of opposition. Liberal frustration, national resentment, social tension and the growth of new political ideas continued beneath the surface.',
    question: 'Did Alexander III strengthen autocracy securely or only temporarily?',
    taskType: 'judgement',
  },
  {
    heading: 'Overall judgement',
    body: 'Alexander III strengthened autocracy most clearly by reaffirming its ideology, rejecting constitutional consultation and expanding the state’s repressive powers. His success was substantial in the short term because organised opposition was weakened and central authority remained intact. Yet the durability of this achievement was limited because the regime relied more on control than consent and left major social and political tensions unresolved.',
    question: 'How far did Alexander III strengthen autocracy?',
    taskType: 'judgement',
  },
];

export const alexanderIiiAutocracyTimeline = {
  events: [
    { id: '1881-assassination', date: '13 March 1881', title: 'Alexander II assassinated', detail: 'People’s Will killed the reforming Tsar, reinforcing the belief that concession encouraged revolution.' },
    { id: '1881-accession', date: 'March 1881', title: 'Alexander III becomes Tsar', detail: 'He inherited a crisis of authority and immediately faced the question of whether to continue reform.' },
    { id: '1881-loris', date: 'March 1881', title: 'Loris-Melikov proposals rejected', detail: 'Alexander III abandoned limited elected participation in advisory commissions.' },
    { id: '1881-manifesto', date: 'April 1881', title: 'Manifesto of Unshakeable Autocracy', detail: 'The Tsar publicly committed himself to preserving unrestricted autocratic authority.' },
    { id: '1881-security', date: 'August 1881', title: 'Emergency security regulation', detail: 'Officials gained wide powers to suppress meetings, publications and suspected opposition.' },
    { id: '1882-press', date: '1882', title: 'Temporary press regulations', detail: 'The government strengthened censorship and made it easier to close hostile publications.' },
    { id: '1884-university', date: '1884', title: 'University Statute', detail: 'University autonomy was reduced and state supervision increased.' },
    { id: '1885-nobility', date: '1885', title: 'Nobles’ Land Bank', detail: 'The state supported the landed nobility, a traditional pillar of Tsarist authority.' },
    { id: '1889-land-captains', date: '1889', title: 'Land Captains introduced', detail: 'Officials drawn mainly from the nobility gained extensive authority over peasant communities.' },
    { id: '1890-zemstva', date: '1890', title: 'Zemstva Act', detail: 'The influence of nobles increased and peasant representation was restricted.' },
    { id: '1892-dumas', date: '1892', title: 'Municipal Dumas restricted', detail: 'Higher property qualifications narrowed urban political participation.' },
    { id: '1894-death', date: '1894', title: 'Death of Alexander III', detail: 'He left autocracy intact but passed unresolved tensions to Nicholas II.' },
  ],
};

export const alexanderIiiAutocracyFlashcards = [
  { id: 'beliefs', front: 'Alexander III’s political beliefs', back: 'He supported hereditary autocracy, Orthodoxy, central authority and firm resistance to liberalism.' },
  { id: 'assassination-impact', front: 'Impact of Alexander II’s assassination', back: 'It convinced conservatives that reform had encouraged revolution rather than satisfied opposition.' },
  { id: 'loris-melikov', front: 'Loris-Melikov proposals', back: 'Limited elected participation in advisory commissions; they did not create a parliament or restrict sovereignty.' },
  { id: 'manifesto', front: 'Manifesto of Unshakeable Autocracy', back: 'Issued in April 1881 to reaffirm the Tsar’s commitment to unrestricted autocratic rule.' },
  { id: 'pobedonostsev', front: 'Pobedonostsev', back: 'Conservative adviser and Procurator of the Holy Synod who opposed democracy, a free press and representative government.' },
  { id: 'security-regulation', front: '1881 security regulation', back: 'Allowed exceptional security measures, wider police powers, closures and restrictions on meetings.' },
  { id: 'reaction', front: 'Reaction', back: 'Policies designed to reverse liberalisation, restrict participation and strengthen traditional authority.' },
  { id: 'continuity', front: 'Continuity under Alexander III', back: 'Economic and administrative modernisation continued where it strengthened the state.' },
  { id: 'short-term-success', front: 'Short-term success', back: 'Open revolutionary activity declined and central autocratic authority remained intact.' },
  { id: 'long-term-limit', front: 'Long-term limitation', back: 'Repression did not remove social tensions, national resentment or ideological opposition.' },
  { id: 'comparison-a2', front: 'Alexander II compared with Alexander III', back: 'Alexander II combined reform with autocracy; Alexander III prioritised control and rejected constitutional development.' },
  { id: 'overall', front: 'Overall judgement', back: 'Alexander III strengthened autocracy in the short term, but its security depended heavily on repression rather than consent.' },
];

export const alexanderIiiAutocracyQuiz = [
  { id: 'q1', question: 'Why did Alexander III distrust reform?', options: ['He believed it encouraged further opposition', 'He wanted to abolish the monarchy', 'He supported parliamentary sovereignty', 'He opposed economic modernisation'], correct: 'He believed it encouraged further opposition' },
  { id: 'q2', question: 'What happened to the Loris-Melikov proposals?', options: ['Alexander III rejected them', 'They created a parliament', 'They abolished censorship', 'They transferred power to the zemstva'], correct: 'Alexander III rejected them' },
  { id: 'q3', question: 'What did the 1881 manifesto reaffirm?', options: ['Unshakeable autocracy', 'Universal male suffrage', 'Ministerial responsibility', 'Federal government'], correct: 'Unshakeable autocracy' },
  { id: 'q4', question: 'Who was Pobedonostsev?', options: ['A conservative adviser and Procurator of the Holy Synod', 'A leader of People’s Will', 'A liberal zemstvo chairman', 'A Marxist economist'], correct: 'A conservative adviser and Procurator of the Holy Synod' },
  { id: 'q5', question: 'Which idea did Pobedonostsev oppose?', options: ['Representative government', 'Autocracy', 'Orthodoxy', 'Central authority'], correct: 'Representative government' },
  { id: 'q6', question: 'What was one effect of the 1881 security regulation?', options: ['Governors gained wider emergency powers', 'The secret police were abolished', 'Universities became independent', 'Censorship ended'], correct: 'Governors gained wider emergency powers' },
  { id: 'q7', question: 'Which statement best describes continuity under Alexander III?', options: ['Modernisation continued where it strengthened the state', 'Every reform of Alexander II was abolished', 'Russia stopped industrialising', 'Local government became fully democratic'], correct: 'Modernisation continued where it strengthened the state' },
  { id: 'q8', question: 'Why was the rejection of Loris-Melikov important?', options: ['It closed a cautious route towards central consultation', 'It immediately ended serfdom', 'It expanded peasant voting', 'It created ministerial responsibility'], correct: 'It closed a cautious route towards central consultation' },
  { id: 'q9', question: 'What was Alexander III’s clearest short-term achievement?', options: ['Autocratic authority remained intact', 'All opposition disappeared permanently', 'Russia became constitutional', 'National tensions ended'], correct: 'Autocratic authority remained intact' },
  { id: 'q10', question: 'What was the main long-term weakness of his approach?', options: ['Repression left underlying tensions unresolved', 'The Tsar surrendered sovereignty', 'The nobility lost all influence', 'The state abandoned coercion'], correct: 'Repression left underlying tensions unresolved' },
];

export const alexanderIiiAutocracyJudgement = {
  question: 'Rank these factors from most to least important in strengthening autocracy under Alexander III. Justify your top three and explain the limitations of the lowest-ranked factor.',
  factors: [
    { id: 'belief', title: 'Alexander III’s personal commitment', detail: 'The Tsar firmly believed in hereditary autocracy and rejected liberal political development.' },
    { id: 'assassination', title: 'The assassination of Alexander II', detail: 'It discredited concession and created strong support for reaction.' },
    { id: 'manifesto', title: 'The 1881 manifesto', detail: 'It publicly established the ideological direction of the reign.' },
    { id: 'pobedonostsev', title: 'Pobedonostsev’s influence', detail: 'He supplied a conservative justification for autocracy, Orthodoxy and censorship.' },
    { id: 'repression', title: 'Emergency and police powers', detail: 'The state gained stronger practical means to control opposition.' },
    { id: 'elite-support', title: 'Support for the nobility', detail: 'Traditional elites retained influence and helped sustain the regime.' },
    { id: 'weak-opposition', title: 'Weakness of organised opposition', detail: 'Revolutionary groups were disrupted and struggled to challenge the regime openly.' },
    { id: 'economic', title: 'Continuing modernisation', detail: 'Economic development strengthened state capacity but could also create new tensions.' },
  ],
};

export const alexanderIiiAutocracyAO3 = {
  question: 'Which interpretation best explains the strength and limitations of Alexander III’s autocracy? Test each view using precise contextual knowledge.',
  interpretations: [
    { historian: 'Interpretation A', argument: 'Alexander III restored stability by decisively reversing the uncertainty created by his father’s reforms and reasserting the traditional authority of the Tsar.' },
    { historian: 'Interpretation B', argument: 'The apparent strength of Alexander III’s regime rested mainly on repression and therefore concealed rather than resolved the weaknesses of autocracy.' },
    { historian: 'Interpretation C', argument: 'Alexander III combined ideological reaction with selective modernisation, strengthening the state in the short term while preserving long-term political tensions.' },
  ],
};

export const alexanderIiiAutocracyPeel = {
  question: 'Write one developed paragraph answering: “Alexander III significantly strengthened Russian autocracy.” Assess the validity of this view.',
  stretchQuestion: 'Plan a balanced 25-mark response comparing ideology, repression, elite support and unresolved opposition.',
  scaffold: [
    'Point: make a direct claim about the extent to which autocracy was strengthened.',
    'Evidence: use precise knowledge such as the manifesto, rejection of Loris-Melikov, Pobedonostsev or the 1881 security regulation.',
    'Explain: show how the evidence increased the Tsar’s authority or capacity to control opposition.',
    'Counter: identify a limitation, such as unresolved social, national or ideological tensions.',
    'Compare: weigh short-term security against long-term durability.',
    'Judgement: finish with an explicit decision linked to the wording of the question.',
  ],
};

export const alexanderIiiAutocracyConfidence = {
  prompt: 'How confident are you explaining how and why Alexander III strengthened autocracy?',
  leastSecureOptions: ['Alexander III’s beliefs', 'Impact of the assassination', 'Loris-Melikov proposals', '1881 manifesto', 'Pobedonostsev', 'Security regulation', 'Continuity and modernisation', 'Comparison with Alexander II', 'Short-term success', 'Long-term limitations'],
  scale: [1, 2, 3, 4, 5],
};

export const alexanderIiiAutocracyFallbacks: Record<string, any> = {
  lesson_content: { sections: alexanderIiiAutocracyLessonSections },
  timeline: alexanderIiiAutocracyTimeline,
  flashcards: { cards: alexanderIiiAutocracyFlashcards },
  quiz: { questions: alexanderIiiAutocracyQuiz },
  judgement_ranking: alexanderIiiAutocracyJudgement,
  ao3_interpretation: alexanderIiiAutocracyAO3,
  peel_response: alexanderIiiAutocracyPeel,
  confidence_exit_ticket: alexanderIiiAutocracyConfidence,
};
