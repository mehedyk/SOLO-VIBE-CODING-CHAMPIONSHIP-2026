import { getDb } from '../db/client';
import { AuditLogDoc } from '../db/schema';
import { newId } from '../util/id';

export async function logAuditEvent(entry: {
  action: string;
  actorId: string;
  targetResource: string;
  targetId: string;
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  ip?: string;
}): Promise<AuditLogDoc> {
  const db = await getDb();
  const doc: AuditLogDoc = {
    id: newId('aud'),
    ...entry,
    timestamp: new Date().toISOString(),
  };

  await db.collection('audit_logs').insertOne(doc);
  return doc;
}

export async function getAuditLogs(filter: { actorId?: string; targetResource?: string } = {}): Promise<AuditLogDoc[]> {
  const db = await getDb();
  const query: any = {};
  if (filter.actorId) query.actorId = filter.actorId;
  if (filter.targetResource) query.targetResource = filter.targetResource;

  const cursor = await db.collection('audit_logs').find(query);
  return await cursor.toArray();
}
