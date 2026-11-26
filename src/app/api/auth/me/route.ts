import { NextRequest, NextResponse } from 'next/server';
import { currentUserFromRequest } from '@/lib/auth/guard';
import { toPublicUser } from '@/lib/auth/current';
import { apiError } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserFromRequest(req);
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, user: toPublicUser(user) });
  } catch (err) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
