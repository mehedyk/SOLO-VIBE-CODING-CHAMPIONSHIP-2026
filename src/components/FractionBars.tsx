'use client';

import React from 'react';
import { FractionStep } from '../lib/math/fractions';

interface FractionBarsProps {
  step: FractionStep;
  width?: number;
  height?: number;
}

export function FractionBars({ step, width = 600, height = 220 }: FractionBarsProps) {
  const barWidth = width - 120;
  const barHeight = 44;
  const startX = 80;

  return (
    <div className="fraction-bars-container flex flex-col items-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-2xl select-none"
        role="img"
        aria-label="Fraction comparison bars"
      >
        {step.bars.map((bar, idx) => {
          const y = 30 + idx * 80;
          const segmentWidth = barWidth / bar.denominator;

          return (
            <g key={idx} className="fraction-bar-group">
              {/* Fraction label */}
              <text
                x={startX - 15}
                y={y + barHeight / 2 + 6}
                fill="#f8fafc"
                fontSize="18"
                fontWeight="bold"
                textAnchor="end"
              >
                {bar.label}
              </text>

              {/* Background whole bar */}
              <rect
                x={startX}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                rx="6"
              />

              {/* Shaded segments */}
              {Array.from({ length: bar.shaded }).map((_, segIdx) => (
                <rect
                  key={segIdx}
                  x={startX + segIdx * segmentWidth}
                  y={y}
                  width={segmentWidth}
                  height={barHeight}
                  fill={bar.color}
                  opacity="0.85"
                  rx={segIdx === 0 && bar.shaded === 1 ? '6' : segIdx === 0 ? '6 0 0 6' : segIdx === bar.denominator - 1 ? '0 6 6 0' : '0'}
                />
              ))}

              {/* Partition divider lines */}
              {Array.from({ length: bar.denominator - 1 }).map((_, divIdx) => (
                <line
                  key={divIdx}
                  x1={startX + (divIdx + 1) * segmentWidth}
                  y1={y}
                  x2={startX + (divIdx + 1) * segmentWidth}
                  y2={y + barHeight}
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray={step.kind === 'initial' ? '4 4' : 'none'}
                />
              ))}
            </g>
          );
        })}
      </svg>

      <div className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-slate-200 text-sm font-medium text-center">
        {step.noteBn}
      </div>
    </div>
  );
}
