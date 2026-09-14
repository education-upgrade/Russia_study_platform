'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AcknowledgeRecallRewardButton({ rewardId }: { rewardId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function acknowledge() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/teacher/recall-rewards/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Reward could not be updated.');
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Reward could not be updated.');
    } finally {
      setBusy(false);
    }
  }

  return <div>
    <button type="button" onClick={acknowledge} disabled={busy}>{busy ? 'Saving…' : 'Mark reward given'}</button>
    {error && <small role="alert">{error}</small>}
  </div>;
}
