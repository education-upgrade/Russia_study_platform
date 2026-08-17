import { historyRussiaPack } from './history-russia';

// Single active pack for the current pilot. Multi-subject class/course selection
// can be added later without changing teacher/student workflow consumers.
export const activeSubjectPack = historyRussiaPack;
export const activeSubjectIdentity = historyRussiaPack.identity;
export const activeSubjectPathways = historyRussiaPack.pathways;
export const activeSubjectCourseUnits = historyRussiaPack.courseUnits;
