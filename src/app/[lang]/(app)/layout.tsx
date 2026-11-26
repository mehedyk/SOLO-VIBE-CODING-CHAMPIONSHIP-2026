import { notFound } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { requireUser, toPublicUser } from '@/lib/auth/current';
import { getAcademicDate } from '@/lib/i18n/banglaDate';
import { isLang } from '@/lib/i18n/dict';

export default async function AppLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  // The real login check: valid, unexpired, not revoked, user not suspended. Otherwise: sign-in page.
  const user = await requireUser(lang, `/${lang}/dashboard`);
  const dhaka = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const d = getAcademicDate(lang, dhaka);
  return (
    <AppShell lang={lang} user={toPublicUser(user)} dateText={`${d.dateStr} · ${d.banglaYearStr}`}>
      <main id="main" className="page-lab">{children}</main>
    </AppShell>
  );
}
