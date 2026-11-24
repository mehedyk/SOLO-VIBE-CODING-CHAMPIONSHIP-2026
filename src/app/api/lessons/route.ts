import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/auth/guard';
import { createLesson } from '@/lib/lessons/authoring';
import { getDb } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    const db = await getDb();
    const query: any = {};
    if (status) query.status = status;
    if (authorId) query.authorId = authorId;

    const cursor = await db.collection('lessons').find(query);
    const lessons = await cursor.toArray();
    return NextResponse.json({ lessons });
  } catch (err: any) {
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
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
    return NextResponse.json({ error: 'SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
