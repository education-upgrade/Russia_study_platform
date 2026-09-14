import { recallQuestions as coreRecallQuestions, recallTopics } from './questions';
import { additionalRecallQuestions } from './questions-expanded';

export type { RecallQuestion, RecallQuestionType, RecallTopic } from './questions';
export { recallTopics };

export const recallQuestions = [...coreRecallQuestions, ...additionalRecallQuestions];
export const recallQuestionById = new Map(recallQuestions.map((question) => [question.id, question]));
export const recallTopicById = new Map(recallTopics.map((topic) => [topic.id, topic]));
