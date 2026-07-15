import {
  pathwayFoundations1855LessonSections,
  pathwayFoundations1855Flashcards,
  pathwayFoundations1855QuizQuestions,
  pathwayFoundations1855JudgementTask,
  pathwayFoundations1855AO3Task,
  pathwayFoundations1855PeelContent,
  pathwayFoundations1855ConfidenceContent,
  pathwayFoundations1855Timeline,
} from './pathwayFoundations1855Content';

export const pathwayFoundations1855Fallbacks: Record<string, any> = {
  lesson_content: {
    sections: pathwayFoundations1855LessonSections,
  },
  timeline: pathwayFoundations1855Timeline,
  flashcards: {
    cards: pathwayFoundations1855Flashcards,
  },
  quiz: {
    questions: pathwayFoundations1855QuizQuestions,
  },
  judgement_ranking: pathwayFoundations1855JudgementTask,
  ao3_interpretation: pathwayFoundations1855AO3Task,
  peel_response: pathwayFoundations1855PeelContent,
  confidence_exit_ticket: pathwayFoundations1855ConfidenceContent,
};
