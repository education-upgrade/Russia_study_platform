import { recallQuestions, type RecallQuestion } from './questions';

export type RecallMode = 'recommended' | 'weak' | 'topic' | 'all';

export type RecallQuestionStat = {
  question_id: string;
  topic_id: string;
  attempts: number;
  correct_count: number;
  consecutive_correct: number;
  last_result: boolean | null;
  last_seen_at: string | null;
};

export type PublicRecallQuestion = {
  id: string;
  topicId: string;
  type: RecallQuestion['type'];
  prompt: string;
  options?: string[];
};

export function publicQuestion(question: RecallQuestion): PublicRecallQuestion {
  return {
    id: question.id,
    topicId: question.topicId,
    type: question.type,
    prompt: question.prompt,
    options: question.options,
  };
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function oneEditAway(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (b.length > a.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  if (i < a.length || j < b.length) edits += 1;
  return edits <= 1;
}

function adjacentTranspositionAway(a: string, b: string) {
  if (a.length !== b.length || a === b) return false;
  const differences: number[] = [];
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) differences.push(index);
    if (differences.length > 2) return false;
  }
  if (differences.length !== 2) return false;
  const [first, second] = differences;
  return second === first + 1 && a[first] === b[second] && a[second] === b[first];
}

export function gradeRecallAnswer(question: RecallQuestion, rawAnswer: unknown) {
  if (question.type === 'mcq') {
    const selected = typeof rawAnswer === 'number' ? rawAnswer : Number(rawAnswer);
    return Number.isInteger(selected) && selected === question.correctOption;
  }

  if (typeof rawAnswer !== 'string') return false;
  const candidate = normalize(rawAnswer);
  if (!candidate) return false;

  return (question.acceptedAnswers ?? []).some((accepted) => {
    const target = normalize(accepted);
    if (candidate === target) return true;
    // Mirror the GCSE app's forgiving short-answer principle without accepting
    // very short guesses: allow one typo/transposition for answers of 5+ characters.
    if (target.length < 5 || candidate.length < 5) return false;
    return oneEditAway(candidate, target) || adjacentTranspositionAway(candidate, target);
  });
}

function daysSince(value: string | null) {
  if (!value) return 90;
  const milliseconds = Date.now() - new Date(value).getTime();
  return Math.max(0, milliseconds / 86_400_000);
}

function priority(question: RecallQuestion, stat?: RecallQuestionStat) {
  if (!stat) return 120 + Math.random() * 8;
  const accuracy = stat.attempts > 0 ? stat.correct_count / stat.attempts : 0;
  let score = 40;
  if (stat.last_result === false) score += 65;
  score += Math.max(0, 35 - accuracy * 35);
  score -= Math.min(45, stat.consecutive_correct * 15);
  score += Math.min(30, daysSince(stat.last_seen_at));
  // Small jitter prevents identical sessions while never outweighing mastery signals.
  score += Math.random() * 5;
  return score + (question.type === 'short_answer' ? 2 : 0);
}

export function selectRecallQuestions({
  stats,
  mode,
  topicId,
  count = 10,
}: {
  stats: RecallQuestionStat[];
  mode: RecallMode;
  topicId?: string | null;
  count?: number;
}) {
  const safeCount = Math.max(1, Math.min(20, count));
  const byQuestion = new Map(stats.map((stat) => [stat.question_id, stat]));
  let candidates = recallQuestions.filter((question) => !topicId || question.topicId === topicId);

  if (mode === 'weak') {
    const weak = candidates.filter((question) => {
      const stat = byQuestion.get(question.id);
      if (!stat) return false;
      const accuracy = stat.attempts ? stat.correct_count / stat.attempts : 0;
      return stat.last_result === false || stat.consecutive_correct < 2 || accuracy < 0.75;
    });
    if (weak.length > 0) candidates = weak;
  }

  if (mode === 'recommended') {
    const notSecure = candidates.filter((question) => {
      const stat = byQuestion.get(question.id);
      return !stat || stat.consecutive_correct < 3 || daysSince(stat.last_seen_at) >= 7;
    });
    if (notSecure.length >= Math.min(5, safeCount)) candidates = notSecure;
  }

  const ranked = [...candidates].sort((a, b) => priority(b, byQuestion.get(b.id)) - priority(a, byQuestion.get(a.id)));
  const selected: RecallQuestion[] = [];
  const topicCounts = new Map<string, number>();

  // For whole-course modes, avoid one topic crowding out the rest where possible.
  for (const question of ranked) {
    if (selected.length >= safeCount) break;
    if (!topicId && (mode === 'recommended' || mode === 'all')) {
      const used = topicCounts.get(question.topicId) ?? 0;
      const softCap = Math.max(2, Math.ceil(safeCount / 4));
      if (used >= softCap && ranked.some((other) => (topicCounts.get(other.topicId) ?? 0) < softCap && !selected.includes(other))) continue;
    }
    selected.push(question);
    topicCounts.set(question.topicId, (topicCounts.get(question.topicId) ?? 0) + 1);
  }

  // Back-fill if the diversity cap left the session short.
  if (selected.length < safeCount) {
    for (const question of ranked) {
      if (selected.length >= safeCount) break;
      if (!selected.some((item) => item.id === question.id)) selected.push(question);
    }
  }

  return selected;
}
