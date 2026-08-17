import { subjectPacks } from './index';

export const ACTIVE_SUBJECT_ID = 'aqa-history-russia-1h';

// Single active pack for the current pilot. Multi-subject class/course selection
// can later resolve this from the class without changing workflow consumers.
export const activeSubjectPack = subjectPacks[ACTIVE_SUBJECT_ID];

if (!activeSubjectPack) throw new Error(`Active subject pack ${ACTIVE_SUBJECT_ID} is not registered.`);

export const activeSubjectIdentity = activeSubjectPack.identity;
export const activeSubjectPathways = activeSubjectPack.pathways;
export const activeSubjectCourseUnits = activeSubjectPack.courseUnits;
