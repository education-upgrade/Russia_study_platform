import type { SubjectPack } from '@/subjects/types';
import { psychologyAqaActivityOptions, psychologyAqaActivityPresets, getPsychologyDefaultInstructions } from './activityPresets';
import { psychologyAqaCourseUnits } from './courseUnits';
import { psychologyAqaIdentity } from './identity';
import { psychologyAqaPathways } from './pathways';

export const psychologyAqaPack: SubjectPack = {
  identity: psychologyAqaIdentity,
  pathways: psychologyAqaPathways,
  courseUnits: psychologyAqaCourseUnits,
  activityOptions: psychologyAqaActivityOptions,
  activityPresets: psychologyAqaActivityPresets,
  defaultInstructions: getPsychologyDefaultInstructions,
};
