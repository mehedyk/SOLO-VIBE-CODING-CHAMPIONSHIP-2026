'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { site } from '@/lib/i18n/site';
import { postJson } from '@/lib/clientFetch';
import type { Lang } from '@/lib/i18n/dict';

export default function ApplyForm({ lang, pending }: { lang: Lang; pending: boolean }) {
  const t = site[lang].dash;
  const router = useRouter();
  const [exp, setExp] = useState('');
  const [plan, setPlan] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  if (pending) return <p className="alert info">{t.appPending}</p>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await postJson('/api/applications', { teachingExperience: exp, sampleLessonPlan: plan });
    setBusy(false);
    if (r.ok) { setMsg({ kind: 'ok', text: t.appSent }); router.refresh(); }
    else if (r.data?.error === 'PENDING_APPLICATION_EXISTS') setMsg({ kind: 'ok', text: t.appPending });
    else setMsg({ kind: 'err', text: t.failed });
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field"><label htmlFor="ap-exp">{t.exp}</label><textarea id="ap-exp" required minLength={10} maxLength={2000} value={exp} onChange={(e) => setExp(e.target.value)} /></div>
      <div className="field"><label htmlFor="ap-plan">{t.plan}</label><textarea id="ap-plan" required minLength={10} maxLength={4000} value={plan} onChange={(e) => setPlan(e.target.value)} /></div>
      {msg && <p className={`alert ${msg.kind}`} role="status">{msg.text}</p>}
      <button className="btn btn-navy" type="submit" disabled={busy}>{t.submitApp}</button>
    </form>
  );
}
