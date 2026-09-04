'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveAssignmentActivityProgress } from '@/lib/assignmentProgressClient';

type Props = {
  activityType: string;
  children: React.ReactNode;
};

export default function AssignmentActivityProgressBridge({ activityType, children }: Props) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');

  useEffect(() => {
    if (!assignmentId) return;

    void saveAssignmentActivityProgress({
      assignmentId,
      activityType,
      status: 'in_progress',
    }).catch((error) => {
      console.error('Unable to mark assignment activity as started', error);
    });
  }, [assignmentId, activityType]);

  return <>{children}</>;
}
