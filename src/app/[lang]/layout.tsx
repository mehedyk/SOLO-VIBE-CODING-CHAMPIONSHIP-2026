import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LangSwitch from "../../components/LangSwitch";
import { LANGS, dict, isLang } from "../../lib/i18n/dict";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: { default: dict[lang].appName, template: `%s · ${dict[lang].appName}` }, description: dict[lang].tagline };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">{d.skip}</a>
        <header className="site-head">
          <Link href={`/${lang}`} className="brand">{d.appName}</Link>
          <LangSwitch lang={lang} />
        </header>
        <main id="main">{children}</main>
        <footer className="site-foot">{d.footer}</footer>
      </body>
    </html>
  );
}
