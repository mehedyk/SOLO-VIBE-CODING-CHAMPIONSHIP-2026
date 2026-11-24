import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'MISSING_CREDENTIALS', message: 'Email and password required' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'USER_SUSPENDED', message: 'Your account has been suspended' }, { status: 403 });
    }

    const session = await createSession(user.id);
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
