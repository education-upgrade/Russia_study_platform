export type PathwayReadiness = 'ready' | 'needs-audit' | 'in-development' | 'planned';

export type PathwayReadinessRecord = {
  status: PathwayReadiness;
  note: string;
};

export const pathwayReadiness: Record<string, PathwayReadinessRecord> = {
  'russia-1855': {
    status: 'needs-audit',
    note: 'Existing ready pathway; requires a full check against the current eight-activity modular standard.',
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
    status: 'needs-audit',
    note: 'Modular route exists, but the complete activity set and main pathway fallback flow still need checking.',
  },
  'alexander-ii-reform': {
    status: 'needs-audit',
    note: 'Older overview pathway using legacy custom route structure; treat as recap until standardised.',
  },
  '1905-revolution': {
    status: 'needs-audit',
    note: 'Existing pilot pathway; requires audit against the current modular and content standards.',
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
  if (status === 'needs-audit') return 'Needs audit';
  if (status === 'in-development') return 'In development';
  return 'Planned';
}
