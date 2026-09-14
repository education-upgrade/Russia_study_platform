'use client';

import { useEffect } from 'react';
import styles from './LevelUpCelebration.module.css';

export default function LevelUpCelebration({ level, onContinue }: { level: number; onContinue: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') onContinue(); }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

  return <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="recall-level-up-title">
    <div className={styles.card}>
      <span className={styles.star} aria-hidden="true">★</span>
      <p>Level up</p>
      <h2 id="recall-level-up-title">Level {level}</h2>
      <strong>50 more correct answers secured.</strong>
      <span>Your teacher can now see that a reward is due.</span>
      <button type="button" onClick={onContinue}>Continue Recall</button>
    </div>
  </div>;
}
