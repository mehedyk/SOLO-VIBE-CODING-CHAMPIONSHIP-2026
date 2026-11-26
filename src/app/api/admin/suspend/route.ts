import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { suspendUser, reactivateUser } from '@/lib/auth/service';
import { apiError } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'user:suspend');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { targetUserId, action, reason } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: 'MISSING_TARGET_USER_ID' }, { status: 400 });
    }

    if (action === 'reactivate') {
      const user = await reactivateUser(auth.user.id, targetUserId);
      return NextResponse.json({ success: true, user });
    } else {
      const user = await suspendUser(auth.user.id, targetUserId, reason || 'Admin action');
      return NextResponse.json({ success: true, user });
    }
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
