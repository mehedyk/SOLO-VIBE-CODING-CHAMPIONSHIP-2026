import { notFound } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import SiteFooter from '@/components/SiteFooter';
import { getCurrentUserSafe } from '@/lib/auth/current';
import { isLang } from '@/lib/i18n/dict';

export default async function PublicLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const user = await getCurrentUserSafe();
  return (
    <>
      <PublicHeader lang={lang} signedIn={Boolean(user)} />
      <main id="main" className="land">{children}</main>
      <SiteFooter lang={lang} signedIn={Boolean(user)} />
    </>
  );
}
