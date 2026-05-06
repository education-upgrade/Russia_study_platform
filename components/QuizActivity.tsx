'use client';

import { useMemo, useState } from 'react';

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

export default function QuizActivity({ activityId, questions }: QuizActivityProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const questionKeys = useMemo(
    () => questions.map((question, index) => question.id ?? `question-${index}`),
    [questions]
  );

  const answeredCount = questionKeys.filter((key) => Boolean(answers[key])).length;
  const score = questions.reduce((total, question, index) => {
    const key = question.id ?? `question-${index}`;
    return total + (answers[key] === question.correct ? 1 : 0);
  }, 0);

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const allAnswered = answeredCount === questions.length;
  const incorrectQuestionIds = questions
    .map((question, index) => ({ question, key: question.id ?? `question-${index}` }))
    .filter(({ question, key }) => answers[key] !== question.correct)
    .map(({ question, key }) => question.id ?? key);

  function selectAnswer(questionKey: string, option: string) {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [questionKey]: option }));
  }

  async function submitQuiz() {
    setSubmitted(true);
    setSaveStatus('saving');
    setSaveMessage('Saving quiz result...');

    try {
      const response = await fetch('/api/student-responses/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          answers,
          score,
          maxScore: questions.length,
          percentage,
          incorrectQuestionIds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Quiz result could not be saved.');
      }

      setSaveStatus('saved');
      setSaveMessage(`Saved at ${new Date(result.savedAt).toLocaleTimeString()}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Quiz result could not be saved.');
    }
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
    setSaveStatus('idle');
    setSaveMessage('');
  }

  return (
    <div className="quiz-shell">
      <div className="panel teal">
        <div className="quiz-toolbar">
          <div>
            <p className="eyebrow">Interactive retrieval</p>
            <h3>Answer all questions, then submit your quiz.</h3>
            <p>Use this as a quick knowledge check before moving into exam-writing.</p>
          </div>
          <div className="activity-summary">
            <span className="badge">Answered {answeredCount}/{questions.length}</span>
            {submitted && <span className="badge">Score {score}/{questions.length} · {percentage}%</span>}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ '--progress': `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` } as React.CSSProperties} />
        </div>
        {saveMessage && (
          <p><strong>Save status:</strong> {saveMessage}</p>
        )}
      </div>

      {questions.map((question, qIndex) => {
        const key = question.id ?? `question-${qIndex}`;
        const selected = answers[key];

        return (
          <section className="panel" key={key}>
            <p className="eyebrow">Question {qIndex + 1}</p>
            <h3>{question.question}</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
              {question.options.map((option) => {
                const isSelected = selected === option;
                const isCorrect = option === question.correct;
                const showCorrect = submitted && isCorrect;
                const showIncorrect = submitted && isSelected && !isCorrect;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => selectAnswer(key, option)}
                    className={`option-button${isSelected ? ' selected' : ''}${showCorrect ? ' correct' : ''}${showIncorrect ? ' incorrect' : ''}`}
                    disabled={submitted}
                  >
                    {option}{showCorrect ? ' ✓ correct' : ''}{showIncorrect ? ' · check this' : ''}
                  </button>
                );
              })}
            </div>
            {submitted && selected && selected !== question.correct && (
              <p><strong>Correct answer:</strong> {question.correct}</p>
            )}
          </section>
        );
      })}

      <div className="button-row">
        {!submitted ? (
          <button
            type="button"
            className="button"
            onClick={submitQuiz}
            disabled={!allAnswered || saveStatus === 'saving'}
            style={{ opacity: allAnswered ? 1 : 0.5 }}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Submit quiz'}
          </button>
        ) : (
          <button type="button" className="button secondary" onClick={resetQuiz}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
