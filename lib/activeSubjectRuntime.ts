import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { pathwayRegistry } from '@/lib/pathwayRegistry';
import { activeSubjectPack } from '@/subjects/activeSubject';
import { subjectPacks } from '@/subjects';

function packForPathway(pathwaySlug: string) {
  if (activeSubjectPack.pathways.some((item) => item.pathwaySlug === pathwaySlug)) return activeSubjectPack;
  return Object.values(subjectPacks).find((pack) => pack.pathways.some((item) => item.pathwaySlug === pathwaySlug)) ?? null;
}

export function tryGetActivePathwayConfig(pathwaySlug: string) {
  const pack = packForPathway(pathwaySlug);
  const subjectPathway = pack?.pathways.find((item) => item.pathwaySlug === pathwaySlug);
  if (subjectPathway) return subjectPathway;

  // Legacy History pathways can still be registered outside a subject pack while
  // the Russia content is migrated. Resolve only an exact slug: never silently
  // substitute a different Russia pathway for an unknown subject pathway.
  return pathwayRegistry[pathwaySlug] ?? null;
}

export function getActivePathwayConfig(pathwaySlug: string) {
  const pathway = tryGetActivePathwayConfig(pathwaySlug);
  if (!pathway) throw new Error(`Unknown pathway: ${pathwaySlug}`);
  return pathway;
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
