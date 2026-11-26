import { NextResponse, type NextRequest } from 'next/server';

/**
 * First line of defence for private pages. It only checks that a session cookie *exists* (Edge runtime cannot
 * reach MongoDB). The real validation - signature-free server session lookup, expiry, revocation, suspension -
 * happens in the (app) layout via requireUser(), and in every API route via authorizeRequest().
 */
const SESSION_COOKIE = 'pvl_session';
const PRIVATE = /^\/(dashboard|lessons|manipulatives)(\/|$)/;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const match = pathname.match(/^\/(bn|en)(\/.*)?$/);
  if (!match) return NextResponse.next();

  // Let server layouts know the exact page, so a bounced visitor lands back here after signing in.
  const headers = new Headers(req.headers);
  headers.set('x-pathname', pathname + search);

  const lang = match[1]!;
  const rest = match[2] ?? '';

  if (PRIVATE.test(rest) && !req.cookies.get(SESSION_COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}/login`;
    url.search = '';
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/(bn|en)/:path*'] };
