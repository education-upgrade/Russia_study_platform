import { recallQuestions as coreRecallQuestions, recallTopics } from './questions';
import { additionalRecallQuestions } from './questions-expanded';

export type { RecallQuestion, RecallQuestionType, RecallTopic } from './questions';
export { recallTopics };

const balancedQuestions = additionalRecallQuestions.map((question) => {
  if (question.id === 'k-23') return { ...question, options: ['Frequent reorganisations upset officials', 'Repeated promotions reassured officials', 'Higher salaries satisfied officials', 'Stable ministries protected officials'], correctOption: 0, answerLabel: 'Frequent reorganisations upset officials' };
  return question;
});

export const recallQuestions = [...coreRecallQuestions, ...balancedQuestions];
export const recallQuestionById = new Map(recallQuestions.map((question) => [question.id, question]));
export const recallTopicById = new Map(recallTopics.map((topic) => [topic.id, topic]));
