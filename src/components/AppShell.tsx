'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Icon from './Icon';
import LangSwitch from './LangSwitch';
import { ThemeToggle, SceneToggle, ModeToggle } from './HeaderControls';
import { site } from '../lib/i18n/site';
import type { Lang } from '../lib/i18n/dict';
import type { PublicUser } from '../lib/db/schema';

export default function AppShell({ lang, user, dateText, children }: { lang: Lang; user: PublicUser; dateText: string; children: React.ReactNode }) {
  const s = site[lang];
  const path = usePathname() ?? '';
  const [busy, setBusy] = useState(false);

  // Classroom projector mode gets the whole screen.
  if (/\/lessons\/[^/]+\/present\/?$/.test(path)) {
    return (
      <div className="app-main">
        <div className="topbar">
          <Link className="btn btn-ghost btn-sm" href={path.replace(/\/present\/?$/, '')}><Icon name="left" />{s.nav.lessons}</Link>
          <div className="head-actions"><ThemeToggle lang={lang} /><LangSwitch lang={lang} /></div>
        </div>
        <div className="app-content bare">{children}</div>
      </div>
    );
  }

  const L = (p: string) => `/${lang}${p}`;
  const items: { href: string; label: string; icon: string; match: (p: string) => boolean }[] = [
    { href: L('/dashboard'), label: s.nav.dashboard, icon: 'home', match: (p) => /^\/(bn|en)\/dashboard\/?$/.test(p) },
    { href: L('/lessons'), label: s.nav.lessons, icon: 'book', match: (p) => p.includes('/lessons') },
    { href: L('/manipulatives/counting'), label: s.nav.labsApp, icon: 'flask', match: (p) => p.includes('/manipulatives') },
  ];
  if (user.role === 'contributor' || user.role === 'reviewer' || user.role === 'admin') items.push({ href: L('/dashboard/author'), label: s.nav.author, icon: 'pen', match: (p) => p.includes('/dashboard/author') });
  if (user.role === 'admin') items.push({ href: L('/dashboard/admin'), label: s.nav.admin, icon: 'shield', match: (p) => p.includes('/dashboard/admin') });

  async function logout() {
    setBusy(true);
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); } catch { /* cookie is cleared server-side on next visit anyway */ }
    window.location.href = L('');
  }

  return (
    <div className="app">
      <aside className="side-nav">
        <Link href={L('')} className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo_mark.svg" alt="" width={32} height={32} />
          <span className="hide-sm">{s.appName}</span>
        </Link>
        <nav aria-label={lang === 'bn' ? 'অ্যাপ মেনু' : 'App'}>
          {items.map((it) => (
            <Link key={it.href} href={it.href} aria-current={it.match(path) ? 'page' : undefined}><Icon name={it.icon} />{it.label}</Link>
          ))}
        </nav>
        <div className="side-foot">
          <div className="who">
            <span className="avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
            <div><strong>{user.name}</strong><small>{s.app.roleName[user.role] ?? user.role}</small></div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={logout} disabled={busy}><Icon name="out" />{s.nav.logout}</button>
        </div>
      </aside>
      <div className="app-main">
        <div className="topbar">
          <span className="date">{dateText}</span>
          <div className="head-actions">
            <ModeToggle lang={lang} />
            <SceneToggle label={s.scene} />
            <ThemeToggle lang={lang} />
            <LangSwitch lang={lang} />
          </div>
        </div>
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
