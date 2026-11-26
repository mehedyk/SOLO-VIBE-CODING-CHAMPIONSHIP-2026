import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';
import { loginSchema, safeNextPath } from '@/lib/auth/validation';
import { checkThrottle, clientIp, isSameOrigin, recordHit, resetThrottle } from '@/lib/auth/throttle';
import { logAuditEvent } from '@/lib/auth/audit';
import { toPublicUser } from '@/lib/auth/current';
import { apiError } from '@/lib/http';

const WINDOW = 15 * 60 * 1000;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 30;

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req.headers)) return apiError(403, 'CROSS_SITE_REQUEST_BLOCKED');

    const parsed = loginSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return apiError(400, 'INVALID_INPUT');
    const { email, password, next } = parsed.data;

    const ip = clientIp(req.headers);
    const emailKey = `login:email:${email}`;
    const ipKey = `login:ip:${ip}`;

    for (const key of [emailKey, ipKey]) {
      const state = await checkThrottle(key);
      if (state.limited) {
        const res = apiError(429, 'TOO_MANY_ATTEMPTS', { retryAfterSec: state.retryAfterSec });
        res.headers.set('Retry-After', String(state.retryAfterSec));
        return res;
      }
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      await recordHit(emailKey, MAX_PER_EMAIL, WINDOW);
      await recordHit(ipKey, MAX_PER_IP, WINDOW);
      return apiError(401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      await logAuditEvent({ action: 'LOGIN_BLOCKED_SUSPENDED', actorId: user.id, targetResource: 'user', targetId: user.id, allowed: false, reason: 'USER_SUSPENDED', ip });
      return apiError(403, 'USER_SUSPENDED');
    }

    await resetThrottle(emailKey);
    const session = await createSession(user.id, { userAgent: req.headers.get('user-agent') || undefined, ip });
    const lang = req.headers.get('x-lang') === 'en' ? 'en' : 'bn';

    const res = NextResponse.json({
      success: true,
      user: toPublicUser(user),
      redirectTo: safeNextPath(next, lang),
      expiresAt: session.expiresAt,
      // `token` stays in the body only so scripts/tests can use `Authorization: Bearer`; browsers rely on the HttpOnly cookie.
      token: session.token,
    });
    setSessionCookie(res, session.token);
    return res;
  } catch (err) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
