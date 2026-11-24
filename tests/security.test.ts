import test from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../next.config.mjs';
import { parseQuery } from '../src/lib/lessons/catalogue';

test('Security Headers: next.config.mjs configures strict CSP and headers', async () => {
  assert.equal(nextConfig.poweredByHeader, false, 'X-Powered-By is disabled');
  assert.ok(typeof nextConfig.headers === 'function', 'headers function is defined');

  const headersList = await nextConfig.headers();
  assert.ok(headersList.length > 0);

  const globalHeaders = headersList[0]!.headers;
  const csp = globalHeaders.find((h: any) => h.key === 'Content-Security-Policy');
  assert.ok(csp, 'CSP is defined');
  assert.ok(csp.value.includes("default-src 'self'"));
  assert.ok(csp.value.includes("frame-ancestors 'none'"));

  const noSniff = globalHeaders.find((h: any) => h.key === 'X-Content-Type-Options');
  assert.equal(noSniff?.value, 'nosniff');

  const frameOptions = globalHeaders.find((h: any) => h.key === 'X-Frame-Options');
  assert.equal(frameOptions?.value, 'DENY');
});

test('Input Sanitization: catalogue query ignores malicious inputs', () => {
  const hostile = parseQuery({
    q: '<script>alert("xss")</script>',
    topic: '"><img src=x onerror=alert(1)>',
    review: 'javascript:void(0)',
    sort: 'DROP TABLE lessons;--',
  });

  // Topic & review are strictly whitelisted
  assert.equal(hostile.topic, '', 'Non-whitelisted topic discarded');
  assert.equal(hostile.review, '', 'Non-whitelisted review discarded');
  assert.equal(hostile.sort, 'title', 'Invalid sort defaulted safely');
  // Query string is preserved safely as text (React automatically escapes text nodes)
  assert.ok(hostile.q.includes('alert'));
});
