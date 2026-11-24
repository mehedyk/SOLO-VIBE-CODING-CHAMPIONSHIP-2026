import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateNumberLineInputs,
  buildNumberLineSteps,
} from '../src/lib/math/numberline';

test('Number Line: input validation and boundaries', () => {
  // Valid addition: 8 + 5 = 13
  assert.equal(validateNumberLineInputs(8, 5, '+').valid, true);

  // Valid subtraction: 15 - 7 = 8
  assert.equal(validateNumberLineInputs(15, 7, '−').valid, true);

  // Exceeds max range (20)
  assert.equal(validateNumberLineInputs(18, 5, '+').valid, false);

  // Below min range (0)
  assert.equal(validateNumberLineInputs(3, 7, '−').valid, false);

  // Non integers
  assert.equal(validateNumberLineInputs(3.5, 2, '+').valid, false);
});

test('Number Line: step progression and invariant target check', () => {
  const steps = buildNumberLineSteps(8, 5, '+');
  assert.equal(steps.length, 3);

  // Step 0: start
  assert.equal(steps[0]!.kind, 'start');
  assert.equal(steps[0]!.current, 8);

  // Step 1: jump
  assert.equal(steps[1]!.kind, 'jump');
  assert.equal(steps[1]!.jump, 5);

  // Step 2: result
  assert.equal(steps[2]!.kind, 'result');
  assert.equal(steps[2]!.target, 13);
  assert.equal(steps[2]!.current, 13);
  assert.ok(steps[2]!.noteBn.includes('13'));
  assert.ok(steps[2]!.noteEn.includes('13'));
});
