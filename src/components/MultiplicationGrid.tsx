'use client';

import React, { useState } from 'react';
import { Lang } from '../lib/i18n/dict';
import { formatInt } from '../lib/math/numerals';

interface MultiplicationGridProps {
  lang: Lang;
  initialRows?: number;
  initialCols?: number;
}

export function MultiplicationGrid({
  lang,
  initialRows = 4,
  initialCols = 6,
}: MultiplicationGridProps) {
  const isBn = lang === 'bn';
  const [rows, setRows] = useState<number>(initialRows);
  const [cols, setCols] = useState<number>(initialCols);

  const product = rows * cols;

  return (
    <div className="manipulative-card">
      <div className="manipulative-header">
        <div>
          <h3>{isBn ? 'নামতা ও আয়তাকার গুণন ম্যাট্রিক্স (২য়-৩য় শ্রেণি)' : 'Multiplication Array Matrix (Class 2-3)'}</h3>
          <p className="meta">
            {isBn
              ? 'গুণ মানে সারি ও কলামের বারবার যোগফল। গ্রিডের প্রতিটি ব্লক একত্রিত ক্ষেত্রফল গঠন করে।'
              : 'Multiplication as an array area model: rows × columns = total discrete units.'}
          </p>
        </div>
        <div className="count-display-badge">
          <span>{isBn ? 'গুণফল:' : 'Product:'}</span>
          <strong className="count-number">
            {formatInt(rows, lang)} × {formatInt(cols, lang)} = {formatInt(product, lang)}
          </strong>
        </div>
      </div>

      {/* Row and Col Sliders */}
      <div className="array-controls-grid">
        <div className="slider-box">
          <label htmlFor="rows-range">
            {isBn ? 'সারি (Rows):' : 'Rows:'} <strong>{formatInt(rows, lang)}</strong>
          </label>
          <input
            id="rows-range"
            type="range"
            min={1}
            max={10}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
        </div>

        <div className="slider-box">
          <label htmlFor="cols-range">
            {isBn ? 'কলাম (Columns):' : 'Columns:'} <strong>{formatInt(cols, lang)}</strong>
          </label>
          <input
            id="cols-range"
            type="range"
            min={1}
            max={10}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Visual Array Grid */}
      <div className="array-grid-container">
        <div
          className="array-visual-grid"
          style={{
            gridTemplateRows: `repeat(${rows}, 32px)`,
            gridTemplateColumns: `repeat(${cols}, 32px)`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((__, c) => {
              const cellNum = r * cols + c + 1;
              return (
                <div
                  key={`${r}-${c}`}
                  className="array-cell pop"
                  title={`${r + 1} × ${c + 1}`}
                >
                  <span className="array-cell-index">{formatInt(cellNum, lang)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="manipulative-footnote">
        <span>
          {isBn
            ? `💡 পুনরাবৃত্তিমূলক যোগ: ${Array.from({ length: rows })
                .map(() => formatInt(cols, lang))
                .join(' + ')} = ${formatInt(product, lang)}`
            : `💡 Repeated Addition: ${Array.from({ length: rows })
                .map(() => cols)
                .join(' + ')} = ${product}`}
        </span>
      </div>
    </div>
  );
}
