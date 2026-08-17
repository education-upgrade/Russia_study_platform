import { historyRussiaIdentity } from './history-russia/identity';
import { psychologyAqaIdentity } from './psychology-aqa/identity';

const identities = {
  [historyRussiaIdentity.id]: historyRussiaIdentity,
  [psychologyAqaIdentity.id]: psychologyAqaIdentity,
};

const activeId = process.env.NEXT_PUBLIC_ACTIVE_SUBJECT_ID || historyRussiaIdentity.id;

// Kept separate from the full subject pack so global navigation does not bundle
// curriculum/pathway data just to render branding.
export const activeSubjectIdentity = identities[activeId as keyof typeof identities] ?? historyRussiaIdentity;
