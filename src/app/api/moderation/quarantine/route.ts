import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { quarantineLesson } from '@/lib/moderation/service';
import { apiError } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:quarantine');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { lessonId, reportId, reason } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'MISSING_LESSON_ID' }, { status: 400 });
    }

    const lesson = await quarantineLesson(auth.user, lessonId, reportId, reason);
    return NextResponse.json({ success: true, lesson });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
