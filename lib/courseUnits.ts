import { russiaCourseUnits, getRussiaCourseUnit } from '@/subjects/history-russia/courseUnits';
import type { SubjectCourseUnit } from '@/subjects/types';

// Backwards-compatible exports while curriculum consumers migrate to subject packs.
export type CourseUnit = SubjectCourseUnit;
export const courseUnits = russiaCourseUnits;
export const getCourseUnit = getRussiaCourseUnit;
