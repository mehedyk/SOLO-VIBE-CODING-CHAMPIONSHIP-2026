import { getDb } from './client';
import { AttemptDoc } from './schema';
import { newId } from '../util/id';

export async function saveAttempt(attempt: Omit<AttemptDoc, 'id' | 'completedAt'> & { id?: string; completedAt?: string }): Promise<AttemptDoc> {
  const db = await getDb();
  const doc: AttemptDoc = {
    ...attempt,
    id: attempt.id || newId('att'),
    completedAt: attempt.completedAt || new Date().toISOString(),
  };

  await db.collection('attempts').insertOne(doc);
  return doc;
}

export async function getAttemptsByUser(identifier: { userId?: string; guestId?: string }): Promise<AttemptDoc[]> {
  const db = await getDb();
  const query: any = {};
  if (identifier.userId) query.userId = identifier.userId;
  else if (identifier.guestId) query.guestId = identifier.guestId;
  else return [];

  const cursor = await db.collection('attempts').find(query);
  return await cursor.toArray();
}

export async function getLessonStats(lessonSlug: string): Promise<{ totalAttempts: number; avgScore: number }> {
  const db = await getDb();
  const cursor = await db.collection('attempts').find({ lessonSlug });
  const attempts: AttemptDoc[] = await cursor.toArray();

  if (attempts.length === 0) {
    return { totalAttempts: 0, avgScore: 0 };
  }

  const totalScore = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
  return {
    totalAttempts: attempts.length,
    avgScore: Math.round((totalScore / attempts.length) * 10) / 10,
  };
}
