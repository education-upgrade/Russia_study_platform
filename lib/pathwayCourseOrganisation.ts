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
  'nicholas-ii-ruler': 'Nicholas II as Ruler',
  'industrialisation-nicholas-ii': 'Industrialisation under Nicholas II',
  'opposition-before-1905': 'Opposition before 1905',
  'manifesto-fundamental-laws': 'From Manifesto to Fundamental Laws',
  'stolypin-reform': 'Stolypin and Reform',
  'russia-before-1914': 'Russia before 1914',
  'russia-first-world-war': 'Russia and the First World War',
  'february-revolution': 'The February Revolution',
  'feb-oct-1917': 'From February to October 1917',
  'lenin-ideology-change': 'Lenin’s Russia: Ideology and Change',
  'bolshevik-consolidation': 'Bolshevik Consolidation and Opposition',
  'civil-war': 'The Russian Civil War',
  'war-communism': 'War Communism',
  'nep': 'The New Economic Policy',
  'struggle-after-lenin': 'The Struggle for Power after Lenin',
};

const builtPathwaySlugs = new Set([
  'industry-before-1894', 'agriculture-land-hunger', 'social-divisions',
  'orthodoxy-culture-authority', 'tsarism-secure-1894', 'nicholas-ii-ruler',
  'industrialisation-nicholas-ii', 'opposition-before-1905',
  'manifesto-fundamental-laws', 'stolypin-reform', 'russia-before-1914',
  'russia-first-world-war', 'february-revolution', 'feb-oct-1917',
  'lenin-ideology-change', 'bolshevik-consolidation', 'civil-war',
  'war-communism', 'nep', 'struggle-after-lenin',
]);

const unit6Title = 'Lenin and the emergence of Communist dictatorship';
const unit6AdditionalPathways: PathwayConfig[] = [
  { pathwaySlug: 'bolshevik-consolidation', title: 'Bolshevik consolidation and opposition', lessonTitle: 'How did the Bolsheviks consolidate power after October 1917?', subtitle: 'Political opposition, Cheka, Red Terror, Church, nationalities and party dictatorship', yearGroup: 'Y13', courseWeek: 2, unitNumber: 6, unitTitle: unit6Title, mainFocus: 'Political opposition, coercion, institutional control and one-party dictatorship', writtenFocus: 'Repression and consolidation judgement', writtenFocusType: 'JUDGEMENT_TASK', breadthLenses: ['governance', 'opposition', 'ideology', 'individuals'], status: 'ready', routeBase: '/student/lesson/bolshevik-consolidation' },
  { pathwaySlug: 'civil-war', title: 'The Russian Civil War', lessonTitle: 'Why did the Reds win the Russian Civil War?', subtitle: 'Reds, Whites, Trotsky, geography, organisation and foreign intervention', yearGroup: 'Y13', courseWeek: 3, unitNumber: 6, unitTitle: unit6Title, mainFocus: 'Red strengths, White weaknesses, geography, leadership and mobilisation', writtenFocus: 'Causes of Red victory', writtenFocusType: 'ESSAY_PLAN', breadthLenses: ['governance', 'opposition', 'economy', 'society', 'individuals'], status: 'ready', routeBase: '/student/lesson/civil-war' },
  { pathwaySlug: 'war-communism', title: 'War Communism', lessonTitle: 'How successful was War Communism?', subtitle: 'Nationalisation, requisitioning, labour, economic collapse and resistance', yearGroup: 'Y13', courseWeek: 4, unitNumber: 6, unitTitle: unit6Title, mainFocus: 'Emergency mobilisation, ideology, economic collapse and political resistance', writtenFocus: 'Success and failure judgement', writtenFocusType: 'JUDGEMENT_TASK', breadthLenses: ['economy', 'society', 'governance', 'ideology'], status: 'ready', routeBase: '/student/lesson/war-communism' },
  { pathwaySlug: 'nep', title: 'The New Economic Policy', lessonTitle: 'How successful was the New Economic Policy?', subtitle: 'Tax in kind, mixed economy, recovery, Nepmen and the Scissors Crisis', yearGroup: 'Y13', courseWeek: 5, unitNumber: 6, unitTitle: unit6Title, mainFocus: 'Economic retreat, recovery, ideological compromise and political control', writtenFocus: 'Short-term success vs long-term weakness', writtenFocusType: 'ESSAY_PLAN', breadthLenses: ['economy', 'society', 'governance', 'ideology'], status: 'ready', routeBase: '/student/lesson/nep' },
  { pathwaySlug: 'struggle-after-lenin', title: 'The struggle for power after Lenin', lessonTitle: 'Why did Stalin win the power struggle after Lenin?', subtitle: 'Contenders, General Secretaryship, alliances, ideology and rivals’ mistakes', yearGroup: 'Y13', courseWeek: 6, unitNumber: 6, unitTitle: unit6Title, mainFocus: 'Party machinery, ideological positioning, alliances and opposition weakness', writtenFocus: '25-mark causal judgement', writtenFocusType: 'ESSAY_PLAN', breadthLenses: ['governance', 'opposition', 'ideology', 'individuals'], status: 'ready', routeBase: '/student/lesson/struggle-after-lenin' },
];

// The teacher picker and assignment form both import pathwayOptions. Add the Unit 6
// configurations to that same array so a displayed topic can never resolve to a
// different fallback topic when the assignment is saved.
for (const pathway of unit6AdditionalPathways) {
  if (!pathwayOptions.some((existing) => existing.pathwaySlug === pathway.pathwaySlug)) {
    pathwayOptions.push(pathway);
  }
}
pathwayOptions.sort((first, second) => {
  if (first.yearGroup !== second.yearGroup) return first.yearGroup.localeCompare(second.yearGroup);
  return first.courseWeek - second.courseWeek;
});

export type OrganisedPathway = PathwayConfig & { displayTitle: string; lessonNumber: number };
export type OrganisedUnit = { unitNumber: number; unitTitle: string; yearGroup: PathwayConfig['yearGroup']; lessons: OrganisedPathway[] };

export function getPathwayDisplayTitle(pathway: PathwayConfig) {
  return displayTitleOverrides[pathway.pathwaySlug] ?? pathway.title;
}

function isAvailablePathway(pathway: PathwayConfig) {
  return pathway.status === 'ready' || builtPathwaySlugs.has(pathway.pathwaySlug);
}

export function getOrganisedReadyUnits(): OrganisedUnit[] {
  const grouped = new Map<string, PathwayConfig[]>();
  pathwayOptions.filter(isAvailablePathway).forEach((pathway) => {
    const key = `${pathway.yearGroup}-${pathway.unitNumber}`;
    grouped.set(key, [...(grouped.get(key) ?? []), pathway]);
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
    .sort((first, second) => first.yearGroup !== second.yearGroup
      ? first.yearGroup.localeCompare(second.yearGroup)
      : first.unitNumber - second.unitNumber);
}
