import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser } from '../src/lib/auth/service';
import { createLesson, updateLesson } from '../src/lib/lessons/authoring';
import {
  reportLesson,
  quarantineLesson,
  dismissReport,
  listReports,
} from '../src/lib/moderation/service';
import { getAuditLogs } from '../src/lib/auth/audit';

test('A03 Challenge: Moderation, Quarantine, and Unauthorized Modification Auditing', async () => {
  const author = await createUser({
    email: `mod_author_${Date.now()}@lab.org`,
    name: 'Author Contributor',
    role: 'contributor',
  });

  const attacker = await createUser({
    email: `mod_attacker_${Date.now()}@lab.org`,
    name: 'Unauthorized User',
    role: 'contributor',
  });

  const reviewer = await createUser({
    email: `mod_reviewer_${Date.now()}@lab.org`,
    name: 'Pedagogy Reviewer',
    role: 'reviewer',
  });

  const slug = `quarantine-test-${Date.now()}`;
  const { lesson } = await createLesson(author, {
    slug,
    titleBn: 'ত্রুটিযুক্ত পাঠ',
    titleEn: 'Flawed Lesson',
    topic: 'subtraction',
    grade: 'Class 3',
    summaryBn: 'ত্রুটিপূর্ণ বিবরণ',
    summaryEn: 'Flawed explanation',
    data: { minuend: 50, subtrahend: 60 },
  });

  // Step 1: Teacher/student reports the lesson
  const report = await reportLesson(
    { id: 'student_1' },
    lesson.id,
    'Negative result not supported in Class 3 curriculum',
    'Minuend is smaller than subtrahend.'
  );

  assert.equal(report.status, 'open');
  assert.equal(report.targetId, lesson.id);

  // Step 2 (A03 JUDGE TEST): Attacker/unauthorized user attempts to quarantine lesson
  await assert.rejects(async () => {
    await quarantineLesson(attacker, lesson.id, report.id, 'Malicious quarantine');
  }, /UNAUTHORIZED_QUARANTINE_ATTEMPT/);

  // Verify audit log has the rejected unauthorized attempt
  const violationLogs = await getAuditLogs({ targetResource: 'lesson' });
  const violationEvent = violationLogs.find(
    (l) => l.targetId === lesson.id && l.actorId === attacker.id && l.allowed === false
  );
  assert.ok(violationEvent, 'Audit log records unauthorized tampering attempt');
  assert.equal(violationEvent?.reason, 'UNAUTHORIZED_QUARANTINE_ATTEMPT');

  // Step 3: Authorized reviewer quarantines the lesson
  const quarantined = await quarantineLesson(
    reviewer,
    lesson.id,
    report.id,
    'Confirmed: negative subtraction is outside Grade 3 curriculum scope'
  );

  assert.equal(quarantined.status, 'quarantined');
  assert.ok(quarantined.quarantineReason?.includes('outside Grade 3 curriculum'));

  // Step 4: Author attempts to modify quarantined lesson -> blocked
  await assert.rejects(async () => {
    await updateLesson(author, lesson.id, { titleEn: 'Quick Fix' });
  }, /CANNOT_EDIT_QUARANTINED_LESSON/);

  // Step 5: Second report dismissed with note
  const secondReport = await reportLesson({ id: 'user_2' }, lesson.id, 'Dislike font color');
  const dismissed = await dismissReport(reviewer, secondReport.id, 'Not a policy or mathematical violation');
  assert.equal(dismissed.status, 'dismissed');
  assert.equal(dismissed.resolvedBy, reviewer.id);

  // Step 6: Verify all audit trails
  const allLogs = await getAuditLogs();
  assert.ok(allLogs.some((l) => l.action === 'LESSON_QUARANTINED' && l.actorId === reviewer.id));
  assert.ok(allLogs.some((l) => l.action === 'REPORT_DISMISSED' && l.actorId === reviewer.id));
});
