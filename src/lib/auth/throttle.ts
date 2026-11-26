import { getDb } from '../db/client';

/**
 * Small persistent rate limiter backed by the database, so it still works across serverless instances.
 * `recordHit` counts an event; once `max` events happen inside `windowMs` the key is locked until the window ends.
 */
export interface ThrottleState {
  limited: boolean;
  retryAfterSec: number;
}

const OPEN: ThrottleState = { limited: false, retryAfterSec: 0 };

export async function checkThrottle(key: string): Promise<ThrottleState> {
  const db = await getDb();
  const entry = await db.collection('throttle').findOne({ key });
  if (!entry?.lockedUntil) return OPEN;
  const remaining = new Date(entry.lockedUntil).getTime() - Date.now();
  return remaining > 0 ? { limited: true, retryAfterSec: Math.ceil(remaining / 1000) } : OPEN;
}

export async function recordHit(key: string, max: number, windowMs: number): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  const entry = await db.collection('throttle').findOne({ key });
  const expiresAt = new Date(now + windowMs * 2);

  if (!entry || now - new Date(entry.windowStart).getTime() > windowMs) {
    const fresh = { key, count: 1, windowStart: new Date(now).toISOString(), lockedUntil: null as string | null, expiresAt };
    if (entry) await db.collection('throttle').updateOne({ key }, { $set: fresh });
    else await db.collection('throttle').insertOne({ id: key, ...fresh });
    return;
  }

  const count = (entry.count || 0) + 1;
  const lockedUntil = count >= max ? new Date(new Date(entry.windowStart).getTime() + windowMs).toISOString() : null;
  await db.collection('throttle').updateOne({ key }, { $set: { count, lockedUntil, expiresAt } });
}

export async function resetThrottle(key: string): Promise<void> {
  const db = await getDb();
  await db.collection('throttle').deleteOne({ key });
}

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}

/** Rejects cross-site form/XHR posts that carry the session cookie. Same-origin and non-browser clients pass. */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get('origin');
  if (!origin) return headers.get('sec-fetch-site') !== 'cross-site';
  try {
    return new URL(origin).host === headers.get('host');
  } catch {
    return false;
  }
}
