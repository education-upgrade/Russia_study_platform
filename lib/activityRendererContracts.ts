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

export type FlashcardContent = {
  cards: Array<Record<string, unknown>>;
};

export type QuizContent = {
  questions: Array<Record<string, unknown>>;
};

export type TimelineContent = {
  events: Array<Record<string, unknown>>;
};

export type CardSortContent = {
  cards: Array<Record<string, unknown>>;
  categories: Array<Record<string, unknown>>;
};

export type JudgementRankingContent = {
  question: string;
  factors: Array<Record<string, unknown>>;
};

export type AO3InterpretationContent = {
  question: string;
  interpretations: Array<Record<string, unknown>>;
};

export type PeelResponseContent = {
  question: string;
  stretchQuestion?: string;
  scaffold?: Array<Record<string, unknown>>;
};

export type ConfidenceExitTicketContent = {
  prompt: string;
  scale?: Array<Record<string, unknown>>;
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

function arrayOrFallback(primary: unknown, fallback: unknown) {
  if (Array.isArray(primary) && primary.length > 0) return primary;
  if (Array.isArray(fallback)) return fallback;
  return [];
}

function textOrFallback(primary: unknown, fallback: unknown) {
  if (typeof primary === 'string' && primary.trim()) return primary;
  if (typeof fallback === 'string') return fallback;
  return '';
}

export function normaliseRendererContent(activityType: string, content: any = {}, fallbackContent: any = {}): NormalisedActivityContent {
  if (activityType === 'flashcards') return { cards: arrayOrFallback(content.cards, fallbackContent.cards) };
  if (activityType === 'quiz') return { questions: arrayOrFallback(content.questions, fallbackContent.questions) };
  if (activityType === 'timeline') return { events: arrayOrFallback(content.events, fallbackContent.events) };
  if (activityType === 'card_sort') return { cards: arrayOrFallback(content.cards, fallbackContent.cards), categories: arrayOrFallback(content.categories, fallbackContent.categories) };
  if (activityType === 'judgement_ranking') return { question: textOrFallback(content.question, fallbackContent.question), factors: arrayOrFallback(content.factors, fallbackContent.factors) };
  if (activityType === 'ao3_interpretation') return { question: textOrFallback(content.question, fallbackContent.question), interpretations: arrayOrFallback(content.interpretations, fallbackContent.interpretations) };
  if (activityType === 'peel_response') return { question: textOrFallback(content.question, fallbackContent.question), stretchQuestion: textOrFallback(content.stretchQuestion, fallbackContent.stretchQuestion), scaffold: arrayOrFallback(content.scaffold, fallbackContent.scaffold) };
  if (activityType === 'confidence_exit_ticket') return { prompt: textOrFallback(content.prompt, fallbackContent.prompt), scale: arrayOrFallback(content.scale, fallbackContent.scale), leastSecureOptions: arrayOrFallback(content.leastSecureOptions, fallbackContent.leastSecureOptions) as string[] };
  return {} as NormalisedActivityContent;
}
