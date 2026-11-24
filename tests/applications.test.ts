import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser } from '../src/lib/auth/service';
import { submitApplication, listApplications, reviewApplication } from '../src/lib/applications/service';
import { getAuditLogs } from '../src/lib/auth/audit';
import { getDb } from '../src/lib/db/client';

test('Contributor application lifecycle: submit, duplicate rejection, and admin approval', async () => {
  const applicant = await createUser({
    email: `applicant_${Date.now()}@test.com`,
    name: 'Mathematics Teacher',
    role: 'guest',
  });

  const admin = await createUser({
    email: `admin_app_${Date.now()}@test.com`,
    name: 'Curriculum Director',
    role: 'admin',
  });

  // Submit application
  const app = await submitApplication(applicant, {
    teachingExperience: '5 years primary math in Dhaka',
    sampleLessonPlan: 'Regrouping using physical tens rods',
  });

  assert.equal(app.status, 'pending');
  assert.equal(app.userId, applicant.id);

  // Submitting again while pending should fail
  await assert.rejects(async () => {
    await submitApplication(applicant, {
      teachingExperience: 'Another experience',
      sampleLessonPlan: 'Another plan',
    });
  }, /PENDING_APPLICATION_EXISTS/);

  // Listing applications
  const pendingList = await listApplications('pending');
  const found = pendingList.find((a) => a.id === app.id);
  assert.ok(found, 'Application appears in pending list');

  // Admin approves application
  const approved = await reviewApplication(admin, app.id, 'approved', 'Clear lesson pedagogy verified');
  assert.equal(approved.status, 'approved');
  assert.equal(approved.reviewedBy, admin.id);

  // Verify applicant is now upgraded to 'contributor'
  const db = await getDb();
  const updatedUser = await db.collection('users').findOne({ id: applicant.id });
  assert.equal(updatedUser?.role, 'contributor', 'User role upgraded to contributor on application approval');

  // Verify audit log has the events
  const logs = await getAuditLogs({ targetResource: 'application' });
  const approvalEvent = logs.find((l) => l.targetId === app.id && l.action === 'APPLICATION_APPROVED');
  assert.ok(approvalEvent, 'Audit event logged for application approval');
});
