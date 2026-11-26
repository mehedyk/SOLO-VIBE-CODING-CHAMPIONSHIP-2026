import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import AuthorConsole, { type LessonRow } from '@/components/dashboard/AuthorConsole';
import { requireUser } from '@/lib/auth/current';
import { hasCapability } from '@/lib/auth/roles';
import { getDb } from '@/lib/db/client';
import { isLang } from '@/lib/i18n/dict';
import { site } from '@/lib/i18n/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: site[lang].nav.author } : {};
}

const row = (l: any): LessonRow => ({ id: l.id, slug: l.slug, titleBn: l.titleBn, titleEn: l.titleEn, status: l.status, version: l.version, authorId: l.authorId, grade: l.grade, topic: l.topic });

export default async function AuthorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const user = await requireUser(lang, `/${lang}/dashboard/author`);
  const canCreate = hasCapability(user, 'lesson:create').allowed;
  const canReview = hasCapability(user, 'lesson:review').allowed;
  const canPublish = hasCapability(user, 'lesson:publish').allowed;
  if (!canCreate && !canReview) redirect(`/${lang}/dashboard`);

  const db = await getDb();
  const mine: LessonRow[] = canCreate ? (await (await db.collection('lessons').find({ authorId: user.id })).toArray()).map(row) : [];
  const queue: LessonRow[] = canReview ? (await (await db.collection('lessons').find({ status: 'under_review' })).toArray()).map(row) : [];
  const t = site[lang].dash;

  return (
    <>
      <div className="page-head"><h1>{site[lang].nav.author}</h1><p>{t.authorLead}</p></div>
      <AuthorConsole lang={lang} mine={mine} queue={queue} canCreate={canCreate} canReview={canReview} canPublish={canPublish} userId={user.id} />
    </>
  );
}
