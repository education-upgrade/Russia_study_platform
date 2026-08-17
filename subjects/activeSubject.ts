import { subjectPacks } from './index';
import { assertValidSubjectPack } from './validateSubjectPack';

export const ACTIVE_SUBJECT_ID = process.env.NEXT_PUBLIC_ACTIVE_SUBJECT_ID || 'aqa-history-russia-1h';

// One codebase can now power separate subject deployments. Russia remains the
// default, while a Psychology deployment can set NEXT_PUBLIC_ACTIVE_SUBJECT_ID
// to aqa-psychology-7182 without changing shared teacher/student workflows.
const registeredSubjectPack = subjectPacks[ACTIVE_SUBJECT_ID];

if (!registeredSubjectPack) throw new Error(`Active subject pack ${ACTIVE_SUBJECT_ID} is not registered.`);

export const activeSubjectPack = assertValidSubjectPack(registeredSubjectPack);

export const activeSubjectIdentity = activeSubjectPack.identity;
export const activeSubjectPathways = activeSubjectPack.pathways;
export const activeSubjectCourseUnits = activeSubjectPack.courseUnits;
