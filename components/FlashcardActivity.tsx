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
  const ratedCount = Object.keys(ratings).length;
  const secureCount = Object.values(ratings).filter((rating) => rating === 'secure').length;
  const nearlyCount = Object.values(ratings).filter((rating) => rating === 'nearly').length;
  const revisitCount = Object.values(ratings).filter((rating) => rating === 'revisit').length;
  const progressPercentage = cards.length ? Math.round((ratedCount / cards.length) * 100) : 0;

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
    setSaveMessage('Saving flashcard progress...');

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
      setSaveMessage(`Saved at ${new Date(result.savedAt).toLocaleTimeString()}`);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Flashcard progress could not be saved.');
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
    <div className="flashcard-activity-shell">
      <section className="flashcard-progress-panel">
        <div>
          <p className="eyebrow">Active recall</p>
          <h3>Card {currentIndex + 1} of {cards.length}</h3>
          <p>Try to answer before revealing. Then rate the card honestly so your teacher can see what needs revisiting.</p>
        </div>
        <div className="activity-summary">
          <span className="badge">Rated: {ratedCount}/{cards.length}</span>
          <span className="badge">Secure: {secureCount}</span>
          <span className="badge">Nearly: {nearlyCount}</span>
          <span className="badge">Revisit: {revisitCount}</span>
        </div>
        <div className="progress-bar" aria-label="Flashcard completion progress">
          <div className="progress-fill" style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} />
        </div>
        {saveMessage && <p><strong>Save status:</strong> {saveMessage}</p>}
      </section>

      <section className={`interactive-flashcard ${isRevealed ? 'revealed' : ''}`}>
        <div className="flashcard-face">
          <p className="eyebrow">Question</p>
          <h3>{currentCard.front}</h3>
        </div>

        {isRevealed ? (
          <div className="flashcard-face answer-face">
            <p className="eyebrow">Answer</p>
            <p>{currentCard.back}</p>
          </div>
        ) : (
          <button type="button" className="button" onClick={revealCard}>
            Reveal answer
          </button>
        )}
      </section>

      {isRevealed && (
        <section className="panel">
          <p className="eyebrow">Rate your recall</p>
          <h3>How well did you know this?</h3>
          <div className="flashcard-rating-row">
            {(Object.keys(ratingLabels) as FlashcardRating[]).map((rating) => (
              <button
                type="button"
                key={rating}
                className={`option-button rating-${rating}${ratings[currentCardId] === rating ? ' selected' : ''}`}
                onClick={() => rateCard(rating)}
              >
                {ratingLabels[rating]}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flashcard-navigation-row">
        <button type="button" className="button secondary" onClick={goToPreviousCard} disabled={currentIndex === 0}>
          Previous
        </button>
        <button type="button" className="button secondary" onClick={goToNextCard} disabled={currentIndex === cards.length - 1}>
          Next card
        </button>
        <button type="button" className="button" onClick={saveFlashcards} disabled={saveStatus === 'saving'}>
          {saveStatus === 'saving' ? 'Saving...' : ratedCount === cards.length ? 'Save completed flashcards' : 'Save progress'}
        </button>
      </div>

      {revisitCards.length > 0 && (
        <section className="panel warm">
          <p className="eyebrow">Revisit list</p>
          <h3>Cards to review again</h3>
          <ul className="revisit-list">
            {revisitCards.map((card, index) => (
              <li key={`${card.front}-${index}`}>{card.front}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
