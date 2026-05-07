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

const ratingHints: Record<FlashcardRating, string> = {
  secure: 'I knew this without help.',
  nearly: 'I mostly knew it but need another look.',
  revisit: 'I need to relearn this card.',
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
    <div className="flashcard-activity-shell" style={{ maxWidth: 860, margin: '0 auto' }}>
      <section className="flashcard-progress-panel" style={{ position: 'sticky', top: 12, zIndex: 4 }}>
        <div className="quiz-toolbar">
          <div>
            <p className="eyebrow">Active recall deck</p>
            <h3 style={{ marginBottom: 4 }}>Card {currentIndex + 1} of {cards.length}</h3>
            <p style={{ margin: 0 }}>Answer from memory, reveal, rate, then move on. The controls stay fixed so the page does not jump.</p>
          </div>
          <div className="activity-summary">
            <span className="badge">Rated: {ratedCount}/{cards.length}</span>
            <span className="badge">Secure: {secureCount}</span>
            <span className="badge">Nearly: {nearlyCount}</span>
            <span className="badge">Revisit: {revisitCount}</span>
          </div>
        </div>
        <div className="progress-bar" aria-label="Flashcard completion progress">
          <div className="progress-fill" style={{ '--progress': `${progressPercentage}%` } as React.CSSProperties} />
        </div>
        {saveMessage && (
          <p style={{ margin: '8px 0 0' }}>
            <strong>Save status:</strong> {saveMessage}
          </p>
        )}
      </section>

      <section
        className={`interactive-flashcard ${isRevealed ? 'revealed' : ''}`}
        style={{
          minHeight: 430,
          gridTemplateRows: '1fr auto auto',
          alignContent: 'stretch',
          gap: 14,
        }}
      >
        <div
          className="flashcard-face"
          style={{
            minHeight: 230,
            display: 'grid',
            alignContent: 'center',
            overflow: 'auto',
          }}
        >
          <div style={{ display: isRevealed ? 'grid' : 'block', gap: 18 }}>
            <div>
              <p className="eyebrow">Question</p>
              <h3>{currentCard.front}</h3>
            </div>

            {isRevealed && (
              <div className="answer-face" style={{ borderTop: '1px solid rgba(22, 33, 63, 0.12)', paddingTop: 16 }}>
                <p className="eyebrow">Answer</p>
                <p style={{ marginBottom: 0 }}>{currentCard.back}</p>
              </div>
            )}
          </div>
        </div>

        <section
          className="panel"
          style={{
            minHeight: 142,
            padding: 16,
            display: 'grid',
            alignContent: 'center',
            boxShadow: 'none',
          }}
        >
          {!isRevealed ? (
            <div>
              <p className="eyebrow">Step 1</p>
              <h3 style={{ marginBottom: 10 }}>Try to answer before revealing.</h3>
              <button type="button" className="button" onClick={revealCard}>
                Reveal answer
              </button>
            </div>
          ) : (
            <div>
              <p className="eyebrow">Step 2 · Rate your recall</p>
              <div className="flashcard-rating-row">
                {(Object.keys(ratingLabels) as FlashcardRating[]).map((rating) => (
                  <button
                    type="button"
                    key={rating}
                    className={`option-button rating-${rating}${currentRating === rating ? ' selected' : ''}`}
                    onClick={() => rateCard(rating)}
                  >
                    <strong>{ratingLabels[rating]}</strong>
                    <br />
                    <small>{ratingHints[rating]}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="flashcard-navigation-row" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="button secondary" onClick={goToPreviousCard} disabled={currentIndex === 0}>
            Previous
          </button>
          <button type="button" className="button secondary" onClick={goToNextCard} disabled={currentIndex === cards.length - 1}>
            Next card
          </button>
          <button type="button" className="button" onClick={saveFlashcards} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : isDeckComplete ? 'Save completed deck' : 'Save progress'}
          </button>
        </div>
      </section>

      {isDeckComplete && (
        <section className={revisitCards.length > 0 ? 'panel warm' : 'panel green'}>
          <p className="eyebrow">Deck summary</p>
          <h3>{revisitCards.length > 0 ? 'Revisit these before writing' : 'Deck complete'}</h3>
          {revisitCards.length > 0 ? (
            <ul className="revisit-list">
              {revisitCards.map((card, index) => (
                <li key={`${card.front}-${index}`}>{card.front}</li>
              ))}
            </ul>
          ) : (
            <p>All cards have been rated and none were marked for revisit.</p>
          )}
        </section>
      )}
    </div>
  );
}
