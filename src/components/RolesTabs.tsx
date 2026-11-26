'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import Icon from './Icon';
import { site } from '../lib/i18n/site';
import type { Lang } from '../lib/i18n/dict';

export default function RolesTabs({ lang }: { lang: Lang }) {
  const s = site[lang];
  const [i, setI] = useState(0);
  const id = useId();
  const item = s.roles.items[i]!;
  const selfServe = item.key === 'student' || item.key === 'teacher';

  const onKey = (e: React.KeyboardEvent) => {
    const n = s.roles.items.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setI((i + 1) % n); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setI((i - 1 + n) % n); }
  };

  return (
    <div className="roles">
      <div className="role-tabs" role="tablist" aria-orientation="vertical" onKeyDown={onKey}>
        {s.roles.items.map((r, k) => (
          <button key={r.key} role="tab" id={`${id}-t${k}`} aria-selected={i === k} aria-controls={`${id}-p`} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)}>{r.name}</button>
        ))}
      </div>
      <div className="role-pane" role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${i}`}>
        <h3>{item.headline}</h3>
        <ul>{item.points.map((p) => <li key={p}>{p}</li>)}</ul>
        {selfServe ? (
          <Link className="btn btn-navy btn-sm" href={`/${lang}/signup?role=${item.key}`}>{s.nav.signup}<Icon name="right" /></Link>
        ) : (
          <p className="field-hint">{lang === 'bn' ? 'আবেদনের মাধ্যমে যুক্ত হতে হয়।' : 'Joined by application.'}</p>
        )}
      </div>
    </div>
  );
}
