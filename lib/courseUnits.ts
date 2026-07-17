export type CourseUnit = {
  unitNumber: number;
  title: string;
  subtitle: string;
  yearGroup: 'Y12' | 'Y13';
  status: 'ready' | 'building' | 'planned';
  pathwaySlugs: string[];
};

export const courseUnits: CourseUnit[] = [
  {
    unitNumber: 1,
    title: 'Alexander II: Russia in 1855 and the need for reform',
    subtitle: 'The condition of Russia, the pressures for reform and the extent and limits of Alexander II’s changes.',
    yearGroup: 'Y12',
    status: 'ready',
    pathwaySlugs: [
      'russia-1855',
      'crimean-war',
      'power-ideology-control',
      'why-serfdom-had-to-end',
      'emancipation-serfs',
      'alexander-ii-wider-reforms',
      'reform-preserve-autocracy',
      'essay-skills-alexander-ii',
    ],
  },
  {
    unitNumber: 2,
    title: 'Reaction, opposition and Alexander III',
    subtitle: 'Later Alexander II, opposition, counter-reform, Russification and the consolidation of autocracy.',
    yearGroup: 'Y12',
    status: 'building',
    pathwaySlugs: [
      'later-alexander-ii',
      'alexander-iii-autocracy',
      'counter-reform-practice',
      'russification-minorities',
      'ideas-challenged-tsarism',
      'radical-opposition',
      'ao3-reform-reaction-opposition',
    ],
  },
  {
    unitNumber: 3,
    title: 'Economy, society and Russia by 1894',
    subtitle: 'Industrialisation, agriculture, social divisions, culture and the security of Tsarism.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['industry-before-1894', 'agriculture-land-hunger', 'social-divisions', 'orthodoxy-culture-authority', 'tsarism-secure-1894'],
  },
  {
    unitNumber: 4,
    title: 'Nicholas II and the road to 1905',
    subtitle: 'Nicholas II, industrialisation, opposition, the 1905 Revolution and Stolypin.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['nicholas-ii-ruler', 'industrialisation-nicholas-ii', 'opposition-before-1905', '1905-revolution', 'manifesto-fundamental-laws', 'stolypin-reform'],
  },
  {
    unitNumber: 5,
    title: 'War, collapse and revolution in 1917',
    subtitle: 'Russia before war, the First World War, February and the Bolshevik seizure of power.',
    yearGroup: 'Y12',
    status: 'planned',
    pathwaySlugs: ['russia-before-1914', 'russia-first-world-war', 'february-revolution', 'feb-oct-1917'],
  },
  {
    unitNumber: 6,
    title: 'Lenin and Communist dictatorship',
    subtitle: 'Ideology, government, civil war, economic policy and the establishment of one-party rule.',
    yearGroup: 'Y13',
    status: 'planned',
    pathwaySlugs: ['lenin-ideology-change'],
  },
  {
    unitNumber: 10,
    title: 'Khrushchev, reform and reaction, 1953–1964',
    subtitle: 'De-Stalinisation, economic and social change, political control and Khrushchev’s fall.',
    yearGroup: 'Y13',
    status: 'planned',
    pathwaySlugs: ['stalin-postwar-khrushchev'],
  },
];

export function getCourseUnit(unitNumber: number) {
  return courseUnits.find((unit) => unit.unitNumber === unitNumber) ?? null;
}
