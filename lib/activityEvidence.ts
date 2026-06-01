import { getActivityLabel } from './activityTypeRegistry';

export type RawActivityResponse = {
  activity_id?: string;
  status?: string;
  score?: number | null;
  response_type?: string;
  response_json?: any;
  last_saved_at?: string | null;
};

export type ActivityEvidence = {
  activityType: string;
  label: string;
  completionStatus: 'missing' | 'in_progress' | 'complete';
  masteryStatus: 'missing' | 'intervention' | 'developing' | 'secure';
  masteryScore: number | null;
  confidenceScore: number | null;
  evidenceValue: string;
  evidenceSummary: string;
  interventionFlag: string;
  recommendedAction: string;
  savedAt: string | null;
  rawResponse: RawActivityResponse | null;
};

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function truncate(value: unknown, fallback: string) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return fallback;
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

function completionFromResponse(response?: RawActivityResponse | null): ActivityEvidence['completionStatus'] {
  if (!response) return 'missing';
  if (response.status === 'complete' || response.status === 'submitted') return 'complete';
  return 'in_progress';
}

function statusFromScore(score: number | null): ActivityEvidence['masteryStatus'] {
  if (score === null) return 'missing';
  if (score < 50) return 'intervention';
  if (score < 75) return 'developing';
  return 'secure';
}

function buildAction(flag: string) {
  if (flag === 'Missing evidence') return 'Ask the student to complete this activity.';
  if (flag === 'Low confidence') return 'Check the least secure area and assign targeted recap.';
  if (flag === 'Retrieval intervention') return 'Set a short recap route before moving on.';
  if (flag === 'Written response needs development') return 'Review explanation, evidence and judgement.';
  if (flag === 'Flashcards revisit needed') return 'Repeat revisit cards until secure.';
  if (flag === 'Chronology check') return 'Ask the student to explain why their chosen event matters.';
  if (flag === 'AO3 development') return 'Check whether the student evaluates the interpretation rather than describing it.';
  if (flag === 'Judgement development') return 'Check whether the ranking is justified with precise evidence.';
  return 'No urgent action.';
}

export function normaliseActivityEvidence(activityType: string, response?: RawActivityResponse | null): ActivityEvidence {
  const json = response?.response_json ?? {};
  const completionStatus = completionFromResponse(response);

  if (!response) {
    return {
      activityType,
      label: getActivityLabel(activityType),
      completionStatus: 'missing',
      masteryStatus: 'missing',
      masteryScore: null,
      confidenceScore: null,
      evidenceValue: 'Missing',
      evidenceSummary: 'No saved evidence yet.',
      interventionFlag: 'Missing evidence',
      recommendedAction: buildAction('Missing evidence'),
      savedAt: null,
      rawResponse: null,
    };
  }

  let masteryScore: number | null = null;
  let confidenceScore: number | null = null;
  let evidenceValue = response.status ?? 'Saved';
  let evidenceSummary = 'Evidence saved.';
  let interventionFlag = 'Submitted';

  if (activityType === 'quiz') {
    masteryScore = asNumber(json.percentage) ?? response.score ?? null;
    evidenceValue = response.score === null || response.score === undefined ? 'Submitted' : `${response.score}/${json.maxScore ?? '?'}`;
    evidenceSummary = typeof json.percentage === 'number' ? `${json.percentage}% retrieval accuracy.` : 'Retrieval quiz submitted.';
    if ((masteryScore ?? 100) < 60) interventionFlag = 'Retrieval intervention';
  } else if (activityType === 'flashcards') {
    const total = asNumber(json.totalCards) ?? 0;
    const rated = asNumber(json.ratedCount) ?? 0;
    const secure = asNumber(json.secureCount) ?? 0;
    const nearly = asNumber(json.nearlyCount) ?? 0;
    const revisit = asNumber(json.revisitCount) ?? 0;
    masteryScore = total > 0 ? Math.round((secure / total) * 100) : null;
    evidenceValue = total > 0 ? `${rated}/${total}` : 'Submitted';
    evidenceSummary = `${secure} secure · ${nearly} nearly · ${revisit} revisit.`;
    if (revisit > 0) interventionFlag = 'Flashcards revisit needed';
  } else if (activityType === 'peel_response') {
    const words = asNumber(json.wordCount) ?? 0;
    masteryScore = words >= 100 ? 80 : words >= 60 ? 65 : 40;
    evidenceValue = `${words} words`;
    evidenceSummary = truncate(json.fullResponse, 'Written response submitted.');
    if (words < 60) interventionFlag = 'Written response needs development';
  } else if (activityType === 'confidence_exit_ticket') {
    confidenceScore = asNumber(json.confidence) ?? response.score ?? null;
    masteryScore = confidenceScore === null ? null : confidenceScore * 20;
    evidenceValue = confidenceScore === null ? 'Submitted' : `${confidenceScore}/5`;
    evidenceSummary = truncate(json.leastSecureArea ?? json.needHelpWith ?? json.reflection, 'Confidence check submitted.');
    if ((confidenceScore ?? 5) <= 2) interventionFlag = 'Low confidence';
  } else if (activityType === 'timeline') {
    masteryScore = completionStatus === 'complete' ? 70 : 50;
    evidenceValue = 'Saved';
    evidenceSummary = truncate(json.significanceExplanation ?? json.chosenEventTitle ?? json.reflection, 'Timeline judgement submitted.');
    if (!json.significanceExplanation && !json.reflection) interventionFlag = 'Chronology check';
  } else if (activityType === 'judgement_ranking') {
    masteryScore = completionStatus === 'complete' ? 70 : 50;
    evidenceValue = 'Saved';
    evidenceSummary = truncate(json.justification ?? json.topFactor ?? json.reflection, 'Judgement ranking submitted.');
    if (!json.justification && !json.reflection) interventionFlag = 'Judgement development';
  } else if (activityType === 'ao3_interpretation') {
    masteryScore = completionStatus === 'complete' ? 70 : 50;
    evidenceValue = 'Saved';
    evidenceSummary = truncate(json.evaluation ?? json.judgement ?? json.reflection, 'AO3 interpretation submitted.');
    if (!json.evaluation && !json.judgement && !json.reflection) interventionFlag = 'AO3 development';
  }

  const masteryStatus = interventionFlag === 'Submitted' ? statusFromScore(masteryScore) : ((masteryScore ?? 0) < 75 ? 'developing' : 'secure');

  return {
    activityType,
    label: getActivityLabel(activityType),
    completionStatus,
    masteryStatus,
    masteryScore,
    confidenceScore,
    evidenceValue,
    evidenceSummary,
    interventionFlag,
    recommendedAction: buildAction(interventionFlag),
    savedAt: response.last_saved_at ?? null,
    rawResponse: response,
  };
}

export function aggregateActivityEvidence(evidence: ActivityEvidence[]) {
  const trackable = evidence.length;
  const complete = evidence.filter((item) => item.completionStatus === 'complete').length;
  const missing = evidence.filter((item) => item.completionStatus === 'missing').length;
  const flags = evidence.filter((item) => item.interventionFlag !== 'Submitted');
  const scored = evidence.map((item) => item.masteryScore).filter((score): score is number => typeof score === 'number');
  const averageMastery = scored.length ? Math.round(scored.reduce((total, score) => total + score, 0) / scored.length) : null;
  const confidenceScores = evidence.map((item) => item.confidenceScore).filter((score): score is number => typeof score === 'number');
  const averageConfidence = confidenceScores.length ? Math.round((confidenceScores.reduce((total, score) => total + score, 0) / confidenceScores.length) * 10) / 10 : null;

  return {
    trackable,
    complete,
    missing,
    flags,
    averageMastery,
    averageConfidence,
    completionPercentage: trackable ? Math.round((complete / trackable) * 100) : 0,
  };
}
