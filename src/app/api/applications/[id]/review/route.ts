import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { reviewApplication } from '@/lib/applications/service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authorizeRequest(req, 'application:review');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { decision, notes } = await req.json();
    if (!decision || (decision !== 'approved' && decision !== 'rejected')) {
      return NextResponse.json({ error: 'INVALID_DECISION', message: 'Decision must be approved or rejected' }, { status: 400 });
    }

    const application = await reviewApplication(auth.user, id, decision, notes || '');
    return NextResponse.json({ success: true, application });
  } catch (err: any) {
    if (err.message === 'APPLICATION_NOT_FOUND') {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }
    if (err.message === 'APPLICATION_ALREADY_DECIDED') {
      return NextResponse.json({ error: 'ALREADY_DECIDED' }, { status: 409 });
    }
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
