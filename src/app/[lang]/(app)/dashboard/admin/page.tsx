import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import AdminConsole from '@/components/dashboard/AdminConsole';
import { requireUser } from '@/lib/auth/current';
import { getDb } from '@/lib/db/client';
import { getAuditLogs } from '@/lib/auth/audit';
import { listApplications } from '@/lib/applications/service';
import { listReports } from '@/lib/moderation/service';
import { isLang } from '@/lib/i18n/dict';
import { site } from '@/lib/i18n/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: site[lang].nav.admin } : {};
}

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const user = await requireUser(lang, `/${lang}/dashboard/admin`);
  if (user.role !== 'admin') redirect(`/${lang}/dashboard`);

  const db = await getDb();
  const [rawUsers, apps, reports, audit] = await Promise.all([
    (await db.collection('users').find({})).toArray(),
    listApplications(),
    listReports(),
    getAuditLogs(),
  ]);

  // Pick fields explicitly so password hashes can never reach the browser.
  const users = rawUsers
    .map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status, createdAt: u.createdAt }))
    .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="page-head"><h1>{site[lang].nav.admin}</h1><p>{site[lang].dash.adminLead}</p></div>
      <AdminConsole
        lang={lang}
        data={{
          selfId: user.id,
          users,
          apps: apps.map((a) => ({ id: a.id, userName: a.userName, userEmail: a.userEmail, teachingExperience: a.teachingExperience, sampleLessonPlan: a.sampleLessonPlan, status: a.status, createdAt: a.createdAt })),
          reports: reports.map((r) => ({ id: r.id, targetId: r.targetId, reason: r.reason, details: r.details, status: r.status, createdAt: r.createdAt })),
          audit: audit.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 60).map((a) => ({ id: a.id, action: a.action, actorId: a.actorId, targetResource: a.targetResource, allowed: a.allowed, reason: a.reason, timestamp: a.timestamp })),
        }}
      />
    </>
  );
}
