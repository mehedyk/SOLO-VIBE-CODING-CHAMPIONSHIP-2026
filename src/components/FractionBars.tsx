'use client';

import React, { useState } from 'react';
import { FractionStep } from '../lib/math/fractions';

interface FractionBarsProps {
  step?: FractionStep;
  width?: number;
  height?: number;
  interactive?: boolean;
}

export function FractionBars({
  step: propStep,
  width = 680,
  height = 240,
  interactive = true,
}: FractionBarsProps) {
  const [num1, setNum1] = useState(1);
  const [den1, setDen1] = useState(2);
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(4);

  const isEquivalent = propStep ? propStep.equivalent : num1 * den2 === num2 * den1;

  const currentBars = propStep
    ? propStep.bars
    : [
        { numerator: num1, denominator: den1, shaded: num1, color: '#38bdf8', label: `${num1}/${den1}` },
        { numerator: num2, denominator: den2, shaded: num2, color: isEquivalent ? '#34d399' : '#fbbf24', label: `${num2}/${den2}` },
      ];

  const barWidth = width - 140;
  const barHeight = 46;
  const startX = 90;

  return (
    <div className="fraction-bars-container">
      {/* Interactive Sliders when in interactive mode */}
      {interactive && !propStep && (
        <div className="fraction-interactive-controls">
          <div className="fraction-control-group">
            <span className="fraction-group-title" style={{ color: '#38bdf8' }}>
              প্রথম ভগ্নাংশ (Fraction 1):
            </span>
            <div className="fraction-inputs-row">
              <label>
                লব: <strong>{num1}</strong>
                <input
                  type="range"
                  min={1}
                  max={den1}
                  value={num1}
                  onChange={(e) => setNum1(Number(e.target.value))}
                />
              </label>
              <label>
                হর: <strong>{den1}</strong>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={den1}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setDen1(d);
                    if (num1 > d) setNum1(d);
                  }}
                />
              </label>
            </div>
          </div>

          <div className="fraction-control-group">
            <span className="fraction-group-title" style={{ color: isEquivalent ? '#34d399' : '#fbbf24' }}>
              দ্বিতীয় ভগ্নাংশ (Fraction 2):
            </span>
            <div className="fraction-inputs-row">
              <label>
                লব: <strong>{num2}</strong>
                <input
                  type="range"
                  min={1}
                  max={den2}
                  value={num2}
                  onChange={(e) => setNum2(Number(e.target.value))}
                />
              </label>
              <label>
                হর: <strong>{den2}</strong>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={den2}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setDen2(d);
                    if (num2 > d) setNum2(d);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="fraction-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="fraction-bars-svg select-none"
          role="img"
          aria-label="Fraction comparison bars"
        >
          {currentBars.map((bar, idx) => {
            const y = 35 + idx * 95;
            const segmentWidth = barWidth / bar.denominator;
            const shadedWidth = segmentWidth * bar.shaded;

            return (
              <g key={idx} className="fraction-bar-group">
                {/* Fraction label */}
                <text
                  x={startX - 18}
                  y={y + barHeight / 2 + 7}
                  fill="#f8fafc"
                  fontSize="20"
                  fontWeight="800"
                  textAnchor="end"
                  fontFamily="system-ui, sans-serif"
                >
                  {bar.label}
                </text>

                {/* Background whole bar */}
                <rect
                  x={startX}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="2.5"
                  rx="8"
                />

                {/* Shaded portion */}
                <rect
                  x={startX}
                  y={y}
                  width={shadedWidth}
                  height={barHeight}
                  fill={bar.color}
                  opacity="0.88"
                  rx="6"
                  className="fraction-fill-rect"
                />

                {/* Partition grid lines */}
                {Array.from({ length: bar.denominator - 1 }).map((_, divIdx) => {
                  const lineX = startX + (divIdx + 1) * segmentWidth;
                  return (
                    <line
                      key={divIdx}
                      x1={lineX}
                      y1={y}
                      x2={lineX}
                      y2={y + barHeight}
                      stroke="#475569"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {/* Border outline */}
                <rect
                  x={startX}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  rx="8"
                />
              </g>
            );
          })}

          {/* Equivalence alignment vertical guideline */}
          {currentBars[0] && currentBars[1] && (
            <line
              x1={startX + (barWidth / currentBars[0].denominator) * currentBars[0].shaded}
              y1={20}
              x2={startX + (barWidth / currentBars[0].denominator) * currentBars[0].shaded}
              y2={height - 20}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          )}
        </svg>
      </div>

      {/* Result feedback */}
      <div className={`fraction-feedback-banner ${isEquivalent ? 'equiv-ok' : 'equiv-no'}`}>
        <span>
          {isEquivalent
            ? `✓ সমতুল্য প্রমাণ: ${currentBars[0]?.label} = ${currentBars[1]?.label} (উভয় ভগ্নাংশ একই দৈর্ঘ্য নির্দেশ করে)`
            : `≠ অসমান: ${currentBars[0]?.label} এবং ${currentBars[1]?.label} এর দৈর্ঘ্য এক নয়`}
        </span>
      </div>
    </div>
  );
}
