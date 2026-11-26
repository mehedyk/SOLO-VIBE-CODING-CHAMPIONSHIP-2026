import { getDb } from '../db/client';
import { UserDoc, UserRole, UserStatus } from '../db/schema';
import { revokeAllUserSessions } from './session';
import { burnPasswordCheck, hashPassword, verifyPassword } from './password';
import { logAuditEvent } from './audit';
import { newId } from '../util/id';

export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  role?: UserRole;
}): Promise<UserDoc> {
  const db = await getDb();
  const email = data.email.trim().toLowerCase();
  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const now = new Date().toISOString();
  const doc: UserDoc = {
    id: newId('usr'),
    email,
    name: data.name.trim(),
    role: data.role || 'guest',
    status: 'active',
    passwordHash: data.password ? await hashPassword(data.password) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.collection('users').insertOne(doc);
  } catch (err: any) {
    // Unique index on users.email: two sign-ups racing for the same address.
    if (err?.code === 11000) throw new Error('USER_ALREADY_EXISTS');
    throw err;
  }
  return doc;
}

/** Returns the user when the email/password pair is valid, otherwise null. Never reveals which part was wrong. */
export async function authenticateUser(email: string, password: string): Promise<UserDoc | null> {
  const db = await getDb();
  const user: UserDoc | null = await db.collection('users').findOne({ email: email.trim().toLowerCase() });

  if (!user || !user.passwordHash) {
    await burnPasswordCheck(password); // same cost as a real check, so timing does not reveal valid emails
    return null;
  }

  const { ok, needsRehash } = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;

  const patch: Partial<UserDoc> = { lastLoginAt: new Date().toISOString() };
  if (needsRehash) patch.passwordHash = await hashPassword(password);
  await db.collection('users').updateOne({ id: user.id }, { $set: patch });

  return { ...user, ...patch };
}

// ── Optional demo accounts ──────────────────────────────────────────────────────────────────
// Off by default. When ENABLE_DEMO_ACCOUNTS=true the login page shows one-click role buttons for judges.
// These accounts have no password at all, so there is no credential anyone can guess or look up.
export const DEMO_ROLES: Record<string, { name: string; role: UserRole }> = {
  student: { name: 'Demo Student', role: 'student' },
  teacher: { name: 'Demo Teacher', role: 'teacher' },
  contributor: { name: 'Demo Author', role: 'contributor' },
  admin: { name: 'Demo Admin', role: 'admin' },
};

export function demoAccountsEnabled(): boolean {
  return process.env.ENABLE_DEMO_ACCOUNTS === 'true';
}

export async function getOrCreateDemoUser(roleKey: string): Promise<UserDoc | null> {
  const info = DEMO_ROLES[roleKey];
  if (!info) return null;
  const db = await getDb();
  const email = `demo-${roleKey}@demo.invalid`;
  const existing: UserDoc | null = await db.collection('users').findOne({ email });
  if (existing) return existing.status === 'suspended' ? null : existing;
  return createUser({ email, name: info.name, role: info.role }); // no password => cannot be used to sign in normally
}

export async function suspendUser(adminId: string, targetUserId: string, reason: string): Promise<UserDoc> {
  const db = await getDb();
  const user: UserDoc | null = await db.collection('users').findOne({ id: targetUserId });
  if (!user) throw new Error('TARGET_USER_NOT_FOUND');

  const now = new Date().toISOString();
  await db.collection('users').updateOne(
    { id: targetUserId },
    { $set: { status: 'suspended' as UserStatus, updatedAt: now } }
  );

  // Revoke all active sessions of the suspended user immediately
  await revokeAllUserSessions(targetUserId);

  await logAuditEvent({
    action: 'USER_SUSPENDED',
    actorId: adminId,
    targetResource: 'user',
    targetId: targetUserId,
    allowed: true,
    reason,
  });

  return { ...user, status: 'suspended', updatedAt: now };
}

export async function reactivateUser(adminId: string, targetUserId: string): Promise<UserDoc> {
  const db = await getDb();
  const user: UserDoc | null = await db.collection('users').findOne({ id: targetUserId });
  if (!user) throw new Error('TARGET_USER_NOT_FOUND');

  const now = new Date().toISOString();
  await db.collection('users').updateOne(
    { id: targetUserId },
    { $set: { status: 'active' as UserStatus, updatedAt: now } }
  );

  await logAuditEvent({
    action: 'USER_REACTIVATED',
    actorId: adminId,
    targetResource: 'user',
    targetId: targetUserId,
    allowed: true,
  });

  return { ...user, status: 'active', updatedAt: now };
}
