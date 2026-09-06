import {
  pathwayAlexanderIIReformConfidenceContent,
  pathwayAlexanderIIReformFlashcards,
  pathwayAlexanderIIReformLessonSections,
  pathwayAlexanderIIReformPeelContent,
  pathwayAlexanderIIReformQuizQuestions,
} from './pathwayAlexanderIIReformContent';

const timeline = {
  events: [
    {
      id: 'crimean-war-begins',
      date: '1853',
      title: 'Crimean War begins',
      detail: 'War against the Ottoman Empire developed into conflict with Britain and France, placing Russia’s military system under severe pressure.',
    },
    {
      id: 'alexander-accession',
      date: '1855',
      title: 'Alexander II becomes Tsar',
      detail: 'Alexander inherited the war and a state whose military, transport and administrative weaknesses were becoming increasingly obvious.',
    },
    {
      id: 'crimean-defeat',
      date: '1856',
      title: 'Crimean defeat confirmed',
      detail: 'The Treaty of Paris ended the war and damaged Russia’s prestige, strengthening the case for military, economic and administrative modernisation.',
    },
    {
      id: 'emancipation-pressure',
      date: '1856',
      title: 'Reform from above becomes urgent',
      detail: 'Alexander II told the Moscow nobility that it was better to end serfdom from above than wait for it to end through pressure from below.',
    },
    {
      id: 'emancipation',
      date: '1861',
      title: 'Emancipation of the serfs',
      detail: 'The Emancipation Edict became the most important early example of Alexander II using reform to modernise and stabilise the Tsarist state.',
    },
  ],
};

const judgementRanking = {
  question: 'Which pressure most strongly explains why Alexander II believed Russia needed reform after 1855?',
  factors: [
    {
      id: 'crimean-defeat',
      title: 'Crimean War defeat',
      detail: 'Defeat exposed Russia’s weaknesses and damaged its reputation as a European great power.',
    },
    {
      id: 'military-weakness',
      title: 'Military weakness',
      detail: 'A large but inefficient army, poor organisation and weak logistics made modernisation essential.',
    },
    {
      id: 'economic-backwardness',
      title: 'Economic backwardness',
      detail: 'Limited industry, railways and productivity restricted the state’s ability to compete and finance a modern army.',
    },
    {
      id: 'serfdom',
      title: 'Problems caused by serfdom',
      detail: 'Serfdom restricted labour mobility and productivity while also generating deep peasant resentment.',
    },
    {
      id: 'unrest',
      title: 'Fear of unrest',
      detail: 'The regime feared that refusing controlled reform could allow pressure from below to become more dangerous.',
    },
  ],
};

const ao3Interpretation = {
  question: 'How convincing is each interpretation of why Alexander II believed Russia needed reform?',
  interpretations: [
    {
      historian: 'Interpretation A',
      argument: 'The decisive pressure for reform was the Crimean War because defeat exposed the military, transport and economic weaknesses that threatened Russia’s great-power status.',
    },
    {
      historian: 'Interpretation B',
      argument: 'The Crimean War accelerated reform, but the deeper problem was serfdom: it weakened economic development, limited military modernisation and increased the danger of unrest from below.',
    },
  ],
};

export const alexanderIIReformFallbacks = {
  lesson_content: { sections: pathwayAlexanderIIReformLessonSections },
  timeline,
  flashcards: { cards: pathwayAlexanderIIReformFlashcards },
  quiz: { questions: pathwayAlexanderIIReformQuizQuestions },
  judgement_ranking: judgementRanking,
  ao3_interpretation: ao3Interpretation,
  peel_response: pathwayAlexanderIIReformPeelContent,
  confidence_exit_ticket: {
    prompt: pathwayAlexanderIIReformConfidenceContent.prompt,
    scale: [1, 2, 3, 4, 5],
    leastSecureOptions: pathwayAlexanderIIReformConfidenceContent.leastSecureOptions,
  },
};
