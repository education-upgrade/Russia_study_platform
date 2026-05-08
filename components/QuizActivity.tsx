'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import styles from './QuizActivity.module.css';

type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correct: string;
};

type QuizActivityProps = {
  activityId: string;
  questions: QuizQuestion[];
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function optionsWithBalancedCorrectPosition(question: QuizQuestion, questionIndex: number) {
  const options = [...question.options];
  const correctIndex = options.indexOf(question.correct);

  if (correctIndex === -1) return options;

  const targetIndex = Math.min(questionIndex % 4, options.length - 1);
  const [correctOption] = options.splice(correctIndex, 1);
  options.splice(targetIndex, 0, correctOption);

  return options;
}

export default function QuizActivity({ activityId, questions }: QuizActivityProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questionKeys = useMemo(
    () => questions.map((question, index) => question.id ?? `question-${index}`),
    [questions]
  );

  const currentQuestion = questions[currentIndex];
  const currentQuestionKey = questionKeys[currentIndex] ?? '';
  const currentOptions = currentQuestion ? optionsWithBalancedCorrectPosition(currentQuestion, currentIndex) : [];
  const selectedAnswer = answers[currentQuestionKey];
  const answeredCount = questionKeys.filter((key) => Boolean(answers[key])).length;

  function calculateResult(nextAnswers: Record<string, string>) {
    const score = questions.reduce((total, question, index) => {
      const key = question.id ?? `question-${index}`;
      return total + (nextAnswers[key] === question.correct ? 1 : 0);
    }, 0);
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const incorrectQuestionIds = questions
      .map((question, index) => ({ question, key: question.id ?? `question-${index}` }))
      .filter(({ question, key }) => nextAnswers[key] !== question.correct)
      .map(({ question, key }) => question.id ?? key);

    return { score, percentage, incorrectQuestionIds };
  }

  const { score, percentage, incorrectQuestionIds } = calculateResult(answers);
  const progressPercentage = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  async function saveQuiz(nextAnswers: Record<string, string>, isComplete: boolean) {
    const result = calculateResult(nextAnswers);
    setSaveStatus('saving');
    setSaveMessage(isComplete ? 'Saving final score...' : 'Auto-saving...');

    try {
      const response = await fetch('/api/student-responses/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          answers: nextAnswers,
          score: result.score,
          maxScore: questions.length,
          percentage: result.percentage,
          incorrectQuestionIds: result.incorrectQuestionIds,
          status: isComplete ? 'complete' : 'in_progress',
        }),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.error ?? 'Quiz result could not be saved.');
      }

      setSaveStatus('saved');
      setSaveMessage(isComplete ? `Saved score ${result.score}/${questions.length}` : 'Saved');
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Quiz result could not be saved.');
      return false;
    }
  }

  function selectAnswer(option: string) {
    if (!currentQuestion || selectedAnswer || completed) return;

    const nextAnswers = { ...answers, [currentQuestionKey]: option };
    const isFinalQuestion = currentIndex === questions.length - 1;

    setAnswers(nextAnswers);
    void saveQuiz(nextAnswers, isFinalQuestion);

    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
    }

    advanceTimerRef.current = setTimeout(() => {
      if (isFinalQuestion) {
        setCompleted(true);
      } else {
        setCurrentIndex((previous) => Math.min(previous + 1, questions.length - 1));
      }
    }, 650);
  }

  function goToPreviousQuestion() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  function skipForward() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setCurrentIndex((previous) => Math.min(previous + 1, questions.length - 1));
  }

  function reviewQuiz() {
    setCompleted(false);
    setCurrentIndex(0);
  }

  function resetQuiz() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setAnswers({});
    setCompleted(false);
    setCurrentIndex(0);
    setIsMovingNext(false);
    setSaveStatus('idle');
    setSaveMessage('');
  }

  async function moveToPeel() {
    if (isMovingNext) return;
    setIsMovingNext(true);
    const saved = await saveQuiz(answers, true);

    if (saved) {
      router.push('/student/lesson/1905/peel');
      return;
    }

    setIsMovingNext(false);
  }

  if (!currentQuestion) {
    return (
      <section className="panel warm">
        <h3>No quiz questions found</h3>
        <p>This activity does not currently have any questions.</p>
      </section>
    );
  }

  if (completed) {
    return (
      <div className={styles.shell}>
        <section className={styles.topbar}>
          <div>
            <h3>Quiz complete</h3>
          </div>
          <div className={styles.stats} aria-label="Quiz result statistics">
            <span>{score}/{questions.length}</span>
            <span>{percentage}%</span>
            <span>{incorrectQuestionIds.length} revisit</span>
          </div>
        </section>

        <div className={styles.progress} aria-label="Quiz completion progress">
          <div style={{ width: '100%' }} />
        </div>

        <section className={styles.summary}>
          <h2>{score}/{questions.length}</h2>
          <p>{percentage >= 80 ? 'Strong recall. Move on to the PEEL response and apply this knowledge.' : 'Good start. Revisit the weaker questions, then apply the knowledge in your PEEL response.'}</p>
        </section>

        <section className={styles.bottomNav}>
          <button type="button" className="button secondary" onClick={reviewQuiz}>Review</button>
          <button type="button" className="button secondary" onClick={resetQuiz}>Try again</button>
          <button type="button" className="button" onClick={moveToPeel} disabled={isMovingNext || saveStatus === 'saving'}>
            {isMovingNext || saveStatus === 'saving' ? 'Saving...' : 'Next'}
          </button>
        </section>

        {saveMessage && <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage}</p>}
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}>
        <div>
          <h3>Question {currentIndex + 1} of {questions.length}</h3>
        </div>
        <div className={styles.stats} aria-label="Quiz progress statistics">
          <span>{answeredCount}/{questions.length} answered</span>
          <span>{score} correct</span>
          <span>{saveStatus === 'saving' ? 'saving' : saveStatus === 'saved' ? 'saved' : 'ready'}</span>
        </div>
      </section>

      <div className={styles.progress} aria-label="Quiz completion progress">
        <div style={{ width: `${progressPercentage}%` }} />
      </div>

      <section className={styles.card}>
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
        <div className={styles.options}>
          {currentOptions.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correct;
            const showCorrect = Boolean(selectedAnswer) && isCorrect;
            const showIncorrect = isSelected && !isCorrect;

            return (
              <button
                type="button"
                key={option}
                onClick={() => selectAnswer(option)}
                className={`${styles.option}${isSelected ? ` ${styles.selected}` : ''}${showCorrect ? ` ${styles.correct}` : ''}${showIncorrect ? ` ${styles.incorrect}` : ''}`}
                disabled={Boolean(selectedAnswer)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.bottomNavCompact}>
        <button type="button" className="button secondary" onClick={goToPreviousQuestion} disabled={currentIndex === 0}>Previous</button>
        <button type="button" className="button secondary" onClick={skipForward} disabled={currentIndex === questions.length - 1}>Skip</button>
      </section>

      {saveStatus === 'error' && saveMessage && <p className={`${styles.saveMessage} ${styles.error}`}>{saveMessage}</p>}
    </div>
  );
}
