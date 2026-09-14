'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './RecallHub.module.css';

type Question = {
  id: string;
  topicId: string;
  type: 'mcq' | 'short_answer';
  prompt: string;
  options?: string[];
};

type Session = {
  id: string;
  mode: string;
  topicId: string | null;
  topicTitle: string | null;
  questionCount: number;
  answeredCount: number;
  score: number;
  status: 'in_progress' | 'complete';
  questions: Question[];
  answeredQuestionIds: string[];
  nextQuestionId: string | null;
};

type TopicProgress = {
  id: string;
  title: string;
  period: string;
  questionCount: number;
  seen: number;
  secure: number;
  accuracy: number | null;
};

type Progress = {
  totalQuestions: number;
  questionsSeen: number;
  secureQuestions: number;
  weakQuestions: number;
  attempts: number;
  correct: number;
  accuracy: number | null;
  completedSessions: number;
  topicProgress: TopicProgress[];
};

type AnswerResult = {
  saved: boolean;
  isCorrect: boolean;
  correctAnswer: string;
  feedback: string;
  answeredCount: number;
  score: number;
  complete: boolean;
  nextQuestionId: string | null;
};

export default function RecallHub() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedTopic, setSelectedTopic] = useState('alexander-ii');
  const [shortAnswer, setShortAnswer] = useState('');
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadProgress = useCallback(async () => {
    const response = await fetch('/api/recall/progress', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Recall progress could not be loaded.');
    setProgress(data as Progress);
  }, []);

  const loadExistingSession = useCallback(async () => {
    const response = await fetch('/api/recall/session', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Recall session could not be loaded.');
    setSession(data.session as Session | null);
  }, []);

  useEffect(() => {
    Promise.all([loadProgress(), loadExistingSession()])
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Recall could not be loaded.'))
      .finally(() => setLoading(false));
  }, [loadExistingSession, loadProgress]);

  const currentQuestion = useMemo(() => {
    if (!session || session.status === 'complete') return null;
    return session.questions.find((question) => question.id === session.nextQuestionId) ?? null;
  }, [session]);

  async function startSession(mode: 'recommended' | 'weak' | 'topic' | 'all') {
    setStarting(true);
    setError('');
    setFeedback(null);
    setShortAnswer('');
    try {
      const response = await fetch('/api/recall/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, topicId: mode === 'topic' ? selectedTopic : null, count: 10 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'A recall session could not be started.');
      setSession(data.session as Session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'A recall session could not be started.');
    } finally {
      setStarting(false);
    }
  }

  async function submitAnswer(answer: string | number) {
    if (!session || !currentQuestion || submitting || feedback) return;
    if (currentQuestion.type === 'short_answer' && !String(answer).trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/recall/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, questionId: currentQuestion.id, answer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Your answer could not be saved.');
      const result = data as AnswerResult;
      setFeedback(result);
      setSession((current) => current ? {
        ...current,
        answeredCount: result.answeredCount,
        score: result.score,
        status: result.complete ? 'complete' : 'in_progress',
        nextQuestionId: result.nextQuestionId,
        answeredQuestionIds: [...new Set([...current.answeredQuestionIds, currentQuestion.id])],
      } : current);
      await loadProgress();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your answer could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  function continueAfterFeedback() {
    const wasComplete = feedback?.complete ?? false;
    setFeedback(null);
    setShortAnswer('');
    if (wasComplete) return;
  }

  function finishSessionView() {
    setFeedback(null);
    setShortAnswer('');
    setSession(null);
  }

  if (loading) return <section className={styles.loading}><strong>Loading Recall…</strong><span>Your saved progress is being checked.</span></section>;

  if (session) {
    const percentage = session.questionCount ? Math.round((session.answeredCount / session.questionCount) * 100) : 0;
    const completed = session.status === 'complete';
    return <div className={styles.sessionPage}>
      <header className={styles.sessionHeader}>
        <div><p className={styles.eyebrow}>Adaptive Recall</p><h1>{session.topicTitle ?? 'Whole-course recall'}</h1></div>
        <div className={styles.sessionScore}><strong>{session.score}</strong><span>correct so far</span></div>
      </header>
      <div className={styles.progressTrack} aria-label={`${percentage}% of recall session complete`}><div style={{ width: `${percentage}%` }} /></div>
      <div className={styles.progressMeta}><span>Question {Math.min(session.answeredCount + 1, session.questionCount)} of {session.questionCount}</span><span>{percentage}% saved</span></div>

      {error && <div className={styles.error} role="alert">{error}</div>}

      {completed ? <section className={styles.completeCard}>
        <p className={styles.eyebrow}>Session complete</p>
        <h2>{session.score} / {session.questionCount}</h2>
        <p>Every answer in this session has been saved. Your next adaptive session will use these results to change what appears.</p>
        {progress && <div className={styles.completeStats}><span><strong>{progress.accuracy ?? '—'}%</strong> overall accuracy</span><span><strong>{progress.secureQuestions}</strong> secure questions</span><span><strong>{progress.weakQuestions}</strong> weak questions</span></div>}
        <button className={styles.primaryButton} type="button" onClick={finishSessionView}>Back to Recall</button>
      </section> : currentQuestion ? <section className={styles.questionCard}>
        <div className={styles.questionTop}><span>{currentQuestion.type === 'mcq' ? 'Multiple choice' : 'Short answer'}</span><span>Saved after every answer</span></div>
        <h2>{currentQuestion.prompt}</h2>

        {currentQuestion.type === 'mcq' ? <div className={styles.options}>
          {(currentQuestion.options ?? []).map((option, index) => <button key={option} disabled={submitting || Boolean(feedback)} type="button" onClick={() => submitAnswer(index)}>{option}</button>)}
        </div> : <form className={styles.shortForm} onSubmit={(event) => { event.preventDefault(); void submitAnswer(shortAnswer); }}>
          <label htmlFor="recall-short-answer">Your answer</label>
          <input id="recall-short-answer" value={shortAnswer} onChange={(event) => setShortAnswer(event.target.value)} disabled={submitting || Boolean(feedback)} autoComplete="off" />
          <button className={styles.primaryButton} type="submit" disabled={submitting || Boolean(feedback) || !shortAnswer.trim()}>{submitting ? 'Saving…' : 'Check and save'}</button>
        </form>}

        {feedback && <div className={`${styles.feedback} ${feedback.isCorrect ? styles.correct : styles.incorrect}`}>
          <strong>{feedback.isCorrect ? 'Correct' : 'Not quite'}</strong>
          {!feedback.isCorrect && <p className={styles.correctAnswer}>Answer: {feedback.correctAnswer}</p>}
          <p>{feedback.feedback}</p>
          <button className={styles.primaryButton} type="button" onClick={continueAfterFeedback}>{feedback.complete ? 'See session result' : 'Next question'}</button>
        </div>}
      </section> : null}
    </div>;
  }

  return <div className={styles.page}>
    <header className={styles.hero}>
      <div><p className={styles.eyebrow}>Knowledge retrieval</p><h1>Recall</h1><p>Ten-question adaptive practice across AQA Tsarist and Communist Russia. Questions you miss return sooner; secure knowledge appears less often.</p></div>
      {progress && <div className={styles.heroStat}><strong>{progress.accuracy ?? '—'}{progress.accuracy !== null ? '%' : ''}</strong><span>overall accuracy</span></div>}
    </header>

    {error && <div className={styles.error} role="alert">{error}</div>}

    <section className={styles.metrics} aria-label="Recall progress">
      <article><span>Questions seen</span><strong>{progress?.questionsSeen ?? 0}<small> / {progress?.totalQuestions ?? 0}</small></strong></article>
      <article><span>Secure</span><strong>{progress?.secureQuestions ?? 0}</strong></article>
      <article><span>Weak areas</span><strong>{progress?.weakQuestions ?? 0}</strong></article>
      <article><span>Sessions</span><strong>{progress?.completedSessions ?? 0}</strong></article>
    </section>

    <section className={styles.startGrid}>
      <button className={styles.modeCard} type="button" disabled={starting} onClick={() => startSession('recommended')}><span>Recommended</span><strong>Daily Recall</strong><p>Adaptive ten-question practice prioritising unseen and less-secure knowledge.</p></button>
      <button className={styles.modeCard} type="button" disabled={starting || !progress?.weakQuestions} onClick={() => startSession('weak')}><span>Targeted</span><strong>Weak Areas</strong><p>{progress?.weakQuestions ? `Focus on ${progress.weakQuestions} questions that need more retrieval.` : 'Complete a recall session first to identify weaker knowledge.'}</p></button>
      <button className={styles.modeCard} type="button" disabled={starting} onClick={() => startSession('all')}><span>Interleaved</span><strong>Whole Course</strong><p>Mix knowledge from across 1855–1964 for broad retrieval practice.</p></button>
    </section>

    <section className={styles.topicSection}>
      <div><p className={styles.eyebrow}>Choose a period</p><h2>Topic practice</h2><p>Focus retrieval on one section of the course without changing your normal study-pathway progress.</p></div>
      <div className={styles.topicLaunch}>
        <select aria-label="Recall topic" value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
          {(progress?.topicProgress ?? []).map((topic) => <option key={topic.id} value={topic.id}>{topic.period} · {topic.title}</option>)}
        </select>
        <button className={styles.primaryButton} type="button" disabled={starting} onClick={() => startSession('topic')}>{starting ? 'Starting…' : 'Start topic recall'}</button>
      </div>
      <div className={styles.topicList}>
        {(progress?.topicProgress ?? []).map((topic) => <article key={topic.id}><div><strong>{topic.title}</strong><span>{topic.period}</span></div><div><span>{topic.seen}/{topic.questionCount} seen</span><span>{topic.accuracy === null ? 'No score yet' : `${topic.accuracy}% accuracy`}</span><span>{topic.secure} secure</span></div></article>)}
      </div>
    </section>
  </div>;
}
