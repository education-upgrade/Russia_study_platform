import type { SubjectPack } from './types';
import { assertValidSubjectPack } from './validateSubjectPack';
import { historyRussiaPack } from './history-russia';
import { psychologyAqaPack } from './psychology-aqa';

const registeredPacks = [historyRussiaPack, psychologyAqaPack].map(assertValidSubjectPack);

export const subjectPacks: Record<string, SubjectPack> = Object.fromEntries(
  registeredPacks.map((pack) => [pack.identity.id, pack]),
);

export function getSubjectPack(subjectId: string) {
  return subjectPacks[subjectId] ?? null;
}
