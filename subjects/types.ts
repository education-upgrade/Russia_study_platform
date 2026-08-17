export type SubjectPackIdentity = {
  id: string;
  subject: string;
  courseName: string;
  examBoard: string;
  qualification: string;
  shortName: string;
  platformName: string;
  brandMark: string;
};

export type SubjectPathway = {
  pathwaySlug: string;
  title: string;
  lessonTitle: string;
  subtitle: string;
  yearGroup: 'Y12' | 'Y13';
  courseWeek: number;
  unitNumber: number;
  unitTitle: string;
  status: 'ready' | 'planned';
  routeBase: string;
  metadata?: Record<string, unknown>;
};

export type SubjectCourseUnit = {
  unitNumber: number;
  title: string;
  subtitle: string;
  yearGroup: 'Y12' | 'Y13';
  status: 'ready' | 'building' | 'planned';
  pathwaySlugs: string[];
};

export type StudyMode = 'full_guided_study' | 'exam_practice' | 'recap' | 'confidence_repair';

export type SubjectActivityPreset = {
  id: StudyMode;
  title: string;
  description: string;
  activities: string[];
};

export type SubjectActivityOption = {
  activityType: string;
  label: string;
  description: string;
  estimatedMinutes: number;
};

export type SubjectPack = {
  identity: SubjectPackIdentity;
  pathways: SubjectPathway[];
  courseUnits: SubjectCourseUnit[];
  activityOptions: SubjectActivityOption[];
  activityPresets: SubjectActivityPreset[];
  defaultInstructions: (mode: StudyMode, title: string) => string;
};
