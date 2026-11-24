'use client';

import React, { useState } from 'react';
import { Lang } from '../lib/i18n/dict';
import { formatInt } from '../lib/math/numerals';

interface DecimalsGridProps {
  lang: Lang;
  initialFilled?: number;
}

export function DecimalsGrid({ lang, initialFilled = 65 }: DecimalsGridProps) {
  const isBn = lang === 'bn';
  const [filled, setFilled] = useState<number>(initialFilled);

  const decimalVal = (filled / 100).toFixed(2);
  const percentage = filled;

  return (
    <div className="manipulative-card">
      <div className="manipulative-header">
        <div>
          <h3>{isBn ? 'দশমিক ও শতকরা ১০০-ঘরের গ্রিড (৪র্থ-৫ম শ্রেণি)' : 'Decimals & Percentages 100-Grid (Class 4-5)'}</h3>
          <p className="meta">
            {isBn
              ? '১০০টি সমান ঘরের মধ্যে অংশ নির্বাচন করে দশমিক (০.০১-১.০০) এবং শতকরা (১%-১০০%) অনুধাবন।'
              : 'A 100-square grid linking fractions (n/100), decimals (0.nn), and percentages (nn%).'}
          </p>
        </div>

        <div className="count-display-badge">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
            <div>
              <span>{isBn ? 'দশমিক:' : 'Decimal:'}</span>{' '}
              <strong className="count-number" style={{ color: '#38bdf8' }}>
                {isBn ? decimalVal.replace(/\./g, '.') : decimalVal}
              </strong>
            </div>
            <div>
              <span>{isBn ? 'শতকরা:' : 'Percent:'}</span>{' '}
              <strong className="count-number" style={{ color: '#34d399' }}>
                {formatInt(percentage, lang)}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="array-controls-grid">
        <div className="slider-box" style={{ width: '100%' }}>
          <label htmlFor="fill-range">
            {isBn ? '১০০-র মধ্যে নির্বাচিত ঘর:' : 'Selected units out of 100:'}{' '}
            <strong>{formatInt(filled, lang)} / ১০০</strong>
          </label>
          <input
            id="fill-range"
            type="range"
            min={0}
            max={100}
            value={filled}
            onChange={(e) => setFilled(Number(e.target.value))}
          />
        </div>
      </div>

      {/* 10x10 Hundred-Grid */}
      <div className="hundred-grid-wrap">
        <div className="hundred-grid">
          {Array.from({ length: 100 }).map((_, idx) => {
            const isFilled = idx < filled;
            return (
              <div
                key={idx}
                className={`hundred-cell ${isFilled ? 'active' : ''}`}
                onClick={() => setFilled(idx + 1)}
                title={`Unit ${idx + 1} of 100`}
              />
            );
          })}
        </div>
      </div>

      <div className="manipulative-footnote">
        <span>
          {isBn
            ? `📊 সম্পর্ক: ${formatInt(filled, lang)}/১০০ (ভগ্নাংশ) = ${decimalVal} (দশমিক) = ${formatInt(percentage, lang)}% (শতকরা)`
            : `📊 Identity: ${filled}/100 (fraction) = ${decimalVal} (decimal) = ${percentage}% (percentage)`}
        </span>
      </div>
    </div>
  );
}
