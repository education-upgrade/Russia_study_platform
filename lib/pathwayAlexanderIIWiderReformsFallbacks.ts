import {
  pathwayAlexanderIIWiderReformsLessonSections,
  pathwayAlexanderIIWiderReformsTimeline,
  pathwayAlexanderIIWiderReformsFlashcards,
  pathwayAlexanderIIWiderReformsQuizQuestions,
  pathwayAlexanderIIWiderReformsJudgement,
  pathwayAlexanderIIWiderReformsAO3,
  pathwayAlexanderIIWiderReformsPeelContent,
  pathwayAlexanderIIWiderReformsConfidenceContent,
} from './pathwayAlexanderIIWiderReformsContent';

export const pathwayAlexanderIIWiderReformsFallbacks: Record<string, any> = {
  lesson_content: { sections: pathwayAlexanderIIWiderReformsLessonSections },
  timeline: pathwayAlexanderIIWiderReformsTimeline,
  flashcards: { cards: pathwayAlexanderIIWiderReformsFlashcards },
  quiz: { questions: pathwayAlexanderIIWiderReformsQuizQuestions },
  judgement_ranking: pathwayAlexanderIIWiderReformsJudgement,
  ao3_interpretation: pathwayAlexanderIIWiderReformsAO3,
  peel_response: pathwayAlexanderIIWiderReformsPeelContent,
  confidence_exit_ticket: pathwayAlexanderIIWiderReformsConfidenceContent,
};
