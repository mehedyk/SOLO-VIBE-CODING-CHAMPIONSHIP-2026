import Link from 'next/link';
import LangSwitch from './LangSwitch';
import Icon from './Icon';
import { ThemeToggle, SceneToggle } from './HeaderControls';
import { site } from '../lib/i18n/site';
import type { Lang } from '../lib/i18n/dict';

export default function PublicHeader({ lang, signedIn }: { lang: Lang; signedIn: boolean }) {
  const s = site[lang];
  return (
    <header className="pub-head">
      <Link href={`/${lang}`} className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo_mark.svg" alt="" width={32} height={32} />
        <span>{s.appName}</span>
      </Link>
      <nav className="pub-nav" aria-label={lang === 'bn' ? 'প্রধান মেনু' : 'Main'}>
        <Link href={`/${lang}#how`}>{s.nav.how}</Link>
        <Link href={`/${lang}#labs`}>{s.nav.labs}</Link>
        <Link href={`/${lang}#roles`}>{s.nav.roles}</Link>
        <Link href={`/${lang}#curriculum`}>{s.nav.curriculum}</Link>
      </nav>
      <div className="head-actions">
        <SceneToggle label={s.scene} />
        <ThemeToggle lang={lang} />
        <LangSwitch lang={lang} />
        {signedIn ? (
          <Link href={`/${lang}/dashboard`} className="btn btn-amber btn-sm">{s.nav.dashboard}<Icon name="right" /></Link>
        ) : (
          <>
            <Link href={`/${lang}/login`} className="btn btn-ghost btn-sm hide-xs">{s.nav.login}</Link>
            <Link href={`/${lang}/signup`} className="btn btn-amber btn-sm">{s.nav.signup}</Link>
          </>
        )}
      </div>
    </header>
  );
}
