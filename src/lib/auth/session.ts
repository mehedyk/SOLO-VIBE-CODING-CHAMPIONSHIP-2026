import crypto from 'node:crypto';
import { getDb } from '../db/client';
import { SessionDoc, UserDoc } from '../db/schema';
import { newId } from '../util/id';
import { SESSION_MAX_AGE_SECONDS } from './cookies';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Creates a server-side session. The returned `token` is shown once (set it as a cookie); only its hash is stored. */
export async function createSession(
  userId: string,
  metadata?: { userAgent?: string; ip?: string }
): Promise<SessionDoc & { token: string }> {
  const db = await getDb();
  const token = crypto.randomBytes(32).toString('base64url');
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);

  const doc: SessionDoc = {
    id: newId('ses'),
    userId,
    tokenHash: hashToken(token),
    expiresAt: expires.toISOString(),
    revoked: false,
    userAgent: metadata?.userAgent?.slice(0, 300),
    ip: metadata?.ip,
    createdAt: now.toISOString(),
  };

  await db.collection('sessions').insertOne(doc);
  return { ...doc, token };
}

export async function validateSession(token: string): Promise<{ valid: boolean; user: UserDoc | null; reason?: string }> {
  if (!token || token.length > 200) return { valid: false, user: null, reason: 'NO_TOKEN' };

  const db = await getDb();
  const session: SessionDoc | null = await db.collection('sessions').findOne({ tokenHash: hashToken(token) });

  if (!session) return { valid: false, user: null, reason: 'SESSION_NOT_FOUND' };
  if (session.revoked) return { valid: false, user: null, reason: 'SESSION_REVOKED' };
  if (new Date(session.expiresAt) < new Date()) return { valid: false, user: null, reason: 'SESSION_EXPIRED' };

  const user: UserDoc | null = await db.collection('users').findOne({ id: session.userId });
  if (!user) return { valid: false, user: null, reason: 'USER_NOT_FOUND' };
  if (user.status === 'suspended') return { valid: false, user, reason: 'USER_SUSPENDED' };

  return { valid: true, user };
}

export async function revokeSession(token: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.collection('sessions').updateOne({ tokenHash: hashToken(token) }, { $set: { revoked: true } });
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
