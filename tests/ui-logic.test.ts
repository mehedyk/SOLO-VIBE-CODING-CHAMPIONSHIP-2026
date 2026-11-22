import test from "node:test";
import assert from "node:assert/strict";
import { buildSubtractionSteps, diagnoseAnswer, digitsOf } from "../src/lib/math/subtraction";
import { needsPrediction } from "../src/lib/math/prediction";
import { checkInputs, checkAnswer, TRANSFER } from "../src/lib/math/inputs";
import { dict, noteText, fill, LANGS } from "../src/lib/i18n/dict";

const ph = (s: string) => [...new Set(s.match(/\{(\w+)\}/g) ?? [])].sort().join(",");

test("i18n: bn and en have identical keys, no empty strings, same placeholders", () => {
  const bn = dict.bn as Record<string, string>, en = dict.en as Record<string, string>;
  assert.deepEqual(Object.keys(bn).sort(), Object.keys(en).sort());
  for (const k of Object.keys(bn)) {
    assert.ok(bn[k]!.trim().length > 0 && en[k]!.trim().length > 0, `empty: ${k}`);
    assert.equal(ph(bn[k]!), ph(en[k]!), `placeholder mismatch: ${k}`);
  }
});

test("i18n: bn text uses Bangla script; Bangla UI numerals are Bangla digits", () => {
  assert.match(dict.bn.appName, /[\u0980-\u09FF]/);
  const steps = buildSubtractionSteps(305, 168);
  for (const s of steps) {
    const t = noteText(s.note, "bn");
    assert.ok(!/[0-9]/.test(t), `ASCII digit in bn note: ${t}`);
    assert.ok(!/\{\w+\}/.test(t), `unfilled placeholder: ${t}`);
    const e = noteText(s.note, "en");
    assert.ok(!/\{\w+\}/.test(e) && e.length > 0);
  }
});

test("i18n: every note renders for a broad sample in both languages", () => {
  for (const lang of LANGS)
    for (let m = 0; m <= 999; m += 37)
      for (let s = 0; s <= m; s += 41)
        for (const st of buildSubtractionSteps(m, s)) assert.ok(noteText(st.note, lang).length > 5);
});

test("prediction is asked once per column that has work, before its first step", () => {
  const steps = buildSubtractionSteps(52, 27);
  const done = new Set<number>();
  const asked: number[] = [];
  for (let i = 1; i < steps.length; i++) {
    if (needsPrediction(steps, i, done)) { asked.push(steps[i]!.place!); done.add(steps[i]!.place!); }
  }
  assert.deepEqual(asked, [0, 1, 2]);
  assert.equal(needsPrediction(steps, 0, new Set()), false);
  assert.equal(needsPrediction(steps, steps.length - 1, new Set()), false); // result step
});

test("prediction ground truth: 52-27 ones column cannot be removed directly, tens can", () => {
  const steps = buildSubtractionSteps(52, 27);
  const s = digitsOf(27);
  assert.equal(steps[0]!.counts[0] >= s[0], false);
  const afterExchange = steps.find((x) => x.kind === "exchange")!;
  assert.equal(afterExchange.counts[0] >= s[0], true);
});

test("input validation: messages codes for bad numbers", () => {
  assert.deepEqual(checkInputs("52", "27"), { ok: true, m: 52, s: 27 });
  assert.deepEqual(checkInputs("৫২", "২৭"), { ok: true, m: 52, s: 27 });
  assert.deepEqual(checkInputs("", "3"), { ok: false, field: "m", code: "empty" });
  assert.deepEqual(checkInputs("5", ""), { ok: false, field: "s", code: "empty" });
  assert.deepEqual(checkInputs("1000", "3"), { ok: false, field: "m", code: "out_of_range" });
  assert.deepEqual(checkInputs("20", "30"), { ok: false, field: "s", code: "subtrahend_larger" });
  assert.deepEqual(checkInputs("2.5", "1"), { ok: false, field: "m", code: "not_integer" });
  assert.deepEqual(checkInputs("12345678901", "1"), { ok: false, field: "m", code: "too_long" });
});

test("answers: equivalent forms accepted, common errors diagnosed, nothing mislabelled", () => {
  assert.deepEqual(checkAnswer(52, 27, " ২৫ "), { kind: "correct" });
  assert.deepEqual(checkAnswer(52, 27, "025"), { kind: "correct" });
  assert.deepEqual(checkAnswer(52, 27, "35"), { kind: "wrong", diagnosis: "smaller_from_larger" });
  assert.deepEqual(checkAnswer(52, 27, "35.0"), { kind: "invalid", code: "not_integer" });
  assert.equal(diagnoseAnswer(52, 27, 35), "smaller_from_larger");
  assert.equal(diagnoseAnswer(52, 27, 35 + 0), "smaller_from_larger");
  assert.equal(diagnoseAnswer(52, 27, 25), "correct");
  assert.equal(diagnoseAnswer(52, 27, 99), "other");
  // when no regrouping is needed the "smaller from larger" answer IS the right answer
  assert.equal(diagnoseAnswer(68, 25, 43), "correct");
});

test("transfer problems are valid and each needs at least one exchange", () => {
  for (const [m, s] of TRANSFER) {
    assert.equal(checkInputs(String(m), String(s)).ok, true);
    assert.ok(buildSubtractionSteps(m, s).some((x) => x.kind === "exchange"), `${m}-${s}`);
  }
});

test("fill leaves unknown placeholders visible (so tests catch them)", () => {
  assert.equal(fill("a {x} b {y}", { x: 1 }), "a 1 b {y}");
});
