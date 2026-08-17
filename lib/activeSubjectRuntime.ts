import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { activeSubjectPack } from '@/subjects/activeSubject';
import { subjectPacks } from '@/subjects';

function packForPathway(pathwaySlug: string) {
  if (activeSubjectPack.pathways.some((item) => item.pathwaySlug === pathwaySlug)) return activeSubjectPack;
  return Object.values(subjectPacks).find((pack) => pack.pathways.some((item) => item.pathwaySlug === pathwaySlug)) ?? null;
}

export function getActivePathwayConfig(pathwaySlug: string) {
  const pack = packForPathway(pathwaySlug);
  const subjectPathway = pack?.pathways.find((item) => item.pathwaySlug === pathwaySlug);
  if (subjectPathway) return subjectPathway;
  return getPathwayConfig(pathwaySlug);
}

export function getActiveActivityLabel(activityType: string) {
  return activeSubjectPack.activityOptions.find((item) => item.activityType === activityType)?.label
    ?? getActivityLabel(activityType);
}

export function getSubjectActivityLabel(pathwaySlug: string, activityType: string) {
  const pack = packForPathway(pathwaySlug);
  return pack?.activityOptions.find((item) => item.activityType === activityType)?.label
    ?? getActivityLabel(activityType);
}
