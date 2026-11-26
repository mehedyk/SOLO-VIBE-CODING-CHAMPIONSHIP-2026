// Promote an existing account to admin (or any role):  npm run make-admin -- you@example.com [admin|reviewer|contributor|teacher|student]
// Reads MONGODB_URI / MONGODB_DB from .env.local. Sign up on the site first, then run this once.
import { MongoClient } from 'mongodb';

const [email, role = 'admin'] = process.argv.slice(2);
const ROLES = ['student', 'teacher', 'contributor', 'reviewer', 'admin'];
if (!email || !ROLES.includes(role)) {
  console.error(`Usage: npm run make-admin -- <email> [${ROLES.join('|')}]`);
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Put it in .env.local (see .env.example).');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || 'primary_visual_lab');
  const res = await db.collection('users').updateOne({ email: email.trim().toLowerCase() }, { $set: { role, updatedAt: new Date().toISOString() } });
  if (res.matchedCount === 0) { console.error(`No account with email ${email}. Sign up on the site first.`); process.exitCode = 2; }
  else console.log(`Done: ${email} is now "${role}". Sign out and back in to see the new menu.`);
} finally {
  await client.close();
}
