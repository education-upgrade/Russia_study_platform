export type PathwayReadiness = 'ready' | 'recap' | 'needs-audit' | 'in-development' | 'planned';

export type PathwayReadinessRecord = {
  status: PathwayReadiness;
  note: string;
};

export const pathwayReadiness: Record<string, PathwayReadinessRecord> = {
  'russia-1855': {
    status: 'ready',
    note: 'Complete modular pathway audited against the eight-activity standard and tested successfully through PR #12.',
  },
  'crimean-war': {
    status: 'ready',
    note: 'Complete modular pathway tested with lesson, timeline, flashcards, quiz, judgement, AO3, PEEL and confidence.',
  },
  'why-serfdom-had-to-end': {
    status: 'ready',
    note: 'Complete modular pathway tested with all standard activities.',
  },
  'emancipation-serfs': {
    status: 'ready',
    note: 'Complete modular pathway merged through PR #10 and tested in preview.',
  },
  'alexander-ii-wider-reforms': {
    status: 'ready',
    note: 'Complete modular pathway audited against the eight-activity standard and tested successfully through PR #13.',
  },
  'alexander-ii-reform': {
    status: 'recap',
    note: 'Retained as an optional synoptic recap on why reform became necessary. It overlaps with the Crimean War and serfdom pathways, so it is not part of the core teaching sequence and should not be expanded as a duplicate eight-activity lesson.',
  },
  '1905-revolution': {
    status: 'ready',
    note: 'Complete modular pathway audited against the eight-activity standard, preview-tested and merged through PR #17.',
  },
};

export function getPathwayReadiness(pathwaySlug: string, registryStatus: 'ready' | 'planned'): PathwayReadinessRecord {
  return pathwayReadiness[pathwaySlug] ?? {
    status: registryStatus === 'ready' ? 'needs-audit' : 'planned',
    note: registryStatus === 'ready'
      ? 'Registry marks this pathway ready, but it has not yet passed the current modular audit.'
      : 'Pathway is present in the curriculum plan but has not yet been completed.',
  };
}

export function getPathwayReadinessLabel(status: PathwayReadiness) {
  if (status === 'ready') return 'Ready';
  if (status === 'recap') return 'Ready — recap';
  if (status === 'needs-audit') return 'Needs audit';
  if (status === 'in-development') return 'In development';
  return 'Planned';
}
