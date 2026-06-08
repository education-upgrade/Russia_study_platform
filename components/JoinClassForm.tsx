'use client';

import { useState } from 'react';
import styles from '@/app/join-class/page.module.css';

export default function JoinClassForm() {
  const [classCode, setClassCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'joining' | 'joined' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function joinClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('joining');
    setMessage('Checking class code...');

    try {
      const response = await fetch('/api/classes/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Class could not be joined.');

      setStatus('joined');
      setMessage(`Joined ${result.className}. You can now continue to your study dashboard.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Class could not be joined.');
    }
  }

  return (
    <form className={styles.form} onSubmit={joinClass}>
      <label htmlFor="classCode">Class code</label>
      <div className={styles.inputRow}>
        <input
          id="classCode"
          name="classCode"
          value={classCode}
          onChange={(event) => setClassCode(event.target.value.toUpperCase())}
          placeholder="RUSSIA12"
          autoComplete="off"
          required
        />
        <button type="submit" disabled={status === 'joining'}>
          {status === 'joining' ? 'Joining...' : 'Join class'}
        </button>
      </div>
      {message && <p className={status === 'error' ? styles.error : styles.message}>{message}</p>}
      {status === 'joined' && <a className={styles.continueLink} href="/student">Go to student dashboard</a>}
    </form>
  );
}
