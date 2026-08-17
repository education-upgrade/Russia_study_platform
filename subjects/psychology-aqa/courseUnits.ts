import type { SubjectCourseUnit } from '@/subjects/types';

export const psychologyAqaCourseUnits: SubjectCourseUnit[] = [
  {
    unitNumber: 1,
    title: 'Social influence',
    subtitle: 'Conformity, obedience, resistance and minority influence.',
    yearGroup: 'Y12',
    status: 'building',
    pathwaySlugs: ['psychology-social-influence-conformity'],
  },
  {
    unitNumber: 2,
    title: 'Memory',
    subtitle: 'Models of memory and eyewitness testimony pathways planned for the next portability tests.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['psychology-memory-models', 'psychology-memory-eyewitness'],
  },
];
