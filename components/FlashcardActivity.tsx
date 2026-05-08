'use client';

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
};

const ratingLabels: Record<FlashcardRating, string> = {
  secure: 'Secure',
  nearly: 'Nearly',
  revisit: 'Revisit',
};

function getCardId(card: Flashcard, index: number) {
  return card.id ?? `card-${index + 1}`;
}

export default function FlashcardActivity({ activityId, cards }: FlashcardActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedCardIds, setRevealedCardIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({});
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

  const revisitCards = useMemo(
    () => cards.filter((card, index) => ratings[getCardId(card, index)] === 'revisit'),
    [cards, ratings]
  );

  function revealCard() {
    if (!currentCardId || isRevealed) return;
    setRevealedCardIds((previous) => [...new Set([...previous, currentCardId])]);
  }

  async function saveFlashcards(nextRatings: Record<string, FlashcardRating>, nextRevealedCardIds: string[]) {
    setSaveStatus('saving');
    setSaveMessage('Saving progress...');

    try {
      const response = await fetch('/api/student-responses/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          ratings: nextRatings,
          revealedCardIds: nextRevealedCardIds,
          totalCards: cards.length,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Flashcard progress could not be saved.');
      }

      setSaveStatus('saved');
      setSaveMessage(`Saved automatically at ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Could not save automatically.');
    }
  }

  function rateCard(rating: FlashcardRating) {
    if (!currentCardId) return;

    const nextRatings = { ...ratings, [currentCardId]: rating };
    const nextRevealedCardIds = [...new Set([...revealedCardIds, currentCardId])];

    setRatings(nextRatings);
    setRevealedCardIds(nextRevealedCardIds);
    void saveFlashcards(nextRatings, nextRevealedCardIds);

    if (currentIndex < cards.length - 1) {
      window.setTimeout(() => {
        setCurrentIndex((previous) => Math.min(previous + 1, cards.length - 1));
      }, 350);
    }
  }

  function goToPreviousCard() {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  if (!currentCard) {
    return (
      <section className="panel warm">
        <h3>No cards found</h3>
        <p>This activity does not currently have any cards.</p>
      </section>
    );
  }

  return (
    <div className={styles.shell}>
      <section className={styles.topbar}>
        <div>
          <h3>Card {currentIndex + 1} of {cards.length}</h3>
        </div>
        <div className={styles.stats} aria-label="Flashcard progress statistics">
          <span>{ratedCount}/{cards.length} rated</span>
          <span>{secureCount} secure</span>
          <span>{nearlyCount} nearly</span>
          <span>{revisitCount} revisit</span>
        </div>
      </section>

      <div className={styles.progress} aria-label="Flashcard completion progress">
        <div style={{ width: `${progressPercentage}%` }} />
      </div>

      <section className={`${styles.card} ${isRevealed ? styles.revealed : ''}`}>
        <div className={styles.face}>
          <h2>{currentCard.front}</h2>
        </div>

        <div className={`${styles.face} ${isRevealed ? '' : styles.hiddenAnswer}`} aria-hidden={!isRevealed}>
          <p>{currentCard.back}</p>
        </div>
      </section>

      <section className={styles.controls}>
        {!isRevealed ? (
          <button type="button" className={`button ${styles.primary}`} onClick={revealCard}>
            Reveal answer
          </button>
        ) : (
          <div className={styles.ratingRow} aria-label="Rate your recall">
            {(Object.keys(ratingLabels) as FlashcardRating[]).map((rating) => (
              <button
                type="button"
                key={rating}
                className={`${styles.rating} ${styles[rating]}${currentRating === rating ? ` ${styles.selected}` : ''}`}
                onClick={() => rateCard(rating)}
              >
                {ratingLabels[rating]}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.bottomNav}>
        <button type="button" className="button secondary" onClick={goToPreviousCard} disabled={currentIndex === 0}>
          Previous
        </button>
        <span className={styles.autoSaveHint}>
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Autosave failed' : isDeckComplete ? 'Deck saved' : 'Autosaves after each rating'}
        </span>
      </section>

      {saveMessage && <p className={`${styles.saveMessage} ${styles[saveStatus]}`}>{saveMessage}</p>}

      {isDeckComplete && (
        <section className={`${styles.summary} ${revisitCards.length > 0 ? styles.summaryRevisit : styles.summarySecure}`}>
          <strong>{revisitCards.length > 0 ? 'Revisit before writing' : 'Deck complete'}</strong>
          {revisitCards.length > 0 ? (
            <span>{revisitCards.map((card) => card.front).join(' · ')}</span>
          ) : (
            <span>No cards marked for revisit.</span>
          )}
        </section>
      )}
    </div>
  );
}
