/**
 * Place-value subtraction with regrouping (exchange), exact integer arithmetic.
 *
 * Model: three columns [ones, tens, hundreds]. `counts` are the objects still on
 * the board; `removed` are objects taken away so far. Invariant at EVERY step:
 *     value(counts) + value(removed) === minuend
 * i.e. an exchange never changes the total value, only how it is bundled.
 */
export const PLACES = ["ones", "tens", "hundreds"] as const;
export type Place = 0 | 1 | 2; // index into PLACES
export const PLACE_VALUE = [1, 10, 100] as const;

export const LIMITS = { min: 0, max: 999 } as const;

export type Cols = readonly [number, number, number];

export type StepKind = "start" | "exchange" | "remove" | "result";

export interface Step {
  kind: StepKind;
  /** Column being worked on (undefined for start/result). */
  place?: Place;
  /** For exchange: the higher column giving one unit away. */
  from?: Place;
  counts: Cols;
  removed: Cols;
  /** Written-method digits of the answer completed so far (ones first), -1 = not yet. */
  answerDigits: readonly [number, number, number];
  /** Machine-readable explanation; the UI localises it. */
  note: { key: string; params: Record<string, number> };
}

export type Validation =
  | { ok: true }
  | { ok: false; code: "not_integer" | "out_of_range" | "subtrahend_larger"; };

export function validate(minuend: number, subtrahend: number): Validation {
  if (!Number.isInteger(minuend) || !Number.isInteger(subtrahend)) return { ok: false, code: "not_integer" };
  if (minuend < LIMITS.min || minuend > LIMITS.max || subtrahend < LIMITS.min || subtrahend > LIMITS.max)
    return { ok: false, code: "out_of_range" };
  if (subtrahend > minuend) return { ok: false, code: "subtrahend_larger" };
  return { ok: true };
}

export function digitsOf(n: number): Cols {
  return [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100)];
}

export function valueOf(c: Cols): number {
  return c[0] * 1 + c[1] * 10 + c[2] * 100;
}

const copy = (c: Cols): [number, number, number] => [c[0], c[1], c[2]];

export function buildSubtractionSteps(minuend: number, subtrahend: number): Step[] {
  const v = validate(minuend, subtrahend);
  if (!v.ok) throw new RangeError(`invalid subtraction input: ${v.code}`);

  const m = digitsOf(minuend);
  const s = digitsOf(subtrahend);
  const counts = copy(m);
  const removed: [number, number, number] = [0, 0, 0];
  const answer: [number, number, number] = [-1, -1, -1];
  const steps: Step[] = [];

  const push = (kind: StepKind, key: string, params: Record<string, number>, place?: Place, from?: Place) =>
    steps.push({
      kind, place, from, counts: copy(counts), removed: copy(removed),
      answerDigits: [answer[0], answer[1], answer[2]], note: { key, params },
    });

  push("start", "start", { minuend });

  for (const p of [0, 1, 2] as const) {
    // Not enough objects in this column: exchange from the nearest non-empty higher column,
    // one unit at a time, cascading through zeros (e.g. 305 − 168).
    while (counts[p] < s[p]) {
      let q = (p + 1) as number;
      while (q <= 2 && counts[q] === 0) q++;
      // q <= 2 is guaranteed because subtrahend <= minuend (validated), see tests.
      if (q > 2) throw new Error("unreachable: validated input must be able to regroup");
      // Break one unit of column q into ten units of column q-1.
      counts[q] -= 1;
      counts[q - 1] += 10;
      push("exchange", "exchange", { from: q, to: q - 1, count: counts[q - 1], need: s[p] }, p, q as Place);
    }
    counts[p] -= s[p];
    removed[p] += s[p];
    answer[p] = counts[p];
    push("remove", "remove", { remove: s[p], left: counts[p], place: p }, p);
  }

  steps.push({
    kind: "result", counts: copy(counts), removed: copy(removed),
    answerDigits: [answer[0], answer[1], answer[2]],
    note: { key: "result", params: { minuend, subtrahend, answer: minuend - subtrahend } },
  });
  return steps;
}

/** Check a learner answer. Exact integer compare; format variants handled by parseNumeral. */
export function isCorrectAnswer(minuend: number, subtrahend: number, answer: number): boolean {
  return Number.isInteger(answer) && answer === minuend - subtrahend;
}
