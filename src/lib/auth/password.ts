import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt) as (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number,
  options: crypto.ScryptOptions
) => Promise<Buffer>;

// scrypt cost parameters (~32 MB, tens of ms): strong enough for a free serverless tier.
const N = 2 ** 15;
const R = 8;
const P = 1;
const KEYLEN = 64;
const FORMAT = 'scrypt';

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

const COMMON = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890', 'qwerty123',
  'iloveyou', 'admin123', 'letmein123', 'welcome123', 'demo1234', 'bangladesh', 'abcd1234',
]);

export type PasswordIssue = 'TOO_SHORT' | 'TOO_LONG' | 'TOO_COMMON' | 'SAME_AS_EMAIL' | 'NEEDS_VARIETY';

/** Returns the first problem with a candidate password, or null when it is acceptable. */
export function checkPasswordPolicy(password: string, email?: string): PasswordIssue | null {
  if (password.length < PASSWORD_MIN) return 'TOO_SHORT';
  if (password.length > PASSWORD_MAX) return 'TOO_LONG';
  const lower = password.toLowerCase();
  if (COMMON.has(lower)) return 'TOO_COMMON';
  if (email && lower === email.toLowerCase()) return 'SAME_AS_EMAIL';
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes < 2) return 'NEEDS_VARIETY';
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password.normalize('NFKC'), salt, KEYLEN, { N, r: R, p: P, maxmem: 128 * N * R * 2 });
  return [FORMAT, N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

/** Verifies scrypt hashes and the legacy `salt:hash` PBKDF2 format created by earlier versions. */
export async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (stored.startsWith(`${FORMAT}$`)) {
    const [, n, r, p, saltB64, keyB64] = stored.split('$');
    if (!n || !r || !p || !saltB64 || !keyB64) return { ok: false, needsRehash: false };
    const expected = Buffer.from(keyB64, 'base64');
    const n_ = Number(n), r_ = Number(r), p_ = Number(p);
    const actual = await scrypt(password.normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, {
      N: n_, r: r_, p: p_, maxmem: 128 * n_ * r_ * 2,
    });
    const ok = actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
    return { ok, needsRehash: ok && (n_ !== N || r_ !== R || p_ !== P) };
  }

  // Legacy format: "<saltHex>:<pbkdf2Hex>" (1000 iterations). Accept once, then upgrade.
  const [salt, key] = stored.split(':');
  if (!salt || !key) return { ok: false, needsRehash: false };
  const actual = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512');
  const expected = Buffer.from(key, 'hex');
  const ok = actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  return { ok, needsRehash: ok };
}

// Used to spend the same time when an email does not exist, so login timing does not reveal accounts.
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword('not-a-real-password');
  await verifyPassword(password, await dummyHash);
}
