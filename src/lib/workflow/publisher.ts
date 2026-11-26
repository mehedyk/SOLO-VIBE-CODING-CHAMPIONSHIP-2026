import { getDb } from '../db/client';
import { LessonDoc, WorkflowDoc, UserDoc } from '../db/schema';
import { hasCapability } from '../auth/roles';
import { logAuditEvent } from '../auth/audit';
import { newId } from '../util/id';

const PUBLISH_STEPS = [
  'validate_integrity',
  'build_catalogue_index',
  'generate_static_snapshot',
  'finalize_publication',
];

export async function startPublicationWorkflow(
  admin: UserDoc,
  lessonId: string,
  options?: { simulateFailureAtStep?: string }
): Promise<WorkflowDoc> {
  const cap = hasCapability(admin, 'lesson:publish');
  if (!cap.allowed) {
    throw new Error('INSUFFICIENT_PERMISSIONS');
  }

  const db = await getDb();
  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: lessonId });
  if (!lesson) {
    throw new Error('LESSON_NOT_FOUND');
  }

  // Check if there is already an active workflow for this lesson
  const existingActive: WorkflowDoc | null = await db.collection('workflows').findOne({
    targetId: lessonId,
    status: { $in: ['pending', 'validating', 'indexing', 'snapshotting'] },
  });

  if (existingActive) {
    return existingActive;
  }

  const now = new Date().toISOString();
  const workflowDoc: WorkflowDoc = {
    id: newId('wf'),
    type: 'publish_lesson',
    targetId: lessonId,
    status: 'pending',
    currentStep: 0,
    steps: PUBLISH_STEPS,
    maxRetries: 3,
    retryCount: 0,
    logs: [
      {
        step: 'init',
        timestamp: now,
        message: `Workflow initiated by ${admin.name} (${admin.id})`,
        success: true,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  await db.collection('workflows').insertOne(workflowDoc);

  await logAuditEvent({
    action: 'WORKFLOW_STARTED',
    actorId: admin.id,
    targetResource: 'workflow',
    targetId: workflowDoc.id,
    allowed: true,
    metadata: { lessonId, steps: PUBLISH_STEPS },
  });

  // Execute workflow immediately
  return await executeWorkflow(workflowDoc.id, options);
}

export async function executeWorkflow(
  workflowId: string,
  options?: { simulateFailureAtStep?: string }
): Promise<WorkflowDoc> {
  const db = await getDb();
  let wf: WorkflowDoc | null = await db.collection('workflows').findOne({ id: workflowId });
  if (!wf) throw new Error('WORKFLOW_NOT_FOUND');

  const lesson: LessonDoc | null = await db.collection('lessons').findOne({ id: wf.targetId });
  if (!lesson) throw new Error('TARGET_LESSON_NOT_FOUND');

  for (let i = wf.currentStep; i < wf.steps.length; i++) {
    const stepName = wf.steps[i];
    const timestamp = new Date().toISOString();

    // Check simulated failure hook for A07 proof / test verification
    if (options?.simulateFailureAtStep === stepName) {
      const errorMsg = `Simulated network timeout/failure during step: ${stepName}`;
      const failLog = {
        step: stepName,
        timestamp,
        message: errorMsg,
        success: false,
      };

      await db.collection('workflows').updateOne(
        { id: workflowId },
        {
          $set: {
            status: 'failed',
            error: errorMsg,
            currentStep: i,
            updatedAt: timestamp,
          },
          $push: { logs: failLog } as any,
        }
      );

      await logAuditEvent({
        action: 'WORKFLOW_STEP_FAILED',
        actorId: 'system',
        targetResource: 'workflow',
        targetId: workflowId,
        allowed: true,
        reason: errorMsg,
        metadata: { step: stepName, stepIndex: i },
      });

      return (await db.collection('workflows').findOne({ id: workflowId }))!;
    }

    // Step Execution Logic
    try {
      if (stepName === 'validate_integrity') {
        if (!lesson.titleBn || !lesson.titleEn || !lesson.contentHash) {
          throw new Error('Lesson metadata incomplete or corrupted');
        }
      } else if (stepName === 'build_catalogue_index') {
        // Build search token record
        await db.collection('catalogue_index').updateOne(
          { lessonId: lesson.id },
          {
            $set: {
              lessonId: lesson.id,
              slug: lesson.slug,
              titleBn: lesson.titleBn,
              titleEn: lesson.titleEn,
              topic: lesson.topic,
              grade: lesson.grade,
              indexedAt: timestamp,
            },
          },
          { upsert: true }
        );
      } else if (stepName === 'generate_static_snapshot') {
        // Snapshot generation (renders immutable manifest)
        await db.collection('lesson_snapshots').updateOne(
          { lessonId: lesson.id },
          {
            $set: {
              lessonId: lesson.id,
              version: lesson.version,
              contentHash: lesson.contentHash,
              snapshotTime: timestamp,
            },
          },
          { upsert: true }
        );
      } else if (stepName === 'finalize_publication') {
        // Mark lesson published idempotently
        await db.collection('lessons').updateOne(
          { id: lesson.id },
          {
            $set: {
              status: 'published',
              updatedAt: timestamp,
            },
          }
        );
      }

      // Record successful step completion
      const stepLog = {
        step: stepName,
        timestamp,
        message: `Step ${stepName} completed successfully`,
        success: true,
      };

      const isLast = i === wf.steps.length - 1;
      const nextStatus = isLast ? 'completed' : getStatusForStep(wf.steps[i + 1] ?? '');

      await db.collection('workflows').updateOne(
        { id: workflowId },
        {
          $set: {
            status: nextStatus,
            currentStep: i + 1,
            error: null,
            updatedAt: timestamp,
          },
          $push: { logs: stepLog } as any,
        }
      );
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown step failure';
      const failLog = {
        step: stepName,
        timestamp,
        message: errorMsg,
        success: false,
      };

      await db.collection('workflows').updateOne(
        { id: workflowId },
        {
          $set: {
            status: 'failed',
            error: errorMsg,
            currentStep: i,
            updatedAt: timestamp,
          },
          $push: { logs: failLog } as any,
        }
      );

      return (await db.collection('workflows').findOne({ id: workflowId }))!;
    }
  }

  await logAuditEvent({
    action: 'WORKFLOW_COMPLETED',
    actorId: 'system',
    targetResource: 'workflow',
    targetId: workflowId,
    allowed: true,
    metadata: { lessonId: lesson.id },
  });

  return (await db.collection('workflows').findOne({ id: workflowId }))!;
}

export async function retryPublicationWorkflow(
  admin: UserDoc,
  workflowId: string,
  options?: { simulateFailureAtStep?: string }
): Promise<WorkflowDoc> {
  const cap = hasCapability(admin, 'lesson:publish');
  if (!cap.allowed) throw new Error('INSUFFICIENT_PERMISSIONS');

  const db = await getDb();
  const wf: WorkflowDoc | null = await db.collection('workflows').findOne({ id: workflowId });
  if (!wf) throw new Error('WORKFLOW_NOT_FOUND');

  if (wf.status === 'completed') {
    throw new Error('WORKFLOW_ALREADY_COMPLETED');
  }

  if (wf.retryCount >= wf.maxRetries) {
    throw new Error('MAX_RETRIES_EXCEEDED');
  }

  const now = new Date().toISOString();
  const retryCount = wf.retryCount + 1;

  await db.collection('workflows').updateOne(
    { id: workflowId },
    {
      $set: {
        status: getStatusForStep(wf.steps[wf.currentStep] ?? (wf.steps[0] ?? '')),
        retryCount,
        updatedAt: now,
      },
      $push: {
        logs: {
          step: 'retry',
          timestamp: now,
          message: `Retry attempt #${retryCount} initiated by ${admin.name}`,
          success: true,
        },
      } as any,
    }
  );

  await logAuditEvent({
    action: 'WORKFLOW_RETRIED',
    actorId: admin.id,
    targetResource: 'workflow',
    targetId: workflowId,
    allowed: true,
    metadata: { retryCount, resumeStep: wf.steps[wf.currentStep] },
  });

  return await executeWorkflow(workflowId, options);
}

function getStatusForStep(step: string): any {
  if (step === 'validate_integrity') return 'validating';
  if (step === 'build_catalogue_index') return 'indexing';
  if (step === 'generate_static_snapshot') return 'snapshotting';
  if (step === 'finalize_publication') return 'pending';
  return 'pending';
}

export async function getWorkflow(workflowId: string): Promise<WorkflowDoc | null> {
  const db = await getDb();
  return await db.collection('workflows').findOne({ id: workflowId });
}
