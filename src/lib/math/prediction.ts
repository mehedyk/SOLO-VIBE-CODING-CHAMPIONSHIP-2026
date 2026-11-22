import type { Step, Cols } from "./subtraction";

/**
 * A prediction is asked once per column, just before the first step that works on it.
 * `done` holds the columns already predicted (or skipped by the teacher).
 */
export function needsPrediction(steps: readonly Step[], nextIdx: number, done: ReadonlySet<number>): boolean {
  const step = steps[nextIdx];
  const prev = steps[nextIdx - 1];
  if (!step || !prev) return false;
  if (step.kind !== "exchange" && step.kind !== "remove") return false;
  if (step.place === undefined || done.has(step.place)) return false;
  return prev.place !== step.place;
}

/** Can the subtrahend digit be taken directly from what is on the board right now? */
export function canRemoveDirectly(boardBefore: Cols, subtrahendDigits: Cols, place: 0 | 1 | 2): boolean {
  return boardBefore[place] >= subtrahendDigits[place];
}
