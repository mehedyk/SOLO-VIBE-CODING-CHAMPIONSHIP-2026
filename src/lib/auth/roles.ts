import { UserDoc, UserRole } from '../db/schema';

export type Capability =
  | 'lesson:read'
  | 'lesson:create'
  | 'lesson:edit_own'
  | 'lesson:edit_any'
  | 'lesson:review'
  | 'lesson:publish'
  | 'lesson:quarantine'
  | 'user:suspend'
  | 'audit:view'
  | 'application:submit'
  | 'application:review';

const ROLE_PERMISSIONS: Record<UserRole, Capability[]> = {
  guest: ['lesson:read', 'application:submit'],
  student: ['lesson:read', 'application:submit'],
  // Teachers use lessons in class (present / print / download). Reviewing content is a reviewer/admin power.
  teacher: ['lesson:read', 'application:submit'],
  contributor: ['lesson:read', 'lesson:create', 'lesson:edit_own', 'application:submit'],
  reviewer: ['lesson:read', 'lesson:review', 'lesson:quarantine'],
  admin: [
    'lesson:read',
    'lesson:create',
    'lesson:edit_own',
    'lesson:edit_any',
    'lesson:review',
    'lesson:publish',
    'lesson:quarantine',
    'user:suspend',
    'audit:view',
    'application:submit',
    'application:review',
  ],
};

export function hasCapability(
  user: UserDoc | null,
  capability: Capability,
  context?: { resourceOwnerId?: string }
): { allowed: boolean; reason?: string } {
  if (!user) {
    if (capability === 'lesson:read') return { allowed: true };
    return { allowed: false, reason: 'UNAUTHENTICATED' };
  }

  if (user.status === 'suspended') {
    return { allowed: false, reason: 'USER_SUSPENDED' };
  }

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  if (capability === 'lesson:edit_own') {
    if (user.role === 'admin') return { allowed: true };
    if (permissions.includes('lesson:edit_own')) {
      if (context?.resourceOwnerId && context.resourceOwnerId !== user.id) {
        return { allowed: false, reason: 'RESOURCE_OWNERSHIP_MISMATCH' };
      }
      return { allowed: true };
    }
    return { allowed: false, reason: 'INSUFFICIENT_ROLE_PERMISSIONS' };
  }

  if (permissions.includes(capability)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'INSUFFICIENT_ROLE_PERMISSIONS' };
}
