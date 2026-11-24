import { getDb } from '../db/client';
import { ContributorApplicationDoc, UserDoc } from '../db/schema';
import { logAuditEvent } from '../auth/audit';

export async function submitApplication(
  user: UserDoc,
  data: { teachingExperience: string; sampleLessonPlan: string }
): Promise<ContributorApplicationDoc> {
  if (user.status === 'suspended') {
    throw new Error('USER_SUSPENDED');
  }

  const db = await getDb();
  // Check for existing pending application
  const existingPending = await db.collection('applications').findOne({
    userId: user.id,
    status: 'pending',
  });

  if (existingPending) {
    throw new Error('PENDING_APPLICATION_EXISTS');
  }

  const now = new Date().toISOString();
  const doc: ContributorApplicationDoc = {
    id: 'app_' + Math.random().toString(36).substring(2, 11),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    teachingExperience: data.teachingExperience,
    sampleLessonPlan: data.sampleLessonPlan,
    status: 'pending',
    createdAt: now,
  };

  await db.collection('applications').insertOne(doc);

  await logAuditEvent({
    action: 'APPLICATION_SUBMITTED',
    actorId: user.id,
    targetResource: 'application',
    targetId: doc.id,
    allowed: true,
  });

  return doc;
}

export async function listApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<ContributorApplicationDoc[]> {
  const db = await getDb();
  const query = status ? { status } : {};
  const cursor = await db.collection('applications').find(query);
  return await cursor.toArray();
}

export async function reviewApplication(
  admin: UserDoc,
  applicationId: string,
  decision: 'approved' | 'rejected',
  notes: string
): Promise<ContributorApplicationDoc> {
  const db = await getDb();
  const application: ContributorApplicationDoc | null = await db.collection('applications').findOne({ id: applicationId });

  if (!application) {
    throw new Error('APPLICATION_NOT_FOUND');
  }

  if (application.status !== 'pending') {
    throw new Error('APPLICATION_ALREADY_DECIDED');
  }

  const now = new Date().toISOString();
  await db.collection('applications').updateOne(
    { id: applicationId },
    {
      $set: {
        status: decision,
        reviewedBy: admin.id,
        reviewNotes: notes,
        reviewedAt: now,
      },
    }
  );

  // If approved, upgrade the user's role to 'contributor'
  if (decision === 'approved') {
    await db.collection('users').updateOne(
      { id: application.userId },
      { $set: { role: 'contributor', updatedAt: now } }
    );
  }

  await logAuditEvent({
    action: `APPLICATION_${decision.toUpperCase()}`,
    actorId: admin.id,
    targetResource: 'application',
    targetId: applicationId,
    allowed: true,
    reason: notes,
    metadata: { userId: application.userId, decision },
  });

  return {
    ...application,
    status: decision,
    reviewedBy: admin.id,
    reviewNotes: notes,
    reviewedAt: now,
  };
}
