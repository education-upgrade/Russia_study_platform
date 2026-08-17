import type { SubjectPack } from '@/subjects/types';
import { russiaActivityOptions, russiaActivityPresets, getRussiaDefaultInstructions } from './activityPresets';
import { russiaCourseUnits } from './courseUnits';
import { historyRussiaIdentity } from './identity';
import { russiaPathways } from './pathways';

export const historyRussiaPack: SubjectPack = {
  identity: historyRussiaIdentity,
  pathways: russiaPathways,
  courseUnits: russiaCourseUnits,
  activityOptions: russiaActivityOptions,
  activityPresets: russiaActivityPresets,
  defaultInstructions: getRussiaDefaultInstructions,
};
