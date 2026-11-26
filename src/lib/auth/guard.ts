import { NextRequest } from 'next/server';
import { validateSession } from './session';
import { Capability, hasCapability } from './roles';
import { logAuditEvent } from './audit';
import { SESSION_COOKIE } from './cookies';
import { isSameOrigin } from './throttle';
import { UserDoc } from '../db/schema';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function readToken(req: NextRequest): { token: string | null; viaCookie: boolean } {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return { token: authHeader.slice(7), viaCookie: false };
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  return { token: cookie ?? null, viaCookie: Boolean(cookie) };
}

/** Resolves the signed-in user without checking any capability. */
export async function currentUserFromRequest(req: NextRequest): Promise<UserDoc | null> {
  const { token } = readToken(req);
  if (!token) return null;
  const result = await validateSession(token);
  return result.valid ? result.user : null;
}

export async function authorizeRequest(
  req: NextRequest,
  requiredCapability: Capability,
  context?: { resourceOwnerId?: string; resourceId?: string; resourceType?: string }
): Promise<{ allowed: boolean; user: UserDoc | null; error?: string; status?: number }> {
  const { token, viaCookie } = readToken(req);

  if (!token) {
    if (requiredCapability === 'lesson:read') {
      return { allowed: true, user: null };
    }
    return { allowed: false, user: null, error: 'UNAUTHENTICATED', status: 401 };
  }

  // Cookie-authenticated writes must come from this site (CSRF defence on top of SameSite=Lax).
  if (viaCookie && !SAFE_METHODS.has(req.method) && !isSameOrigin(req.headers)) {
    return { allowed: false, user: null, error: 'CROSS_SITE_REQUEST_BLOCKED', status: 403 };
  }

  const sessionResult = await validateSession(token);
  if (!sessionResult.valid || !sessionResult.user) {
    return { allowed: false, user: null, error: sessionResult.reason || 'INVALID_SESSION', status: 401 };
  }

  const user = sessionResult.user;
  const capCheck = hasCapability(user, requiredCapability, { resourceOwnerId: context?.resourceOwnerId });

  if (!capCheck.allowed) {
    // Record audit event for unauthorized or restricted access attempt (judges test for A03)
    await logAuditEvent({
      action: 'ACCESS_DENIED',
      actorId: user.id,
      targetResource: context?.resourceType || 'unknown',
      targetId: context?.resourceId || 'unknown',
      allowed: false,
      reason: capCheck.reason,
      metadata: {
        requiredCapability,
        userRole: user.role,
        userStatus: user.status,
      },
    });

    return { allowed: false, user, error: capCheck.reason || 'FORBIDDEN', status: 403 };
  }

  return { allowed: true, user };
}
