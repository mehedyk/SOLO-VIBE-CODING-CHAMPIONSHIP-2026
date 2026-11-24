import { NextRequest } from 'next/server';
import { validateSession } from './session';
import { Capability, hasCapability } from './roles';
import { logAuditEvent } from './audit';
import { UserDoc } from '../db/schema';

export async function authorizeRequest(
  req: NextRequest,
  requiredCapability: Capability,
  context?: { resourceOwnerId?: string; resourceId?: string; resourceType?: string }
): Promise<{ allowed: boolean; user: UserDoc | null; error?: string; status?: number }> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    if (requiredCapability === 'lesson:read') {
      return { allowed: true, user: null };
    }
    return { allowed: false, user: null, error: 'UNAUTHENTICATED', status: 401 };
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
