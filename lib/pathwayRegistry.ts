export type PathwayStatus = 'ready' | 'planned';
export type YearGroup = 'Y12' | 'Y13';

export type PathwayConfig = {
  pathwaySlug: string;
  title: string;
  lessonTitle: string;
  subtitle: string;
  yearGroup: YearGroup;
  status: PathwayStatus;
  routeBase: string;
};

export const PATHWAY_ACTIVITY_ORDER = [
  'lesson_content',
  'flashcards',
  'quiz',
  'peel_response',
  'confidence_exit_ticket',
] as const;

export type PathwayActivityType = typeof PATHWAY_ACTIVITY_ORDER[number];

export const pathwayRegistry: Record<string, PathwayConfig> = {
  'russia-1855': {
    pathwaySlug: 'russia-1855',
    title: 'Russia in 1855',
    lessonTitle: 'Why was Russia difficult to govern in 1855?',
    subtitle: 'Autocracy, empire, society and problems of government',
    yearGroup: 'Y12',
    status: 'ready',
    routeBase: '/student/lesson/1855',
  },
  'alexander-ii-reform': {
    pathwaySlug: 'alexander-ii-reform',
    title: 'Alexander II reform',
    lessonTitle: 'Why did Alexander II believe Russia needed reform?',
    subtitle: 'Crimean War, serfdom, backwardness and reform from above',
    yearGroup: 'Y12',
    status: 'ready',
    routeBase: '/student/lesson/alexander-ii-reform',
  },
  'emancipation-serfs': {
    pathwaySlug: 'emancipation-serfs',
    title: 'Emancipation of the serfs',
    lessonTitle: 'How far did emancipation improve the lives of Russian peasants?',
    subtitle: '1861 emancipation, redemption payments, land and the mir',
    yearGroup: 'Y12',
    status: 'ready',
    routeBase: '/student/lesson/emancipation-serfs',
  },
  '1905-revolution': {
    pathwaySlug: '1905-revolution',
    title: '1905 Revolution',
    lessonTitle: 'Was the 1905 Revolution a turning point for Tsarist Russia?',
    subtitle: 'Causes, events, consequences and limits of change',
    yearGroup: 'Y12',
    status: 'ready',
    routeBase: '/student/lesson/1905',
  },
  'feb-oct-1917': {
    pathwaySlug: 'feb-oct-1917',
    title: 'February to October 1917',
    lessonTitle: 'Why did the Provisional Government collapse in 1917?',
    subtitle: 'Dual power, Provisional Government failure and Bolshevik success',
    yearGroup: 'Y12',
    status: 'planned',
    routeBase: '/student/lesson/feb-oct-1917',
  },
  'stalin-postwar-khrushchev': {
    pathwaySlug: 'stalin-postwar-khrushchev',
    title: 'Stalin and Khrushchev, 1945–64',
    lessonTitle: 'How far did Stalin and Khrushchev transform the USSR after 1945?',
    subtitle: 'Recovery, reform, repression and de-Stalinisation',
    yearGroup: 'Y13',
    status: 'planned',
    routeBase: '/student/lesson/stalin-postwar-khrushchev',
  },
};

export const pathwayOptions = Object.values(pathwayRegistry);

export function getPathwayConfig(pathwaySlug: string | null | undefined) {
  if (pathwaySlug && pathwayRegistry[pathwaySlug]) return pathwayRegistry[pathwaySlug];
  return pathwayRegistry['1905-revolution'];
}

export function getActivityRoute(routeBase: string, activityType: string) {
  const suffixByType: Record<string, string> = {
    lesson_content: 'lesson',
    flashcards: 'flashcards',
    quiz: 'quiz',
    peel_response: 'peel',
    confidence_exit_ticket: 'confidence',
  };

  return `${routeBase}/${suffixByType[activityType] ?? ''}`;
}

export function orderActivityTypes(activityTypes: string[]) {
  return [...activityTypes].sort((first, second) => {
    const firstIndex = PATHWAY_ACTIVITY_ORDER.indexOf(first as PathwayActivityType);
    const secondIndex = PATHWAY_ACTIVITY_ORDER.indexOf(second as PathwayActivityType);
    const safeFirstIndex = firstIndex === -1 ? 999 : firstIndex;
    const safeSecondIndex = secondIndex === -1 ? 999 : secondIndex;
    return safeFirstIndex - safeSecondIndex;
  });
}
