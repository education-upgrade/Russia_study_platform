'use client';

import { useState } from 'react';
import styles from '@/app/teacher/progress/page.module.css';

type AssignRecommendedRouteButtonProps = {
  pathwaySlug: string;
  lessonTitle: string;
  routeMode: string;
  requiredActivityTypes: string[];
  instructions: string;
  label?: string;
  showMessage?: boolean;
};

export default function AssignRecommendedRouteButton({
  pathwaySlug,
  lessonTitle,
  routeMode,
  requiredActivityTypes,
  instructions,
  label = 'Assign recommended route',
  showMessage = true,
}: AssignRecommendedRouteButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function assignRoute() {
    setStatus('saving');
    setMessage('Creating assignment...');

    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathwaySlug, lessonTitle, mode: routeMode, requiredActivityTypes, instructions }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Assignment could not be created.');

      setStatus('saved');
      setMessage(`Assigned: ${result.route ?? requiredActivityTypes.join(' to ')}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <div className={styles.actionButtonGroup}>
      <button type="button" onClick={assignRoute} disabled={status === 'saving'} className={styles.copyButton}>
        {status === 'saving' ? 'Assigning...' : status === 'saved' ? 'Assigned' : label}
      </button>
      {message && showMessage && <small className={status === 'error' ? styles.errorText : styles.mutedText}>{message}</small>}
    </div>
  );
}
