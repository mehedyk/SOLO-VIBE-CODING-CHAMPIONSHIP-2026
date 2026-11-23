import test from "node:test";
import assert from "node:assert/strict";
import { buildAdditionSteps, validateAddition, diagnoseAddition } from "../src/lib/math/addition";
import { valueOf, digitsOf } from "../src/lib/math/subtraction";
import { checkAdditionInputs, checkAdditionAnswer, ADD_TRANSFER } from "../src/lib/math/inputs";
import { needsPrediction } from "../src/lib/math/prediction";

const last = <T,>(a: T[]) => a[a.length - 1]!;

test("addition known examples", () => {
  for (const [a, b] of [[48, 37], [95, 55], [999, 0], [0, 0], [500, 499], [199, 800], [9, 1], [99, 1]] as const) {
    const f = last(buildAdditionSteps(a, b));
    assert.equal(valueOf(f.counts), a + b, `${a}+${b}`);
    assert.deepEqual(f.side, [0, 0, 0]);
  }
});

test("48+37: exactly one exchange, ones 15 -> 5 and the tens column gains 1", () => {
  const steps = buildAdditionSteps(48, 37);
  const ex = steps.filter((s) => s.kind === "exchange");
  assert.equal(ex.length, 1);
  assert.deepEqual(ex[0]!.counts, [5, 5, 0]); // ones 15-10; tens 4+1 carried (the 3 tens are added next)
  assert.equal(ex[0]!.from, 0); assert.equal(ex[0]!.to, 1);
});

test("95+55 needs two exchanges (ones, then tens)", () => {
  assert.equal(buildAdditionSteps(95, 55).filter((s) => s.kind === "exchange").length, 2);
});

test("INVARIANT: board + pending = a+b at every step (dense grid), no impossible counts", () => {
  for (let a = 0; a <= 999; a += 7)
    for (let b = 0; a + b <= 999; b += 11)
      for (const st of buildAdditionSteps(a, b)) {
        assert.equal(valueOf(st.counts) + valueOf(st.side), a + b, `${a}+${b} ${st.kind}`);
        assert.ok(st.counts.every((c) => Number.isInteger(c) && c >= 0 && c <= 19));
      }
});

test("every exchange moves exactly ten ones-of-a-place to one of the next place", () => {
  for (let a = 0; a <= 999; a += 13)
    for (let b = 0; a + b <= 999; b += 17) {
      const steps = buildAdditionSteps(a, b);
      steps.forEach((st, i) => {
        if (st.kind !== "exchange") return;
        const prev = steps[i - 1]!;
        assert.equal(prev.counts[st.from!] - st.counts[st.from!], 10);
        assert.equal(st.counts[st.to!] - prev.counts[st.to!], 1);
      });
    }
});

test("validation: boundaries and invalid input", () => {
  assert.deepEqual(validateAddition(500, 499), { ok: true });
  assert.deepEqual(validateAddition(500, 500), { ok: false, code: "sum_too_large" });
  assert.deepEqual(validateAddition(1000, 0), { ok: false, code: "out_of_range" });
  assert.deepEqual(validateAddition(-1, 0), { ok: false, code: "out_of_range" });
  assert.deepEqual(validateAddition(1.5, 1), { ok: false, code: "not_integer" });
  assert.throws(() => buildAdditionSteps(600, 600), RangeError);
  assert.deepEqual(checkAdditionInputs("৪৮", "৩৭"), { ok: true, m: 48, s: 37 });
  assert.deepEqual(checkAdditionInputs("600", "600"), { ok: false, field: "s", code: "sum_too_large" });
  assert.deepEqual(checkAdditionInputs("", "1"), { ok: false, field: "m", code: "empty" });
});

test("answers: equivalent forms ok; forgotten carry diagnosed; letters invalid", () => {
  assert.deepEqual(checkAdditionAnswer(48, 37, "৮৫"), { kind: "correct" });
  assert.deepEqual(checkAdditionAnswer(48, 37, "085"), { kind: "correct" });
  assert.deepEqual(checkAdditionAnswer(48, 37, "75"), { kind: "wrong", diagnosis: "forgot_carry" });
  assert.deepEqual(checkAdditionAnswer(48, 37, "x"), { kind: "invalid", code: "not_integer" });
  assert.equal(diagnoseAddition(48, 37, 99), "other");
});

test("prediction asked once per column for addition", () => {
  const steps = buildAdditionSteps(48, 37);
  const done = new Set<number>(); const asked: number[] = [];
  for (let i = 1; i < steps.length; i++) if (needsPrediction(steps, i, done)) { asked.push(steps[i]!.place!); done.add(steps[i]!.place!); }
  assert.deepEqual(asked, [0, 1, 2]);
});

test("transfer additions are valid and each needs an exchange", () => {
  for (const [a, b] of ADD_TRANSFER) {
    assert.equal(checkAdditionInputs(String(a), String(b)).ok, true);
    assert.ok(buildAdditionSteps(a, b).some((s) => s.kind === "exchange"), `${a}+${b}`);
  }
  assert.deepEqual(digitsOf(48), [8, 4, 0]);
});
