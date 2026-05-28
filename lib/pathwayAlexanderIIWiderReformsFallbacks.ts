import {
  pathwayAlexanderIIWiderReformsFlashcards,
  pathwayAlexanderIIWiderReformsQuizQuestions,
  pathwayAlexanderIIWiderReformsPeelContent,
  pathwayAlexanderIIWiderReformsConfidenceContent,
} from './pathwayAlexanderIIWiderReformsContent';

export const pathwayAlexanderIIWiderReformsFallbacks: Record<string, any> = {
  flashcards: { cards: pathwayAlexanderIIWiderReformsFlashcards },
  quiz: { questions: pathwayAlexanderIIWiderReformsQuizQuestions },
  peel_response: pathwayAlexanderIIWiderReformsPeelContent,
  confidence_exit_ticket: pathwayAlexanderIIWiderReformsConfidenceContent,
  judgement_ranking: {
    question: 'Rank Alexander II wider reforms from most to least significant.',
    factors: [
      { id: 'judicial', title: 'Judicial reform', detail: 'Modernised the court system.' },
      { id: 'military', title: 'Military reform', detail: 'Improved the army after the Crimean War.' },
      { id: 'zemstva', title: 'Zemstva reform', detail: 'Improved local administration but remained limited.' },
      { id: 'education', title: 'Education reform', detail: 'Expanded educational opportunity.' },
    ],
  },
  ao3_interpretation: {
    question: 'Assess the interpretations about modernisation under Alexander II.',
    interpretations: [
      { historian: 'Interpretation A', argument: 'Alexander II modernised Russia through reform.' },
      { historian: 'Interpretation B', argument: 'The reforms were significant but limited by autocracy.' },
    ],
  },
};
