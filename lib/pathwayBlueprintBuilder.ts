import { orderSupportedActivityTypes } from './activityTypeRegistry';
import { type ActivityEvidence } from './activityEvidence';
import { type InterventionRecommendation } from './interventionEngine';

export type AdaptivePathwayBlueprint = {
  pathwaySlug: string;
  lessonTitle: string;
  routeMode: InterventionRecommendation['routeMode'];
  title: string;
  rationale: string;
  requiredActivityTypes: string[];
  scaffoldLevel: 'support' | 'secure' | 'stretch';
  teacherInstructions: string;
  studentInstructions: string;
  successCriteria: string[];
};

function scaffoldLevelFor(recommendation: InterventionRecommendation): AdaptivePathwayBlueprint['scaffoldLevel'] {
  if (recommendation.routeMode === 'confidence_repair' || recommendation.routeMode === 'recap') return 'support';
  if (recommendation.title.toLowerCase().includes('stretch')) return 'stretch';
  return 'secure';
}

function criteriaFor(activityTypes: string[]) {
  const criteria = ['Complete each activity in order.'];
  if (activityTypes.includes('quiz')) criteria.push('Use retrieval evidence to check factual security.');
  if (activityTypes.includes('timeline')) criteria.push('Explain why chronology matters for the enquiry.');
  if (activityTypes.includes('judgement_ranking')) criteria.push('Justify the most important factor with precise evidence.');
  if (activityTypes.includes('ao3_interpretation')) criteria.push('Evaluate the interpretation directly.');
  if (activityTypes.includes('peel_response')) criteria.push('Write a PEEL paragraph with a clear judgement.');
  if (activityTypes.includes('confidence_exit_ticket')) criteria.push('Finish with an honest confidence check.');
  return criteria;
}

export function buildAdaptivePathwayBlueprint(args: {
  pathwaySlug: string;
  lessonTitle: string;
  evidence: ActivityEvidence[];
  recommendation: InterventionRecommendation;
}): AdaptivePathwayBlueprint {
  const requiredActivityTypes = orderSupportedActivityTypes(args.recommendation.requiredActivityTypes);

  return {
    pathwaySlug: args.pathwaySlug,
    lessonTitle: args.lessonTitle,
    routeMode: args.recommendation.routeMode,
    title: args.recommendation.title,
    rationale: args.recommendation.rationale,
    requiredActivityTypes,
    scaffoldLevel: scaffoldLevelFor(args.recommendation),
    teacherInstructions: args.recommendation.teacherMessage,
    studentInstructions: `${args.recommendation.title}: complete the activities in order and use the final confidence check to reflect on progress.`,
    successCriteria: criteriaFor(requiredActivityTypes),
  };
}
