import { MongoClient, Db } from 'mongodb';
import { ensureIndexes } from './schema';

// In-memory collection fallback for offline/test environments without Atlas connection
class MemoryCollection {
  name: string;
  private docs: Map<string, any> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  async findOne(query: any): Promise<any | null> {
    for (const doc of this.docs.values()) {
      if (this.matches(doc, query)) return JSON.parse(JSON.stringify(doc));
    }
    return null;
  }

  async find(query: any = {}): Promise<{ toArray: () => Promise<any[]> }> {
    const results: any[] = [];
    for (const doc of this.docs.values()) {
      if (this.matches(doc, query)) results.push(JSON.parse(JSON.stringify(doc)));
    }
    return {
      toArray: async () => results,
    };
  }

  async insertOne(doc: any): Promise<{ insertedId: string; acknowledged: boolean }> {
    const id = doc._id ? String(doc._id) : (doc.id || Math.random().toString(36).substring(2, 11));
    const toInsert = { ...doc, _id: id, id: doc.id || id };
    this.docs.set(id, toInsert);
    return { insertedId: id, acknowledged: true };
  }

  async updateOne(query: any, update: any, options?: { upsert?: boolean }): Promise<{ matchedCount: number; modifiedCount: number }> {
    for (const [id, doc] of this.docs.entries()) {
      if (this.matches(doc, query)) {
        if (update.$set) Object.assign(doc, update.$set);
        if (update.$inc) {
          for (const [k, v] of Object.entries(update.$inc)) {
            doc[k] = (doc[k] || 0) + (v as number);
          }
        }
        if (update.$push) {
          for (const [k, v] of Object.entries(update.$push)) {
            if (!Array.isArray(doc[k])) doc[k] = [];
            doc[k].push(v);
          }
        }
        this.docs.set(id, doc);
        return { matchedCount: 1, modifiedCount: 1 };
      }
    }
    if (options?.upsert && update.$set) {
      await this.insertOne({ ...query, ...update.$set });
      return { matchedCount: 0, modifiedCount: 1 };
    }
    return { matchedCount: 0, modifiedCount: 0 };
  }

  async deleteOne(query: any): Promise<{ deletedCount: number }> {
    for (const [id, doc] of this.docs.entries()) {
      if (this.matches(doc, query)) {
        this.docs.delete(id);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }

  async countDocuments(query: any = {}): Promise<number> {
    let count = 0;
    for (const doc of this.docs.values()) {
      if (this.matches(doc, query)) count++;
    }
    return count;
  }

  async createIndex(_keys: any, _options?: any): Promise<string> {
    return 'in_memory_index';
  }

  private matches(doc: any, query: any): boolean {
    if (!query || Object.keys(query).length === 0) return true;
    for (const [k, v] of Object.entries(query)) {
      if (k === '$or' && Array.isArray(v)) {
        const anyMatch = v.some((subQuery) => this.matches(doc, subQuery));
        if (!anyMatch) return false;
        continue;
      }
      if (v && typeof v === 'object' && ('$in' in v || '$gt' in v || '$gte' in v)) {
        if ('$in' in v && Array.isArray((v as any).$in)) {
          if (!(v as any).$in.includes(doc[k])) return false;
        }
        if ('$gt' in v && !(doc[k] > (v as any).$gt)) return false;
        if ('$gte' in v && !(doc[k] >= (v as any).$gte)) return false;
        continue;
      }
      if (doc[k] !== v) return false;
    }
    return true;
  }
}

class MemoryDb {
  private collections: Map<string, MemoryCollection> = new Map();

  collection(name: string): MemoryCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name)!;
  }
}

const memoryDbInstance = new MemoryDb();

const isProd = () => process.env.NODE_ENV === 'production';

/**
 * Where data lives:
 *  - MONGODB_URI set  -> MongoDB Atlas (indexes are created once per process).
 *  - not set, dev/test -> in-memory store (data resets on restart).
 *  - not set, production -> hard error. Serverless instances do not share memory, so a silent in-memory
 *    fallback would make accounts and sessions vanish at random. Set ALLOW_MEMORY_DB=true to override for a demo.
 */
export async function getDb(): Promise<Db | any> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (isProd() && process.env.ALLOW_MEMORY_DB !== 'true') {
      throw new Error('DATABASE_NOT_CONFIGURED: set MONGODB_URI in the environment variables.');
    }
    return memoryDbInstance;
  }

  const g = global as typeof globalThis & {
    _pvlMongo?: { promise: Promise<MongoClient>; indexed?: Promise<void> };
  };

  if (!g._pvlMongo) {
    const c = new MongoClient(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
    g._pvlMongo = { promise: c.connect() };
  }

  try {
    const connected = await g._pvlMongo.promise;
    const db = connected.db(process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || 'primary_visual_lab');
    g._pvlMongo.indexed ??= ensureIndexes(db);
    await g._pvlMongo.indexed;
    return db;
  } catch (err: any) {
    g._pvlMongo = undefined; // do not cache a failed connection; the next request retries
    if (isProd()) throw new Error(`DATABASE_UNAVAILABLE: ${err?.message ?? 'connection failed'}`);
    console.warn('MongoDB connection failed, using the in-memory store for this dev run:', err?.message);
    return memoryDbInstance;
  }
}
