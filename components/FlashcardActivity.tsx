'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import styles from './FlashcardActivity.module.css';

type FlashcardRating = 'secure' | 'nearly' | 'revisit';

type Flashcard = {
  id?: string;
  front: string;
  back: string;
};

type FlashcardActivityProps = {
  activityId: string;
  cards: Flashcard[];
  nextHref?: string;
};

const ratingLabels: Record<FlashcardRating, string> = {
  secure: 'Secure',
  nearly: 'Nearly',
  revisit: 'Revisit',
};

function getCardId(card: Flashcard, index: number) {
  return card.id ?? `card-${index + 1}`;
}

export default function FlashcardActivity({ activityId, cards, nextHref = '/student/lesson/1905/quiz' }: FlashcardActivityProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({});
  const [completed, setCompleted] = useState(false);
  const [isMovingNext, setIsMovingNext] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const currentCard = cards[currentIndex];
  const currentCardId = currentCard ? getCardId(currentCard, currentIndex) : '';
  const isRevealed = revealedCardIds.includes(currentCardId);
  const currentRating = ratings[currentCardId];
  const ratedCount = Object.keys(ratings).length;
  const secureCount = Object.values(ratings).filter((rating) => rating === 'secure').length;
  const nearlyCount = Object.values(ratings).filter((rating) => rating === 'nearly').length;
  const revisitCount = Object.values(ratings).filter((rating) => rating === 'revisit').length;
  const progressPercentage = cards.length ? Math.round((ratedCount / cards.length) * 100) : 0;
  const isDeckComplete = cards.length > 0 && ratedCount === cards.length;

  const revisitCards = useMemo(() => cards.filter((card, index) => ratings[getCardId(card, index)] === 'revisit'), [cards, ratings]);
  const nearlyCards = useMemo(() => cards.filter((card, index) => ratings[getCardId(card, index)] === 'nearly'), [cards, ratings]);

  function revealCard() {
    if (!currentCardId || isRevealed) return;
    setRevealedCardIds((previous) => [...new Set([...previous, currentCardId])]);
  }

  async function saveFlashcards(nextRatings: Record<string, FlashcardRating>, nextRevealedCardIds: string[]) {
    setSaveStatus('saving');
    setSaveMessage('');
    try {
      const response = await fetch('/api/student-responses/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, ratings: nextRatings, revealedCardIds: nextRevealedCardIds, totalCards: cards.length }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Flashcard progress could not be saved.');
      setSaveStatus('saved');
      setSaveMessage('Saved');
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Could not save automatically.');
      return false;
    }
  }

  function rateCard(rating: FlashcardRating) {
    if (!currentCardId) return;
    const nextRatings = { ...ratings, [currentCardId]: rating };
    const nextRevealedCardIds = [...new Set([...revealedCardIds, currentCardId])];
    const isFinalCard = currentIndex === cards.length - 1;
    setRatings(nextRatings);
    setRevealedCardIds(nextRevealedCardIds);
    void saveFlashcards(nextRatings, nextRevealedCardIds);
    if (isFinalCard) {
      window.setTimeout(() => setCompleted(true), 350);
      return;
    }
    window.setTimeout(() => setCurrentIndex((previous) => Math.min(previous + 1, cards.length - 1)), 350);
  }

  function resetDeck() {
    setCurrentIndex(0);
    setRevealedCardIds([]);
    setRatings({});
    setCompleted(false);
    setIsMovingNext(false);
    setSaveStatus('idle');
    setSaveMessage('');
  }

  async function moveToNext() {
    if (isMovingNext) return;
    setIsMovingNext(true);
    const allCardIds = cards.map((card, index) => getCardId(card, index));
    const nextRevealedCardIds = [...new Set([...revealedCardIds, ...allCardIds.filter((cardId) => ratings[cardId])])];
    const saved = await saveFlashcards(ratings, nextRevealedCardIds);
    if (saved) {
      router.push(nextHref);
      return;
    }
    setIsMovingNext(false);
  }

  if (!currentCard) return <section className="panel warm"><h3>No cards found</h3><p>This activity does not currently have any cards.</p></section>;

  if (completed || isDeckComplete) {
    const revisitList = revisitCards.map((card) => card.front).join(' · ');
    const nearlyList = nearlyCards.map((card) => card.front).join(' · ');
    return (
      <div className={styles.shell}>
        <section className={styles.topbar}><div><h3>Flashcards complete</h3></div><div className={styles.stats}><span>{secureCount}/{cards.length} secure</span><span>{nearlyCount} nearly</span><span>{revisitCount} revisit</span></div></section>
        <div className={styles.progress}><div style={{ width: '100%' }} /></div>
        <section className={styles.completionSummary}><h2>{secureCount}/{cards.length}</h2><p>{revisitCount === 0 && nearlyCount <= 3 ? 'Strong flashcard recall. Now test this knowledge in the retrieval quiz.' : 'Good work. Revisit the weaker cards, then test the knowledge in the retrieval quiz.'}</p></section>
        {(revisitCards.length > 0 || nearlyCards.length > 0) && (
          <section className={styles.completionTargets}>
            {revisitCards.length > 0 && <article><strong>Revisit first</strong><span>{revisitList}</span></article>}
            {nearlyCards.length > 0 && <article><strong>Nearly secure</strong><span>{nearlyList}</span></article>}
          </section>
        )}
        <section className={styles.completionNav}>
          <button type="button" className="button secondary" onClick={() => { setCompleted(false); setCurrentIndex(0); }}>Review</button>
          <button type="button" className="button secondary" onClick={resetDeck}>Try again</button>
          <button type="button" className="button" onClick={moveToNext} disabled={isMovingNext || saveStatus === 'saving'}>{isMovingNext || saveStatus === 'saving' ? 'Saving...' : 'Next'}</button>
        </section>
        {saveMessage && <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage}</p>}
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}><div><h3>Card {currentIndex + 1} of {cards.length}</h3></div><div className={styles.stats}><span>{ratedCount}/{cards.length} rated</span><span>{secureCount} secure</span><span>{nearlyCount} nearly</span><span>{revisitCount} revisit</span></div></section>
      <div className={styles.progress}><div style={{ width: `${progressPercentage}%` }} /></div>
      <section className={`${styles.card} ${isRevealed ? styles.revealed : ''}`}><div className={styles.face}><h2>{currentCard.front}</h2></div><div className={`${styles.face} ${isRevealed ? '' : styles.hiddenAnswer}`} aria-hidden={!isRevealed}><p>{currentCard.back}</p></div></section>
      <section className={styles.controls}>
        {!isRevealed ? <button type="button" className={`button ${styles.primary}`} onClick={revealCard}>Reveal answer</button> : (
          <div className={styles.ratingRow}>
            {(Object.keys(ratingLabels) as FlashcardRating[]).map((rating) => <button type="button" key={rating} className={`${styles.rating} ${styles[rating]}${currentRating === rating ? ` ${styles.selected}` : ''}`} onClick={() => rateCard(rating)}>{ratingLabels[rating]}</button>)}
          </div>
        )}
      </section>
      <section className={styles.bottomNav}><button type="button" className="button secondary" onClick={() => setCurrentIndex((previous) => Math.max(previous - 1, 0))} disabled={currentIndex === 0}>Previous</button><span className={`${styles.savePill} ${styles[saveStatus]}`}>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : saveStatus === 'saved' ? 'Saved' : ''}</span></section>
      {saveStatus === 'error' && saveMessage && <p className={`${styles.saveMessage} ${styles.error}`}>{saveMessage}</p>}
    </div>
  );
}
