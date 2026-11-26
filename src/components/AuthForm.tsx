'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { site } from '../lib/i18n/site';
import type { Lang } from '../lib/i18n/dict';

type Mode = 'login' | 'signup';

function strength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  else if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += pw.length >= 8 ? 0 : 0;
  return Math.min(4, Math.max(pw.length >= 8 ? 1 : 0, score));
}

export default function AuthForm({ lang, mode, next, expired, demoEnabled, initialRole }: { lang: Lang; mode: Mode; next?: string; expired?: boolean; demoEnabled: boolean; initialRole?: 'student' | 'teacher' }) {
  const t = site[lang].auth;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole ?? 'student');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ code: string; field?: string; issue?: string } | null>(null);
  const isSignup = mode === 'signup';
  const score = useMemo(() => strength(password), [password]);

  const message = (e: { code: string; issue?: string }) => t.err[e.issue ?? ''] ?? t.err[e.code] ?? t.err.SERVER_ERROR!;

  async function post(url: string, body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-lang': lang }, body: JSON.stringify(body), credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError({ code: data.error ?? 'SERVER_ERROR', field: data.field, issue: data.issue });
        setBusy(false);
        return;
      }
      router.replace(data.redirectTo ?? `/${lang}/dashboard`);
      router.refresh();
    } catch {
      setError({ code: 'NETWORK' });
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (isSignup) void post('/api/auth/register', { name, email, password, role });
    else void post('/api/auth/login', { email, password, next });
  }

  const invalid = (f: string) => error?.field === f || (f === 'email' && error?.code === 'USER_ALREADY_EXISTS');
  const barClass = score <= 1 ? 'low' : score === 2 ? 'mid' : 'on';
  const alt = isSignup ? `/${lang}/login${next ? `?next=${encodeURIComponent(next)}` : ''}` : `/${lang}/signup`;

  return (
    <div className="auth-panel">
      <h2>{isSignup ? t.signupTitle : t.loginTitle}</h2>
      <p className="auth-sub">{isSignup ? t.signupSub : t.loginSub}</p>

      {expired && !error && <p className="alert info" role="status" style={{ marginBottom: '1rem' }}>{t.expired}</p>}
      {error && <p className="alert err" role="alert" style={{ marginBottom: '1rem' }}>{message(error)}</p>}

      <form className="form" onSubmit={submit} noValidate>
        {isSignup && (
          <div className="field">
            <label htmlFor="f-name">{t.name}</label>
            <input id="f-name" type="text" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={invalid('name')} />
          </div>
        )}
        <div className="field">
          <label htmlFor="f-email">{t.email}</label>
          <input id="f-email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid('email')} />
        </div>
        <div className="field">
          <label htmlFor="f-pw">{t.password}</label>
          <div className="pw">
            <input id="f-pw" type={show ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} required minLength={isSignup ? 8 : 1} maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={invalid('password')} aria-describedby={isSignup ? 'pw-help' : undefined} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show}>{show ? t.hide : t.show}</button>
          </div>
          {isSignup && (
            <>
              <div className="meter" aria-hidden="true">{[1, 2, 3, 4].map((n) => <i key={n} className={score >= n ? barClass : ''} />)}</div>
              <p id="pw-help" className="field-hint">{password ? t.strength[score] : t.pwHelp}</p>
            </>
          )}
        </div>

        {isSignup && (
          <fieldset className="role-pick">
            <legend>{t.role}</legend>
            <label><input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} /><span className="opt"><strong>{t.student}</strong><span>{t.studentD}</span></span></label>
            <label><input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} /><span className="opt"><strong>{t.teacher}</strong><span>{t.teacherD}</span></span></label>
          </fieldset>
        )}

        <button type="submit" className="btn btn-navy btn-block" disabled={busy}>{busy ? t.loading : isSignup ? t.signupBtn : t.loginBtn}</button>
      </form>

      <p className="auth-alt">{isSignup ? t.haveAccount : t.noAccount} <Link href={alt}>{isSignup ? site[lang].nav.login : site[lang].nav.signup}</Link></p>

      {demoEnabled && !isSignup && (
        <div className="demo-box">
          <h3>{t.demoTitle}</h3>
          <div className="demo-row">
            {(['student', 'teacher', 'contributor', 'admin'] as const).map((r) => (
              <button key={r} type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void post('/api/auth/demo', { role: r, lang, next })}>{site[lang].app.roleName[r]}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
