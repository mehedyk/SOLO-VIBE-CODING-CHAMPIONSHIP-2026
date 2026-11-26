'use client';

import React, { useState } from 'react';
import { NumberLineStep } from '../lib/math/numberline';

interface NumberLineProps {
  step?: NumberLineStep;
  width?: number;
  height?: number;
  interactive?: boolean;
  lang?: 'bn' | 'en';
  initialStart?: number;
  initialJump?: number;
  initialOp?: '+' | '−';
}

export function NumberLine({
  step: propStep,
  width = 720,
  height = 220,
  interactive = true,
  lang = 'bn',
  initialStart = 4,
  initialJump = 7,
  initialOp = '+',
}: NumberLineProps) {
  const [start, setStart] = useState<number>(initialStart);
  const [jump, setJump] = useState<number>(initialJump);
  const [op, setOp] = useState<'+' | '−'>(initialOp);

  const activeMin = propStep ? propStep.min : 0;
  const activeMax = propStep ? propStep.max : 20;
  const activeStart = propStep ? propStep.start : start;
  const activeJump = propStep ? propStep.jump : jump;
  const activeOp = propStep ? propStep.operation : op;
  const activeTarget = propStep
    ? propStep.target
    : activeOp === '+'
    ? Math.min(activeMax, activeStart + activeJump)
    : Math.max(activeMin, activeStart - activeJump);

  const lineY = 140;
  const paddingX = 55;
  const lineWidth = width - paddingX * 2;
  const totalTicks = activeMax - activeMin;
  const tickSpacing = lineWidth / totalTicks;

  const startX = paddingX + (activeStart - activeMin) * tickSpacing;
  const targetX = paddingX + (activeTarget - activeMin) * tickSpacing;

  // Jump arc control point
  const midX = (startX + targetX) / 2;
  const arcHeight = Math.min(85, Math.abs(targetX - startX) * 0.45 + 35);
  const arcY = lineY - arcHeight;

  return (
    <div className="number-line-container">
      {/* Interactive Controls when in self-interactive mode */}
      {interactive && !propStep && (
        <div className="numberline-interactive-controls">
          <div className="nl-control-item">
            <label>
              {lang === 'bn' ? 'শুরুর অবস্থান' : 'Start'}: <strong>{start}</strong>
              <input
                type="range"
                min={0}
                max={15}
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="nl-control-item">
            <label>
              {lang === 'bn' ? 'লাফের পরিমাণ' : 'Jump size'}: <strong>{jump}</strong>
              <input
                type="range"
                min={1}
                max={10}
                value={jump}
                onChange={(e) => setJump(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="nl-op-toggle">
            <button
              type="button"
              onClick={() => setOp('+')}
              className={`btn ${op === '+' ? 'primary' : 'ghost'}`}
            >
              {lang === 'bn' ? '+ ডানদিকে লাফ (যোগ)' : '+ Jump right (add)'}
            </button>
            <button
              type="button"
              onClick={() => setOp('−')}
              className={`btn ${op === '−' ? 'primary' : 'ghost'}`}
            >
              {lang === 'bn' ? '− বামদিকে পিছানো (বিয়োগ)' : '− Jump left (subtract)'}
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="numberline-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="number-line-svg select-none"
          role="img"
          aria-label="Interactive Number Line"
        >
          {/* Main horizontal axis line */}
          <line
            x1={paddingX - 15}
            y1={lineY}
            x2={width - paddingX + 15}
            y2={lineY}
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Axis arrows */}
          <polygon
            points={`${width - paddingX + 22},${lineY} ${width - paddingX + 10},${lineY - 6} ${width - paddingX + 10},${lineY + 6}`}
            fill="#94a3b8"
          />
          <polygon
            points={`${paddingX - 22},${lineY} ${paddingX - 10},${lineY - 6} ${paddingX - 10},${lineY + 6}`}
            fill="#94a3b8"
          />

          {/* Ticks and integer labels */}
          {Array.from({ length: totalTicks + 1 }).map((_, i) => {
            const val = activeMin + i;
            const x = paddingX + i * tickSpacing;
            const isMilestone = val === activeStart || val === activeTarget;

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={lineY - (isMilestone ? 10 : 6)}
                  x2={x}
                  y2={lineY + (isMilestone ? 10 : 6)}
                  stroke={isMilestone ? '#fbbf24' : '#64748b'}
                  strokeWidth={isMilestone ? '2.5' : '1.5'}
                />
                <text
                  x={x}
                  y={lineY + 28}
                  fill={isMilestone ? '#fbbf24' : '#94a3b8'}
                  fontSize={isMilestone ? '15' : '12'}
                  fontWeight={isMilestone ? '800' : '500'}
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Jump trajectory arc */}
          {activeStart !== activeTarget && (
            <path
              d={`M ${startX} ${lineY} Q ${midX} ${arcY} ${targetX} ${lineY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeDasharray="6 4"
              className="jump-arc-path"
            />
          )}

          {/* Start marker pin */}
          <circle cx={startX} cy={lineY} r="7" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />

          {/* Target marker flag/pin */}
          <circle cx={targetX} cy={lineY} r="8" fill="#34d399" stroke="#0f172a" strokeWidth="2.5" />

          {/* Delta Jump label */}
          {activeStart !== activeTarget && (
            <g>
              <rect
                x={midX - 24}
                y={arcY - 24}
                width="48"
                height="22"
                rx="6"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text
                x={midX}
                y={arcY - 9}
                fill="#38bdf8"
                fontSize="13"
                fontWeight="800"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
              >
                {activeOp === '+' ? `+${activeJump}` : `−${activeJump}`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Invariant Equation Display */}
      <div className="nl-equation-display">
        <span>
          {activeOp === '+'
            ? (lang === 'bn' ? `💡 সমীকরণ: ${activeStart} + ${activeJump} = ${activeTarget} (ডানদিকে ${activeJump} ঘর দূরত্বে লাফ)` : `💡 Equation: ${activeStart} + ${activeJump} = ${activeTarget} (jump ${activeJump} steps right)`)
            : (lang === 'bn' ? `💡 সমীকরণ: ${activeStart} − ${activeJump} = ${activeTarget} (বামদিকে ${activeJump} ঘর দূরত্বে পিছানো)` : `💡 Equation: ${activeStart} − ${activeJump} = ${activeTarget} (jump ${activeJump} steps left)`)}
        </span>
      </div>
    </div>
  );
}
