import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest, currentUserFromRequest } from '@/lib/auth/guard';
import { createLesson } from '@/lib/lessons/authoring';
import { getDb } from '@/lib/db/client';
import { apiError } from '@/lib/http';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUserFromRequest(req);
    if (!user) return apiError(401, 'UNAUTHENTICATED');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    // Visibility: everyone signed in sees published lessons; authors also see their own drafts;
    // reviewers and admins see everything. (The old endpoint returned every draft to anyone.)
    const privileged = user.role === 'admin' || user.role === 'reviewer';
    const query: any = {};
    if (status) query.status = status;
    if (authorId) query.authorId = authorId;
    if (!privileged) query.$or = [{ status: 'published' }, { authorId: user.id }];

    const db = await getDb();
    const cursor = await db.collection('lessons').find(query);
    const lessons = await cursor.toArray();
    return NextResponse.json({ lessons });
  } catch (err: any) {
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, 'lesson:create');
    if (!auth.allowed || !auth.user) {
      return NextResponse.json({ error: auth.error || 'UNAUTHORIZED' }, { status: auth.status || 401 });
    }

    const payload = await req.json();
    const result = await createLesson(auth.user, payload);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: any) {
    if (err.message.startsWith('VALIDATION_FAILED')) {
      return NextResponse.json({ error: 'VALIDATION_FAILED', message: err.message }, { status: 400 });
    }
    if (err.message === 'SLUG_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'SLUG_EXISTS', message: 'Lesson with this slug already exists' }, { status: 409 });
    }
    return apiError(500, 'SERVER_ERROR', undefined, err);
  }
}
