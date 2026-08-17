import { getActivityLabel } from '@/lib/activityTypeRegistry';
import { getPathwayConfig } from '@/lib/pathwayRegistry';
import { activeSubjectPack } from '@/subjects/activeSubject';

export function getActivePathwayConfig(pathwaySlug: string) {
  const subjectPathway = activeSubjectPack.pathways.find((item) => item.pathwaySlug === pathwaySlug);
  if (subjectPathway) return subjectPathway;
  return getPathwayConfig(pathwaySlug);
}

export function getActiveActivityLabel(activityType: string) {
  return activeSubjectPack.activityOptions.find((item) => item.activityType === activityType)?.label
    ?? getActivityLabel(activityType);
}
