'use client';

import { useCallback, useEffect, useState } from 'react';
import Icon from './Icon';
import type { Lang } from '../lib/i18n/dict';

export function ThemeToggle({ lang }: { lang: Lang }) {
  const toggle = useCallback(() => {
    const d = document.documentElement;
    const dark = d.classList.toggle('dark');
    try { localStorage.setItem('pvl-theme', dark ? 'dark' : 'light'); } catch { /* storage blocked: still works for this visit */ }
  }, []);
  const label = lang === 'bn' ? 'আলো/অন্ধকার থিম বদলান' : 'Switch light or dark theme';
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      <Icon name="moon" className="theme-ico-moon" />
      <Icon name="sun" className="theme-ico-sun" />
    </button>
  );
}

export function SceneToggle({ label }: { label: { pause: string; play: string } }) {
  const toggle = useCallback(() => {
    const d = document.documentElement;
    if (d.dataset.scene === 'paused') { delete d.dataset.scene; try { localStorage.removeItem('pvl-scene'); } catch { /* ignore */ } }
    else { d.dataset.scene = 'paused'; try { localStorage.setItem('pvl-scene', 'paused'); } catch { /* ignore */ } }
  }, []);
  return (
    <button type="button" className="icon-btn scene-toggle" onClick={toggle} aria-label={`${label.pause} / ${label.play}`} title={label.pause}>
      <Icon name="pause" className="p-pause" />
      <Icon name="play" className="p-play" />
    </button>
  );
}

export function ModeToggle({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<'teacher' | 'student'>('teacher');
  useEffect(() => {
    try { if (localStorage.getItem('primary_lab_mode') === 'student') setMode('student'); } catch { /* ignore */ }
  }, []);
  const pick = (m: 'teacher' | 'student') => {
    setMode(m);
    document.documentElement.dataset.mode = m;
    try { localStorage.setItem('primary_lab_mode', m); } catch { /* ignore */ }
  };
  const bn = lang === 'bn';
  return (
    <div className="mode-toggle" role="group" aria-label={bn ? 'দেখার ধরন' : 'Display style'}>
      <button type="button" aria-pressed={mode === 'teacher'} onClick={() => pick('teacher')}>{bn ? 'সাধারণ' : 'Compact'}</button>
      <button type="button" aria-pressed={mode === 'student'} onClick={() => pick('student')}>{bn ? 'খেলাচ্ছলে' : 'Playful'}</button>
    </div>
  );
}
