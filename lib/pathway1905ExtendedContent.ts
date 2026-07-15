export const pathway1905PathwaySlug = '1905-revolution';

export const pathway1905Timeline = {
  events: [
    { id: 'war-begins', date: '1904', title: 'Russo-Japanese War begins', detail: 'War intensified pressure on a regime already facing social and economic discontent.' },
    { id: 'bloody-sunday', date: '9 January 1905', title: 'Bloody Sunday', detail: 'Troops fired on peaceful petitioners, damaging the Tsar’s image as the Little Father.' },
    { id: 'potemkin', date: 'June 1905', title: 'Potemkin mutiny', detail: 'The naval mutiny showed that loyalty in the armed forces could not be assumed.' },
    { id: 'tsushima', date: 'May 1905', title: 'Defeat at Tsushima', detail: 'The destruction of Russia’s Baltic Fleet deepened humiliation and discredited the government.' },
    { id: 'general-strike', date: 'October 1905', title: 'October General Strike', detail: 'Coordinated strikes paralysed major cities and placed the regime under severe pressure.' },
    { id: 'soviet', date: 'October 1905', title: 'St Petersburg Soviet formed', detail: 'The workers’ council organised urban opposition and offered an alternative centre of authority.' },
    { id: 'manifesto', date: '17 October 1905', title: 'October Manifesto', detail: 'Nicholas II promised civil liberties and an elected Duma, splitting liberals from radicals.' },
    { id: 'moscow', date: 'December 1905', title: 'Moscow uprising suppressed', detail: 'Once opposition was divided, loyal troops helped the regime restore control through repression.' },
    { id: 'fundamental-laws', date: 'April 1906', title: 'Fundamental Laws', detail: 'The Tsar reasserted his autocratic authority and limited the constitutional meaning of the concessions.' },
  ],
};

export const pathway1905Judgement = {
  question: 'Rank the factors that best explain why the Tsarist regime survived the 1905 Revolution.',
  factors: [
    { id: 'army', title: 'Army loyalty', detail: 'Most troops remained loyal and could suppress unrest once the regime recovered.' },
    { id: 'division', title: 'Divided opposition', detail: 'Liberals, workers, peasants and revolutionaries wanted different outcomes and did not act as one movement.' },
    { id: 'manifesto', title: 'October Manifesto', detail: 'Concessions satisfied many moderates and isolated more radical opponents.' },
    { id: 'witte', title: 'Witte’s leadership', detail: 'Witte encouraged tactical concessions and helped restore confidence in government.' },
    { id: 'repression', title: 'Repression', detail: 'The state used force, arrests and executions after opposition had been weakened.' },
    { id: 'war-ending', title: 'End of the war', detail: 'Peace with Japan allowed the government to redirect troops and attention towards domestic unrest.' },
  ],
};

export const pathway1905AO3 = {
  question: 'Which interpretation is most convincing about the significance of the 1905 Revolution?',
  interpretations: [
    { historian: 'Interpretation A', argument: '1905 was a genuine turning point because mass protest forced the autocracy to concede civil liberties and representative institutions.' },
    { historian: 'Interpretation B', argument: '1905 was a failed revolution because Nicholas II retained the army, recovered control and soon restricted the Duma through the Fundamental Laws.' },
    { historian: 'Interpretation C', argument: 'The main significance of 1905 was that it exposed the methods by which Tsarism could survive: divide opposition, concede temporarily and repress once stronger.' },
  ],
};

export const pathway1905ConfidenceContent = {
  prompt: 'How confident are you explaining why the 1905 Revolution weakened Tsarism but failed to overthrow it?',
  leastSecureOptions: ['Long-term causes', 'Russo-Japanese War', 'Bloody Sunday', 'Spread of unrest', 'October Manifesto', 'Why the regime survived', 'Turning-point judgement'],
  scale: [1, 2, 3, 4, 5],
};
