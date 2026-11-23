/** Minimal shape needed to decide when to ask a prediction. */
export interface PStep { kind: string; place?: number }

/**
 * A prediction is asked once per column, just before the first step that works on it.
 * `done` holds the columns already predicted (or skipped by the teacher).
 */
export function needsPrediction(steps: readonly PStep[], nextIdx: number, done: ReadonlySet<number>): boolean {
  const step = steps[nextIdx];
  const prev = steps[nextIdx - 1];
  if (!step || !prev) return false;
  if (step.kind === "start" || step.kind === "result") return false;
  if (step.place === undefined || done.has(step.place)) return false;
  return prev.place !== step.place;
}
