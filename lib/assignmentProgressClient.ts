export type AssignmentActivityStatus = 'not_started' | 'in_progress' | 'complete';

export type AssignmentActivityProgress = {
  status: AssignmentActivityStatus;
  score: number | null;
  max_score: number | null;
  confidence: number | null;
  position: Record<string, unknown> | null;
  attempt_count: number;
  updated_at: string | null;
};

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

const saveQueues = new Map<string, Promise<unknown>>();

function queueKey(input: SaveAssignmentActivityProgressInput) {
  return `${input.assignmentId}:${input.activityType}`;
}

export async function loadAssignmentActivityProgress(assignmentId: string, activityType: string) {
  const response = await fetch(`/api/assignment-progress?assignmentId=${encodeURIComponent(assignmentId)}&activityType=${encodeURIComponent(activityType)}`, {
    method: 'GET',
    cache: 'no-store',
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error ?? 'Saved progress could not be loaded.');
  return (result?.progress ?? null) as AssignmentActivityProgress | null;
}

async function postProgress(input: SaveAssignmentActivityProgressInput) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('/api/assignment-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        keepalive: true,
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error ?? 'Assignment progress could not be saved.');
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Assignment progress could not be saved.');
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  throw lastError ?? new Error('Assignment progress could not be saved.');
}

export function saveAssignmentActivityProgress(input: SaveAssignmentActivityProgressInput) {
  const key = queueKey(input);
  const previous = saveQueues.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(() => postProgress(input));

  saveQueues.set(key, next);
  void next.finally(() => {
    if (saveQueues.get(key) === next) saveQueues.delete(key);
  });

  return next;
}
