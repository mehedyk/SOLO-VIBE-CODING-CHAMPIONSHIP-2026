'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { site } from '@/lib/i18n/site';
import { postJson } from '@/lib/clientFetch';
import type { Lang } from '@/lib/i18n/dict';

export interface AdminData {
  selfId: string;
  users: { id: string; name: string; email: string; role: string; status: string; createdAt: string }[];
  apps: { id: string; userName: string; userEmail: string; teachingExperience: string; sampleLessonPlan: string; status: string; createdAt: string }[];
  reports: { id: string; targetId: string; reason: string; details?: string; status: string; createdAt: string }[];
  audit: { id: string; action: string; actorId: string; targetResource: string; allowed: boolean; reason?: string; timestamp: string }[];
}

export default function AdminConsole({ lang, data }: { lang: Lang; data: AdminData }) {
  const t = site[lang].dash;
  const roleName = site[lang].app.roleName;
  const router = useRouter();
  const [tab, setTab] = useState<'users' | 'apps' | 'reports' | 'audit'>('apps');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const pendingApps = data.apps.filter((a) => a.status === 'pending');
  const openReports = data.reports.filter((r) => r.status === 'open');
  const fmt = (iso: string) => new Date(iso).toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const nameOf = (id: string) => data.users.find((u) => u.id === id)?.name ?? id.slice(0, 10);

  async function act(url: string, body: unknown) {
    setBusy(true); setMsg(null);
    const r = await postJson(url, body);
    setBusy(false);
    if (r.ok) { setMsg({ kind: 'ok', text: t.done }); router.refresh(); } else setMsg({ kind: 'err', text: `${t.failed} (${r.data?.error ?? 'ERROR'})` });
  }

  return (
    <>
      <div className="stats">
        <div className="stat"><b>{data.users.length}</b><span>{t.total}</span></div>
        <div className="stat"><b>{pendingApps.length}</b><span>{t.pendingApps}</span></div>
        <div className="stat"><b>{openReports.length}</b><span>{t.openReports}</span></div>
      </div>

      <div className="tabs" role="tablist">
        {(['apps', 'users', 'reports', 'audit'] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setMsg(null); }}>
            {t.tabs[k]}{k === 'apps' && pendingApps.length > 0 && <span className="n">{pendingApps.length}</span>}{k === 'reports' && openReports.length > 0 && <span className="n">{openReports.length}</span>}
          </button>
        ))}
      </div>
      {msg && <p className={`alert ${msg.kind}`} role="status" style={{ marginBottom: '1rem' }}>{msg.text}</p>}

      <section className="panel-sheet">
        {tab === 'apps' && (pendingApps.length === 0 ? <p className="empty-note">{t.noPending}</p> : (
          <div className="table-wrap"><table className="data">
            <thead><tr><th>{t.apps}</th><th>{t.when}</th><th /></tr></thead>
            <tbody>{pendingApps.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.userName}</strong><br /><small>{a.userEmail}</small>
                  <details><summary>{t.exp}</summary><p>{a.teachingExperience}</p><p><strong>{t.plan}:</strong> {a.sampleLessonPlan}</p></details></td>
                <td>{fmt(a.createdAt)}</td>
                <td><div className="row-actions">
                  <button className="btn btn-navy btn-sm" disabled={busy} onClick={() => act(`/api/applications/${a.id}/review`, { decision: 'approved', notes: 'Approved' })}>{t.approve}</button>
                  <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => { const n = window.prompt(t.reason); if (n) void act(`/api/applications/${a.id}/review`, { decision: 'rejected', notes: n }); }}>{t.reject}</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        ))}

        {tab === 'users' && (
          <div className="table-wrap"><table className="data">
            <thead><tr><th>{t.users}</th><th>{t.role}</th><th>{t.joined}</th><th>{t.state}</th><th /></tr></thead>
            <tbody>{data.users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong><br /><small>{u.email}</small></td>
                <td><span className="chip">{roleName[u.role] ?? u.role}</span></td>
                <td>{fmt(u.createdAt)}</td>
                <td><span className={`chip ${u.status === 'active' ? 'mint' : 'rose'}`}>{u.status}</span></td>
                <td>{u.id !== data.selfId && (u.status === 'suspended'
                  ? <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act('/api/admin/suspend', { targetUserId: u.id, action: 'reactivate' })}>{t.reinstate}</button>
                  : <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => { const r = window.prompt(t.reason); if (r) void act('/api/admin/suspend', { targetUserId: u.id, action: 'suspend', reason: r }); }}>{t.suspend}</button>)}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}

        {tab === 'reports' && (openReports.length === 0 ? <p className="empty-note">{t.noReports}</p> : (
          <div className="table-wrap"><table className="data">
            <thead><tr><th>{t.reports}</th><th>{t.when}</th><th /></tr></thead>
            <tbody>{openReports.map((r) => (
              <tr key={r.id}><td><strong>{r.reason}</strong><br /><small>{r.targetId}</small>{r.details && <p>{r.details}</p>}</td><td>{fmt(r.createdAt)}</td>
                <td><div className="row-actions">
                  <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => act('/api/moderation/quarantine', { lessonId: r.targetId, reportId: r.id, reason: r.reason })}>{t.quarantine}</button>
                  <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => act('/api/moderation/dismiss', { reportId: r.id, note: 'Dismissed' })}>{t.dismiss}</button>
                </div></td></tr>
            ))}</tbody>
          </table></div>
        ))}

        {tab === 'audit' && (
          <div className="table-wrap"><table className="data">
            <thead><tr><th>{t.when}</th><th>{t.action}</th><th>{t.actor}</th><th>{t.result}</th></tr></thead>
            <tbody>{data.audit.map((a) => (
              <tr key={a.id}><td>{fmt(a.timestamp)}</td><td><code>{a.action}</code><br /><small>{a.targetResource}</small></td><td>{nameOf(a.actorId)}</td>
                <td><span className={`chip ${a.allowed ? 'mint' : 'rose'}`}>{a.allowed ? t.allowed : t.denied}</span></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </>
  );
}
