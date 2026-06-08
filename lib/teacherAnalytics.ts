import { aggregateActivityEvidence, type ActivityEvidence } from './activityEvidence';
import { type InterventionRecommendation } from './interventionEngine';

export type TeacherDecisionStatus =
  | 'waiting_for_evidence'
  | 'intervention_needed'
  | 'confidence_concern'
  | 'exam_practice_ready'
  | 'secure_stretch';

export type TeacherAnalyticsDecision = {
  status: TeacherDecisionStatus;
  headline: string;
  explanation: string;
  priorityFocus: string;
  nextTeachingMove: string;
  suggestedDoNow: string;
  reviewQuestions: string[];
};

function flaggedEvidence(evidence: ActivityEvidence[]) {
  return evidence.filter((item) => item.interventionFlag !== 'Submitted');
}

function firstPriorityLabel(evidence: ActivityEvidence[], fallback: string) {
  return flaggedEvidence(evidence)[0]?.label ?? fallback;
}

function reviewQuestionsFor(evidence: ActivityEvidence[]) {
  const questions: string[] = [];

  if (evidence.some((item) => item.activityType === 'quiz' && item.interventionFlag !== 'Submitted')) {
    questions.push('Which core knowledge is insecure in the retrieval evidence?');
  }

  if (evidence.some((item) => item.activityType === 'flashcards' && item.interventionFlag !== 'Submitted')) {
    questions.push('Which cards are still marked as revisit or nearly secure?');
  }

  if (evidence.some((item) => item.activityType === 'timeline' && item.interventionFlag !== 'Submitted')) {
    questions.push('Can the student explain why chronology matters to the enquiry?');
  }

  if (evidence.some((item) => item.activityType === 'judgement_ranking' && item.interventionFlag !== 'Submitted')) {
    questions.push('Can the student justify why one factor matters more than another?');
  }

  if (evidence.some((item) => item.activityType === 'ao3_interpretation' && item.interventionFlag !== 'Submitted')) {
    questions.push('Is the student evaluating how convincing the interpretation is, rather than describing it?');
  }

  if (evidence.some((item) => item.activityType === 'peel_response' && item.interventionFlag !== 'Submitted')) {
    questions.push('Does the written response use precise evidence and link back to the question?');
  }

  if (evidence.some((item) => item.activityType === 'confidence_exit_ticket' && item.interventionFlag !== 'Submitted')) {
    questions.push('Is the issue low knowledge, low confidence, or both?');
  }

  return questions.length ? questions : ['What is the next best challenge now the evidence is broadly secure?'];
}

export function buildTeacherAnalyticsDecision(
  evidence: ActivityEvidence[],
  recommendation: InterventionRecommendation,
): TeacherAnalyticsDecision {
  const aggregate = aggregateActivityEvidence(evidence);

  if (aggregate.missing > 0) {
    return {
      status: 'waiting_for_evidence',
      headline: 'Evidence still incomplete',
      explanation: `${aggregate.missing} required ${aggregate.missing === 1 ? 'activity is' : 'activities are'} missing, so progress cannot be judged securely yet.`,
      priorityFocus: firstPriorityLabel(evidence, 'Missing study evidence'),
      nextTeachingMove: 'Get the missing evidence completed before assigning a new route.',
      suggestedDoNow: 'Open the pathway and complete the first missing activity before moving on.',
      reviewQuestions: reviewQuestionsFor(evidence),
    };
  }

  if (recommendation.routeMode === 'confidence_repair') {
    return {
      status: 'confidence_concern',
      headline: 'Confidence needs rebuilding',
      explanation: 'The student has submitted evidence, but their confidence data suggests insecurity that may limit independent revision.',
      priorityFocus: firstPriorityLabel(evidence, 'Confidence'),
      nextTeachingMove: 'Set a short confidence repair route with core notes, retrieval and a second confidence check.',
      suggestedDoNow: 'Write three secure facts, one uncertain area and one question to ask the teacher.',
      reviewQuestions: reviewQuestionsFor(evidence),
    };
  }

  if (recommendation.routeMode === 'recap') {
    return {
      status: 'intervention_needed',
      headline: 'Knowledge recap needed',
      explanation: recommendation.rationale,
      priorityFocus: firstPriorityLabel(evidence, 'Retrieval and core knowledge'),
      nextTeachingMove: 'Assign a recap route before moving to heavier AO3 or essay practice.',
      suggestedDoNow: 'Complete a short retrieval starter: causes, events and consequences in order.',
      reviewQuestions: reviewQuestionsFor(evidence),
    };
  }

  if (recommendation.title.toLowerCase().includes('stretch')) {
    return {
      status: 'secure_stretch',
      headline: 'Ready for stretch exam practice',
      explanation: 'The evidence is broadly secure, so the next step should reduce scaffolding and increase independent judgement.',
      priorityFocus: 'Challenge and independent judgement',
      nextTeachingMove: 'Set a stretch route using AO3 interpretation or 25-mark planning.',
      suggestedDoNow: 'Make one synoptic link between this topic and another Russia theme.',
      reviewQuestions: reviewQuestionsFor(evidence),
    };
  }

  return {
    status: 'exam_practice_ready',
    headline: 'Ready for guided exam practice',
    explanation: recommendation.rationale,
    priorityFocus: firstPriorityLabel(evidence, 'Written judgement'),
    nextTeachingMove: 'Set a short exam-practice route and check that evidence is being used to support judgement.',
    suggestedDoNow: 'Plan one PEEL paragraph: point, precise evidence, explanation and judgement link.',
    reviewQuestions: reviewQuestionsFor(evidence),
  };
}
