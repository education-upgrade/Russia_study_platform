export type AssignmentActivityStatus = 'not_started' | 'in_progress' | 'complete';

export type AssignmentActivityProgress = {
  status: AssignmentActivityStatus;
  score: number | null;
  max_score: number | null;
  confidence: number | null;
  position: Record<string, unknown> | null;
  attempt_count: number;
  last_saved_at: string | null;
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
const restoreRequests = new Map<string, Promise<AssignmentActivityProgress | null>>();
const restoredProgress = new Map<string, AssignmentActivityProgress | null>();
const freshAttemptKeys = new Set<string>();

function queueKey(input: Pick<SaveAssignmentActivityProgressInput, 'assignmentId' | 'activityType'>) {
  return `${input.assignmentId}:${input.activityType}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function protectRestoredPosition(existing: Record<string, unknown>, incoming: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...existing };

  for (const [key, incomingValue] of Object.entries(incoming)) {
    const existingValue = existing[key];

    if (typeof incomingValue === 'string' && incomingValue.trim() === '' && typeof existingValue === 'string' && existingValue.trim() !== '') {
      continue;
    }

    if (Array.isArray(incomingValue) && incomingValue.length === 0 && Array.isArray(existingValue) && existingValue.length > 0) {
      continue;
    }

    if (isRecord(incomingValue) && isRecord(existingValue)) {
      merged[key] = protectRestoredPosition(existingValue, incomingValue);
      continue;
    }

    if (isRecord(incomingValue) && Object.keys(incomingValue).length === 0 && isRecord(existingValue) && Object.keys(existingValue).length > 0) {
      continue;
    }

    merged[key] = incomingValue;
  }

  return merged;
}

async function fetchProgress(assignmentId: string, activityType: string) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`/api/assignment-progress?assignmentId=${encodeURIComponent(assignmentId)}&activityType=${encodeURIComponent(activityType)}`, {
        method: 'GET',
        cache: 'no-store',
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? 'Saved progress could not be loaded.');
      return (result?.progress ?? null) as AssignmentActivityProgress | null;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Saved progress could not be loaded.');
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error('Saved progress could not be loaded.');
}

export async function loadAssignmentActivityProgress(assignmentId: string, activityType: string) {
  const key = queueKey({ assignmentId, activityType });
  if (restoredProgress.has(key)) return restoredProgress.get(key) ?? null;

  const existingRequest = restoreRequests.get(key);
  if (existingRequest) return existingRequest;

  const request = fetchProgress(assignmentId, activityType)
    .then((progress) => {
      restoredProgress.set(key, progress);
      return progress;
    })
    .finally(() => {
      if (restoreRequests.get(key) === request) restoreRequests.delete(key);
    });

  restoreRequests.set(key, request);
  return request;
}

async function postProgress(input: SaveAssignmentActivityProgressInput) {
  let lastError: Error | null = null;
  const preparedInput = input.newAttempt
    ? {
        ...input,
        position: {
          ...(input.position ?? {}),
          attemptEventId: crypto.randomUUID(),
        },
      }
    : input;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('/api/assignment-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedInput),
        keepalive: true,
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? 'Assignment progress could not be saved.');
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

  const next = previous.catch(() => undefined).then(async () => {
    const restoreWasPending = !restoredProgress.has(key);
    if (restoreWasPending) await loadAssignmentActivityProgress(input.assignmentId, input.activityType);

    const restored = restoredProgress.get(key) ?? null;
    let guardedInput = input;

    if (restoreWasPending && !freshAttemptKeys.has(key) && restored?.position && input.position) {
      guardedInput = {
        ...input,
        position: protectRestoredPosition(restored.position, input.position),
      };
    }

    if (input.newAttempt) freshAttemptKeys.add(key);

    const result = await postProgress(guardedInput);

    const effectiveStatus = restored?.status === 'complete' && guardedInput.status !== 'complete'
      ? restored.status
      : guardedInput.status;
    const effectivePosition = guardedInput.position ?? restored?.position ?? null;

    restoredProgress.set(key, {
      status: effectiveStatus,
      score: guardedInput.score ?? restored?.score ?? null,
      max_score: guardedInput.maxScore ?? restored?.max_score ?? null,
      confidence: guardedInput.confidence ?? restored?.confidence ?? null,
      position: effectivePosition,
      attempt_count: Math.max(restored?.attempt_count ?? 0, effectiveStatus === 'not_started' ? 0 : 1) + (input.newAttempt ? 1 : 0),
      last_saved_at: new Date().toISOString(),
    });

    if (!input.newAttempt && freshAttemptKeys.has(key) && guardedInput.position && Object.keys(guardedInput.position).length > 0) {
      freshAttemptKeys.delete(key);
    }

    return result;
  });

  saveQueues.set(key, next);
  void next.finally(() => {
    if (saveQueues.get(key) === next) saveQueues.delete(key);
  });

  return next;
}
