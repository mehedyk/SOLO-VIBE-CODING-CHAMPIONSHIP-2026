import { Db } from 'mongodb';

export type UserRole = 'guest' | 'student' | 'teacher' | 'contributor' | 'reviewer' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface UserDoc {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDoc {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  revoked: boolean;
  userAgent?: string;
  ip?: string;
  createdAt: string;
}

export interface AttemptDoc {
  id: string;
  userId?: string;
  guestId?: string;
  lessonSlug: string;
  inputs: Record<string, any>;
  completedSteps: number;
  totalSteps: number;
  score: number;
  predictions: Array<{ place: string; prediction: boolean; correct: boolean }>;
  completedAt: string;
}

export interface ContributorApplicationDoc {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  teachingExperience: string;
  sampleLessonPlan: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export type LessonStatus = 'draft' | 'under_review' | 'published' | 'quarantined';

export interface LessonDoc {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  topic: string;
  grade: string;
  summaryBn: string;
  summaryEn: string;
  status: LessonStatus;
  version: number;
  contentHash: string;
  authorId: string;
  quarantineReason?: string;
  quarantinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonVersionDoc {
  id: string;
  lessonId: string;
  version: number;
  data: any;
  contentHash: string;
  authorId: string;
  createdAt: string;
}

export interface ReviewDoc {
  id: string;
  lessonId: string;
  version: number;
  reviewerId: string;
  reviewerEmail: string;
  decision: 'approved' | 'changes_requested';
  comments: string;
  createdAt: string;
}

export type WorkflowStatus = 'pending' | 'validating' | 'indexing' | 'snapshotting' | 'completed' | 'failed';

export interface WorkflowDoc {
  id: string;
  type: 'publish_lesson';
  targetId: string; // lessonId
  status: WorkflowStatus;
  currentStep: number;
  steps: string[];
  maxRetries: number;
  retryCount: number;
  error?: string;
  logs: Array<{ step: string; timestamp: string; message: string; success: boolean }>;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDoc {
  id: string;
  targetType: 'lesson' | 'review' | 'user';
  targetId: string;
  reporterId: string;
  reason: string;
  details?: string;
  status: 'open' | 'quarantined' | 'dismissed';
  resolvedBy?: string;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLogDoc {
  id: string;
  action: string;
  actorId: string;
  targetResource: string;
  targetId: string;
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  ip?: string;
  timestamp: string;
}

export async function ensureIndexes(db: Db | any): Promise<void> {
  try {
    await db.collection('attempts').createIndex({ userId: 1, lessonSlug: 1 });
    await db.collection('attempts').createIndex({ guestId: 1, lessonSlug: 1 });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ token: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expiresAt: 1 });
    await db.collection('lessons').createIndex({ slug: 1 }, { unique: true });
    await db.collection('lessons').createIndex({ status: 1 });
    await db.collection('workflows').createIndex({ status: 1, updatedAt: 1 });
    await db.collection('audit_logs').createIndex({ actorId: 1, timestamp: -1 });
    await db.collection('reports').createIndex({ status: 1 });
  } catch (err: any) {
    console.warn('Index creation notice:', err.message);
  }
}
