export const russia1905Pilot = {
  course: {
    id: 'aqa-russia-1h',
    title: 'AQA A-Level History: Tsarist and Communist Russia, 1855-1964',
  },
  unit: {
    id: 'unit-1905-revolution',
    title: 'The 1905 Revolution',
    period: '1894-1917',
    themes: ['political authority', 'opposition', 'reform and reaction'],
    yearGroup: 'Y12',
  },
  lesson: {
    id: 'lesson-1905-turning-point',
    title: 'Was the 1905 Revolution a turning point for Tsarist Russia?',
    enquiry: 'How significant was the 1905 Revolution in weakening Tsarist authority?',
    estimatedMinutes: 45,
    sections: [
      'Lesson introduction',
      'Retrieval starter',
      'Flashcard study',
      'Knowledge check',
      'PEEL response',
      'Confidence exit ticket',
    ],
  },
  keyKnowledge: [
    'Russo-Japanese War, 1904-05',
    'Bloody Sunday, January 1905',
    'Strikes, peasant unrest, national minority unrest and mutinies',
    'St Petersburg Soviet',
    'October Manifesto',
    'Duma concessions',
    'Fundamental Laws, 1906',
    'Repression and restoration of Tsarist authority',
  ],
  quizQuestions: [
    {
      id: 'q1905-01',
      question: 'In which year did Bloody Sunday take place?',
      options: ['1904', '1905', '1906', '1917'],
      correct: '1905',
    },
    {
      id: 'q1905-02',
      question: 'Which war exposed the weakness of the Tsarist regime in 1904-05?',
      options: ['Crimean War', 'First World War', 'Russo-Japanese War', 'Civil War'],
      correct: 'Russo-Japanese War',
    },
    {
      id: 'q1905-03',
      question: 'What did the October Manifesto promise?',
      options: ['An end to autocracy', 'Civil liberties and an elected Duma', 'Immediate land redistribution', 'A socialist republic'],
      correct: 'Civil liberties and an elected Duma',
    },
    {
      id: 'q1905-04',
      question: 'What did the Fundamental Laws of 1906 reassert?',
      options: ['The full power of the Duma', 'The authority of the Tsar', 'The abolition of censorship', 'The independence of Poland'],
      correct: 'The authority of the Tsar',
    },
  ],
  flashcards: [
    {
      id: 'fc1905-01',
      front: 'Bloody Sunday',
      back: "January 1905 event where peaceful protesters were shot by troops, damaging the Tsar's image as Little Father.",
    },
    {
      id: 'fc1905-02',
      front: 'October Manifesto',
      back: 'Promise of civil liberties and an elected Duma, issued to divide opposition and restore order.',
    },
    {
      id: 'fc1905-03',
      front: 'Fundamental Laws',
      back: "1906 laws that reasserted the Tsar's autocratic authority and limited the Duma.",
    },
    {
      id: 'fc1905-04',
      front: 'St Petersburg Soviet',
      back: 'Workers council showing organised revolutionary activity in 1905.',
    },
  ],
  peelTask: {
    id: 'peel-1905-01',
    question: 'Explain one way in which the 1905 Revolution weakened Tsarist authority.',
    stretchQuestion: 'How significant was the 1905 Revolution in weakening Tsarist authority?',
    scaffold: ['Point', 'Evidence', 'Explain', 'Link judgement'],
  },
  confidenceExitTicket: {
    id: 'confidence-1905-01',
    prompt: 'How confident are you with the 1905 Revolution?',
    scale: [1, 2, 3, 4, 5],
    leastSecureOptions: ['Causes', 'Events', 'October Manifesto', 'Duma/Fundamental Laws', 'Significance judgement'],
  },
};
