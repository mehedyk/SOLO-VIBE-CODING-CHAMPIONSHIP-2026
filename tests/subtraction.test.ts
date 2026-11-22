import test from "node:test";
import assert from "node:assert/strict";
import { buildSubtractionSteps, valueOf, validate, isCorrectAnswer, digitsOf } from "../src/lib/math/subtraction";
import { parseNumeral, toBnDigits, formatInt } from "../src/lib/math/numerals";

const last = <T,>(a: T[]) => a[a.length - 1]!;

test("known examples", () => {
  assert.equal(valueOf(last(buildSubtractionSteps(52, 27)).counts), 25);
  assert.equal(valueOf(last(buildSubtractionSteps(305, 168)).counts), 137);
  assert.equal(valueOf(last(buildSubtractionSteps(100, 1)).counts), 99);
  assert.equal(valueOf(last(buildSubtractionSteps(999, 999)).counts), 0);
  assert.equal(valueOf(last(buildSubtractionSteps(0, 0)).counts), 0);
});

test("52-27 needs exactly one exchange (tens -> ones)", () => {
  const ex = buildSubtractionSteps(52, 27).filter((s) => s.kind === "exchange");
  assert.equal(ex.length, 1);
  assert.deepEqual(ex[0]!.counts, [12, 4, 0]);
});

test("305-168 cascades through the zero tens column (2 exchanges for ones need, then more)", () => {
  const steps = buildSubtractionSteps(305, 168);
  assert.deepEqual(steps.find((s) => s.kind === "exchange")!.counts, [5, 10, 2]);
  assert.ok(steps.filter((s) => s.kind === "exchange").length >= 2);
});

test("INVARIANT: total value unchanged by every step, exhaustive 0..999", () => {
  for (let m = 0; m <= 999; m += 1) {
    for (let s = 0; s <= m; s += 7) {
      for (const st of buildSubtractionSteps(m, s)) {
        assert.equal(valueOf(st.counts) + valueOf(st.removed), m, `m=${m} s=${s} kind=${st.kind}`);
        assert.ok(st.counts.every((c) => c >= 0 && Number.isInteger(c)), "no negative/impossible counts");
      }
    }
  }
});

test("final answer is m - s for every pair in a dense grid", () => {
  for (let m = 0; m <= 999; m += 3)
    for (let s = 0; s <= m; s += 5) {
      const f = last(buildSubtractionSteps(m, s));
      assert.equal(valueOf(f.counts), m - s);
      assert.deepEqual(f.removed, digitsOf(s));
    }
});

test("boundaries and invalid inputs", () => {
  assert.deepEqual(validate(5, 7), { ok: false, code: "subtrahend_larger" });
  assert.deepEqual(validate(1000, 1), { ok: false, code: "out_of_range" });
  assert.deepEqual(validate(-1, 0), { ok: false, code: "out_of_range" });
  assert.deepEqual(validate(1.5, 1), { ok: false, code: "not_integer" });
  assert.throws(() => buildSubtractionSteps(5, 7), RangeError);
  assert.deepEqual(validate(999, 0), { ok: true });
});

test("step 0 is start, last is result, no exchange when none needed", () => {
  const s = buildSubtractionSteps(68, 25);
  assert.equal(s[0]!.kind, "start");
  assert.equal(last(s).kind, "result");
  assert.equal(s.filter((x) => x.kind === "exchange").length, 0);
});

test("answer parsing: Bangla digits, spaces, commas, leading zeros", () => {
  assert.deepEqual(parseNumeral("২৫"), { ok: true, value: 25 });
  assert.deepEqual(parseNumeral(" 025 "), { ok: true, value: 25 });
  assert.deepEqual(parseNumeral("1,000"), { ok: true, value: 1000 });
  assert.deepEqual(parseNumeral("১২৩"), { ok: true, value: 123 });
  assert.deepEqual(parseNumeral(""), { ok: false, reason: "empty" });
  assert.deepEqual(parseNumeral("2.5"), { ok: false, reason: "not_integer" });
  assert.deepEqual(parseNumeral("-3"), { ok: false, reason: "not_integer" });
  assert.deepEqual(parseNumeral("abc"), { ok: false, reason: "not_integer" });
  assert.deepEqual(parseNumeral("1234567890"), { ok: false, reason: "too_long" });
});

test("equivalent written forms of the correct answer are accepted", () => {
  const p = parseNumeral("০২৫");
  assert.ok(p.ok && isCorrectAnswer(52, 27, p.value));
  assert.equal(isCorrectAnswer(52, 27, 24), false);
});

test("numeral formatting", () => {
  assert.equal(toBnDigits("305"), "৩০৫");
  assert.equal(formatInt(2026, "bn"), "২০২৬");
  assert.equal(formatInt(7, "en"), "7");
});
