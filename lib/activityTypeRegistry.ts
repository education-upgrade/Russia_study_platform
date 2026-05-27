export type CoreActivityType =
  | 'lesson_content'
  | 'flashcards'
  | 'quiz'
  | 'confidence_exit_ticket';

export type ApplicationActivityType =
  | 'peel_response'
  | 'exam_planning'
  | 'ao3_interpretation'
  | 'model_answer_analysis'
  | 'card_sort'
  | 'timeline'
  | 'source_analysis'
  | 'judgement_ranking';

export type SupportedActivityType = CoreActivityType | ApplicationActivityType;

export type ActivityRendererKind =
  | 'lesson'
  | 'flashcards'
  | 'quiz'
  | 'peel'
  | 'timeline'
  | 'cardSort'
  | 'confidence'
  | 'comingSoon';

export type ActivityTypeConfig = {
  activityType: SupportedActivityType;
  routeSlug: string;
  label: string;
  activityGroup: 'core' | 'application' | 'reflection';
  renderer: ActivityRendererKind;
  orderWeight: number;
  isTrackable: boolean;
  isEvidenceTask: boolean;
};

export const activityTypeRegistry: Record<SupportedActivityType, ActivityTypeConfig> = {
  lesson_content: {
    activityType: 'lesson_content',
    routeSlug: 'lesson',
    label: 'Lesson notes',
    activityGroup: 'core',
    renderer: 'lesson',
    orderWeight: 10,
    isTrackable: false,
    isEvidenceTask: false,
  },
  flashcards: {
    activityType: 'flashcards',
    routeSlug: 'flashcards',
    label: 'Flashcards',
    activityGroup: 'core',
    renderer: 'flashcards',
    orderWeight: 20,
    isTrackable: true,
    isEvidenceTask: true,
  },
  quiz: {
    activityType: 'quiz',
    routeSlug: 'quiz',
    label: 'Retrieval quiz',
    activityGroup: 'core',
    renderer: 'quiz',
    orderWeight: 30,
    isTrackable: true,
    isEvidenceTask: true,
  },
  peel_response: {
    activityType: 'peel_response',
    routeSlug: 'peel',
    label: 'PEEL response',
    activityGroup: 'application',
    renderer: 'peel',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  exam_planning: {
    activityType: 'exam_planning',
    routeSlug: 'exam-planning',
    label: 'Exam planning',
    activityGroup: 'application',
    renderer: 'comingSoon',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  ao3_interpretation: {
    activityType: 'ao3_interpretation',
    routeSlug: 'ao3',
    label: 'AO3 interpretation',
    activityGroup: 'application',
    renderer: 'comingSoon',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  model_answer_analysis: {
    activityType: 'model_answer_analysis',
    routeSlug: 'model-answer',
    label: 'Model answer analysis',
    activityGroup: 'application',
    renderer: 'comingSoon',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  card_sort: {
    activityType: 'card_sort',
    routeSlug: 'card-sort',
    label: 'Card sort',
    activityGroup: 'application',
    renderer: 'cardSort',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  timeline: {
    activityType: 'timeline',
    routeSlug: 'timeline',
    label: 'Timeline',
    activityGroup: 'application',
    renderer: 'timeline',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  source_analysis: {
    activityType: 'source_analysis',
    routeSlug: 'source-analysis',
    label: 'Source analysis',
    activityGroup: 'application',
    renderer: 'comingSoon',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  judgement_ranking: {
    activityType: 'judgement_ranking',
    routeSlug: 'judgement-ranking',
    label: 'Judgement ranking',
    activityGroup: 'application',
    renderer: 'comingSoon',
    orderWeight: 40,
    isTrackable: true,
    isEvidenceTask: true,
  },
  confidence_exit_ticket: {
    activityType: 'confidence_exit_ticket',
    routeSlug: 'confidence',
    label: 'Confidence check',
    activityGroup: 'reflection',
    renderer: 'confidence',
    orderWeight: 50,
    isTrackable: true,
    isEvidenceTask: true,
  },
};

export const CORE_ACTIVITY_TYPES: CoreActivityType[] = [
  'lesson_content',
  'flashcards',
  'quiz',
  'confidence_exit_ticket',
];

export const APPROVED_APPLICATION_ACTIVITY_TYPES: ApplicationActivityType[] = [
  'peel_response',
  'exam_planning',
  'ao3_interpretation',
  'model_answer_analysis',
  'card_sort',
  'timeline',
  'source_analysis',
  'judgement_ranking',
];

export function isSupportedActivityType(activityType: string): activityType is SupportedActivityType {
  return activityType in activityTypeRegistry;
}

export function getActivityTypeConfig(activityType: string) {
  if (isSupportedActivityType(activityType)) return activityTypeRegistry[activityType];
  return null;
}

export function getActivityRouteSlug(activityType: string) {
  return getActivityTypeConfig(activityType)?.routeSlug ?? activityType;
}

export function getActivityLabel(activityType: string) {
  return getActivityTypeConfig(activityType)?.label ?? activityType.replaceAll('_', ' ');
}

export function getActivityRenderer(activityType: string): ActivityRendererKind {
  return getActivityTypeConfig(activityType)?.renderer ?? 'comingSoon';
}

export function isTrackableActivity(activityType: string) {
  return getActivityTypeConfig(activityType)?.isTrackable ?? true;
}

export function isEvidenceActivity(activityType: string) {
  return getActivityTypeConfig(activityType)?.isEvidenceTask ?? true;
}

export function orderSupportedActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstConfig = getActivityTypeConfig(first);
    const secondConfig = getActivityTypeConfig(second);
    const firstWeight = firstConfig?.orderWeight ?? 999;
    const secondWeight = secondConfig?.orderWeight ?? 999;
    if (firstWeight !== secondWeight) return firstWeight - secondWeight;
    return first.localeCompare(second);
  });
}

export function getNextActivityType(activityTypes: string[], currentActivityType: string) {
  const orderedTypes = orderSupportedActivityTypes(activityTypes);
