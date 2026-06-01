import { type ActivityEvidence, aggregateActivityEvidence } from './activityEvidence';

export type InterventionRecommendation = {
  routeMode: 'recap' | 'exam_practice' | 'confidence_repair' | 'full_guided_study';
  title: string;
  rationale: string;
  requiredActivityTypes: string[];
  priorityAreas: string[];
  teacherMessage: string;
};

function hasFlag(evidence: ActivityEvidence[], flag: string) {
  return evidence.some((item) => item.interventionFlag === flag);
}

function hasActivity(evidence: ActivityEvidence[], activityType: string) {
  return evidence.some((item) => item.activityType === activityType);
}

export function recommendIntervention(evidence: ActivityEvidence[]): InterventionRecommendation {
  const aggregate = aggregateActivityEvidence(evidence);
  const flags = aggregate.flags;
  const priorityAreas = flags.map((item) => item.label);

  if (aggregate.missing > 0) {
    return {
      routeMode: 'recap',
      title: 'Completion catch-up route',
      rationale: `${aggregate.missing} task${aggregate.missing === 1 ? '' : 's'} still need evidence before mastery can be judged securely.`,
      requiredActivityTypes: evidence.filter((item) => item.completionStatus === 'missing').map((item) => item.activityType),
      priorityAreas,
      teacherMessage: 'Ask the student to complete the missing evidence tasks before setting a new pathway.',
    };
  }

  if (hasFlag(evidence, 'Low confidence') || (aggregate.averageConfidence !== null && aggregate.averageConfidence <= 2.5)) {
    return {
      routeMode: 'confidence_repair',
      title: 'Confidence repair route',
      rationale: 'The student has completed work but confidence evidence suggests insecurity or anxiety about the topic.',
      requiredActivityTypes: ['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket'],
      priorityAreas,
      teacherMessage: 'Set a short confidence repair route with notes, retrieval and a final confidence check.',
    };
  }

  if (hasFlag(evidence, 'Retrieval intervention') || (aggregate.averageMastery !== null && aggregate.averageMastery < 60)) {
    return {
      routeMode: 'recap',
      title: 'Knowledge recap route',
      rationale: 'Retrieval or overall mastery evidence is below the secure threshold.',
      requiredActivityTypes: ['lesson_content', 'flashcards', 'quiz', 'confidence_exit_ticket'],
      priorityAreas,
      teacherMessage: 'Set a recap route before moving to a more demanding written or AO3 task.',
    };
  }

  if (hasFlag(evidence, 'AO3 development')) {
    return {
      routeMode: 'exam_practice',
      title: 'AO3 interpretation booster',
      rationale: 'The student needs to strengthen interpretation evaluation rather than just completing the activity.',
      requiredActivityTypes: ['quiz', 'ao3_interpretation', 'peel_response', 'confidence_exit_ticket'],
      priorityAreas,
      teacherMessage: 'Set an AO3 booster route with retrieval first, then interpretation evaluation and written argument.',
    };
  }

  if (hasFlag(evidence, 'Judgement development') || hasFlag(evidence, 'Written response needs development')) {
    return {
      routeMode: 'exam_practice',
      title: 'Judgement and writing booster',
      rationale: 'The student needs to improve explanation, ranking justification or written judgement.',
      requiredActivityTypes: ['quiz', 'judgement_ranking', 'peel_response', 'confidence_exit_ticket'],
      priorityAreas,
      teacherMessage: 'Set a short judgement-to-PEEL route and check that evidence links back to the enquiry question.',
    };
  }

  if (hasFlag(evidence, 'Chronology check') || hasActivity(flags, 'timeline')) {
    return {
      routeMode: 'recap',
      title: 'Chronology repair route',
      rationale: 'Timeline evidence suggests the student needs to strengthen sequencing and turning-point explanation.',
      requiredActivityTypes: ['timeline', 'quiz', 'confidence_exit_ticket'],
      priorityAreas,
      teacherMessage: 'Set a chronology repair route and ask the student to explain why the turning point matters.',
    };
  }

  return {
    routeMode: 'exam_practice',
    title: 'Stretch exam-practice route',
    rationale: 'Evidence is broadly secure, so the next best step is to apply knowledge through interpretation and written argument.',
    requiredActivityTypes: ['quiz', 'ao3_interpretation', 'peel_response', 'confidence_exit_ticket'],
    priorityAreas: [],
    teacherMessage: 'Move the student on to a higher-challenge exam-practice route.',
  };
}
