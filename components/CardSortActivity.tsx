'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './CardSortActivity.module.css';

type CardSortCard = {
  id: string;
  text: string;
  category: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type CardSortActivityProps = {
  activityId: string;
  cards: CardSortCard[];
  categories: string[];
  nextHref?: string;
};

export default function CardSortActivity({ activityId, cards, categories, nextHref }: CardSortActivityProps) {
  const router = useRouter();
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const completedCount = Object.keys(placements).length;
  const progressPercentage = cards.length ? Math.round((completedCount / cards.length) * 100) : 0;

  const correctCount = useMemo(() => {
    return cards.reduce((total, card) => total + (placements[card.id] === card.category ? 1 : 0), 0);
  }, [cards, placements]);

  const canSubmit = completedCount === cards.length && reflection.trim().length > 0;

  async function saveCardSort(status: 'in_progress' | 'complete') {
    setSaveStatus('saving');
    setSaveMessage(status === 'complete' ? 'Saving completed card sort...' : 'Saving progress...');

    try {
      const response = await fetch('/api/student-responses/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          responseType: 'card_sort',
          status,
          score: correctCount,
          response: {
            placements,
            reflection,
            totalCards: cards.length,
            correctCount,
            completionPercentage: progressPercentage,
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Card sort could not be saved.');

      setSaveStatus('saved');
      setSaveMessage(status === 'complete' ? 'Card sort submitted' : 'Saved');
      if (status === 'complete') setSubmitted(true);
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Card sort could not be saved.');
      return false;
    }
  }

  function placeCard(cardId: string, category: string) {
    const nextPlacements = { ...placements, [cardId]: category };
    setPlacements(nextPlacements);
    setSubmitted(false);
    void saveCardSort('in_progress');
  }

  async function submitCardSort() {
    if (!canSubmit || saveStatus === 'saving') return;
    await saveCardSort('complete');
  }

  async function moveToNext() {
    if (!canSubmit || isMovingNext) return;
    setIsMovingNext(true);
    const saved = await saveCardSort('complete');
    if (saved && nextHref) {
      router.push(nextHref);
      return;
    }
    setIsMovingNext(false);
  }

  if (cards.length === 0) {
    return <section className="panel warm"><h3>No card sort content found</h3><p>This activity does not currently have any cards.</p></section>;
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}>
        <div>
          <h3>Card sort</h3>
          <p>Classify each statement into the most appropriate historical category.</p>
        </div>
        <div className={styles.stats}>
          <span>{completedCount}/{cards.length} sorted</span>
          <span>{correctCount} correct</span>
          <span>{saveStatus === 'saving' ? 'saving' : saveStatus === 'saved' ? 'saved' : submitted ? 'submitted' : 'ready'}</span>
        </div>
      </section>

      <div className={styles.progress}><div style={{ width: `${progressPercentage}%` }} /></div>

      <section className={styles.cardGrid}>
        {cards.map((card) => {
          const selectedCategory = placements[card.id] ?? '';
          const isCorrect = selectedCategory === card.category;
          return (
            <article key={card.id} className={`${styles.card}${selectedCategory ? ` ${styles.answered}` : ''}`}>
              <p>{card.text}</p>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`${styles.categoryButton}${selectedCategory === category ? ` ${styles.selected}` : ''}${selectedCategory === category && isCorrect ? ` ${styles.correct}` : ''}`}
                    onClick={() => placeCard(card.id, category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {selectedCategory && (
                <div className={styles.feedback}>
                  {isCorrect ? 'Strong classification.' : `Chosen: ${selectedCategory}`}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className={styles.reflectionPanel}>
        <label>
          <span>What overall pattern or judgement does this card sort suggest?</span>
          <textarea
            value={reflection}
            onChange={(event) => { setReflection(event.target.value); setSubmitted(false); }}
            placeholder="Overall, the evidence suggests that Alexander II modernised Russia in some areas, but preserved autocratic control because..."
          />
        </label>
      </section>

      <section className={styles.submitRow}>
        <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage || (canSubmit ? 'Ready to submit.' : 'Sort every card and write a short judgement.')}</p>
        <div className={styles.buttonRow}>
          <button type="button" className="button secondary" onClick={submitCardSort} disabled={!canSubmit || saveStatus === 'saving'}>{saveStatus === 'saving' ? 'Saving...' : submitted ? 'Update card sort' : 'Submit card sort'}</button>
          {nextHref && <button type="button" className="button" onClick={moveToNext} disabled={!canSubmit || isMovingNext || saveStatus === 'saving'}>{isMovingNext || saveStatus === 'saving' ? 'Saving...' : 'Next'}</button>}
        </div>
      </section>
    </div>
  );
}
