import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LangSwitch from "../../components/LangSwitch";
import { ModeTypographyToggle } from "../../components/ModeTypographyToggle";
import { MeridianFooter } from "../../components/MeridianFooter";
import { AcademicDateHeader } from "../../components/AcademicDateHeader";
import { LANGS, dict, isLang } from "../../lib/i18n/dict";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return {
    title: { default: dict[lang].appName, template: `%s · ${dict[lang].appName}` },
    description: dict[lang].tagline,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: dict[lang].appName,
      description: dict[lang].tagline,
      images: [{ url: '/images/social_og_image.png', width: 1376, height: 768 }],
    },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  const isBn = lang === 'bn';

  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">{d.skip}</a>
        <AcademicDateHeader lang={lang} />
        <header className="site-head">
          <div className="head-left">
            <Link href={`/${lang}`} className="brand">
              <img
                src="/images/logo_mark.svg"
                alt="Primary Visual Lab Logo"
                width={30}
                height={30}
                style={{ width: "30px", height: "30px", flexShrink: 0 }}
                aria-hidden="true"
              />
              <span className="brand-text">{d.appName}</span>
            </Link>

            <nav className="head-nav" aria-label="Main Navigation">
              <Link href={`/${lang}/lessons`} className="nav-link">
                {isBn ? 'পাঠসমূহ (১ম-৫ম)' : 'Lessons (1-5)'}
              </Link>
              <Link href={`/${lang}/lessons/subtraction-regrouping`} className="nav-link">
                {isBn ? 'ভিজ্যুয়াল ল্যাব' : 'Visual Lab'}
              </Link>
              <Link href={`/${lang}/login`} className="nav-link nav-demo-badge">
                <span className="nav-key-icon">🔑</span>
                <span>{isBn ? 'ডেমো অ্যাকাউন্ট' : 'Demo Login'}</span>
              </Link>
            </nav>
          </div>

          <div className="head-actions">
            <ModeTypographyToggle lang={lang} />
            <LangSwitch lang={lang} />
          </div>
        </header>
        <main id="main">{children}</main>
        <MeridianFooter lang={lang} />
      </body>
    </html>
  );
}
