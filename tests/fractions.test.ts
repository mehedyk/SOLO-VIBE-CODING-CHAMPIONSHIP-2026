import test from 'node:test';
import assert from 'node:assert/strict';
import {
  areFractionsEquivalent,
  simplifyFraction,
  validateFraction,
  buildFractionComparisonSteps,
} from '../src/lib/math/fractions';

test('Fractions: equivalence and GCD simplification', () => {
  assert.equal(areFractionsEquivalent([1, 2], [2, 4]), true);
  assert.equal(areFractionsEquivalent([2, 4], [4, 8]), true);
  assert.equal(areFractionsEquivalent([3, 6], [1, 2]), true);
  assert.equal(areFractionsEquivalent([1, 3], [1, 4]), false);

  assert.deepEqual(simplifyFraction([4, 8]), [1, 2]);
  assert.deepEqual(simplifyFraction([6, 9]), [2, 3]);
  assert.deepEqual(simplifyFraction([5, 5]), [1, 1]);
});

test('Fractions: validation bounds and constraints', () => {
  assert.equal(validateFraction(1, 2).valid, true);
  assert.equal(validateFraction(3, 4).valid, true);

  // Negative numerator
  assert.equal(validateFraction(-1, 2).valid, false);
  // Zero denominator
  assert.equal(validateFraction(1, 0).valid, false);
  // Denominator too large
  assert.equal(validateFraction(1, 25).valid, false);
  // Non-integer
  assert.equal(validateFraction(1.5, 2).valid, false);
  // Improper fraction for proper fraction lab
  assert.equal(validateFraction(5, 4).valid, false);
});

test('Fractions: step generation preserves parts and reports equivalence', () => {
  const steps = buildFractionComparisonSteps([1, 2], [2, 4]);
  assert.equal(steps.length, 4);

  assert.equal(steps[0].kind, 'initial');
  assert.equal(steps[1].kind, 'partition');
  assert.equal(steps[2].kind, 'highlight');
  assert.equal(steps[3].kind, 'result');

  assert.equal(steps[3].equivalent, true);
  assert.ok(steps[3].noteBn.includes('সমতুল্য'));
  assert.ok(steps[3].noteEn.includes('equivalent'));
});
