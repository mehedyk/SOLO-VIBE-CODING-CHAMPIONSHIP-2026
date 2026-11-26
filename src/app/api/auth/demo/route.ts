import { NextRequest, NextResponse } from 'next/server';
import { demoAccountsEnabled, getOrCreateDemoUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';
import { clientIp, isSameOrigin } from '@/lib/auth/throttle';
import { safeNextPath } from '@/lib/auth/validation';
import { toPublicUser } from '@/lib/auth/current';
import { apiError } from '@/lib/http';

/** One-click demo sign-in for judges. Returns 404 unless ENABLE_DEMO_ACCOUNTS=true. */
export async function POST(req: NextRequest) {
  try {
    if (!demoAccountsEnabled()) return apiError(404, 'NOT_FOUND');
    if (!isSameOrigin(req.headers)) return apiError(403, 'CROSS_SITE_REQUEST_BLOCKED');

    const body = await req.json().catch(() => ({}));
    const user = await getOrCreateDemoUser(String(body?.role ?? ''));
    if (!user) return apiError(400, 'INVALID_INPUT');

    const session = await createSession(user.id, { userAgent: req.headers.get('user-agent') || undefined, ip: clientIp(req.headers) });
    const lang = body?.lang === 'en' ? 'en' : 'bn';
    const res = NextResponse.json({ success: true, user: toPublicUser(user), redirectTo: safeNextPath(body?.next, lang) });
    setSessionCookie(res, session.token);
    return res;
  } catch (err) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
