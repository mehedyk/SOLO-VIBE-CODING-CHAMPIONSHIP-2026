import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST as demoLoginPost } from '../src/app/api/auth/demo/route';
import { checkPasswordPolicy, hashPassword, verifyPassword } from '../src/lib/auth/password';
import { safeNextPath, registerSchema, demoLoginSchema } from '../src/lib/auth/validation';
import { createUser, authenticateUser, demoAccountsEnabled, getOrCreateDemoUser } from '../src/lib/auth/service';
import { DEMO_ROLE_KEYS } from '../src/lib/auth/roles';
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

test('demoLoginSchema allows all demo roles and rejects unknown or prototype keys', () => {
  for (const role of DEMO_ROLE_KEYS) {
    assert.equal(demoLoginSchema.safeParse({ role, lang: 'bn' }).success, true, role);
  }
  for (const bad of ['guest', 'superadmin', 'toString', 'constructor', '__proto__', '']) {
    assert.equal(demoLoginSchema.safeParse({ role: bad }).success, false, bad);
  }
});

test('demo accounts are disabled by default and create passwordless users per role when enabled', async () => {
  const prev = process.env.ENABLE_DEMO_ACCOUNTS;
  try {
    delete process.env.ENABLE_DEMO_ACCOUNTS;
    assert.equal(demoAccountsEnabled(), false);
    assert.equal(await getOrCreateDemoUser('student'), null);

    process.env.ENABLE_DEMO_ACCOUNTS = 'true';
    assert.equal(demoAccountsEnabled(), true);
    assert.equal(await getOrCreateDemoUser('toString'), null);
    assert.equal(await getOrCreateDemoUser('guest'), null);

    for (const role of DEMO_ROLE_KEYS) {
      const user = await getOrCreateDemoUser(role);
      assert.ok(user, role);
      assert.equal(user.role, role);
      assert.equal(user.passwordHash, undefined);
      assert.equal(await authenticateUser(user.email, 'anything'), null);
    }

    // Never hijack an account that already has a password credential
    const db = await getDb();
    await db.collection('users').updateOne({ email: 'demo-student@demo.invalid' }, { $set: { passwordHash: 'scrypt$fake' } });
    assert.equal(await getOrCreateDemoUser('student'), null);
    await db.collection('users').updateOne({ email: 'demo-student@demo.invalid' }, { $set: { passwordHash: undefined } });
  } finally {
    if (prev === undefined) delete process.env.ENABLE_DEMO_ACCOUNTS;
    else process.env.ENABLE_DEMO_ACCOUNTS = prev;
  }
});

test('POST /api/auth/demo enforces enable flag, CSRF, audit log, suspension, and IP rate limit', async () => {
  const prev = process.env.ENABLE_DEMO_ACCOUNTS;
  const testIp = '198.51.100.42';
  const makeReq = (body: unknown, origin = 'http://localhost:3000') =>
    new NextRequest('http://localhost:3000/api/auth/demo', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        host: 'localhost:3000',
        origin,
        'x-forwarded-for': testIp,
      },
      body: JSON.stringify(body),
    });

  try {
    delete process.env.ENABLE_DEMO_ACCOUNTS;
    assert.equal((await demoLoginPost(makeReq({ role: 'student' }))).status, 404);

    process.env.ENABLE_DEMO_ACCOUNTS = 'true';
    const csrfRes = await demoLoginPost(makeReq({ role: 'student' }, 'https://evil.example'));
    assert.equal(csrfRes.status, 403);

    const badRoleRes = await demoLoginPost(makeReq({ role: 'constructor' }));
    assert.equal(badRoleRes.status, 400);

    const okRes = await demoLoginPost(makeReq({ role: 'reviewer', lang: 'en', next: '/en/dashboard/author' }));
    assert.equal(okRes.status, 200);
    assert.equal(okRes.headers.get('cache-control'), 'no-store');
    const cookie = okRes.headers.get('set-cookie') ?? '';
    assert.ok(cookie.includes('pvl_session=') && cookie.toLowerCase().includes('httponly'));
    const okBody = await okRes.json();
    assert.equal(okBody.user.role, 'reviewer');
    assert.equal(okBody.redirectTo, '/en/dashboard/author');
    assert.equal('token' in okBody, false);

    const db = await getDb();
    const auditEntry = await db.collection('audit_logs').findOne({ action: 'DEMO_LOGIN', actorId: okBody.user.id });
    assert.ok(auditEntry);
    assert.equal(auditEntry.allowed, true);

    await db.collection('users').updateOne({ id: okBody.user.id }, { $set: { status: 'suspended' } });
    const suspRes = await demoLoginPost(makeReq({ role: 'reviewer' }));
    assert.equal(suspRes.status, 403);
    await db.collection('users').updateOne({ id: okBody.user.id }, { $set: { status: 'active' } });

    await resetThrottle(`demo:ip:${testIp}`);
    for (let i = 0; i < 30; i++) {
      const r = await demoLoginPost(makeReq({ role: 'student' }));
      assert.equal(r.status, 200);
    }
    const limitedRes = await demoLoginPost(makeReq({ role: 'student' }));
    assert.equal(limitedRes.status, 429);
    assert.ok(limitedRes.headers.get('retry-after'));
  } finally {
    await resetThrottle(`demo:ip:${testIp}`);
    if (prev === undefined) delete process.env.ENABLE_DEMO_ACCOUNTS;
    else process.env.ENABLE_DEMO_ACCOUNTS = prev;
  }
});
