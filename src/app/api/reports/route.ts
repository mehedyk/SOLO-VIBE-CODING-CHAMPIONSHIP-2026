import { NextRequest, NextResponse } from 'next/server';
import { reportLesson, listReports } from '@/lib/moderation/service';
import { authorizeRequest } from '@/lib/auth/guard';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, reason, details } = body;
    if (!lessonId || !reason) {
      return NextResponse.json({ error: 'MISSING_FIELDS', message: 'lessonId and reason are required' }, { status: 400 });
    }

    const auth = await authorizeRequest(req, 'lesson:read');
    const reporter = auth.user || { id: 'guest_reporter' };

    const report = await reportLesson(reporter, lessonId, reason, details);
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
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
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
