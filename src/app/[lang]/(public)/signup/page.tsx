import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';
import Icon from '@/components/Icon';
import { getCurrentUserSafe } from '@/lib/auth/current';
import { demoAccountsEnabled } from '@/lib/auth/service';
import { safeNextPath } from '@/lib/auth/validation';
import { isLang } from '@/lib/i18n/dict';
import { site } from '@/lib/i18n/site';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: site[lang].nav.signup };
}

export default async function Page({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);
  const next = str(sp.next) ? safeNextPath(str(sp.next), lang) : undefined;

  if (await getCurrentUserSafe()) redirect(next ?? `/${lang}/dashboard`);

  const t = site[lang].auth;
  const role = str(sp.role) === 'teacher' ? 'teacher' : 'student';
  return (
    <div className="auth">
      <div className="auth-pitch">
        <h1>{t.pitchTitle}</h1>
        <ul>{t.pitch.map((p) => <li key={p}><Icon name="check" /><span>{p}</span></li>)}</ul>
      </div>
      <AuthForm lang={lang} mode="signup" next={next} expired={str(sp.reason) === 'expired'} demoEnabled={demoAccountsEnabled()} initialRole={role} />
    </div>
  );
}
