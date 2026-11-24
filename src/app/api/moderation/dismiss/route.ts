import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { dismissReport } from '@/lib/moderation/service';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:quarantine');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { reportId, note } = await req.json();
    if (!reportId) {
      return NextResponse.json({ error: 'MISSING_REPORT_ID' }, { status: 400 });
    }

    const report = await dismissReport(auth.user, reportId, note || 'Dismissed by moderator');
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
