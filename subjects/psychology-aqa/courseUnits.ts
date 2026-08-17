import type { SubjectCourseUnit } from '@/subjects/types';

export const psychologyAqaCourseUnits: SubjectCourseUnit[] = [
  {
    unitNumber: 1,
    title: 'Memory',
    subtitle: 'Pilot pathways used to test subject portability without changing the shared platform.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['psychology-memory-models', 'psychology-memory-eyewitness'],
  },
  {
    unitNumber: 2,
    title: 'Social influence',
    subtitle: 'A second pilot unit to prove cross-unit organisation inside a non-History pack.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['psychology-social-influence-conformity'],
  },
];
