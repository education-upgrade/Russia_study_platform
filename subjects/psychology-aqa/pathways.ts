import type { SubjectPathway } from '@/subjects/types';

// Structural proof only: these pathways are deliberately planned, not yet student-facing.
export const psychologyAqaPathways: SubjectPathway[] = [
  {
    pathwaySlug: 'psychology-memory-models',
    title: 'Models of memory',
    lessonTitle: 'How do psychologists explain the structure of memory?',
    subtitle: 'A pilot pathway for knowledge, application and evaluation activities.',
    yearGroup: 'Y12',
    courseWeek: 1,
    unitNumber: 1,
    unitTitle: 'Memory',
    status: 'planned',
    routeBase: '/student/lesson/psychology-memory-models',
    metadata: { skillFocus: ['knowledge', 'application', 'evaluation'] },
  },
  {
    pathwaySlug: 'psychology-memory-eyewitness',
    title: 'Eyewitness testimony',
    lessonTitle: 'What affects the accuracy of eyewitness testimony?',
    subtitle: 'A pilot pathway combining retrieval, application and written evaluation.',
    yearGroup: 'Y12',
    courseWeek: 2,
    unitNumber: 1,
    unitTitle: 'Memory',
    status: 'planned',
    routeBase: '/student/lesson/psychology-memory-eyewitness',
    metadata: { skillFocus: ['knowledge', 'application', 'evaluation'] },
  },
  {
    pathwaySlug: 'psychology-social-influence-conformity',
    title: 'Conformity',
    lessonTitle: 'Why do people conform?',
    subtitle: 'A second-topic pilot to prove that the pack can organise multiple units.',
    yearGroup: 'Y12',
    courseWeek: 3,
    unitNumber: 2,
    unitTitle: 'Social influence',
    status: 'planned',
    routeBase: '/student/lesson/psychology-social-influence-conformity',
    metadata: { skillFocus: ['knowledge', 'application', 'evaluation'] },
  },
];
