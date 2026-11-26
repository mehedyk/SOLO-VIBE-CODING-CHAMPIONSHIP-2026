'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { site } from '@/lib/i18n/site';
import { postJson } from '@/lib/clientFetch';
import type { Lang } from '@/lib/i18n/dict';

export interface LessonRow { id: string; slug: string; titleBn: string; titleEn: string; status: string; version: number; authorId: string; grade: string; topic: string }

const TOPICS = ['counting', 'addition', 'subtraction', 'multiplication', 'division', 'fractions', 'decimals', 'measurement', 'geometry', 'statistics'];

export default function AuthorConsole({ lang, mine, queue, canCreate, canReview, canPublish, userId }: { lang: Lang; mine: LessonRow[]; queue: LessonRow[]; canCreate: boolean; canReview: boolean; canPublish: boolean; userId: string }) {
  const t = site[lang].dash;
  const router = useRouter();
  const tabs = [...(canCreate ? ['mine', 'new'] : []), ...(canReview ? ['queue'] : [])] as ('mine' | 'new' | 'queue')[];
  const [tab, setTab] = useState<'mine' | 'new' | 'queue'>(tabs[0] ?? 'queue');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [f, setF] = useState({ slug: '', titleBn: '', titleEn: '', topic: 'addition', grade: '1', summaryBn: '', summaryEn: '', body: '' });
  const label: Record<string, string> = { mine: t.myLessons, new: t.newLesson, queue: lang === 'bn' ? 'পর্যালোচনার সারি' : 'Review queue' };
  const title = (l: LessonRow) => (lang === 'bn' ? l.titleBn : l.titleEn);

  async function act(url: string, body: unknown) {
    setBusy(true); setMsg(null);
    const r = await postJson(url, body);
    setBusy(false);
    if (r.ok) { setMsg({ kind: 'ok', text: t.done }); router.refresh(); return true; }
    setMsg({ kind: 'err', text: `${t.failed} (${r.data?.error ?? 'ERROR'})` });
    return false;
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const ok = await act('/api/lessons', { slug: f.slug.trim().toLowerCase(), titleBn: f.titleBn, titleEn: f.titleEn, topic: f.topic, grade: f.grade, summaryBn: f.summaryBn, summaryEn: f.summaryEn, data: { kind: 'text', body: f.body } });
    if (ok) { setTab('mine'); setF({ ...f, slug: '', titleBn: '', titleEn: '', summaryBn: '', summaryEn: '', body: '' }); }
  }

  const Badge = ({ s }: { s: string }) => <span className={`chip ${s === 'published' ? 'mint' : s === 'quarantined' ? 'rose' : 'amber'}`}>{t.status[s] ?? s}</span>;

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((k) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setMsg(null); }}>{label[k]}{k === 'queue' && queue.length > 0 && <span className="n">{queue.length}</span>}</button>)}
      </div>
      {msg && <p className={`alert ${msg.kind}`} role="status" style={{ marginBottom: '1rem' }}>{msg.text}</p>}

      {tab === 'mine' && (
        <section className="panel-sheet">
          {mine.length === 0 ? <p className="empty-note">{t.noLessons}</p> : (
            <div className="table-wrap"><table className="data">
              <thead><tr><th>{t.myLessons}</th><th>{t.state}</th><th>{t.version}</th><th /></tr></thead>
              <tbody>{mine.map((l) => (
                <tr key={l.id}><td><strong>{title(l)}</strong><br /><small>{l.slug}</small></td><td><Badge s={l.status} /></td><td>v{l.version}</td>
                  <td>{l.status === 'draft' && <button className="btn btn-navy btn-sm" disabled={busy} onClick={() => act(`/api/lessons/${l.id}/submit`, {})}>{t.submitReview}</button>}</td></tr>
              ))}</tbody>
            </table></div>
          )}
        </section>
      )}

      {tab === 'new' && (
        <section className="panel-sheet">
          <form className="form" onSubmit={create}>
            <div className="cols" style={{ gap: '1rem' }}>
              <div className="field"><label htmlFor="l-tb">Title (বাংলা)</label><input id="l-tb" required value={f.titleBn} onChange={(e) => setF({ ...f, titleBn: e.target.value })} /></div>
              <div className="field"><label htmlFor="l-te">Title (English)</label><input id="l-te" required value={f.titleEn} onChange={(e) => setF({ ...f, titleEn: e.target.value })} /></div>
            </div>
            <div className="cols" style={{ gap: '1rem' }}>
              <div className="field"><label htmlFor="l-slug">Slug</label><input id="l-slug" required pattern="[a-z0-9\-]+" placeholder="adding-with-carry" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /><p className="field-hint">a-z, 0-9, -</p></div>
              <div className="cols" style={{ gap: '1rem' }}>
                <div className="field"><label htmlFor="l-topic">Topic</label><select id="l-topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>{TOPICS.map((x) => <option key={x}>{x}</option>)}</select></div>
                <div className="field"><label htmlFor="l-grade">Class</label><select id="l-grade" value={f.grade} onChange={(e) => setF({ ...f, grade: e.target.value })}>{['1', '2', '3', '4', '5'].map((x) => <option key={x}>{x}</option>)}</select></div>
              </div>
            </div>
            <div className="field"><label htmlFor="l-sb">Summary (বাংলা)</label><textarea id="l-sb" required value={f.summaryBn} onChange={(e) => setF({ ...f, summaryBn: e.target.value })} /></div>
            <div className="field"><label htmlFor="l-se">Summary (English)</label><textarea id="l-se" required value={f.summaryEn} onChange={(e) => setF({ ...f, summaryEn: e.target.value })} /></div>
            <div className="field"><label htmlFor="l-body">Lesson body</label><textarea id="l-body" required style={{ minHeight: 160 }} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></div>
            <button className="btn btn-navy" type="submit" disabled={busy}>{t.create}</button>
          </form>
        </section>
      )}

      {tab === 'queue' && (
        <section className="panel-sheet">
          {queue.length === 0 ? <p className="empty-note">{lang === 'bn' ? 'পর্যালোচনার জন্য কিছু নেই।' : 'Nothing waiting for review.'}</p> : (
            <div className="table-wrap"><table className="data">
              <thead><tr><th>{t.myLessons}</th><th>{t.version}</th><th /></tr></thead>
              <tbody>{queue.map((l) => (
                <tr key={l.id}><td><strong>{title(l)}</strong><br /><small>{l.slug}</small></td><td>v{l.version}</td>
                  <td><div className="row-actions">
                    {l.authorId !== userId || canPublish ? <>
                      <button className="btn btn-navy btn-sm" disabled={busy} onClick={() => act(`/api/lessons/${l.id}/review`, { decision: 'approved', comments: 'Approved' })}>{t.approve}</button>
                      <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => { const c = window.prompt(lang === 'bn' ? 'কী বদলাতে হবে?' : 'What needs to change?'); if (c) void act(`/api/lessons/${l.id}/review`, { decision: 'changes_requested', comments: c }); }}>{lang === 'bn' ? 'পরিবর্তন চান' : 'Request changes'}</button>
                    </> : null}
                    {canPublish && <button className="btn btn-amber btn-sm" disabled={busy} onClick={() => act('/api/workflows/publish', { lessonId: l.id })}>{lang === 'bn' ? 'প্রকাশ করুন' : 'Publish'}</button>}
                  </div></td></tr>
              ))}</tbody>
            </table></div>
          )}
        </section>
      )}
    </>
  );
}
