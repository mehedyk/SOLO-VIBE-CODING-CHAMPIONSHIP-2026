'use client';

import React, { useState } from 'react';
import { Lang } from '../lib/i18n/dict';
import { formatInt } from '../lib/math/numerals';

interface CountingDotsProps {
  lang: Lang;
  initialCount?: number;
}

export function CountingDots({ lang, initialCount = 7 }: CountingDotsProps) {
  const isBn = lang === 'bn';
  const [count, setCount] = useState<number>(initialCount);
  const [arrangedAsPairs, setArrangedAsPairs] = useState<boolean>(true);

  const increment = () => setCount((c) => Math.min(20, c + 1));
  const decrement = () => setCount((c) => Math.max(1, c - 1));

  const items = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="manipulative-card">
      <div className="manipulative-header">
        <div>
          <h3>{isBn ? 'ডট ও টোকেন গণনা (১ম শ্রেণি)' : 'Dot & Token Counter (Class 1)'}</h3>
          <p className="meta">
            {isBn
              ? 'বাস্তব বস্তু ও ডটের মাধ্যমে সংখ্যা গণনা, জোড়-বিজোড় ও পরিমাণের প্রত্যক্ষ রূপ।'
              : 'Concrete dot tokens representing countable units with pair-alignment.'}
          </p>
        </div>
        <div className="count-display-badge">
          <span>{isBn ? 'মোট সংখ্যা:' : 'Total:'}</span>
          <strong className="count-number">{formatInt(count, lang)}</strong>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="manipulative-controls">
        <button
          type="button"
          onClick={decrement}
          disabled={count <= 1}
          className="btn"
          aria-label="Decrease count"
        >
          − {isBn ? '১ কমাও' : 'Remove 1'}
        </button>
        <button
          type="button"
          onClick={increment}
          disabled={count >= 20}
          className="btn primary"
          aria-label="Increase count"
        >
          + {isBn ? '১ বাড়াও' : 'Add 1'}
        </button>
        <button
          type="button"
          onClick={() => setArrangedAsPairs(!arrangedAsPairs)}
          className="btn ghost"
        >
          {arrangedAsPairs
            ? isBn
              ? '🔄 সারিবদ্ধ বিন্যাস'
              : '🔄 Linear Order'
            : isBn
              ? '👥 জোড়ায় জোড়ায় বিন্যাস'
              : '👥 Paired Grid'}
        </button>
      </div>

      {/* Visual Token Board */}
      <div className={`dots-board ${arrangedAsPairs ? 'grid-pairs' : 'grid-linear'}`}>
        {items.map((num) => (
          <div
            key={num}
            className={`dot-token pop ${num % 2 === 0 ? 'even-token' : 'odd-token'}`}
          >
            <span className="dot-index">{formatInt(num, lang)}</span>
          </div>
        ))}
      </div>

      <div className="manipulative-footnote">
        <span>
          {isBn
            ? count % 2 === 0
              ? `✓ ${formatInt(count, lang)} একটি জোড় সংখ্যা (প্রতিটি ডটের একটি সঙ্গী আছে)।`
              : `✓ ${formatInt(count, lang)} একটি বিজোড় সংখ্যা (১টি ডটের কোনো সঙ্গী নেই)।`
            : count % 2 === 0
              ? `✓ ${count} is an Even number (every token has a complete pair).`
              : `✓ ${count} is an Odd number (one token is left without a partner).`}
        </span>
      </div>
    </div>
  );
}
