import test from 'node:test';
import assert from 'node:assert/strict';
import { getDb } from '../src/lib/db/client';
import { ensureIndexes } from '../src/lib/db/schema';
import { saveAttempt, getAttemptsByUser, getLessonStats } from '../src/lib/db/attempts';

test('DB client connects and initializes schema indexes', async () => {
  const db = await getDb();
  assert.ok(db, 'Database instance is returned');
  await assert.doesNotReject(async () => {
    await ensureIndexes(db);
  }, 'ensureIndexes runs without error');
});

test('Attempts can be saved, queried by guest/user, and stats aggregated', async () => {
  const guestId = 'guest_test_' + Date.now();
  const slug = 'subtraction-regrouping';

  const saved1 = await saveAttempt({
    guestId,
    lessonSlug: slug,
    inputs: { minuend: 52, subtrahend: 27 },
    completedSteps: 3,
    totalSteps: 3,
    score: 100,
    predictions: [{ place: 'ones', prediction: false, correct: true }],
  });

  assert.ok(saved1.id, 'Has assigned ID');
  assert.equal(saved1.completedSteps, 3);

  const saved2 = await saveAttempt({
    guestId,
    lessonSlug: slug,
    inputs: { minuend: 63, subtrahend: 28 },
    completedSteps: 2,
    totalSteps: 3,
    score: 80,
    predictions: [{ place: 'ones', prediction: false, correct: true }],
  });

  const guestAttempts = await getAttemptsByUser({ guestId });
  assert.equal(guestAttempts.length, 2, 'Returns both attempts for the guest');

  const stats = await getLessonStats(slug);
  assert.ok(stats.totalAttempts >= 2, 'Stats include at least 2 attempts');
  assert.ok(stats.avgScore > 0, 'Average score calculated');
});
