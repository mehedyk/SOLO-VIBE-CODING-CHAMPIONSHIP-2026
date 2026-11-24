import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { submitApplication, listApplications } from '@/lib/applications/service';

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'application:submit');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 401 });
    }

    const { teachingExperience, sampleLessonPlan } = await req.json();
    if (!teachingExperience || !sampleLessonPlan) {
      return NextResponse.json({ error: 'MISSING_FIELDS', message: 'Experience and sample plan are required' }, { status: 400 });
    }

    const app = await submitApplication(auth.user, { teachingExperience, sampleLessonPlan });
    return NextResponse.json({ success: true, application: app }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'PENDING_APPLICATION_EXISTS') {
      return NextResponse.json({ error: 'PENDING_APPLICATION_EXISTS', message: 'You already have an application under review' }, { status: 409 });
    }
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'application:review');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;

    const applications = await listApplications(status || undefined);
    return NextResponse.json({ applications });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
