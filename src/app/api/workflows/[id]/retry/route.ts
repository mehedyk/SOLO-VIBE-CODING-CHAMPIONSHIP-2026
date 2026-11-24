import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { retryPublicationWorkflow } from '@/lib/workflow/publisher';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authorizeRequest(req, 'lesson:publish');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const body = await req.json().catch(() => ({}));
    const workflow = await retryPublicationWorkflow(auth.user, id, {
      simulateFailureAtStep: body.simulateFailureAtStep,
    });
    return NextResponse.json({ success: true, workflow });
  } catch (err: any) {
    if (err.message === 'MAX_RETRIES_EXCEEDED') {
      return NextResponse.json({ error: 'MAX_RETRIES_EXCEEDED', message: 'Maximum retry attempts reached' }, { status: 400 });
    }
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
