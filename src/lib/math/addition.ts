/**
 * Place-value addition with regrouping, exact integers.
 * Invariant at EVERY step:  value(counts) + value(pending) === a + b
 * (an exchange of ten for one never changes the total value).
 */
import { digitsOf, valueOf, LIMITS, type Cols, type Place } from "./subtraction";
import type { BoardStep } from "./board";

export type AdditionValidation =
  | { ok: true }
  | { ok: false; code: "not_integer" | "out_of_range" | "sum_too_large" };

export function validateAddition(a: number, b: number): AdditionValidation {
  if (!Number.isInteger(a) || !Number.isInteger(b)) return { ok: false, code: "not_integer" };
  if (a < LIMITS.min || a > LIMITS.max || b < LIMITS.min || b > LIMITS.max) return { ok: false, code: "out_of_range" };
  if (a + b > LIMITS.max) return { ok: false, code: "sum_too_large" };
  return { ok: true };
}

export function buildAdditionSteps(a: number, b: number): BoardStep[] {
  const v = validateAddition(a, b);
  if (!v.ok) throw new RangeError(`invalid addition input: ${v.code}`);
  const counts: [number, number, number] = [...digitsOf(a)] as [number, number, number];
  const pending: [number, number, number] = [...digitsOf(b)] as [number, number, number];
  const answer: [number, number, number] = [-1, -1, -1];
  const steps: BoardStep[] = [];
  const push = (kind: string, key: string, params: Record<string, number>, place?: Place, from?: Place, to?: Place) =>
    steps.push({
      kind, place, from, to,
      counts: [counts[0], counts[1], counts[2]], side: [pending[0], pending[1], pending[2]],
      answerDigits: [answer[0], answer[1], answer[2]], note: { key, params },
    });

  push("start", "add_start", { a, b });
  for (const p of [0, 1, 2] as const) {
    const n = pending[p];
    counts[p] += n;
    pending[p] = 0;
    const needsExchange = counts[p] >= 10;
    if (!needsExchange) answer[p] = counts[p];
    push("add", "add_put", { place: p, n, count: counts[p] }, p);
    if (needsExchange) {
      if (p === 2) throw new Error("unreachable: sum <= 999 cannot overflow the hundreds column");
      const before = counts[p];
      counts[p] -= 10;
      counts[p + 1] = counts[p + 1]! + 1;
      answer[p] = counts[p];
      push("exchange", "add_carry", { from: p, to: p + 1, count: before, left: counts[p] }, p, p, (p + 1) as Place);
    }
  }
  push("result", "add_result", { a, b, answer: a + b });
  return steps;
}

export type AddDiagnosis = "correct" | "forgot_carry" | "other";
export function diagnoseAddition(a: number, b: number, answer: number): AddDiagnosis {
  const correct = a + b;
  if (answer === correct) return "correct";
  if (answer === correct - 10 || answer === correct - 100) return "forgot_carry";
  return "other";
}

export { valueOf };
export type { Cols };
