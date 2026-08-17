import type { SubjectPack } from './types';

export type SubjectPackValidation = {
  valid: boolean;
  errors: string[];
};

export function validateSubjectPack(pack: SubjectPack): SubjectPackValidation {
  const errors: string[] = [];
  const pathwaySlugs = pack.pathways.map((item) => item.pathwaySlug);
  const pathwaySet = new Set(pathwaySlugs);
  const activityIds = pack.activityOptions.map((item) => item.activityType);
  const activitySet = new Set(activityIds);

  if (!pack.identity.id.trim()) errors.push('Subject identity must have an id.');
  if (!pack.identity.subject.trim()) errors.push('Subject identity must have a subject name.');
  if (!pack.identity.courseName.trim()) errors.push('Subject identity must have a course name.');
  if (pathwaySet.size !== pathwaySlugs.length) errors.push('Pathway slugs must be unique within a subject pack.');
  if (activitySet.size !== activityIds.length) errors.push('Activity options must have unique activityType values.');

  for (const unit of pack.courseUnits) {
    for (const slug of unit.pathwaySlugs) {
      if (!pathwaySet.has(slug)) errors.push(`Course unit ${unit.unitNumber} references unknown pathway: ${slug}.`);
    }
  }

  for (const preset of pack.activityPresets) {
    if (preset.activities.length === 0) errors.push(`Study mode ${preset.id} must contain at least one activity.`);
    for (const activity of preset.activities) {
      if (!activitySet.has(activity)) errors.push(`Study mode ${preset.id} references activity not exposed by this subject pack: ${activity}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidSubjectPack(pack: SubjectPack) {
  const result = validateSubjectPack(pack);
  if (!result.valid) {
    throw new Error(`Invalid subject pack ${pack.identity.id}:\n- ${result.errors.join('\n- ')}`);
  }
  return pack;
}
