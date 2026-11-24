import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser } from '../src/lib/auth/service';
import {
  createLesson,
  updateLesson,
  submitLessonForReview,
  reviewLesson,
  getLessonVersions,
  validateLessonData,
} from '../src/lib/lessons/authoring';
import { getAuditLogs } from '../src/lib/auth/audit';

test('Lesson Authoring: schema validation', () => {
  const invalid = validateLessonData({
    slug: 'Invalid Slug!',
    titleBn: '',
    titleEn: 'Maths',
    topic: '',
    grade: '',
    summaryBn: '',
    summaryEn: '',
    data: null,
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 4);

  const valid = validateLessonData({
    slug: 'place-value-decimals',
    titleBn: 'দশমিক স্থান মান',
    titleEn: 'Place Value Decimals',
    topic: 'fractions',
    grade: 'Class 4',
    summaryBn: 'দশমিকের ভিত্তি বুঝুন',
    summaryEn: 'Understand decimal place values',
    data: { steps: 5 },
  });

  assert.equal(valid.valid, true);
});

test('Lesson Lifecycle: create, immutable versioning, hash check, and peer review', async () => {
  const author1 = await createUser({
    email: `author1_${Date.now()}@edu.org`,
    name: 'Author One',
    role: 'contributor',
  });

  const author2 = await createUser({
    email: `author2_${Date.now()}@edu.org`,
    name: 'Author Two',
    role: 'contributor',
  });

  const reviewer = await createUser({
    email: `reviewer_${Date.now()}@edu.org`,
    name: 'Peer Reviewer',
    role: 'reviewer',
  });

  const slug = `addition-multi-${Date.now()}`;
  const { lesson, version } = await createLesson(author1, {
    slug,
    titleBn: 'দুই অঙ্কের যোগ',
    titleEn: 'Two-digit addition',
    topic: 'addition',
    grade: 'Class 2',
    summaryBn: 'হাতে রেখে যোগ শেখা',
    summaryEn: 'Learn addition with regrouping',
    data: { a: 45, b: 38 },
  });

  assert.equal(lesson.version, 1);
  assert.equal(lesson.status, 'draft');
  assert.equal(version.version, 1);
  assert.ok(version.contentHash.length === 64, 'SHA-256 hash has 64 hex characters');

  // Author 2 cannot edit Author 1's lesson (A03 requirement)
  await assert.rejects(async () => {
    await updateLesson(author2, lesson.id, { titleEn: 'Hacked Title' });
  }, /RESOURCE_OWNERSHIP_MISMATCH/);

  // Author 1 updates lesson -> version increments to 2
  const updated = await updateLesson(author1, lesson.id, {
    titleEn: 'Two-digit Addition with Regrouping (Updated)',
    data: { a: 48, b: 37 },
  });

  assert.equal(updated.lesson.version, 2);
  assert.notEqual(updated.version.contentHash, version.contentHash, 'Content hash changes when content changes');

  // Verify versions history preserves both v1 and v2 immutably
  const versions = await getLessonVersions(lesson.id);
  assert.equal(versions.length, 2);
  assert.equal(versions[0].version, 1);
  assert.equal(versions[1].version, 2);

  // Submit for review
  const submitted = await submitLessonForReview(author1, lesson.id);
  assert.equal(submitted.status, 'under_review');

  // Author cannot review own lesson (Conflict of interest check)
  await assert.rejects(async () => {
    await reviewLesson(author1, lesson.id, 'approved', 'Looks good to me');
  }, /INSUFFICIENT_PERMISSIONS|AUTHOR_CANNOT_REVIEW_OWN_LESSON/);

  // Reviewer requests changes
  const reviewResult = await reviewLesson(reviewer, lesson.id, 'changes_requested', 'Please add practice cards');
  assert.equal(reviewResult.review.decision, 'changes_requested');
  assert.equal(reviewResult.lesson.status, 'draft', 'Reverts to draft for author corrections');

  // Verify audit log has the trail
  const logs = await getAuditLogs({ targetResource: 'lesson' });
  assert.ok(logs.some((l) => l.targetId === lesson.id && l.action === 'LESSON_CREATED'));
  assert.ok(logs.some((l) => l.targetId === lesson.id && l.action === 'LESSON_UPDATED'));
  assert.ok(logs.some((l) => l.targetId === lesson.id && l.action === 'LESSON_REVIEW_CHANGES_REQUESTED'));
});
