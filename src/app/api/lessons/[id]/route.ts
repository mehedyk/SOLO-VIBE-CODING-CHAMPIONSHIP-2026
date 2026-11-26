import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest, currentUserFromRequest } from '@/lib/auth/guard';
import { updateLesson, getLessonVersions } from '@/lib/lessons/authoring';
import { getDb } from '@/lib/db/client';
import { apiError } from '@/lib/http';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUserFromRequest(req);
    if (!user) return apiError(401, 'UNAUTHENTICATED');

    const { id } = await params;
    const db = await getDb();
    const lesson = await db.collection('lessons').findOne({ id });
    const privileged = user.role === 'admin' || user.role === 'reviewer';
    // Unpublished lessons exist only for their author and reviewers; everyone else gets a plain 404.
    if (!lesson || (lesson.status !== 'published' && lesson.authorId !== user.id && !privileged)) {
      return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    }

    const versions = await getLessonVersions(id);
    return NextResponse.json({ lesson, versions });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}

export async function PUT(
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

    const payload = await req.json();
    const result = await updateLesson(auth.user, id, payload);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
