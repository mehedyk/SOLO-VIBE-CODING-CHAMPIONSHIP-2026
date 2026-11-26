import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';
import { registerSchema, safeNextPath } from '@/lib/auth/validation';
import { checkPasswordPolicy } from '@/lib/auth/password';
import { checkThrottle, clientIp, isSameOrigin, recordHit } from '@/lib/auth/throttle';
import { logAuditEvent } from '@/lib/auth/audit';
import { toPublicUser } from '@/lib/auth/current';
import { apiError } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req.headers)) return apiError(403, 'CROSS_SITE_REQUEST_BLOCKED');

    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const field = String(parsed.error.issues[0]?.path[0] ?? 'form');
      return apiError(400, 'INVALID_INPUT', { field });
    }
    const { name, email, password, role } = parsed.data;

    const issue = checkPasswordPolicy(password, email);
    if (issue) return apiError(400, 'WEAK_PASSWORD', { field: 'password', issue });

    const ip = clientIp(req.headers);
    const ipKey = `register:ip:${ip}`;
    const state = await checkThrottle(ipKey);
    if (state.limited) {
      const res = apiError(429, 'TOO_MANY_ATTEMPTS', { retryAfterSec: state.retryAfterSec });
      res.headers.set('Retry-After', String(state.retryAfterSec));
      return res;
    }
    await recordHit(ipKey, 10, 60 * 60 * 1000);

    // Role comes from a strict allow-list (student | teacher). Contributor and reviewer need an application
    // reviewed by an admin; admin is never self-assigned. The old code let anyone sign up as `contributor`.
    const user = await createUser({ name, email, password, role });
    await logAuditEvent({ action: 'USER_REGISTERED', actorId: user.id, targetResource: 'user', targetId: user.id, allowed: true, metadata: { role }, ip });

    const session = await createSession(user.id, { userAgent: req.headers.get('user-agent') || undefined, ip });
    const lang = req.headers.get('x-lang') === 'en' ? 'en' : 'bn';
    const res = NextResponse.json(
      { success: true, user: toPublicUser(user), redirectTo: safeNextPath(null, lang), expiresAt: session.expiresAt, token: session.token },
      { status: 201 }
    );
    setSessionCookie(res, session.token);
    return res;
  } catch (err: any) {
    if (err?.message === 'USER_ALREADY_EXISTS') return apiError(409, 'USER_ALREADY_EXISTS', { field: 'email' });
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
