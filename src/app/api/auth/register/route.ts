import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/service';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'MISSING_FIELDS', message: 'Email, password, and name are required' }, { status: 400 });
    }

    // New registrations default to 'guest' or 'contributor'
    const allowedRole = role === 'contributor' ? 'contributor' : 'guest';
    const user = await createUser({
      email,
      password,
      name,
      role: allowedRole,
    });

    const session = await createSession(user.id);
    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
      token: session.token,
      expiresAt: session.expiresAt,
    }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'USER_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'USER_ALREADY_EXISTS', message: 'Email is already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
