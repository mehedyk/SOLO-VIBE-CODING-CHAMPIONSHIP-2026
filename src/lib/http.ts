import { NextResponse } from 'next/server';

/**
 * Uniform JSON error. The `error` code is stable for clients; internal exception text is logged on the server
 * and never sent to the browser (the old routes returned `err.message`, which can leak internals).
 */
export function apiError(status: number, code: string, extra?: Record<string, unknown>, cause?: unknown): NextResponse {
  if (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error(`[api] ${code}:`, message);
    if (message.startsWith('DATABASE_NOT_CONFIGURED') || message.startsWith('DATABASE_UNAVAILABLE')) {
      return NextResponse.json({ error: message.split(':')[0], ...extra }, { status: 503 });
    }
  }
  return NextResponse.json({ error: code, ...extra }, { status });
}
