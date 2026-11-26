'use client';

import React, { useState } from 'react';
import { Lang } from '../lib/i18n/dict';
import { formatInt } from '../lib/math/numerals';

type ShapeType = 'square' | 'triangle' | 'rectangle';

interface GeoboardProps {
  lang: Lang;
  initialShape?: ShapeType;
}

export function GeoboardShapes({ lang, initialShape = 'rectangle' }: GeoboardProps) {
  const isBn = lang === 'bn';
  const [shape, setShape] = useState<ShapeType>(initialShape);

  const shapes = {
    square: {
      nameBn: 'বর্গক্ষেত্র (৪ বাহু সমান, ৪ সমকোণ)',
      nameEn: 'Square (4 Equal Sides, 4 Right Angles)',
      path: 'M 60,60 L 180,60 L 180,180 L 60,180 Z',
      area: 4,
      perimeter: 8,
    },
    rectangle: {
      nameBn: 'আয়তক্ষেত্র (বিপরীত বাহু সমান, ৪ সমকোণ)',
      nameEn: 'Rectangle (Opposite Sides Equal, 4 Right Angles)',
      path: 'M 30,60 L 210,60 L 210,180 L 30,180 Z',
      area: 6,
      perimeter: 10,
    },
    triangle: {
      nameBn: 'সমকোণী ত্রিভুজ (১ সমকোণ = ৯০°)',
      nameEn: 'Right-Angled Triangle (1 Right Angle = 90°)',
      path: 'M 60,60 L 180,180 L 60,180 Z',
      area: 2,
      perimeter: 7,
    },
  };

  const cur = shapes[shape];

  // 5x5 pegs
  const pegs: Array<{ x: number; y: number }> = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      pegs.push({ x: 30 + c * 45, y: 30 + r * 45 });
    }
  }

  return (
    <div className="manipulative-card">
      <div className="manipulative-header">
        <div>
          <h3>{isBn ? 'ইন্টারঅ্যাক্টিভ জিওবোর্ড ও কোণ (৩য়-৫ম শ্রেণি)' : 'Interactive Geoboard & Polygons (Class 3-5)'}</h3>
          <p className="meta">
            {isBn
              ? 'বিন্দু ও রেখাংশ যুক্ত করে বিভিন্ন জ্যামিতিক আকৃতি, সমকোণ, পরিসীমা ও ক্ষেত্রফল নির্ণয়।'
              : 'Pegboard array with rubber-band polygons to explore vertices, perimeter, and area.'}
          </p>
        </div>
        <div className="count-display-badge">
          <div>
            <span>{isBn ? 'ক্ষেত্রফল:' : 'Area:'}</span>{' '}
            <strong className="count-number" style={{ color: '#34d399' }}>
              {formatInt(cur.area, lang)} {isBn ? 'বর্গ একক' : 'sq units'}
            </strong>
          </div>
          <div>
            <span>{isBn ? 'পরিসীমা:' : 'Perimeter:'}</span>{' '}
            <strong className="count-number" style={{ color: '#fbbf24' }}>
              {formatInt(cur.perimeter, lang)} {isBn ? 'একক' : 'units'}
            </strong>
          </div>
        </div>
      </div>

      {/* Shape Selector Controls */}
      <div className="manipulative-controls">
        <button
          type="button"
          onClick={() => setShape('square')}
          className={`btn ${shape === 'square' ? 'primary' : ''}`}
        >
          {isBn ? '🟦 বর্গক্ষেত্র' : '🟦 Square'}
        </button>
        <button
          type="button"
          onClick={() => setShape('rectangle')}
          className={`btn ${shape === 'rectangle' ? 'primary' : ''}`}
        >
          {isBn ? '▬ আয়তক্ষেত্র' : '▬ Rectangle'}
        </button>
        <button
          type="button"
          onClick={() => setShape('triangle')}
          className={`btn ${shape === 'triangle' ? 'primary' : ''}`}
        >
          {isBn ? '▲ সমকোণী ত্রিভুজ' : '▲ Triangle'}
        </button>
      </div>

      {/* SVG Geoboard */}
      <div className="geoboard-svg-wrap">
        <svg
          viewBox="0 0 240 240"
          className="geoboard-svg"
          aria-label="Geoboard Pegs and Shape"
        >
          {/* Peg Grid background lines */}
          <rect x="10" y="10" width="220" height="220" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />

          {/* Polygon Band Shape */}
          <path
            d={cur.path}
            fill="rgba(56, 189, 248, 0.25)"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* 5x5 Pins */}
          {pegs.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#fbbf24"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className="manipulative-footnote">
        <span>
          {isBn ? `📐 বৈশিষ্ট্য: ${cur.nameBn}` : `📐 Properties: ${cur.nameEn}`}
        </span>
      </div>
    </div>
  );
}
