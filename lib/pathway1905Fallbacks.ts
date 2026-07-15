import {
  pathway1905LessonSections,
  pathway1905Flashcards,
  pathway1905QuizQuestions,
  pathway1905PeelContent,
} from './pathway1905Content';
import {
  pathway1905Timeline,
  pathway1905Judgement,
  pathway1905AO3,
  pathway1905ConfidenceContent,
} from './pathway1905ExtendedContent';

export const pathway1905Fallbacks: Record<string, any> = {
  lesson_content: { sections: pathway1905LessonSections },
  timeline: pathway1905Timeline,
  flashcards: { cards: pathway1905Flashcards },
  quiz: { questions: pathway1905QuizQuestions },
  judgement_ranking: pathway1905Judgement,
  ao3_interpretation: pathway1905AO3,
  peel_response: pathway1905PeelContent,
  confidence_exit_ticket: pathway1905ConfidenceContent,
};
