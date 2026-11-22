import { parseNumeral } from "./numerals";
import { validate, LIMITS, isCorrectAnswer, diagnoseAnswer, type Diagnosis } from "./subtraction";

export type InputError = "empty" | "not_integer" | "too_long" | "out_of_range" | "subtrahend_larger";
export type InputCheck =
  | { ok: true; m: number; s: number }
  | { ok: false; field: "m" | "s"; code: InputError };

export function checkInputs(mRaw: string, sRaw: string): InputCheck {
  const m = parseNumeral(mRaw);
  if (!m.ok) return { ok: false, field: "m", code: m.reason };
  const s = parseNumeral(sRaw);
  if (!s.ok) return { ok: false, field: "s", code: s.reason };
  if (m.value > LIMITS.max) return { ok: false, field: "m", code: "out_of_range" };
  if (s.value > LIMITS.max) return { ok: false, field: "s", code: "out_of_range" };
  const v = validate(m.value, s.value);
  if (!v.ok) return { ok: false, field: "s", code: v.code === "subtrahend_larger" ? "subtrahend_larger" : "out_of_range" };
  return { ok: true, m: m.value, s: s.value };
}

export type AnswerCheck =
  | { kind: "invalid"; code: "empty" | "not_integer" | "too_long" }
  | { kind: "correct" }
  | { kind: "wrong"; diagnosis: Exclude<Diagnosis, "correct"> };

export function checkAnswer(m: number, s: number, raw: string): AnswerCheck {
  const p = parseNumeral(raw);
  if (!p.ok) return { kind: "invalid", code: p.reason };
  if (isCorrectAnswer(m, s, p.value)) return { kind: "correct" };
  return { kind: "wrong", diagnosis: diagnoseAnswer(m, s, p.value) as Exclude<Diagnosis, "correct"> };
}

/** Fixed transfer problems; each needs at least one exchange (tested). */
export const TRANSFER: ReadonlyArray<readonly [number, number]> = [
  [81, 46], [73, 28], [402, 175], [600, 247], [94, 38],
];
