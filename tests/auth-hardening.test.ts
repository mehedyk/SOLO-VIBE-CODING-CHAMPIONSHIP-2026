import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPasswordPolicy, hashPassword, verifyPassword } from '../src/lib/auth/password';
import { safeNextPath, registerSchema } from '../src/lib/auth/validation';
import { createUser, authenticateUser } from '../src/lib/auth/service';
import { createSession, validateSession, hashToken } from '../src/lib/auth/session';
import { getDb } from '../src/lib/db/client';
import { checkThrottle, recordHit, resetThrottle } from '../src/lib/auth/throttle';
import crypto from 'node:crypto';

test('passwords are hashed with scrypt and verified', async () => {
  const h = await hashPassword('Correct-Horse-9');
  assert.ok(h.startsWith('scrypt$'));
  assert.equal((await verifyPassword('Correct-Horse-9', h)).ok, true);
  assert.equal((await verifyPassword('wrong', h)).ok, false);
});

test('legacy PBKDF2 hashes still verify and are flagged for upgrade', async () => {
  const salt = 'abcdef';
  const legacy = `${salt}:${crypto.pbkdf2Sync('old-pass-1', salt, 1000, 64, 'sha512').toString('hex')}`;
  const r = await verifyPassword('old-pass-1', legacy);
  assert.deepEqual(r, { ok: true, needsRehash: true });
});

test('password policy rejects short, common and single-class passwords', () => {
  assert.equal(checkPasswordPolicy('short1'), 'TOO_SHORT');
  assert.equal(checkPasswordPolicy('password123'), 'TOO_COMMON');
  assert.equal(checkPasswordPolicy('onlyletters'), 'NEEDS_VARIETY');
  assert.equal(checkPasswordPolicy('Maths-Lab-2026'), null);
});

test('safeNextPath only allows same-site language paths', () => {
  assert.equal(safeNextPath('/en/lessons', 'en'), '/en/lessons');
  for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', '/api/admin', '/en/login', undefined]) {
    assert.equal(safeNextPath(bad as string | undefined, 'en'), '/en/dashboard', String(bad));
  }
});

test('self-service signup cannot choose admin, contributor or reviewer', () => {
  for (const role of ['admin', 'contributor', 'reviewer']) {
    assert.equal(registerSchema.safeParse({ name: 'Ann', email: 'a@b.co', password: 'Good-Pass-12', role }).success, false, role);
  }
  assert.equal(registerSchema.safeParse({ name: 'Ann', email: 'a@b.co', password: 'Good-Pass-12', role: 'teacher' }).success, true);
});

test('sessions store only a hash of the token', async () => {
  const user = await createUser({ email: 'hash-test@example.com', name: 'Hash Test', password: 'Good-Pass-12', role: 'student' });
  const s = await createSession(user.id);
  const db = await getDb();
  const stored = await db.collection('sessions').findOne({ id: s.id });
  assert.equal(stored.tokenHash, hashToken(s.token));
  assert.equal(JSON.stringify(stored).includes(s.token), false);
  assert.equal((await validateSession(s.token)).valid, true);
});

test('wrong password returns null; emails are case-insensitive', async () => {
  await createUser({ email: 'Case@Example.com', name: 'Case', password: 'Good-Pass-12', role: 'student' });
  assert.equal(await authenticateUser('case@example.com', 'nope-nope-1'), null);
  assert.ok(await authenticateUser('CASE@example.com', 'Good-Pass-12'));
});

test('throttle locks a key after max hits and can be reset', async () => {
  const key = 'test:throttle:' + Date.now();
  for (let i = 0; i < 3; i++) await recordHit(key, 3, 60_000);
  assert.equal((await checkThrottle(key)).limited, true);
  await resetThrottle(key);
  assert.equal((await checkThrottle(key)).limited, false);
});
