import type { SubjectPack } from './types';
import { historyRussiaPack } from './history-russia';

export const subjectPacks: Record<string, SubjectPack> = {
  [historyRussiaPack.identity.id]: historyRussiaPack,
};

export function getSubjectPack(subjectId: string) {
  return subjectPacks[subjectId] ?? null;
}
