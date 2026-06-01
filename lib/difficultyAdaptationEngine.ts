import { type ActivityEvidence, aggregateActivityEvidence } from './activityEvidence';

export type DifficultyLevel = 'scaffolded' | 'secure' | 'stretch';

export type ActivityDifficultyPlan = {
  activityType: string;
  difficultyLevel: DifficultyLevel;
  supportStrategy: string;
  successTarget: string;
};

export type DifficultyAdaptationPlan = {
  overallLevel: DifficultyLevel;
  reason: string;
  activityPlans: ActivityDifficultyPlan[];
};

function planForActivity(activityType: string, level: DifficultyLevel): ActivityDifficultyPlan {
  const base = {
    activityType,
    difficultyLevel: level,
  };

  if (activityType === 'quiz') {
    return {
      ...base,
      supportStrategy: level === 'scaffolded' ? 'Use core retrieval only with immediate recap prompts.' : level === 'stretch' ? 'Use mixed retrieval with synoptic links.' : 'Use standard retrieval with knowledge-check feedback.',
      successTarget: level === 'scaffolded' ? 'Aim for 60% plus corrections.' : level === 'stretch' ? 'Aim for 85% with accurate links across themes.' : 'Aim for 70% secure recall.',
    };
  }

  if (activityType === 'ao3_interpretation') {
    return {
      ...base,
      supportStrategy: level === 'scaffolded' ? 'Provide sentence starters and explicit evaluation prompts.' : level === 'stretch' ? 'Reduce prompts and require independent judgement on convincingness.' : 'Use guided prompts for argument, evidence and limitation.',
      successTarget: level === 'scaffolded' ? 'Identify the interpretation argument and one support/limit.' : level === 'stretch' ? 'Evaluate argument, evidence and limitation with a clear judgement.' : 'Explain how convincing the interpretation is using precise context.',
    };
  }

  if (activityType === 'peel_response') {
    return {
      ...base,
      supportStrategy: level === 'scaffolded' ? 'Use PEEL sentence stems and a suggested evidence bank.' : level === 'stretch' ? 'Require a developed paragraph with counter-judgement.' : 'Use standard PEEL structure with a linked judgement.',
      successTarget: level === 'scaffolded' ? 'Write one clear PEEL paragraph over 60 words.' : level === 'stretch' ? 'Write a developed analytical paragraph over 120 words.' : 'Write a secure paragraph over 90 words.',
    };
  }

  if (activityType === 'timeline') {
    return {
      ...base,
      supportStrategy: level === 'scaffolded' ? 'Focus on sequencing and one significance explanation.' : level === 'stretch' ? 'Add change/continuity or turning-point judgement.' : 'Explain chronology and significance together.',
      successTarget: level === 'scaffolded' ? 'Correctly place key events and explain one event.' : level === 'stretch' ? 'Judge whether the sequence shows change or continuity.' : 'Explain why the sequence matters to the enquiry.',
    };
  }

  if (activityType === 'judgement_ranking') {
    return {
      ...base,
      supportStrategy: level === 'scaffolded' ? 'Rank from a short list with guided criteria.' : level === 'stretch' ? 'Rank independently and justify with comparative reasoning.' : 'Rank factors and justify the top choice.',
      successTarget: level === 'scaffolded' ? 'Give one clear reason for the top-ranked factor.' : level === 'stretch' ? 'Compare at least two factors before judging.' : 'Justify the ranking using precise evidence.',
    };
  }

  return {
    ...base,
    supportStrategy: level === 'scaffolded' ? 'Use additional prompts and shorter steps.' : level === 'stretch' ? 'Reduce scaffolding and increase independence.' : 'Use standard guidance.',
    successTarget: level === 'scaffolded' ? 'Complete the task accurately with support.' : level === 'stretch' ? 'Complete independently with a developed judgement.' : 'Complete securely.',
  };
}

export function buildDifficultyAdaptationPlan(evidence: ActivityEvidence[], requiredActivityTypes: string[]): DifficultyAdaptationPlan {
  const aggregate = aggregateActivityEvidence(evidence);
  const lowConfidence = aggregate.averageConfidence !== null && aggregate.averageConfidence <= 2.5;
  const weakMastery = aggregate.averageMastery !== null && aggregate.averageMastery < 60;
  const strongMastery = aggregate.averageMastery !== null && aggregate.averageMastery >= 80 && aggregate.completionPercentage >= 80;

  const overallLevel: DifficultyLevel = lowConfidence || weakMastery || aggregate.missing > 0 ? 'scaffolded' : strongMastery ? 'stretch' : 'secure';
  const reason = overallLevel === 'scaffolded'
    ? 'Evidence suggests the student needs more support before moving to independent exam practice.'
    : overallLevel === 'stretch'
      ? 'Evidence suggests the student is ready for reduced scaffolding and higher-challenge judgement.'
      : 'Evidence suggests the student should use standard guided practice.';

  return {
    overallLevel,
    reason,
    activityPlans: requiredActivityTypes.map((activityType) => planForActivity(activityType, overallLevel)),
  };
}
