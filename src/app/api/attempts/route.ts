import { NextRequest, NextResponse } from 'next/server';
import { saveAttempt, getAttemptsByUser } from '@/lib/db/attempts';
import { authorizeRequest } from '@/lib/auth/guard';
import { findLesson } from '@/lib/lessons/registry';
import { apiError } from '@/lib/http';

const clamp = (n: unknown, min: number, max: number, fallback: number) =>
  typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:read');
    if (!auth.user) return apiError(401, 'UNAUTHENTICATED');

    const body = await req.json().catch(() => null);
    if (!body || typeof body.lessonSlug !== 'string' || !findLesson(body.lessonSlug) || typeof body.completedSteps !== 'number') {
      return apiError(400, 'INVALID_ATTEMPT_PAYLOAD');
    }

    // The owner is always the signed-in user. The old endpoint trusted `userId` from the body,
    // which let anyone write attempts into someone else's history.
    const totalSteps = clamp(body.totalSteps, 1, 200, 1);
    const saved = await saveAttempt({
      userId: auth.user.id,
      lessonSlug: body.lessonSlug,
      inputs: typeof body.inputs === 'object' && body.inputs ? body.inputs : {},
      completedSteps: clamp(body.completedSteps, 0, totalSteps, 0),
      totalSteps,
      score: clamp(body.score, 0, 100, 0),
      predictions: Array.isArray(body.predictions) ? body.predictions.slice(0, 20) : [],
    });

    return NextResponse.json({ success: true, attempt: saved }, { status: 201 });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:read');
    if (!auth.user) return apiError(401, 'UNAUTHENTICATED');

    // Always the caller's own attempts; a `userId` query parameter is ignored (it used to expose anyone's history).
    const attempts = await getAttemptsByUser({ userId: auth.user.id });
    return NextResponse.json({ attempts });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
