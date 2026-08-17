import type { SubjectPack } from '@/subjects/types';
import { russiaActivityOptions, russiaActivityPresets, getRussiaDefaultInstructions } from './activityPresets';
import { russiaCourseUnits } from './courseUnits';
import { russiaPathways } from './pathways';

export const historyRussiaPack: SubjectPack = {
  identity: {
    id: 'aqa-history-russia-1h',
    subject: 'History',
    courseName: 'Tsarist and Communist Russia 1855–1964',
    examBoard: 'AQA',
    qualification: 'A Level',
    shortName: 'Russia',
    platformName: 'Russia Study',
    brandMark: 'R',
  },
  pathways: russiaPathways,
  courseUnits: russiaCourseUnits,
  activityOptions: russiaActivityOptions,
  activityPresets: russiaActivityPresets,
  defaultInstructions: getRussiaDefaultInstructions,
};
