'use client';

import { useState } from 'react';
import { site } from '../lib/i18n/site';
import { formatInt } from '../lib/math/numerals';
import type { Lang } from '../lib/i18n/dict';

/** The one idea the whole product teaches, playable in the hero: break a ten into ones to compute 52 − 27. */
export default function TenBreaker({ lang }: { lang: Lang }) {
  const s = site[lang].breaker;
  const [broken, setBroken] = useState(false);
  const n = (x: number) => formatInt(x, lang);
  const tens = broken ? 4 : 5;
  const ones = broken ? 12 : 2;
  const bn = lang === 'bn';

  return (
    <section className="breaker" aria-labelledby="breaker-h">
      <h2 id="breaker-h">{s.title}</h2>
      <p className="breaker-eq" aria-hidden="true">{n(52)} − {n(27)}</p>
      <div className="breaker-cols">
        <div className="bcol">
          <small>{s.col1} · {n(tens)}</small>
          <div className="bcol-items" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`rod${broken && i === 4 ? ' leaving' : ''}`} />)}
          </div>
        </div>
        <div className={`bcol${broken ? ' active' : ''}`}>
          <small>{s.col2} · {n(ones)}</small>
          <div className="bcol-items" aria-hidden="true">
            {Array.from({ length: ones }, (_, i) => <span key={i} className="unit" style={{ animationDelay: broken && i >= 2 ? `${(i - 2) * 45}ms` : '0ms' }} />)}
          </div>
        </div>
      </div>
      <p className="breaker-note" role="status">
        {broken ? s.note1 : s.note0}
        <span className="sr-only">{bn ? ` এখন ${n(tens)}টি দশক ও ${n(ones)}টি একক।` : ` Now ${tens} tens and ${ones} ones.`}</span>
      </p>
      <div className="breaker-actions">
        {!broken ? (
          <button type="button" className="btn btn-amber btn-sm" onClick={() => setBroken(true)}>{s.btn}</button>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setBroken(false)}>{s.reset}</button>
        )}
      </div>
    </section>
  );
}
