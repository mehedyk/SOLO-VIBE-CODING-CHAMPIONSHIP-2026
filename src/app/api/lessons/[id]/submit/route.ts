import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { submitLessonForReview } from '@/lib/lessons/authoring';
import { getDb } from '@/lib/db/client';
import { apiError } from '@/lib/http';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const lesson = await db.collection('lessons').findOne({ id });
    if (!lesson) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    const auth = await authorizeRequest(req, 'lesson:edit_own', {
      resourceOwnerId: lesson.authorId,
      resourceId: id,
      resourceType: 'lesson',
    });

    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 403 });
    }

    const updated = await submitLessonForReview(auth.user, id);
    return NextResponse.json({ success: true, lesson: updated });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
