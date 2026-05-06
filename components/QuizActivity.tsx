'use client';

import { useMemo, useState } from 'react';

type QuizQuestion = {
  id?: string;
  question: string;
  options: string[];
  correct: string;
};

type QuizActivityProps = {
  questions: QuizQuestion[];
};

export default function QuizActivity({ questions }: QuizActivityProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  function selectAnswer(questionKey: string, option: string) {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [questionKey]: option }));
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div>
      <div className="card teal" style={{ marginTop: 12 }}>
        <p className="eyebrow">Interactive retrieval</p>
        <h3>Answer all questions, then submit your quiz.</h3>
        <p><strong>Answered:</strong> {answeredCount}/{questions.length}</p>
        {submitted && <p><strong>Score:</strong> {score}/{questions.length} ({percentage}%)</p>}
      </div>

      {questions.map((question, qIndex) => {
        const key = question.id ?? `question-${qIndex}`;
        const selected = answers[key];

        return (
          <section className="card lavender" style={{ marginTop: 12 }} key={key}>
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
                    style={{
                      textAlign: 'left',
                      borderRadius: 16,
                      border: isSelected ? '2px solid #17233d' : '1px solid #d8e4ec',
                      padding: '12px 14px',
                      background: showCorrect ? '#e3f3f1' : showIncorrect ? '#f7efd9' : '#ffffff',
                      color: '#17233d',
                      fontWeight: isSelected || showCorrect ? 700 : 500,
                      cursor: submitted ? 'default' : 'pointer',
                    }}
                  >
                    {option}{showCorrect ? ' correct' : ''}{showIncorrect ? ' check this' : ''}
                  </button>
                );
              })}
            </div>
            {submitted && selected && selected !== question.correct && (
              <p style={{ marginTop: 12 }}><strong>Correct answer:</strong> {question.correct}</p>
            )}
          </section>
        );
      })}

      <div className="button-row">
        {!submitted ? (
          <button
            type="button"
            className="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5, border: 0 }}
          >
            Submit quiz
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
