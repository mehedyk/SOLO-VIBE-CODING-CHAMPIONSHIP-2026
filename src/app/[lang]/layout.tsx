import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LangSwitch from "../../components/LangSwitch";
import { MeridianFooter } from "../../components/MeridianFooter";
import { LANGS, dict, isLang } from "../../lib/i18n/dict";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
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
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">{d.skip}</a>
        <header className="site-head flex items-center justify-between">
          <Link href={`/${lang}`} className="brand flex items-center gap-2">
            <svg
              className="w-6 h-6 shrink-0"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="8" height="32" rx="2" fill="#34d399" />
              <rect x="18" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
              <rect x="26" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
              <rect x="26" y="12" width="6" height="6" rx="1.5" fill="#fbbf24" />
              <rect x="26" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
              <rect x="18" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
            </svg>
            <span>{d.appName}</span>
          </Link>
          <LangSwitch lang={lang} />
        </header>
        <main id="main">{children}</main>
        <MeridianFooter lang={lang} />
      </body>
    </html>
  );
}
