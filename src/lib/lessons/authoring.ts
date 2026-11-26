import crypto from 'node:crypto';
import { getDb } from '../db/client';
import { LessonDoc, LessonVersionDoc, ReviewDoc, UserDoc } from '../db/schema';
import { hasCapability } from '../auth/roles';
import { logAuditEvent } from '../auth/audit';
import { newId } from '../util/id';

export function computeContentHash(data: any): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function validateLessonData(payload: {
  slug: string;
  titleBn: string;
  titleEn: string;
  topic: string;
  grade: string;
  summaryBn: string;
  summaryEn: string;
  data: any;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
    errors.push('Slug must be non-empty and contain only lowercase alphanumeric characters and hyphens.');
  }
  if (!payload.titleBn || payload.titleBn.trim().length === 0) {
    errors.push('titleBn is required and cannot be empty.');
  }
  if (!payload.titleEn || payload.titleEn.trim().length === 0) {
    errors.push('titleEn is required and cannot be empty.');
  }
  if (!payload.topic) {
    errors.push('topic is required.');
  }
  if (!payload.grade) {
    errors.push('grade is required.');
  }
  if (!payload.summaryBn || !payload.summaryEn) {
    errors.push('summaryBn and summaryEn are required in both languages.');
  }
  if (!payload.data || typeof payload.data !== 'object') {
    errors.push('data object is required.');
  }

  return { valid: errors.length === 0, errors };
}

export async function createLesson(
  author: UserDoc,
  payload: {
    slug: string;
    titleBn: string;
    titleEn: string;
    topic: string;
    grade: string;
    summaryBn: string;
    summaryEn: string;
    data: any;
  }
): Promise<{ lesson: LessonDoc; version: LessonVersionDoc }> {
  const cap = hasCapability(author, 'lesson:create');
  if (!cap.allowed) {
    throw new Error('INSUFFICIENT_PERMISSIONS');
  }

  const validation = validateLessonData(payload);
  if (!validation.valid) {
    throw new Error('VALIDATION_FAILED: ' + validation.errors.join('; '));
  }

  const db = await getDb();
  const existing = await db.collection('lessons').findOne({ slug: payload.slug });
  if (existing) {
    throw new Error('SLUG_ALREADY_EXISTS');
  }

  const hash = computeContentHash({
    slug: payload.slug,
    titleBn: payload.titleBn,
    titleEn: payload.titleEn,
    topic: payload.topic,
    grade: payload.grade,
    data: payload.data,
  });

  const now = new Date().toISOString();
  const lessonId = newId('les');

  const lessonDoc: LessonDoc = {
    id: lessonId,
    slug: payload.slug,
    titleBn: payload.titleBn,
    titleEn: payload.titleEn,
    topic: payload.topic,
    grade: payload.grade,
    summaryBn: payload.summaryBn,
    summaryEn: payload.summaryEn,
    status: 'draft',
    version: 1,
    contentHash: hash,
    authorId: author.id,
    createdAt: now,
    updatedAt: now,
  };

  const versionDoc: LessonVersionDoc = {
    id: newId('ver'),
    lessonId,
    version: 1,
    data: payload.data,
    contentHash: hash,
    authorId: author.id,
    createdAt: now,
  };

  await db.collection('lessons').insertOne(lessonDoc);
  await db.collection('lesson_versions').insertOne(versionDoc);

  await logAuditEvent({
    action: 'LESSON_CREATED',
    actorId: author.id,
    targetResource: 'lesson',
    targetId: lessonId,
    allowed: true,
    metadata: { slug: payload.slug, version: 1, hash },
  });

  return { lesson: lessonDoc, version: versionDoc };
}

export async function updateLesson(
  user: UserDoc,
  lessonId: string,
  payload: {
    titleBn?: string;
    titleEn?: string;
    topic?: string;
    grade?: string;
    summaryBn?: string;
    summaryEn?: string;
    data?: any;
  }
): Promise<{ lesson: LessonDoc; version: LessonVersionDoc }> {
  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) {
    throw new Error('LESSON_NOT_FOUND');
  }

  // Capability check with ownership context
  const cap = hasCapability(user, 'lesson:edit_own', { resourceOwnerId: lesson.authorId });
  if (!cap.allowed) {
    await logAuditEvent({
      action: 'ACCESS_DENIED',
      actorId: user.id,
      targetResource: 'lesson',
      targetId: lessonId,
      allowed: false,
      reason: cap.reason,
    });
    throw new Error(cap.reason || 'FORBIDDEN');
  }

  if (lesson.status === 'quarantined') {
    throw new Error('CANNOT_EDIT_QUARANTINED_LESSON');
  }

  const nextVersion = lesson.version + 1;
  const merged = {
    slug: lesson.slug,
    titleBn: payload.titleBn || lesson.titleBn,
    titleEn: payload.titleEn || lesson.titleEn,
    topic: payload.topic || lesson.topic,
    grade: payload.grade || lesson.grade,
    summaryBn: payload.summaryBn || lesson.summaryBn,
    summaryEn: payload.summaryEn || lesson.summaryEn,
    data: payload.data || {},
  };

  const hash = computeContentHash(merged);
  const now = new Date().toISOString();

  const versionDoc: LessonVersionDoc = {
    id: newId('ver'),
    lessonId,
    version: nextVersion,
    data: merged.data,
    contentHash: hash,
    authorId: user.id,
    createdAt: now,
  };

  await db.collection('lesson_versions').insertOne(versionDoc);

  const updatedLesson: LessonDoc = {
    ...lesson,
    titleBn: merged.titleBn,
    titleEn: merged.titleEn,
    topic: merged.topic,
    grade: merged.grade,
    summaryBn: merged.summaryBn,
    summaryEn: merged.summaryEn,
    version: nextVersion,
    contentHash: hash,
    status: 'draft', // revert to draft after edit
    updatedAt: now,
  };

  await db.collection('lessons').updateOne({ id: lessonId }, { $set: updatedLesson });

  await logAuditEvent({
    action: 'LESSON_UPDATED',
    actorId: user.id,
    targetResource: 'lesson',
    targetId: lessonId,
    allowed: true,
    metadata: { version: nextVersion, hash },
  });

  return { lesson: updatedLesson, version: versionDoc };
}

export async function submitLessonForReview(user: UserDoc, lessonId: string): Promise<LessonDoc> {
  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) throw new Error('LESSON_NOT_FOUND');

  const cap = hasCapability(user, 'lesson:edit_own', { resourceOwnerId: lesson.authorId });
  if (!cap.allowed) throw new Error('FORBIDDEN');

  if (lesson.status !== 'draft') {
    throw new Error('LESSON_NOT_IN_DRAFT');
  }

  const now = new Date().toISOString();
  await db.collection('lessons').updateOne(
    { id: lessonId },
    { $set: { status: 'under_review' as const, updatedAt: now } }
  );

  await logAuditEvent({
    action: 'LESSON_SUBMITTED_FOR_REVIEW',
    actorId: user.id,
    targetResource: 'lesson',
    targetId: lessonId,
    allowed: true,
    metadata: { version: lesson.version },
  });

  return { ...lesson, status: 'under_review', updatedAt: now };
}

export async function reviewLesson(
  reviewer: UserDoc,
  lessonId: string,
  decision: 'approved' | 'changes_requested',
  comments: string
): Promise<{ review: ReviewDoc; lesson: LessonDoc }> {
  const cap = hasCapability(reviewer, 'lesson:review');
  if (!cap.allowed) throw new Error('INSUFFICIENT_PERMISSIONS');

  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) throw new Error('LESSON_NOT_FOUND');

  // Prevent author from reviewing their own lesson (anti-tampering conflict of interest check)
  if (lesson.authorId === reviewer.id && reviewer.role !== 'admin') {
    await logAuditEvent({
      action: 'ACCESS_DENIED',
      actorId: reviewer.id,
      targetResource: 'lesson',
      targetId: lessonId,
      allowed: false,
      reason: 'AUTHOR_CANNOT_REVIEW_OWN_LESSON',
    });
    throw new Error('AUTHOR_CANNOT_REVIEW_OWN_LESSON');
  }

  const now = new Date().toISOString();
  const reviewDoc: ReviewDoc = {
    id: newId('rev'),
    lessonId,
    version: lesson.version,
    reviewerId: reviewer.id,
    reviewerEmail: reviewer.email,
    decision,
    comments,
    createdAt: now,
  };

  await db.collection('reviews').insertOne(reviewDoc);

  const nextStatus = decision === 'approved' ? 'under_review' : 'draft';
  await db.collection('lessons').updateOne(
    { id: lessonId },
    { $set: { status: nextStatus, updatedAt: now } }
  );

  await logAuditEvent({
    action: `LESSON_REVIEW_${decision.toUpperCase()}`,
    actorId: reviewer.id,
    targetResource: 'lesson',
    targetId: lessonId,
    allowed: true,
    reason: comments,
    metadata: { version: lesson.version, decision },
  });

  return { review: reviewDoc, lesson: { ...lesson, status: nextStatus, updatedAt: now } };
}

export async function getLessonVersions(lessonId: string): Promise<LessonVersionDoc[]> {
  const db = await getDb();
  const cursor = await db.collection('lesson_versions').find({ lessonId });
  return await cursor.toArray();
}
