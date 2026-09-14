import { recallQuestions as coreRecallQuestions, recallTopics } from './questions';
import { additionalRecallQuestions } from './questions-expanded';
import { depthRecallQuestions } from './questions-depth';

export type { RecallQuestion, RecallQuestionType, RecallTopic } from './questions';
export { recallTopics };

const rebalance = (question: (typeof additionalRecallQuestions)[number]) => {
  if (question.id === 'k-23') return { ...question, options: ['Frequent reorganisations upset officials', 'Repeated promotions reassured officials', 'Higher salaries satisfied officials', 'Stable ministries protected officials'], correctOption: 0, answerLabel: 'Frequent reorganisations upset officials' };
  if (question.id === 'a2-57') return { ...question, options: ['They provided experience of elected local service', 'They created a fully elected national government', 'They placed military command under local councils', 'They made government ministers locally accountable'], correctOption: 0, answerLabel: 'They provided experience of elected local service' };
  return question;
};

export const recallQuestions = [...coreRecallQuestions, ...additionalRecallQuestions.map(rebalance), ...depthRecallQuestions.map(rebalance)];
export const recallQuestionById = new Map(recallQuestions.map((question) => [question.id, question]));
export const recallTopicById = new Map(recallTopics.map((topic) => [topic.id, topic]));
