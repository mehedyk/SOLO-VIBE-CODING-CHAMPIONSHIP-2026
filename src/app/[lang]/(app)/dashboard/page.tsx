import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import ApplyForm from '@/components/dashboard/ApplyForm';
import { requireUser } from '@/lib/auth/current';
import { getDb } from '@/lib/db/client';
import { getAttemptsByUser } from '@/lib/db/attempts';
import { hasCapability } from '@/lib/auth/roles';
import { isLang, fill } from '@/lib/i18n/dict';
import { site } from '@/lib/i18n/site';
import { LESSONS, lessonText, findLesson } from '@/lib/lessons/registry';
import { NCTB_CURRICULUM } from '@/lib/curriculum/nctb';
import { formatInt } from '@/lib/math/numerals';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: site[lang].nav.dashboard } : {};
}

export default async function Dashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const s = site[lang];
  const t = s.dash;
  const user = await requireUser(lang, `/${lang}/dashboard`);
  const L = (p: string) => `/${lang}${p}`;
  const n = (x: number) => formatInt(x, lang);
  const greet = fill(s.app.greet, { name: user.name.split(' ')[0] ?? user.name });
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium' });

  const attempts = (await getAttemptsByUser({ userId: user.id })).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const avg = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0;
  const tried = new Set(attempts.map((a) => a.lessonSlug)).size;
  const last = attempts[0];

  const canApply = hasCapability(user, 'application:submit').allowed && user.role !== 'admin';
  let pending = false;
  if (canApply) {
    const db = await getDb();
    pending = Boolean(await db.collection('applications').findOne({ userId: user.id, status: 'pending' }));
  }

  const isTeacher = user.role === 'teacher';
  const nextLesson = LESSONS.find((l) => !attempts.some((a) => a.lessonSlug === l.slug)) ?? LESSONS[0]!;

  return (
    <>
      <section className="hero-strip">
        <div>
          <h1>{greet}</h1>
          <p>{isTeacher ? t.teacherLead : user.role === 'admin' ? t.adminLead : user.role === 'contributor' || user.role === 'reviewer' ? t.authorLead : t.studentLead}</p>
        </div>
        <Link className="btn btn-amber" href={L(`/lessons/${nextLesson.slug}`)}>{last ? t.continueTitle : t.startLab}<Icon name="right" /></Link>
      </section>

      <div className="stats">
        <div className="stat"><b>{n(attempts.length)}</b><span>{t.attempts}</span></div>
        <div className="stat"><b>{n(avg)}{lang === 'bn' ? '%' : '%'}</b><span>{t.avgScore}</span></div>
        <div className="stat"><b>{n(tried)}</b><span>{t.labsTried}</span></div>
        {isTeacher
          ? <div className="stat"><b>{n(NCTB_CURRICULUM.length)}</b><span>{lang === 'bn' ? 'শিক্ষাক্রমের অধ্যায়' : 'Curriculum chapters'}</span></div>
          : <div className="stat"><b style={{ fontSize: '1.3rem' }}>{last ? fmtDate(last.completedAt) : '—'}</b><span>{t.lastActive}</span></div>}
      </div>

      <div className="cols">
        <section className="panel-sheet">
          <h2>{isTeacher ? t.teacherTools : t.recent}</h2>
          {isTeacher ? (
            <div className="table-wrap"><table className="data">
              <thead><tr><th>{t.lessonsReady}</th><th /></tr></thead>
              <tbody>{LESSONS.map((l) => (
                <tr key={l.slug}><td><strong>{lessonText(l, lang).title}</strong></td>
                  <td><div className="row-actions">
                    <Link className="btn btn-navy btn-sm" href={L(`/lessons/${l.slug}/present`)}><Icon name="screen" />{t.presenter}</Link>
                    <Link className="btn btn-ghost btn-sm" href={L(`/lessons/${l.slug}/print`)}><Icon name="printer" />{t.print}</Link>
                    <a className="btn btn-ghost btn-sm" href={`/api/slides/${l.slug}`}><Icon name="download" />{t.slides}</a>
                    <Link className="btn btn-ghost btn-sm" href={L(`/lessons/${l.slug}`)}>{t.learner}</Link>
                  </div></td></tr>
              ))}</tbody>
            </table></div>
          ) : attempts.length === 0 ? (
            <p className="empty-note">{t.noAttempts}</p>
          ) : (
            <div className="table-wrap"><table className="data">
              <thead><tr><th>{s.nav.lessons}</th><th>{t.score}</th><th>{t.steps}</th><th>{t.when}</th></tr></thead>
              <tbody>{attempts.slice(0, 8).map((a) => {
                const l = findLesson(a.lessonSlug);
                return <tr key={a.id}><td><strong>{l ? lessonText(l, lang).title : a.lessonSlug}</strong></td><td>{n(a.score)}%</td><td>{n(a.completedSteps)}/{n(a.totalSteps)}</td><td>{fmtDate(a.completedAt)}</td></tr>;
              })}</tbody>
            </table></div>
          )}
        </section>

        <section className="panel-sheet">
          <h2>{t.suggested}</h2>
          <ul className="quick">
            {LESSONS.map((l) => <li key={l.slug}><Link href={L(`/lessons/${l.slug}`)}><span>{lessonText(l, lang).title}<small>{lessonText(l, lang).objective?.slice(0, 80)}…</small></span><Icon name="right" /></Link></li>)}
            {s.labs.items.filter((i) => i.href.startsWith('/manipulatives')).slice(0, 4).map((i) => <li key={i.slug}><Link href={L(i.href)}><span>{i.name}<small>{i.cls}</small></span><Icon name="right" /></Link></li>)}
          </ul>
        </section>
      </div>

      {(user.role === 'contributor' || user.role === 'reviewer') && <p><Link className="btn btn-navy" href={L('/dashboard/author')}><Icon name="pen" />{s.nav.author}</Link></p>}
      {user.role === 'admin' && <p><Link className="btn btn-navy" href={L('/dashboard/admin')}><Icon name="shield" />{s.nav.admin}</Link></p>}

      {canApply && (
        <section className="panel-sheet" style={{ maxWidth: 760 }}>
          <h2>{t.applyTitle}</h2>
          <p style={{ color: 'var(--ink-2)' }}>{t.applyBody}</p>
          <ApplyForm lang={lang} pending={pending} />
        </section>
      )}
    </>
  );
}
