export type UnifiedActivityStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'mastered'
  | 'needs_review';

export type UnifiedActivityResponse = {
  status?: string | null;
  score?: number | null;
  response_json?: any;
  last_saved_at?: string | null;
};

export type UnifiedActivityState = {
  activityType: string;
  status: UnifiedActivityStatus;
  completionPercentage: number;
  masteryScore: number | null;
  confidenceScore: number | null;
  evidenceSaved: boolean;
  isComplete: boolean;
  savedAt: string | null;
};

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function scoreFromResponse(activityType: string, response?: UnifiedActivityResponse | null) {
  if (!response) return { masteryScore: null, confidenceScore: null };
  const json = response.response_json ?? {};

  if (activityType === 'quiz') {
    return { masteryScore: asNumber(json.percentage) ?? response.score ?? null, confidenceScore: null };
  }

  if (activityType === 'flashcards') {
    const total = asNumber(json.totalCards) ?? 0;
    const secure = asNumber(json.secureCount) ?? 0;
    return { masteryScore: total > 0 ? Math.round((secure / total) * 100) : response.score ?? null, confidenceScore: null };
  }

  if (activityType === 'confidence_exit_ticket') {
    const confidenceScore = asNumber(json.confidence) ?? response.score ?? null;
    return { masteryScore: confidenceScore === null ? null : confidenceScore * 20, confidenceScore };
  }

  if (activityType === 'peel_response') {
    const words = asNumber(json.wordCount) ?? 0;
    return { masteryScore: words >= 100 ? 80 : words >= 60 ? 65 : words > 0 ? 40 : response.score ?? null, confidenceScore: null };
  }

  if (['timeline', 'judgement_ranking', 'ao3_interpretation', 'card_sort'].includes(activityType)) {
    const submitted = response.status === 'complete' || response.status === 'submitted' || Boolean(response.response_json);
    return { masteryScore: submitted ? 70 : null, confidenceScore: null };
  }

  return { masteryScore: response.score ?? null, confidenceScore: null };
}

export function resolveUnifiedActivityState(activityType: string, response?: UnifiedActivityResponse | null): UnifiedActivityState {
  const evidenceSaved = Boolean(response);
  const savedStatus = response?.status ?? null;
  const isComplete = evidenceSaved && (savedStatus === 'complete' || savedStatus === 'submitted' || Boolean(response?.response_json));
  const { masteryScore, confidenceScore } = scoreFromResponse(activityType, response);

  let status: UnifiedActivityStatus = 'not_started';
  let completionPercentage = 0;

  if (evidenceSaved) {
    status = isComplete ? 'submitted' : 'in_progress';
    completionPercentage = isComplete ? 100 : 50;
  }

  if (isComplete && masteryScore !== null && masteryScore >= 80) status = 'mastered';
  if (isComplete && masteryScore !== null && masteryScore < 50) status = 'needs_review';

  return {
    activityType,
    status,
    completionPercentage,
    masteryScore,
    confidenceScore,
    evidenceSaved,
    isComplete,
    savedAt: response?.last_saved_at ?? null,
  };
}

export function completionStatusFromUnifiedState(state: UnifiedActivityState): 'missing' | 'in_progress' | 'complete' {
  if (!state.evidenceSaved) return 'missing';
  if (state.isComplete) return 'complete';
  return 'in_progress';
}
