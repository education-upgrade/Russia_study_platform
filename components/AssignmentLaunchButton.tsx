'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  assignmentId: string;
  activityType: string;
  href: string;
  label: string;
};

export default function AssignmentLaunchButton({ href, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function launch() {
    setLoading(true);
    router.push(href);
  }

  return (
    <button className="button" type="button" onClick={launch} disabled={loading}>
      {loading ? 'Opening...' : label}
    </button>
  );
}
