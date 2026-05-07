'use client';

import { useMemo, useState } from 'react';

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
    setRevealedCardIds((previous) => [...previous, currentCardId]);
  }

  function rateCard(rating: FlashcardRating) {
    if (!currentCardId) return;
    setRatings((previous) => ({ ...previous, [currentCardId]: rating }));
    setSaveStatus('idle');
    setSaveMessage('');
  }

  function goToNextCard() {
    setCurrentIndex((previous) => Math.min(previous + 1, cards.length - 1));
  }

  function goToPreviousCard() {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  async function saveFlashcards() {
    setSaveStatus('saving');
    setSaveMessage('Saving...');

    try {
      const response = await fetch('/api/student-responses/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          ratings,
          revealedCardIds,
          totalCards: cards.length,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Flashcard progress could not be saved.');
      }

      setSaveStatus('saved');
      setSaveMessage(`Saved ${new Date(result.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Could not save.');
    }
  }

  if (!currentCard) {
    return (
      <section className="panel warm">
        <p className="eyebrow">Flashcards</p>
        <h3>No flashcards found</h3>
        <p>This activity does not currently have any cards.</p>
      </section>
    );
  }

  return (
    <div className="flashcard-app-shell">
      <section className="flashcard-app-topbar">
        <div>
          <p className="eyebrow">Active recall</p>
          <h3>Card {currentIndex + 1} of {cards.length}</h3>
        </div>
        <div className="flashcard-mini-stats" aria-label="Flashcard progress statistics">
          <span>{ratedCount}/{cards.length} rated</span>
          <span>{secureCount} secure</span>
          <span>{nearlyCount} nearly</span>
          <span>{revisitCount} revisit</span>
        </div>
      </section>

      <div className="flashcard-app-progress" aria-label="Flashcard completion progress">
        <div style={{ width: `${progressPercentage}%` }} />
      </div>

      <section className={`flashcard-app-card ${isRevealed ? 'revealed' : ''}`}>
        <div className="flashcard-app-card-face question-face">
          <p className="eyebrow">Question</p>
          <h2>{currentCard.front}</h2>
        </div>

        <div className="flashcard-app-card-face answer-face" aria-hidden={!isRevealed}>
          <p className="eyebrow">Answer</p>
          <p>{currentCard.back}</p>
        </div>
      </section>

      <section className="flashcard-app-controls">
        {!isRevealed ? (
          <button type="button" className="button flashcard-primary-action" onClick={revealCard}>
            Reveal answer
          </button>
        ) : (
          <div className="flashcard-rating-compact" aria-label="Rate your recall">
            {(Object.keys(ratingLabels) as FlashcardRating[]).map((rating) => (
              <button
                type="button"
                key={rating}
                className={`flashcard-rating-chip ${rating}${currentRating === rating ? ' selected' : ''}`}
                onClick={() => rateCard(rating)}
              >
                {ratingLabels[rating]}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="flashcard-app-bottom-nav">
        <button type="button" className="button secondary" onClick={goToPreviousCard} disabled={currentIndex === 0}>
          Previous
        </button>
        <button type="button" className="button secondary" onClick={goToNextCard} disabled={currentIndex === cards.length - 1}>
          Next
        </button>
        <button type="button" className="button" onClick={saveFlashcards} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? 'Saving...' : isDeckComplete ? 'Save deck' : 'Save'}
        </button>
      </section>

      {saveMessage && (
        <p className={`flashcard-save-message ${saveStatus}`}>{saveMessage}</p>
      )}

      {isDeckComplete && (
        <section className={revisitCards.length > 0 ? 'flashcard-deck-summary revisit' : 'flashcard-deck-summary secure'}>
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
