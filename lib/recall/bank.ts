import { recallQuestions as coreRecallQuestions, recallTopics } from './questions';
import { additionalRecallQuestions } from './questions-expanded';
import { depthRecallQuestions } from './questions-depth';

export type { RecallQuestion, RecallQuestionType, RecallTopic } from './questions';
export { recallTopics };

const rebalance = (question: (typeof additionalRecallQuestions)[number]) => {
  if (question.id === 'k-23') return { ...question, options: ['Frequent reorganisations upset officials', 'Repeated promotions reassured officials', 'Higher salaries satisfied officials', 'Stable ministries protected officials'], correctOption: 0, answerLabel: 'Frequent reorganisations upset officials' };
  if (question.id === 'a2-57') return { ...question, options: ['They provided experience of elected local service', 'They created a fully elected national government', 'They placed military command under local councils', 'They made government ministers locally accountable'], correctOption: 0, answerLabel: 'They provided experience of elected local service' };
  if (question.id === 'a3-41') return { ...question, options: ['Exports continued while rural communities faced hardship', 'Imports continued while urban factories faced shortages', 'Tariffs fell while industrial employers cut taxation', 'Railways closed while landowners abandoned farming'], correctOption: 0, answerLabel: 'Exports continued while rural communities faced hardship' };
  if (question.id === 'n2-53') return { ...question, options: ['The franchise favoured conservative property owners', 'The franchise favoured radical urban workers', 'The Tsar surrendered control over ministers', 'The Duma controlled appointments to the army'], correctOption: 0, answerLabel: 'The franchise favoured conservative property owners' };
  if (question.id === 's-81') return { ...question, options: ['An alleged medical conspiracy against Soviet leaders', 'A proposed reform of the Soviet health service', 'An alleged military conspiracy against Party officials', 'A proposed expansion of hospital provision'], correctOption: 0, answerLabel: 'An alleged medical conspiracy against Soviet leaders' };
  return question;
};

export const recallQuestions = [...coreRecallQuestions, ...additionalRecallQuestions.map(rebalance), ...depthRecallQuestions.map(rebalance)];
export const recallQuestionById = new Map(recallQuestions.map((question) => [question.id, question]));
export const recallTopicById = new Map(recallTopics.map((topic) => [topic.id, topic]));
