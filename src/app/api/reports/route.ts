import { NextRequest, NextResponse } from 'next/server';
import { reportLesson, listReports } from '@/lib/moderation/service';
import { authorizeRequest } from '@/lib/auth/guard';
import { apiError } from '@/lib/http';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:read');
    if (!auth.user) return apiError(401, 'UNAUTHENTICATED');

    const body = await req.json().catch(() => ({}));
    const lessonId = typeof body?.lessonId === 'string' ? body.lessonId.slice(0, 100) : '';
    const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 200) : '';
    const details = typeof body?.details === 'string' ? body.details.slice(0, 2000) : undefined;
    if (!lessonId || !reason) {
      return apiError(400, 'MISSING_FIELDS');
    }

    const report = await reportLesson(auth.user, lessonId, reason, details);
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:quarantine');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;

    const reports = await listReports(status || undefined);
    return NextResponse.json({ reports });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
