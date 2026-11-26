import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/session';
import { clearSessionCookie } from '@/lib/auth/cookies';
import { readToken } from '@/lib/auth/guard';
import { isSameOrigin } from '@/lib/auth/throttle';
import { apiError } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req.headers)) return apiError(403, 'CROSS_SITE_REQUEST_BLOCKED');
    const { token } = readToken(req);
    if (token) await revokeSession(token);
    const res = NextResponse.json({ success: true });
    clearSessionCookie(res);
    return res;
  } catch (err) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
