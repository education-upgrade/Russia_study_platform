import { pathwayOptions, type PathwayConfig } from './pathwayRegistry';

const displayTitleOverrides: Record<string, string> = {
  'russia-1855': 'Russia in 1855',
  'crimean-war': 'The Crimean War',
  'why-serfdom-had-to-end': 'Why Serfdom Had to End',
  'emancipation-serfs': 'The Emancipation of the Serfs',
  'alexander-ii-wider-reforms': 'Alexander II’s Wider Reforms',
  'reform-preserve-autocracy': 'Reform to Preserve Autocracy?',
  'power-ideology-control': 'Power, Ideology and Control',
  'essay-skills-alexander-ii': 'Essay Skills: Alexander II',
};

const builtUnit3PathwaySlugs = new Set([
  'industry-before-1894',
  'agriculture-land-hunger',
  'social-divisions',
  'orthodoxy-culture-authority',
  'tsarism-secure-1894',
]);

export type OrganisedPathway = PathwayConfig & {
  displayTitle: string;
  lessonNumber: number;
};

export type OrganisedUnit = {
  unitNumber: number;
  unitTitle: string;
  yearGroup: PathwayConfig['yearGroup'];
  lessons: OrganisedPathway[];
};

export function getPathwayDisplayTitle(pathway: PathwayConfig) {
  return displayTitleOverrides[pathway.pathwaySlug] ?? pathway.title;
}

function isAvailablePathway(pathway: PathwayConfig) {
  return pathway.status === 'ready' || builtUnit3PathwaySlugs.has(pathway.pathwaySlug);
}

export function getOrganisedReadyUnits(): OrganisedUnit[] {
  const grouped = new Map<string, PathwayConfig[]>();

  pathwayOptions
    .filter(isAvailablePathway)
    .forEach((pathway) => {
      const key = `${pathway.yearGroup}-${pathway.unitNumber}`;
      const current = grouped.get(key) ?? [];
      current.push(pathway);
      grouped.set(key, current);
    });

  return Array.from(grouped.values())
    .map((pathways) => {
      const ordered = [...pathways].sort((first, second) => first.courseWeek - second.courseWeek);
      const first = ordered[0];

      return {
        unitNumber: first.unitNumber,
        unitTitle: first.unitTitle,
        yearGroup: first.yearGroup,
        lessons: ordered.map((pathway, index) => ({
          ...pathway,
          displayTitle: getPathwayDisplayTitle(pathway),
          lessonNumber: index + 1,
        })),
      };
    })
    .sort((first, second) => {
      if (first.yearGroup !== second.yearGroup) return first.yearGroup.localeCompare(second.yearGroup);
      return first.unitNumber - second.unitNumber;
    });
}
