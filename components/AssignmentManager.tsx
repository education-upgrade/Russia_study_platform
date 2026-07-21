'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/app/teacher/set-study/page.module.css';

type AssignmentManagerProps = {
  assignmentId: string;
  instructions: string | null;
  dueAt: string | null;
  status: string;
};

function toLocalDateTimeInput(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default function AssignmentManager({ assignmentId, instructions: initialInstructions, dueAt, status }: AssignmentManagerProps) {
  const router = useRouter();
  const [instructions, setInstructions] = useState(initialInstructions ?? '');
  const [deadline, setDeadline] = useState(toLocalDateTimeInput(dueAt));
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function runAction(action: 'update' | 'sync_recipients' | 'archive') {
    if (action === 'archive' && !window.confirm('Archive this assignment? Students will no longer see it on their dashboard.')) return;

    setBusyAction(action);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...(action === 'update' ? {
            instructions,
            dueAt: deadline ? new Date(deadline).toISOString() : null,
          } : {}),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'The assignment could not be updated.');

      if (action === 'update') setMessage('Instructions and deadline updated.');
      if (action === 'sync_recipients') setMessage(`Student list refreshed. ${result.recipientTotal ?? 0} students are now assigned.`);
      if (action === 'archive') setMessage('Assignment archived.');
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'The assignment could not be updated.');
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <details className={styles.managePanel}>
      <summary>Manage</summary>
      <div className={styles.manageBody}>
        <label className={styles.manageField}>
          <span>Deadline</span>
          <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </label>
        <label className={styles.manageField}>
          <span>Student instruction</span>
          <textarea rows={3} value={instructions} onChange={(event) => setInstructions(event.target.value)} />
        </label>
        <div className={styles.manageActions}>
          <button type="button" onClick={() => runAction('update')} disabled={busyAction !== null}>
            {busyAction === 'update' ? 'Saving…' : 'Save changes'}
          </button>
          {status === 'published' && (
            <button type="button" onClick={() => runAction('sync_recipients')} disabled={busyAction !== null}>
              {busyAction === 'sync_recipients' ? 'Refreshing…' : 'Add new students'}
            </button>
          )}
          {status !== 'archived' && (
            <button type="button" className={styles.archiveButton} onClick={() => runAction('archive')} disabled={busyAction !== null}>
              {busyAction === 'archive' ? 'Archiving…' : 'Archive'}
            </button>
          )}
        </div>
        {message && <p className={`${styles.manageMessage} ${isError ? styles.manageError : ''}`} role="status">{message}</p>}
      </div>
    </details>
  );
}
