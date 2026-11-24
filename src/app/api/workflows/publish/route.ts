import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { startPublicationWorkflow } from '@/lib/workflow/publisher';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:publish');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { lessonId, simulateFailureAtStep } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'MISSING_LESSON_ID' }, { status: 400 });
    }

    const workflow = await startPublicationWorkflow(auth.user, lessonId, { simulateFailureAtStep });
    return NextResponse.json({ success: true, workflow }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
