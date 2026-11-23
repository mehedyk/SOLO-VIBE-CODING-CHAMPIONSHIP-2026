import { NextRequest, NextResponse } from 'next/server';
import { saveAttempt, getAttemptsByUser } from '@/lib/db/attempts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.lessonSlug || typeof body.completedSteps !== 'number') {
      return NextResponse.json({ error: 'INVALID_ATTEMPT_PAYLOAD', message: 'Missing required attempt fields' }, { status: 400 });
    }

    const saved = await saveAttempt({
      userId: body.userId,
      guestId: body.guestId || 'guest_default',
      lessonSlug: body.lessonSlug,
      inputs: body.inputs || {},
      completedSteps: body.completedSteps,
      totalSteps: body.totalSteps || 1,
      score: body.score || 0,
      predictions: body.predictions || [],
    });

    return NextResponse.json({ success: true, attempt: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const guestId = searchParams.get('guestId') || undefined;

    if (!userId && !guestId) {
      return NextResponse.json({ error: 'MISSING_IDENTIFIER', message: 'Provide userId or guestId' }, { status: 400 });
    }

    const attempts = await getAttemptsByUser({ userId, guestId });
    return NextResponse.json({ attempts });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
