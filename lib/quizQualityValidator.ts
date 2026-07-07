export type QuizQualityQuestion = {
  id?: string;
  question: string;
  options: string[];
  correct: string;
};

export type QuizQualityIssue = {
  questionId: string;
  severity: 'warning' | 'error';
  category: 'option_length' | 'correct_position' | 'distractor_quality' | 'terminology' | 'format';
  message: string;
};

export type QuizQualityReport = {
  questionCount: number;
  issueCount: number;
  correctAnswerPositions: Record<'A' | 'B' | 'C' | 'D' | 'unknown', number>;
  issues: QuizQualityIssue[];
};

const A_LEVEL_TERMS = [
  'autocracy',
  'bureaucracy',
  'reform',
  'backwardness',
  'industrial',
  'economic',
  'military',
  'administrative',
  'society',
  'opposition',
  'authority',
  'modernise',
  'tsar',
];

const OBVIOUS_DISTRACTOR_TERMS = [
  'bolsheviks',
  'collectivisation',
  'soviet union',
  'duma',
  'lenin',
  'stalin',
];

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function getQuestionId(question: QuizQualityQuestion, index: number) {
  return question.id || `question-${index + 1}`;
}

function getCorrectPosition(question: QuizQualityQuestion): 'A' | 'B' | 'C' | 'D' | 'unknown' {
  const index = question.options.indexOf(question.correct);
  if (index === 0) return 'A';
  if (index === 1) return 'B';
  if (index === 2) return 'C';
  if (index === 3) return 'D';
  return 'unknown';
}

function includesAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function validateQuizQuality(questions: QuizQualityQuestion[]): QuizQualityReport {
  const issues: QuizQualityIssue[] = [];
  const correctAnswerPositions: QuizQualityReport['correctAnswerPositions'] = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    unknown: 0,
  };

  questions.forEach((question, index) => {
    const questionId = getQuestionId(question, index);

    if (question.options.length !== 4) {
      issues.push({
        questionId,
        severity: 'error',
        category: 'format',
        message: 'Quiz questions should have exactly four options.',
      });
    }

    if (!question.options.includes(question.correct)) {
      issues.push({
        questionId,
        severity: 'error',
        category: 'format',
        message: 'The correct answer must exactly match one of the options.',
      });
    }

    const position = getCorrectPosition(question);
    correctAnswerPositions[position] += 1;

    const optionLengths = question.options.map(wordCount);
    const shortest = Math.min(...optionLengths);
    const longest = Math.max(...optionLengths);

    if (longest - shortest > 6) {
      issues.push({
        questionId,
        severity: 'warning',
        category: 'option_length',
        message: 'One or more options are noticeably longer or shorter than the others.',
      });
    }

    const correctLength = wordCount(question.correct);
    const averageDistractorLength = question.options
      .filter((option) => option !== question.correct)
      .reduce((total, option) => total + wordCount(option), 0) / Math.max(1, question.options.length - 1);

    if (correctLength - averageDistractorLength > 4) {
      issues.push({
        questionId,
        severity: 'warning',
        category: 'option_length',
        message: 'The correct answer is much longer than the average distractor.',
      });
    }

    const obviousDistractors = question.options
      .filter((option) => option !== question.correct)
      .filter((option) => includesAny(option, OBVIOUS_DISTRACTOR_TERMS));

    if (obviousDistractors.length > 0) {
      issues.push({
        questionId,
        severity: 'warning',
        category: 'distractor_quality',
        message: 'One or more distractors may be too obviously wrong for this period/topic.',
      });
    }

    const combinedText = [question.question, ...question.options].join(' ');
    if (!includesAny(combinedText, A_LEVEL_TERMS)) {
      issues.push({
        questionId,
        severity: 'warning',
        category: 'terminology',
        message: 'Question may need more precise A-Level historical terminology.',
      });
    }
  });

  const usedPositions = (['A', 'B', 'C', 'D'] as const).filter((position) => correctAnswerPositions[position] > 0);
  if (questions.length >= 8 && usedPositions.length < 3) {
    issues.push({
      questionId: 'whole-quiz',
      severity: 'warning',
      category: 'correct_position',
      message: 'Correct answer positions are not balanced across the quiz.',
    });
  }

  return {
    questionCount: questions.length,
    issueCount: issues.length,
    correctAnswerPositions,
    issues,
  };
}
