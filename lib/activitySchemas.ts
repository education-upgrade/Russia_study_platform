export const activityTypes = [
  'flashcards',
  'quiz',
  'timeline',
  'card_sort',
  'judgement_ranking',
  'ao3_interpretation',
  'peel_response',
  'confidence_exit_ticket',
] as const;

export type ActivityType = typeof activityTypes[number];

export type AdaptiveRendererSupport = {
  difficultyLevel?: 'scaffolded' | 'secure' | 'stretch';
  supportStrategy?: string;
  successTarget?: string;
};

export type BaseActivityRendererProps = {
  activityId: string;
  nextHref?: string;
  adaptiveSupport?: AdaptiveRendererSupport;
};

export type Flashcard = {
  id?: string;
  front: string;
  back: string;
};

export type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correct: string;
};

export type TimelineEvent = {
  id?: string;
  date: string;
  title: string;
  detail: string;
};

export type CardSortCard = {
  id: string;
  text: string;
  category: string;
};

export type JudgementRankingFactor = {
  id: string;
  title: string;
  detail: string;
};

export type AO3Interpretation = {
  historian: string;
  argument: string;
};

export type FlashcardContent = {
  cards: Flashcard[];
};

export type QuizContent = {
  questions: QuizQuestion[];
};

export type TimelineContent = {
  events: TimelineEvent[];
};

export type CardSortContent = {
  cards: CardSortCard[];
  categories: string[];
};

export type JudgementRankingContent = {
  question: string;
  factors: JudgementRankingFactor[];
};

export type AO3InterpretationContent = {
  question: string;
  interpretations: AO3Interpretation[];
};

export type PeelResponseContent = {
  question: string;
  stretchQuestion?: string;
  scaffold?: string[];
};

export type ConfidenceExitTicketContent = {
  prompt: string;
  scale?: number[];
  leastSecureOptions?: string[];
};

export type ActivityContentByType = {
  flashcards: FlashcardContent;
  quiz: QuizContent;
  timeline: TimelineContent;
  card_sort: CardSortContent;
  judgement_ranking: JudgementRankingContent;
  ao3_interpretation: AO3InterpretationContent;
  peel_response: PeelResponseContent;
  confidence_exit_ticket: ConfidenceExitTicketContent;
};

export type NormalisedActivityContent = ActivityContentByType[ActivityType];

export type ActivitySchema<TContent extends NormalisedActivityContent> = {
  type: ActivityType;
  label: string;
  description: string;
  normalise: (content?: unknown, fallbackContent?: unknown) => TContent;
  isValidContent: (content: unknown) => content is TContent;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function arrayOrFallback(primary: unknown, fallback: unknown): unknown[] {
  if (Array.isArray(primary) && primary.length > 0) return primary;
  if (Array.isArray(fallback)) return fallback;
  return [];
}

function textOrFallback(primary: unknown, fallback: unknown) {
  if (typeof primary === 'string' && primary.trim()) return primary;
  if (typeof fallback === 'string') return fallback;
  return '';
}

function stringArrayOrFallback(primary: unknown, fallback: unknown) {
  return arrayOrFallback(primary, fallback).filter((item): item is string => typeof item === 'string');
}

function numberArrayOrFallback(primary: unknown, fallback: unknown) {
  return arrayOrFallback(primary, fallback).filter((item): item is number => typeof item === 'number');
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string';
}

export function isActivityType(value: string): value is ActivityType {
  return activityTypes.includes(value as ActivityType);
}

export function isFlashcard(value: unknown): value is Flashcard {
  return isObject(value)
    && typeof value.front === 'string'
    && typeof value.back === 'string'
    && isOptionalString(value.id);
}

export function isQuizQuestion(value: unknown): value is QuizQuestion {
  return isObject(value)
    && typeof value.question === 'string'
    && Array.isArray(value.options)
    && value.options.length > 0
    && value.options.every((option) => typeof option === 'string')
    && typeof value.correct === 'string'
    && value.options.includes(value.correct)
    && isOptionalString(value.id);
}

export function isTimelineEvent(value: unknown): value is TimelineEvent {
  return isObject(value)
    && typeof value.date === 'string'
    && typeof value.title === 'string'
    && typeof value.detail === 'string'
    && isOptionalString(value.id);
}

export function isCardSortCard(value: unknown): value is CardSortCard {
  return isObject(value)
    && typeof value.id === 'string'
    && typeof value.text === 'string'
    && typeof value.category === 'string';
}

export function isJudgementRankingFactor(value: unknown): value is JudgementRankingFactor {
  return isObject(value)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.detail === 'string';
}

export function isAO3Interpretation(value: unknown): value is AO3Interpretation {
  return isObject(value)
    && typeof value.historian === 'string'
    && typeof value.argument === 'string';
}

function itemArrayOrFallback<T>(primary: unknown, fallback: unknown, guard: (item: unknown) => item is T) {
  return arrayOrFallback(primary, fallback).filter(guard);
}

function isFlashcardContent(content: unknown): content is FlashcardContent {
  return isObject(content) && Array.isArray(content.cards) && content.cards.every(isFlashcard);
}

function isQuizContent(content: unknown): content is QuizContent {
  return isObject(content) && Array.isArray(content.questions) && content.questions.every(isQuizQuestion);
}

function isTimelineContent(content: unknown): content is TimelineContent {
  return isObject(content) && Array.isArray(content.events) && content.events.every(isTimelineEvent);
}

function isCardSortContent(content: unknown): content is CardSortContent {
  return isObject(content)
    && Array.isArray(content.cards)
    && content.cards.every(isCardSortCard)
    && Array.isArray(content.categories)
    && content.categories.every((category) => typeof category === 'string');
}

function isJudgementRankingContent(content: unknown): content is JudgementRankingContent {
  return isObject(content)
    && typeof content.question === 'string'
    && Array.isArray(content.factors)
    && content.factors.every(isJudgementRankingFactor);
}

function isAO3InterpretationContent(content: unknown): content is AO3InterpretationContent {
  return isObject(content)
    && typeof content.question === 'string'
    && Array.isArray(content.interpretations)
    && content.interpretations.every(isAO3Interpretation);
}

function isPeelResponseContent(content: unknown): content is PeelResponseContent {
  return isObject(content)
    && typeof content.question === 'string'
    && isOptionalString(content.stretchQuestion)
    && (content.scaffold === undefined || (Array.isArray(content.scaffold) && content.scaffold.every((item) => typeof item === 'string')));
}

function isConfidenceExitTicketContent(content: unknown): content is ConfidenceExitTicketContent {
  return isObject(content)
    && typeof content.prompt === 'string'
    && (content.scale === undefined || (Array.isArray(content.scale) && content.scale.every((item) => typeof item === 'number')))
    && (content.leastSecureOptions === undefined || (Array.isArray(content.leastSecureOptions) && content.leastSecureOptions.every((item) => typeof item === 'string')));
}

export const activitySchemaRegistry: { [K in ActivityType]: ActivitySchema<ActivityContentByType[K]> } = {
  flashcards: {
    type: 'flashcards',
    label: 'Flashcards',
    description: 'Retrieval cards for securing core AO1 knowledge.',
    isValidContent: isFlashcardContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      cards: itemArrayOrFallback(content.cards, fallbackContent.cards, isFlashcard),
    }),
  },
  quiz: {
    type: 'quiz',
    label: 'Quiz',
    description: 'Multiple-choice retrieval with saved score and misconception tracking.',
    isValidContent: isQuizContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      questions: itemArrayOrFallback(content.questions, fallbackContent.questions, isQuizQuestion),
    }),
  },
  timeline: {
    type: 'timeline',
    label: 'Timeline',
    description: 'Chronological sequencing and turning-point judgement.',
    isValidContent: isTimelineContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      events: itemArrayOrFallback(content.events, fallbackContent.events, isTimelineEvent),
    }),
  },
  card_sort: {
    type: 'card_sort',
    label: 'Card sort',
    description: 'Classification task for sorting evidence into historical categories.',
    isValidContent: isCardSortContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      cards: itemArrayOrFallback(content.cards, fallbackContent.cards, isCardSortCard),
      categories: stringArrayOrFallback(content.categories, fallbackContent.categories),
    }),
  },
  judgement_ranking: {
    type: 'judgement_ranking',
    label: 'Judgement ranking',
    description: 'Factor ranking task for building substantiated historical judgement.',
    isValidContent: isJudgementRankingContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      question: textOrFallback(content.question, fallbackContent.question),
      factors: itemArrayOrFallback(content.factors, fallbackContent.factors, isJudgementRankingFactor),
    }),
  },
  ao3_interpretation: {
    type: 'ao3_interpretation',
    label: 'AO3 interpretation',
    description: 'Interpretation evaluation task using contextual support and challenge.',
    isValidContent: isAO3InterpretationContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      question: textOrFallback(content.question, fallbackContent.question),
      interpretations: itemArrayOrFallback(content.interpretations, fallbackContent.interpretations, isAO3Interpretation),
    }),
  },
  peel_response: {
    type: 'peel_response',
    label: 'PEEL response',
    description: 'Structured paragraph writing task for analytical AO1 development.',
    isValidContent: isPeelResponseContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      question: textOrFallback(content.question, fallbackContent.question),
      stretchQuestion: textOrFallback(content.stretchQuestion, fallbackContent.stretchQuestion),
      scaffold: stringArrayOrFallback(content.scaffold, fallbackContent.scaffold),
    }),
  },
  confidence_exit_ticket: {
    type: 'confidence_exit_ticket',
    label: 'Confidence exit ticket',
    description: 'Metacognitive reflection task for confidence and intervention tracking.',
    isValidContent: isConfidenceExitTicketContent,
    normalise: (content: any = {}, fallbackContent: any = {}) => ({
      prompt: textOrFallback(content.prompt, fallbackContent.prompt),
      scale: numberArrayOrFallback(content.scale, fallbackContent.scale),
      leastSecureOptions: stringArrayOrFallback(content.leastSecureOptions, fallbackContent.leastSecureOptions),
    }),
  },
};

export function normaliseActivityContent(activityType: string, content: unknown = {}, fallbackContent: unknown = {}): NormalisedActivityContent {
  if (!isActivityType(activityType)) return {} as NormalisedActivityContent;
  return activitySchemaRegistry[activityType].normalise(content, fallbackContent);
}

export function validateActivityContent(activityType: string, content: unknown) {
  if (!isActivityType(activityType)) {
    return { valid: false, errors: [`Unknown activity type: ${activityType}`] };
  }

  const schema = activitySchemaRegistry[activityType];
  const valid = schema.isValidContent(content as never);
  return {
    valid,
    errors: valid ? [] : [`Invalid content for activity type: ${activityType}`],
  };
}
