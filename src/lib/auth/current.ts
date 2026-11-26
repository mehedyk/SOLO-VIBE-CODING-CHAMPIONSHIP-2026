import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { SESSION_COOKIE } from './cookies';
import { validateSession } from './session';
import type { PublicUser, UserDoc } from '../db/schema';

export function toPublicUser(u: UserDoc): PublicUser {
  return { id: u.id, email: u.email, name: u.name, role: u.role, status: u.status, createdAt: u.createdAt };
}

/** The signed-in user for the current request (server components only), or null. */
export const getCurrentUser = cache(async (): Promise<UserDoc | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = await validateSession(token);
  return result.valid ? result.user : null;
});

/** Same, but never throws (public pages must still render if the database is down or not configured yet). */
export const getCurrentUserSafe = cache(async (): Promise<UserDoc | null> => {
  try { return await getCurrentUser(); } catch { return null; }
});

/**
 * Gate for private pages. The middleware only checks that a cookie exists; this is the real check
 * (valid, unexpired, not revoked, user not suspended).
 */
export async function requireUser(lang: string, fallbackPath: string): Promise<UserDoc> {
  const user = await getCurrentUser();
  const nextPath = (await headers()).get('x-pathname') || fallbackPath;
  if (!user) {
    redirect(`/api/auth/expired?lang=${lang}&next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
