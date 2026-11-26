import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { reviewLesson } from '@/lib/lessons/authoring';
import { apiError } from '@/lib/http';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authorizeRequest(req, 'lesson:review', {
      resourceId: id,
      resourceType: 'lesson',
    });

    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { decision, comments } = await req.json();
    if (!decision || (decision !== 'approved' && decision !== 'changes_requested')) {
      return NextResponse.json({ error: 'INVALID_DECISION', message: 'Decision must be approved or changes_requested' }, { status: 400 });
    }

    const result = await reviewLesson(auth.user, id, decision, comments || '');
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message === 'AUTHOR_CANNOT_REVIEW_OWN_LESSON') {
      return NextResponse.json({ error: 'CONFLICT_OF_INTEREST', message: 'Authors cannot review their own lessons' }, { status: 403 });
    }
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
