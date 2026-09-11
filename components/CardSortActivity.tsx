'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { loadAssignmentActivityProgress, saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';
import styles from './CardSortActivity.module.css';

type CardSortCard = { id: string; text: string; category: string };
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type CardSortActivityProps = { activityId: string; cards: CardSortCard[]; categories: string[]; nextHref?: string };

export default function CardSortActivity({ activityId, cards, categories, nextHref }: CardSortActivityProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [reflection, setReflection] = useState('');
  const [hydrated, setHydrated] = useState(!assignmentId);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const completedCount = Object.keys(placements).length;
  const progressPercentage = cards.length ? Math.round((completedCount / cards.length) * 100) : 0;
  const correctCount = useMemo(() => cards.reduce((total, card) => total + (placements[card.id] === card.category ? 1 : 0), 0), [cards, placements]);
  const isComplete = completedCount === cards.length && reflection.trim().length > 0;

  useEffect(() => {
    if (!assignmentId) return;
    let cancelled = false;
    void loadAssignmentActivityProgress(assignmentId, 'card_sort')
      .then((progress) => {
        if (cancelled) return;
        const position = progress?.position ?? {};
        const savedPlacements = position.placements;
        if (savedPlacements && typeof savedPlacements === 'object' && !Array.isArray(savedPlacements)) setPlacements(savedPlacements as Record<string, string>);
        if (typeof position.reflection === 'string') setReflection(position.reflection);
        if (progress) { setSaveStatus('saved'); setSaveMessage(progress.status === 'complete' ? 'Saved · activity complete' : 'Saved draft restored'); }
      })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setHydrated(true); });
    return () => { cancelled = true; };
  }, [assignmentId]);

  async function saveCardSort(status: 'in_progress' | 'complete', nextPlacements = placements, nextReflection = reflection) {
    const nextCompletedCount = Object.keys(nextPlacements).length;
    const nextCorrectCount = cards.reduce((total, card) => total + (nextPlacements[card.id] === card.category ? 1 : 0), 0);
    const nextProgressPercentage = cards.length ? Math.round((nextCompletedCount / cards.length) * 100) : 0;
    setSaveStatus('saving'); setSaveMessage('Saving automatically...');
    try {
      if (assignmentId) {
        await saveAssignmentActivityProgress({ assignmentId, activityType: 'card_sort', status, score: nextCorrectCount, maxScore: cards.length, position: { placements: nextPlacements, reflection: nextReflection, writtenResponse: nextReflection, totalCards: cards.length, correctCount: nextCorrectCount, completionPercentage: nextProgressPercentage } });
      } else {
        const response = await fetch('/api/student-responses/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activityId, responseType: 'card_sort', status, score: nextCorrectCount, response: { placements: nextPlacements, reflection: nextReflection, totalCards: cards.length, correctCount: nextCorrectCount, completionPercentage: nextProgressPercentage } }), keepalive: true });
        const result = await response.json().catch(() => null); if (!response.ok) throw new Error(result?.error ?? 'Card sort could not be saved.');
      }
      setSaveStatus('saved'); setSaveMessage(status === 'complete' ? 'Saved · activity complete' : 'Saved'); return true;
    } catch (error) { setSaveStatus('error'); setSaveMessage(error instanceof Error ? error.message : 'Card sort could not be saved.'); return false; }
  }

  useEffect(() => {
    if (!hydrated || !reflection.trim()) return;
    const timeout = window.setTimeout(() => { const complete = Object.keys(placements).length === cards.length && reflection.trim().length > 0; void saveCardSort(complete ? 'complete' : 'in_progress', placements, reflection); }, 650);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflection, placements, cards.length, hydrated]);

  function placeCard(cardId: string, category: string) {
    const nextPlacements = { ...placements, [cardId]: category }; setPlacements(nextPlacements);
    const complete = Object.keys(nextPlacements).length === cards.length && reflection.trim().length > 0;
    void saveCardSort(complete ? 'complete' : 'in_progress', nextPlacements, reflection);
  }
  async function moveToNext() { if (!isComplete || isMovingNext || !nextHref) return; setIsMovingNext(true); const saved = await saveCardSort('complete'); if (saved) { router.push(nextHref); return; } setIsMovingNext(false); }

  if (cards.length === 0) return <section className="panel warm"><h3>No card sort content found</h3><p>This activity does not currently have any cards.</p></section>;
  return <div className={styles.shell}>
    <section className={styles.topbar}><div><h3>Card sort</h3><p>Classify each statement into the most appropriate historical category.</p></div><div className={styles.stats}><span>{completedCount}/{cards.length} sorted</span><span>{correctCount} correct</span><span>{saveStatus === 'saving' ? 'saving' : saveStatus === 'saved' ? 'saved' : 'autosave on'}</span></div></section>
    <div className={styles.progress}><div style={{ width: `${progressPercentage}%` }} /></div>
    <section className={styles.cardGrid}>{cards.map((card) => { const selectedCategory = placements[card.id] ?? ''; const isCorrect = selectedCategory === card.category; return <article key={card.id} className={`${styles.card}${selectedCategory ? ` ${styles.answered}` : ''}`}><p>{card.text}</p><div className={styles.categories}>{categories.map((category) => <button type="button" key={category} className={`${styles.categoryButton}${selectedCategory === category ? ` ${styles.selected}` : ''}${selectedCategory === category && isCorrect ? ` ${styles.correct}` : ''}`} onClick={() => placeCard(card.id, category)}>{category}</button>)}</div>{selectedCategory && <div className={styles.feedback}>{isCorrect ? 'Strong classification.' : `Chosen: ${selectedCategory}`}</div>}</article>; })}</section>
    <section className={styles.reflectionPanel}><label><span>What overall pattern or judgement does this card sort suggest?</span><textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Overall, the evidence suggests that Alexander II modernised Russia in some areas, but preserved autocratic control because..." /></label></section>
    <section className={styles.submitRow}><p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage || 'Your choices and written judgement save automatically.'}</p><div className={styles.buttonRow}>{nextHref && <button type="button" className="button" onClick={moveToNext} disabled={!isComplete || isMovingNext}>{isMovingNext ? 'Saving...' : 'Next'}</button>}</div></section>
  </div>;
}
