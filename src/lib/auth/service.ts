import crypto from 'node:crypto';
import { getDb } from '../db/client';
import { UserDoc, UserRole, UserStatus } from '../db/schema';
import { revokeAllUserSessions } from './session';
import { logAuditEvent } from './audit';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return key === hash;
}

export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  role?: UserRole;
}): Promise<UserDoc> {
  const db = await getDb();
  const existing = await db.collection('users').findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const now = new Date().toISOString();
  const doc: UserDoc = {
    id: 'usr_' + Math.random().toString(36).substring(2, 11),
    email: data.email.toLowerCase(),
    name: data.name,
    role: data.role || 'guest',
    status: 'active',
    passwordHash: data.password ? hashPassword(data.password) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('users').insertOne(doc);
  return doc;
}

export async function authenticateUser(email: string, password: string): Promise<UserDoc | null> {
  const db = await getDb();
  const user: UserDoc | null = await db.collection('users').findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) return null;

  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return user;
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
