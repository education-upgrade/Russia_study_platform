'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  assignmentId: string;
  activityType: string;
  href: string;
  label: string;
};

export default function AssignmentLaunchButton({ assignmentId, activityType, href, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function launch() {
    setLoading(true);
    try {
      await fetch('/api/assignment-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, activityType, status: 'in_progress' }),
      });
    } finally {
      router.push(href);
    }
  }

  return (
    <button className="button" type="button" onClick={launch} disabled={loading}>
      {loading ? 'Opening...' : label}
    </button>
  );
}
