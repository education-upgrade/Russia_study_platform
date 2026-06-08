export const russiaGoverning1855Pathway = {
  slug: 'why-russia-difficult-govern-1855',
  title: 'Why was Russia difficult to govern in 1855?',
  enquiryQuestion: 'Why was Russia difficult to govern in 1855?',
  examFocus: ['AO1 knowledge', 'chronology', 'causation', 'judgement', 'AO3 interpretation'],
  adaptiveGoal: 'Diagnose whether the student struggles more with chronology, causation, factual precision, judgement or confidence.',

  stages: [
    {
      id: 'diagnostic-retrieval',
      type: 'quiz',
      title: 'Russia in 1855 diagnostic retrieval',
      purpose: 'Identify secure and insecure core knowledge before guided study begins.',
      interventionTrigger: 'Below 60 percent correct triggers recap route.',
      questions: [
        'Who was Tsar of Russia in 1855?',
        'What was the main religion of the Russian Empire?',
        'Which war exposed Russian weakness before 1855?',
        'What term describes rule by one absolute ruler?',
        'What was the name of the Russian parliament before 1905?',
      ],
    },

    {
      id: 'guided-core-knowledge',
      type: 'guided_notes',
      title: 'Core governance problems',
      purpose: 'Build secure understanding of geography, autocracy, serfdom, communication and ethnic diversity.',
      learningChecks: [
        'Why did geography make Russia difficult to govern?',
        'How did serfdom weaken Russia?',
        'Why was communication difficult across the empire?',
      ],
    },

    {
      id: 'chronology-sequencing',
      type: 'timeline',
      title: 'Russia before reform',
      purpose: 'Strengthen chronological understanding before causal analysis.',
      interventionTrigger: 'Incorrect sequencing triggers chronology recap pathway.',
      events: [
        'Decembrist Revolt 1825',
        'Nicholas I rule begins 1825',
        'Crimean War 1853',
        'Death of Nicholas I 1855',
        'Alexander II becomes Tsar 1855',
      ],
    },

    {
      id: 'causation-categorisation',
      type: 'judgement_ranking',
      title: 'Most serious governance problem',
      purpose: 'Move students from description into prioritisation and judgement.',
      categories: [
        'Geography',
        'Autocracy',
        'Serfdom',
        'Economic backwardness',
        'Ethnic diversity',
      ],
      interventionTrigger: 'Weak explanations trigger judgement scaffold route.',
    },

    {
      id: 'knowledge-check',
      type: 'flashcards',
      title: 'Secure key knowledge',
      purpose: 'Reinforce weak knowledge areas identified earlier in the pathway.',
      adaptiveBehaviour: 'Students revisit insecure cards until marked secure twice.',
    },

    {
      id: 'ao3-interpretation',
      type: 'ao3_interpretation',
      title: 'How convincing is the interpretation?',
      purpose: 'Develop evaluation rather than description.',
      focus: 'Students must evaluate the interpretation using precise contextual knowledge.',
      interventionTrigger: 'Description without evaluation triggers AO3 repair route.',
    },

    {
      id: 'essay-planning',
      type: 'peel_response',
      title: '25-mark essay planning',
      purpose: 'Prepare students for extended analytical writing.',
      question: 'How far was geography the main reason Russia was difficult to govern in 1855?',
      successCriteria: [
        'Clear judgement',
        'Precise supporting evidence',
        'Comparative factor analysis',
        'Consistent explanation',
      ],
    },

    {
      id: 'confidence-check',
      type: 'confidence_exit_ticket',
      title: 'Confidence reflection',
      purpose: 'Identify mismatch between performance and confidence.',
      reflectionPrompts: [
        'What part of the topic feels most secure?',
        'Which historical skill still feels weakest?',
        'What should the system assign next?',
      ],
    },
  ],

  adaptiveRoutes: {
    chronologyRepair: {
      trigger: 'Weak sequencing performance',
      activities: ['timeline', 'retrieval_quiz', 'chronology recap'],
    },

    causationRepair: {
      trigger: 'Weak judgement explanations',
      activities: ['factor sorting', 'guided explanations', 'mini judgement paragraphs'],
    },

    ao3Repair: {
      trigger: 'Descriptive interpretation analysis',
      activities: ['interpretation annotation', 'evaluation stems', 'contextual challenge'],
    },

    confidenceRepair: {
      trigger: 'Low confidence despite secure scores',
      activities: ['retrieval review', 'guided success pathway', 'confidence rebuild'],
    },

    stretchRoute: {
      trigger: 'Secure performance across all stages',
      activities: ['synoptic comparison', 'independent essay', 'historiography challenge'],
    },
  },
};
