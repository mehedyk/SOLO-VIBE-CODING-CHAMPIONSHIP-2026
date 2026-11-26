import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/cookies';
import { safeNextPath } from '@/lib/auth/validation';

/** Landing point when a cookie exists but the session is invalid/expired/revoked: clear it and go to sign in. */
export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'bn';
  const next = safeNextPath(req.nextUrl.searchParams.get('next'), lang);
  const url = new URL(`/${lang}/login`, req.nextUrl.origin);
  if (next !== `/${lang}/dashboard`) url.searchParams.set('next', next);
  url.searchParams.set('reason', 'expired');
  const res = NextResponse.redirect(url);
  clearSessionCookie(res);
  return res;
}
