import { subjectPacks } from './index';
import { assertValidSubjectPack } from './validateSubjectPack';

export const ACTIVE_SUBJECT_ID = 'aqa-history-russia-1h';

// Single active pack for the current pilot. Multi-subject class/course selection
// can later resolve this from the class without changing workflow consumers.
const registeredSubjectPack = subjectPacks[ACTIVE_SUBJECT_ID];

if (!registeredSubjectPack) throw new Error(`Active subject pack ${ACTIVE_SUBJECT_ID} is not registered.`);

// Fail early if a future subject pack contains broken unit/pathway references or
// presets that point at activities the pack has not exposed.
export const activeSubjectPack = assertValidSubjectPack(registeredSubjectPack);

export const activeSubjectIdentity = activeSubjectPack.identity;
export const activeSubjectPathways = activeSubjectPack.pathways;
export const activeSubjectCourseUnits = activeSubjectPack.courseUnits;
