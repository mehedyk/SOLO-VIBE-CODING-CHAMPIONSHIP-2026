import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/lexend';
import '@fontsource/noto-sans-bengali/400.css';
import '@fontsource/noto-sans-bengali/700.css';
import '@/styles/tokens.css';
import '@/styles/labs.css';
import '@/styles/base.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import SceneBackground from '@/components/SceneBackground';
import { LANGS, dict, isLang } from '@/lib/i18n/dict';

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.map((lang) => ({ lang })); }

export const viewport: Viewport = { themeColor: '#0f2a43', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return {
    title: { default: dict[lang].appName, template: `%s · ${dict[lang].appName}` },
    description: dict[lang].tagline,
    icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/favicon.svg', type: 'image/svg+xml' }], apple: '/apple-touch-icon.png' },
    openGraph: { title: dict[lang].appName, description: dict[lang].tagline, images: [{ url: '/images/social_og_image.png', width: 1376, height: 768 }] },
  };
}

// Applies the saved theme, display style and video preference before first paint (no flash).
const INIT = `try{var d=document.documentElement,s=localStorage;if(s.getItem('pvl-theme')==='dark')d.classList.add('dark');if(s.getItem('primary_lab_mode')==='student')d.dataset.mode='student';if(s.getItem('pvl-scene')==='paused')d.dataset.scene='paused'}catch(e){}`;

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: INIT }} /></head>
      <body>
        <a className="skip" href="#main">{dict[lang].skip}</a>
        <SceneBackground />
        {children}
      </body>
    </html>
  );
}
