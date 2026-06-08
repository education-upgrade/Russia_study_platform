export type UnifiedActivityStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'mastered'
  | 'needs_review';

export type UnifiedActivityState = {
  activityType: string;
  status: UnifiedActivityStatus;
  completionPercentage: number;
  masteryScore: number | null;
  confidenceScore: number | null;
  evidenceSaved: boolean;
};

export function resolveUnifiedActivityState(input: {
  score?: number | null;
  status?: string | null;
  confidence?: number | null;
  hasResponse?: boolean;
}): UnifiedActivityState {
  const score = input.score ?? null;
  const confidence = input.confidence ?? null;
  const hasResponse = input.hasResponse ?? false;

  let status: UnifiedActivityStatus = 'not_started';
  let completionPercentage = 0;

  if (hasResponse) {
    status = 'submitted';
    completionPercentage = 100;
  }

  if (score !== null && score >= 80) {
    status = 'mastered';
  }

  if (score !== null && score < 50) {
    status = 'needs_review';
  }

  if (input.status === 'in_progress') {
    status = 'in_progress';
    completionPercentage = 50;
  }

  return {
    activityType: input.status ?? 'activity',
    status,
    completionPercentage,
    masteryScore: score,
    confidenceScore: confidence,
    evidenceSaved: hasResponse,
  };
}
