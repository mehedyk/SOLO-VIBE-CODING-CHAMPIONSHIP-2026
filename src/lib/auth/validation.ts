import { z } from 'zod';
import { PASSWORD_MAX, PASSWORD_MIN } from './password';

export const SELF_SERVICE_ROLES = ['student', 'teacher'] as const;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email());

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(PASSWORD_MAX),
  next: z.string().max(300).optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: z.string().min(PASSWORD_MIN).max(PASSWORD_MAX),
  role: z.enum(SELF_SERVICE_ROLES).default('student'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Only ever redirect to a same-site, language-prefixed path. Blocks open redirects such as
 * `//evil.com`, `/\evil.com` or `https://evil.com`.
 */
export function safeNextPath(next: string | null | undefined, lang: string): string {
  const fallback = `/${lang}/dashboard`;
  if (!next) return fallback;
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\') || /[\u0000-\u001f]/.test(next)) return fallback;
  if (!/^\/(bn|en)(\/|$|\?)/.test(next)) return fallback;
  if (/^\/(bn|en)\/(login|signup)(\/|$|\?)/.test(next)) return fallback;
  return next;
}
