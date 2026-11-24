import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser } from '../src/lib/auth/service';
import { createLesson } from '../src/lib/lessons/authoring';
import {
  startPublicationWorkflow,
  retryPublicationWorkflow,
  getWorkflow,
} from '../src/lib/workflow/publisher';
import { getDb } from '../src/lib/db/client';
import { getAuditLogs } from '../src/lib/auth/audit';

test('A07 Challenge: End-to-end publication workflow with failure, bounded retry, and recovery', async () => {
  const admin = await createUser({
    email: `workflow_admin_${Date.now()}@lab.org`,
    name: 'Workflow Admin',
    role: 'admin',
  });

  const author = await createUser({
    email: `wf_author_${Date.now()}@lab.org`,
    name: 'Curriculum Contributor',
    role: 'contributor',
  });

  const slug = `fractions-intro-${Date.now()}`;
  const { lesson } = await createLesson(author, {
    slug,
    titleBn: 'ভগ্নাংশের প্রাথমিক ধারণা',
    titleEn: 'Introduction to Fractions',
    topic: 'fractions',
    grade: 'Class 3',
    summaryBn: 'ভগ্নাংশ দিয়ে অংশ বুঝুন',
    summaryEn: 'Understand parts with fractions',
    data: { numerator: 1, denominator: 4 },
  });

  // TEST 1: Simulate intermediate failure at Step 2 (generate_static_snapshot)
  const failedWf = await startPublicationWorkflow(admin, lesson.id, {
    simulateFailureAtStep: 'generate_static_snapshot',
  });

  assert.equal(failedWf.status, 'failed', 'Workflow status is persisted as failed in DB');
  assert.equal(failedWf.currentStep, 2, 'Failed exactly at step index 2');
  assert.ok(failedWf.error?.includes('generate_static_snapshot'), 'Error message identifies failed step');
  assert.ok(failedWf.logs.length >= 3, 'Execution logs persisted in DB');

  // Verify lesson is NOT published yet (no premature or partial publication)
  const db = await getDb();
  const lessonDuringFailure = await db.collection('lessons').findOne({ id: lesson.id });
  assert.notEqual(lessonDuringFailure?.status, 'published', 'Lesson not published while workflow is failed');

  // TEST 2: Resume & Recover from the exact failed step
  const recoveredWf = await retryPublicationWorkflow(admin, failedWf.id);

  assert.equal(recoveredWf.status, 'completed', 'Workflow recovered to completed state');
  assert.equal(recoveredWf.retryCount, 1, 'Retry count tracked');
  assert.equal(recoveredWf.currentStep, 4, 'All 4 steps finished');

  // Verify lesson is now published
  const finalLesson = await db.collection('lessons').findOne({ id: lesson.id });
  assert.equal(finalLesson?.status, 'published', 'Lesson marked published after recovery');

  // TEST 3: Retrying a completed workflow is rejected (idempotency guard)
  await assert.rejects(async () => {
    await retryPublicationWorkflow(admin, failedWf.id);
  }, /WORKFLOW_ALREADY_COMPLETED/);

  // TEST 4: Max retries bound verification
  const { lesson: lesson2 } = await createLesson(author, {
    slug: `multi-step-fail-${Date.now()}`,
    titleBn: 'পরীক্ষা',
    titleEn: 'Test',
    topic: 'addition',
    grade: 'Class 1',
    summaryBn: 'বিবরণ',
    summaryEn: 'Summary',
    data: {},
  });

  let loopWf = await startPublicationWorkflow(admin, lesson2.id, {
    simulateFailureAtStep: 'build_catalogue_index',
  });

  // Exhaust all 3 retries
  for (let r = 1; r <= 3; r++) {
    loopWf = await retryPublicationWorkflow(admin, loopWf.id, {
      simulateFailureAtStep: 'build_catalogue_index',
    });
    assert.equal(loopWf.retryCount, r);
  }

  // 4th retry should be rejected
  await assert.rejects(async () => {
    await retryPublicationWorkflow(admin, loopWf.id);
  }, /MAX_RETRIES_EXCEEDED/);

  // Audit trail verification
  const auditLogs = await getAuditLogs({ targetResource: 'workflow' });
  assert.ok(auditLogs.some((l) => l.targetId === failedWf.id && l.action === 'WORKFLOW_STARTED'));
  assert.ok(auditLogs.some((l) => l.targetId === failedWf.id && l.action === 'WORKFLOW_STEP_FAILED'));
  assert.ok(auditLogs.some((l) => l.targetId === failedWf.id && l.action === 'WORKFLOW_RETRIED'));
  assert.ok(auditLogs.some((l) => l.targetId === failedWf.id && l.action === 'WORKFLOW_COMPLETED'));
});
