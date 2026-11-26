import { NextRequest, NextResponse } from 'next/server';
import { demoAccountsEnabled, getOrCreateDemoUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';
import { checkThrottle, clientIp, isSameOrigin, recordHit } from '@/lib/auth/throttle';
import { demoLoginSchema, safeNextPath } from '@/lib/auth/validation';
import { logAuditEvent } from '@/lib/auth/audit';
import { toPublicUser } from '@/lib/auth/current';
import { apiError } from '@/lib/http';

const WINDOW = 15 * 60 * 1000;
const MAX_PER_IP = 30;

/** One-click demo sign-in for judges. Returns 404 unless ENABLE_DEMO_ACCOUNTS=true. */
export async function POST(req: NextRequest) {
  try {
    if (!demoAccountsEnabled()) return apiError(404, 'NOT_FOUND');
    if (!isSameOrigin(req.headers)) return apiError(403, 'CROSS_SITE_REQUEST_BLOCKED');

    const parsed = demoLoginSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return apiError(400, 'INVALID_INPUT');
    const { role, lang: reqLang, next } = parsed.data;

    const ip = clientIp(req.headers);
    const ipKey = `demo:ip:${ip}`;
    const state = await checkThrottle(ipKey);
    if (state.limited) {
      const res = apiError(429, 'TOO_MANY_ATTEMPTS', { retryAfterSec: state.retryAfterSec });
      res.headers.set('Retry-After', String(state.retryAfterSec));
      return res;
    }
    await recordHit(ipKey, MAX_PER_IP, WINDOW);

    const user = await getOrCreateDemoUser(role);
    if (!user) return apiError(400, 'INVALID_INPUT');

    if (user.status === 'suspended') {
      await logAuditEvent({
        action: 'LOGIN_BLOCKED_SUSPENDED',
        actorId: user.id,
        targetResource: 'user',
        targetId: user.id,
        allowed: false,
        reason: 'USER_SUSPENDED',
        ip,
      });
      return apiError(403, 'USER_SUSPENDED');
    }

    const session = await createSession(user.id, { userAgent: req.headers.get('user-agent') || undefined, ip });
    await logAuditEvent({
      action: 'DEMO_LOGIN',
      actorId: user.id,
      targetResource: 'user',
      targetId: user.id,
      allowed: true,
      metadata: { role: user.role },
      ip,
    });

    const lang = reqLang === 'en' ? 'en' : 'bn';
    const res = NextResponse.json({
      success: true,
      user: toPublicUser(user),
      redirectTo: safeNextPath(next, lang),
    });
    res.headers.set('Cache-Control', 'no-store');
    setSessionCookie(res, session.token);
    return res;
  } catch (err) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
