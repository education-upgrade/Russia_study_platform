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

export type NormalisedActivityContent =
  | FlashcardContent
  | QuizContent
  | TimelineContent
  | CardSortContent
  | JudgementRankingContent
  | AO3InterpretationContent
  | PeelResponseContent
  | ConfidenceExitTicketContent;

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
  const value = arrayOrFallback(primary, fallback);
  return value.filter((item): item is string => typeof item === 'string');
}

function numberArrayOrFallback(primary: unknown, fallback: unknown) {
  const value = arrayOrFallback(primary, fallback);
  return value.filter((item): item is number => typeof item === 'number');
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function flashcardArrayOrFallback(primary: unknown, fallback: unknown): Flashcard[] {
  return arrayOrFallback(primary, fallback).filter((item): item is Flashcard => {
    return isObject(item)
      && typeof item.front === 'string'
      && typeof item.back === 'string'
      && (item.id === undefined || typeof item.id === 'string');
  });
}

function quizQuestionArrayOrFallback(primary: unknown, fallback: unknown): QuizQuestion[] {
  return arrayOrFallback(primary, fallback).filter((item): item is QuizQuestion => {
    return isObject(item)
      && typeof item.question === 'string'
      && Array.isArray(item.options)
      && item.options.every((option) => typeof option === 'string')
      && typeof item.correct === 'string'
      && (item.id === undefined || typeof item.id === 'string');
  });
}

function timelineEventArrayOrFallback(primary: unknown, fallback: unknown): TimelineEvent[] {
  return arrayOrFallback(primary, fallback).filter((item): item is TimelineEvent => {
    return isObject(item)
      && typeof item.date === 'string'
      && typeof item.title === 'string'
      && typeof item.detail === 'string'
      && (item.id === undefined || typeof item.id === 'string');
  });
}

function cardSortArrayOrFallback(primary: unknown, fallback: unknown): CardSortCard[] {
  return arrayOrFallback(primary, fallback).filter((item): item is CardSortCard => {
    return isObject(item)
      && typeof item.id === 'string'
      && typeof item.text === 'string'
      && typeof item.category === 'string';
  });
}

function rankingFactorArrayOrFallback(primary: unknown, fallback: unknown): JudgementRankingFactor[] {
  return arrayOrFallback(primary, fallback).filter((item): item is JudgementRankingFactor => {
    return isObject(item)
      && typeof item.id === 'string'
      && typeof item.title === 'string'
      && typeof item.detail === 'string';
  });
}

function interpretationArrayOrFallback(primary: unknown, fallback: unknown): AO3Interpretation[] {
  return arrayOrFallback(primary, fallback).filter((item): item is AO3Interpretation => {
    return isObject(item)
      && typeof item.historian === 'string'
      && typeof item.argument === 'string';
  });
}

export function normaliseRendererContent(activityType: string, content: any = {}, fallbackContent: any = {}): NormalisedActivityContent {
  if (activityType === 'flashcards') return { cards: flashcardArrayOrFallback(content.cards, fallbackContent.cards) };
  if (activityType === 'quiz') return { questions: quizQuestionArrayOrFallback(content.questions, fallbackContent.questions) };
  if (activityType === 'timeline') return { events: timelineEventArrayOrFallback(content.events, fallbackContent.events) };
  if (activityType === 'card_sort') return { cards: cardSortArrayOrFallback(content.cards, fallbackContent.cards), categories: stringArrayOrFallback(content.categories, fallbackContent.categories) };
  if (activityType === 'judgement_ranking') return { question: textOrFallback(content.question, fallbackContent.question), factors: rankingFactorArrayOrFallback(content.factors, fallbackContent.factors) };
  if (activityType === 'ao3_interpretation') return { question: textOrFallback(content.question, fallbackContent.question), interpretations: interpretationArrayOrFallback(content.interpretations, fallbackContent.interpretations) };
  if (activityType === 'peel_response') return { question: textOrFallback(content.question, fallbackContent.question), stretchQuestion: textOrFallback(content.stretchQuestion, fallbackContent.stretchQuestion), scaffold: stringArrayOrFallback(content.scaffold, fallbackContent.scaffold) };
  if (activityType === 'confidence_exit_ticket') return { prompt: textOrFallback(content.prompt, fallbackContent.prompt), scale: numberArrayOrFallback(content.scale, fallbackContent.scale), leastSecureOptions: stringArrayOrFallback(content.leastSecureOptions, fallbackContent.leastSecureOptions) };
  return {} as NormalisedActivityContent;
}
