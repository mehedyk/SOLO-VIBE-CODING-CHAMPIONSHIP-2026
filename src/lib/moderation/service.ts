import { getDb } from '../db/client';
import { LessonDoc, ReportDoc, UserDoc } from '../db/schema';
import { hasCapability } from '../auth/roles';
import { logAuditEvent } from '../auth/audit';
import { newId } from '../util/id';

export async function reportLesson(
  reporter: UserDoc | { id: string },
  lessonId: string,
  reason: string,
  details?: string
): Promise<ReportDoc> {
  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) throw new Error('LESSON_NOT_FOUND');

  const now = new Date().toISOString();
  const reportDoc: ReportDoc = {
    id: newId('rep'),
    targetType: 'lesson',
    targetId: lessonId,
    reporterId: reporter.id,
    reason,
    details,
    status: 'open',
    createdAt: now,
  };

  await db.collection('reports').insertOne(reportDoc);

  await logAuditEvent({
    action: 'LESSON_REPORTED',
    actorId: reporter.id,
    targetResource: 'report',
    targetId: reportDoc.id,
    allowed: true,
    reason,
    metadata: { lessonId, reason },
  });

  return reportDoc;
}

export async function quarantineLesson(
  moderator: UserDoc,
  lessonId: string,
  reportId?: string,
  reason: string = 'Content flagged for pedagogical or mathematical error'
): Promise<LessonDoc> {
  const cap = hasCapability(moderator, 'lesson:quarantine');
  if (!cap.allowed) {
    await logAuditEvent({
      action: 'ACCESS_DENIED',
      actorId: moderator.id,
      targetResource: 'lesson',
      targetId: lessonId,
      allowed: false,
      reason: 'UNAUTHORIZED_QUARANTINE_ATTEMPT',
      metadata: { role: moderator.role },
    });
    throw new Error('UNAUTHORIZED_QUARANTINE_ATTEMPT');
  }

  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) throw new Error('LESSON_NOT_FOUND');

  const now = new Date().toISOString();
  await db.collection('lessons').updateOne(
    { id: lessonId },
    {
      $set: {
        status: 'quarantined' as const,
        quarantineReason: reason,
        quarantinedAt: now,
        updatedAt: now,
      },
    }
  );

  if (reportId) {
    await db.collection('reports').updateOne(
      { id: reportId },
      {
        $set: {
          status: 'quarantined' as const,
          resolvedBy: moderator.id,
          resolutionNote: `Quarantined by moderator: ${reason}`,
          resolvedAt: now,
        },
      }
    );
  }

  await logAuditEvent({
    action: 'LESSON_QUARANTINED',
    actorId: moderator.id,
    targetResource: 'lesson',
    targetId: lessonId,
    allowed: true,
    reason,
    metadata: { reportId },
  });

  return {
    ...lesson,
    status: 'quarantined',
    quarantineReason: reason,
    quarantinedAt: now,
    updatedAt: now,
  };
}

export async function dismissReport(
  moderator: UserDoc,
  reportId: string,
  note: string
): Promise<ReportDoc> {
  const cap = hasCapability(moderator, 'lesson:quarantine');
  if (!cap.allowed) {
    await logAuditEvent({
      action: 'ACCESS_DENIED',
      actorId: moderator.id,
      targetResource: 'report',
      targetId: reportId,
      allowed: false,
      reason: 'UNAUTHORIZED_REPORT_DISMISSAL',
    });
    throw new Error('INSUFFICIENT_PERMISSIONS');
  }

  const db = await getDb();
  const report: ReportDoc | null = await db.collection('reports').findOne({ id: reportId });
  if (!report) throw new Error('REPORT_NOT_FOUND');

  const now = new Date().toISOString();
  await db.collection('reports').updateOne(
    { id: reportId },
    {
      $set: {
        status: 'dismissed' as const,
        resolvedBy: moderator.id,
        resolutionNote: note,
        resolvedAt: now,
      },
    }
  );

  await logAuditEvent({
    action: 'REPORT_DISMISSED',
    actorId: moderator.id,
    targetResource: 'report',
    targetId: reportId,
    allowed: true,
    reason: note,
  });

  return {
    ...report,
    status: 'dismissed',
    resolvedBy: moderator.id,
    resolutionNote: note,
    resolvedAt: now,
  };
}

export async function listReports(status?: 'open' | 'quarantined' | 'dismissed'): Promise<ReportDoc[]> {
  const db = await getDb();
  const query = status ? { status } : {};
  const cursor = await db.collection('reports').find(query);
  return await cursor.toArray();
}
