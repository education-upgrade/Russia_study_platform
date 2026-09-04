export type AssignmentActivityStatus = 'not_started' | 'in_progress' | 'complete';

type SaveAssignmentActivityProgressInput = {
  assignmentId: string;
  activityType: string;
  status: AssignmentActivityStatus;
  score?: number | null;
  maxScore?: number | null;
  confidence?: number | null;
  position?: Record<string, unknown>;
  newAttempt?: boolean;
};

export async function saveAssignmentActivityProgress(input: SaveAssignmentActivityProgressInput) {
  const response = await fetch('/api/assignment-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    keepalive: input.status === 'complete',
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error ?? 'Assignment progress could not be saved.');
  }

  return result;
}
