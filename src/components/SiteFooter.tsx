'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { site } from '../lib/i18n/site';
import type { Lang } from '../lib/i18n/dict';

/** Footer with the ink-engraving aqueduct video at full strength. It only plays while visible. */
export default function SiteFooter({ lang, signedIn }: { lang: Lang; signedIn: boolean }) {
  const s = site[lang];
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { threshold: 0.1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (visible && !paused && !reduce) v.play().catch(() => undefined);
    else v.pause();
  }, [visible, paused]);

  const L = (p: string) => `/${lang}${p}`;
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>
          <Link href={L('')} className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo_mark.svg" alt="" width={32} height={32} />
            <span>{s.appName}</span>
          </Link>
          <p className="foot-blurb">{s.foot.blurb}</p>
        </div>
        <div>
          <h4>{s.foot.learn}</h4>
          <ul>
            <li><Link href={L('#how')}>{s.nav.how}</Link></li>
            <li><Link href={L('#labs')}>{s.nav.labs}</Link></li>
            <li><Link href={L('#curriculum')}>{s.nav.curriculum}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{s.foot.account}</h4>
          <ul>
            {signedIn ? (
              <li><Link href={L('/dashboard')}>{s.nav.dashboard}</Link></li>
            ) : (
              <>
                <li><Link href={L('/login')}>{s.nav.login}</Link></li>
                <li><Link href={L('/signup')}>{s.nav.signup}</Link></li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h4>{s.foot.about}</h4>
          <ul>
            <li><a href="https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://mehedy.netlify.app" target="_blank" rel="noopener noreferrer">mehedyk</a></li>
          </ul>
        </div>
      </div>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={ref} className="foot-video" src="/video/meridian_ambient.mp4" poster="/video/meridian_poster.webp" muted loop playsInline preload="metadata" aria-hidden="true" disablePictureInPicture />
      <button type="button" className="icon-btn foot-pause" onClick={() => setPaused((p) => !p)} aria-label={paused ? s.foot.play : s.foot.pause} title={paused ? s.foot.play : s.foot.pause}>
        <Icon name={paused ? 'play' : 'pause'} />
      </button>

      <div className="foot-bar">
        <span>© {new Date().getFullYear()} {s.foot.rights}</span>
        <span style={{ maxWidth: '46rem' }}>{s.foot.honest}</span>
      </div>
    </footer>
  );
}
