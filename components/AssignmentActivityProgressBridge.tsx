'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

type Props = {
  activityType: string;
  children: React.ReactNode;
};

const completionLabels = [
  'next',
  'finish',
  'finished',
  'complete',
  'completed',
  'submit',
  'continue',
  'return to pathway',
];

function isCompletionControl(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const control = target.closest('button, a, [role="button"]');
  if (!control) return false;
  const label = (control.textContent ?? '').trim().toLowerCase();
  return completionLabels.some((candidate) => label === candidate || label.startsWith(`${candidate} `));
}

async function saveProgress(assignmentId: string, activityType: string, status: 'in_progress' | 'complete') {
  const response = await fetch('/api/assignment-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignmentId, activityType, status }),
    keepalive: status === 'complete',
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? 'Assignment progress could not be saved.');
  }
}

export default function AssignmentActivityProgressBridge({ activityType, children }: Props) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const completionSent = useRef(false);

  useEffect(() => {
    completionSent.current = false;
    if (!assignmentId) return;
    void saveProgress(assignmentId, activityType, 'in_progress').catch((error) => {
      console.error('Unable to mark assignment activity as started', error);
    });
  }, [assignmentId, activityType]);

  function captureCompletion(event: React.MouseEvent<HTMLDivElement>) {
    if (!assignmentId || completionSent.current || !isCompletionControl(event.target)) return;
    completionSent.current = true;
    void saveProgress(assignmentId, activityType, 'complete').catch((error) => {
      completionSent.current = false;
      console.error('Unable to mark assignment activity as complete', error);
    });
  }

  return <div onClickCapture={captureCompletion}>{children}</div>;
}
