import crypto from 'node:crypto';
import { getDb } from '../db/client';
import { SessionDoc, UserDoc } from '../db/schema';

const SESSION_DURATION_HOURS = 24;

export async function createSession(userId: string): Promise<SessionDoc> {
  const db = await getDb();
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  const doc: SessionDoc = {
    id: 'ses_' + Math.random().toString(36).substring(2, 11),
    userId,
    token,
    expiresAt: expires.toISOString(),
    revoked: false,
    createdAt: now.toISOString(),
  };

  await db.collection('sessions').insertOne(doc);
  return doc;
}

export async function validateSession(token: string): Promise<{ valid: boolean; user: UserDoc | null; reason?: string }> {
  if (!token) return { valid: false, user: null, reason: 'NO_TOKEN' };

  const db = await getDb();
  const session: SessionDoc | null = await db.collection('sessions').findOne({ token });

  if (!session) {
    return { valid: false, user: null, reason: 'SESSION_NOT_FOUND' };
  }

  if (session.revoked) {
    return { valid: false, user: null, reason: 'SESSION_REVOKED' };
  }

  if (new Date(session.expiresAt) < new Date()) {
    return { valid: false, user: null, reason: 'SESSION_EXPIRED' };
  }

  const user: UserDoc | null = await db.collection('users').findOne({ id: session.userId });
  if (!user) {
    return { valid: false, user: null, reason: 'USER_NOT_FOUND' };
  }

  if (user.status === 'suspended') {
    return { valid: false, user, reason: 'USER_SUSPENDED' };
  }

  return { valid: true, user };
}

export async function revokeSession(token: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection('sessions').updateOne({ token }, { $set: { revoked: true } });
  return res.modifiedCount > 0;
}

export async function revokeAllUserSessions(userId: string): Promise<number> {
  const db = await getDb();
  const cursor = await db.collection('sessions').find({ userId, revoked: false });
  const activeSessions: SessionDoc[] = await cursor.toArray();
  let count = 0;
  for (const s of activeSessions) {
    await db.collection('sessions').updateOne({ id: s.id }, { $set: { revoked: true } });
    count++;
  }
  return count;
}
