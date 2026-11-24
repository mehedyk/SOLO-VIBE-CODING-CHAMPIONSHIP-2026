import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const result = await validateSession(token);
    if (!result.valid || !result.user) {
      return NextResponse.json({ authenticated: false, reason: result.reason }, { status: 401 });
    }

    const { id, email, name, role, status, createdAt } = result.user;
    return NextResponse.json({
      authenticated: true,
      user: { id, email, name, role, status, createdAt },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
