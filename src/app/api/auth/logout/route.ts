import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
      await revokeSession(token);
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
