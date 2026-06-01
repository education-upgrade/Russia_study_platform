'use client';

import { useState } from 'react';

type AssignRecommendedRouteButtonProps = {
  pathwaySlug: string;
  lessonTitle: string;
  routeMode: string;
  requiredActivityTypes: string[];
  instructions: string;
};

export default function AssignRecommendedRouteButton({
  pathwaySlug,
  lessonTitle,
  routeMode,
  requiredActivityTypes,
  instructions,
}: AssignRecommendedRouteButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function assignRoute() {
    setStatus('saving');
    setMessage('Creating recommended assignment...');

    try {
      const response = await fetch('/api/guided-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathwaySlug,
          lessonTitle,
          mode: routeMode,
          requiredActivityTypes,
          instructions,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Assignment could not be created.');

      setStatus('saved');
      setMessage(`Assigned: ${result.route ?? requiredActivityTypes.join(' → ')}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Assignment could not be created.');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button
        type="button"
        onClick={assignRoute}
        disabled={status === 'saving'}
        style={{
          border: '1px solid rgba(213, 226, 235, 0.95)',
          borderRadius: 999,
          background: '#15223f',
          color: '#fff',
          padding: '10px 14px',
          font: 'inherit',
          fontWeight: 950,
          cursor: status === 'saving' ? 'wait' : 'pointer',
        }}
      >
        {status === 'saving' ? 'Assigning...' : 'Assign recommended route'}
      </button>
      {message && (
        <small style={{ color: status === 'error' ? '#9f1239' : '#536275', fontWeight: 800, lineHeight: 1.35 }}>
          {message}
        </small>
      )}
    </div>
  );
}
