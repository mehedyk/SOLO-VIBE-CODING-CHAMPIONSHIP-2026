import test from 'node:test';
import assert from 'node:assert/strict';
import { createUser, authenticateUser, suspendUser, reactivateUser } from '../src/lib/auth/service';
import { createSession, validateSession, revokeSession } from '../src/lib/auth/session';
import { hasCapability } from '../src/lib/auth/roles';
import { logAuditEvent, getAuditLogs } from '../src/lib/auth/audit';

test('Authentication: registration, hashing and login verification', async () => {
  const email = `teacher_${Date.now()}@example.com`;
  const user = await createUser({
    email,
    name: 'Primary Teacher',
    password: 'mock_test_pass_123',
    role: 'contributor',
  });

  assert.equal(user.email, email);
  assert.equal(user.role, 'contributor');
  assert.equal(user.status, 'active');
  assert.ok(user.passwordHash && !user.passwordHash.includes('mock_test_pass_123'), 'Password is encrypted and salted');

  // Authenticate success
  const authSuccess = await authenticateUser(email, 'mock_test_pass_123');
  assert.ok(authSuccess);
  assert.equal(authSuccess?.id, user.id);

  // Authenticate bad password
  const authFail = await authenticateUser(email, 'WrongPassword');
  assert.equal(authFail, null);
});

test('Sessions: token creation, validation, and revocation', async () => {
  const email = `session_user_${Date.now()}@example.com`;
  const user = await createUser({ email, name: 'Session User', password: 'password123' });

  const session = await createSession(user.id);
  assert.ok(session.token, 'Session token generated');

  const checkValid = await validateSession(session.token);
  assert.equal(checkValid.valid, true);
  assert.equal(checkValid.user?.id, user.id);

  // Revoke session
  await revokeSession(session.token);
  const checkRevoked = await validateSession(session.token);
  assert.equal(checkRevoked.valid, false);
  assert.equal(checkRevoked.reason, 'SESSION_REVOKED');
});

test('Multi-device Sessions: multiple active internet logins in MongoDB', async () => {
  const email = `multi_${Date.now()}@example.com`;
  const user = await createUser({ email, name: 'Multi User', password: 'password123' });

  // Login 1: Desktop Chrome
  const session1 = await createSession(user.id, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    ip: '103.205.71.1',
  });

  // Login 2: Mobile Safari
  const session2 = await createSession(user.id, {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1',
    ip: '103.205.71.2',
  });

  // Both sessions are valid concurrently in MongoDB
  const val1 = await validateSession(session1.token);
  const val2 = await validateSession(session2.token);
  assert.equal(val1.valid, true);
  assert.equal(val2.valid, true);

  // Revoking phone session does not kill desktop session
  await revokeSession(session2.token);
  assert.equal((await validateSession(session2.token)).valid, false);
  assert.equal((await validateSession(session1.token)).valid, true);
});

test('Capability Model: roles, capabilities, and ownership checks', async () => {
  const guestUser = { id: 'u_guest', email: 'g@e.com', name: 'G', role: 'guest' as const, status: 'active' as const, createdAt: '', updatedAt: '' };
  const contrib1 = { id: 'u_c1', email: 'c1@e.com', name: 'C1', role: 'contributor' as const, status: 'active' as const, createdAt: '', updatedAt: '' };
  const contrib2 = { id: 'u_c2', email: 'c2@e.com', name: 'C2', role: 'contributor' as const, status: 'active' as const, createdAt: '', updatedAt: '' };
  const reviewer = { id: 'u_rev', email: 'r@e.com', name: 'R', role: 'reviewer' as const, status: 'active' as const, createdAt: '', updatedAt: '' };
  const admin = { id: 'u_adm', email: 'a@e.com', name: 'A', role: 'admin' as const, status: 'active' as const, createdAt: '', updatedAt: '' };

  // Guest can read lessons, cannot create
  assert.equal(hasCapability(guestUser, 'lesson:read').allowed, true);
  assert.equal(hasCapability(guestUser, 'lesson:create').allowed, false);

  // Contributor can create lessons
  assert.equal(hasCapability(contrib1, 'lesson:create').allowed, true);

  // Ownership: Contributor 1 editing own lesson vs Contributor 2's lesson
  const ownCheck = hasCapability(contrib1, 'lesson:edit_own', { resourceOwnerId: 'u_c1' });
  assert.equal(ownCheck.allowed, true, 'Can edit own lesson');

  const otherCheck = hasCapability(contrib1, 'lesson:edit_own', { resourceOwnerId: 'u_c2' });
  assert.equal(otherCheck.allowed, false, 'Rejected editing another user lesson');
  assert.equal(otherCheck.reason, 'RESOURCE_OWNERSHIP_MISMATCH');

  // Reviewer can review
  assert.equal(hasCapability(reviewer, 'lesson:review').allowed, true);
  assert.equal(hasCapability(reviewer, 'user:suspend').allowed, false);

  // Admin has full capabilities including edit_any and user:suspend
  assert.equal(hasCapability(admin, 'lesson:edit_any').allowed, true);
  assert.equal(hasCapability(admin, 'user:suspend').allowed, true);
});

test('A03 Challenge Verification: suspension blocks access and logs audit trail', async () => {
  const admin = await createUser({ email: `admin_${Date.now()}@e.com`, name: 'Admin', role: 'admin' });
  const badActor = await createUser({ email: `bad_${Date.now()}@e.com`, name: 'Bad Actor', role: 'contributor' });

  const session = await createSession(badActor.id);
  assert.equal((await validateSession(session.token)).valid, true);

  // Admin suspends user
  await suspendUser(admin.id, badActor.id, 'Violating guidelines');

  // Token is immediately invalidated
  const sessionAfterSuspension = await validateSession(session.token);
  assert.equal(sessionAfterSuspension.valid, false, 'Suspended user session invalidated');

  // Any attempt to perform operations is denied with USER_SUSPENDED
  const capCheck = hasCapability({ ...badActor, status: 'suspended' }, 'lesson:create');
  assert.equal(capCheck.allowed, false);
  assert.equal(capCheck.reason, 'USER_SUSPENDED');

  // Check audit log contains suspension event
  const logs = await getAuditLogs({ targetResource: 'user' });
  const event = logs.find((l) => l.targetId === badActor.id && l.action === 'USER_SUSPENDED');
  assert.ok(event, 'Audit log records user suspension with admin actor and reason');
  assert.equal(event?.actorId, admin.id);
});
