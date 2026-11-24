'use client';

import React from 'react';
import { NumberLineStep } from '../lib/math/numberline';

interface NumberLineProps {
  step: NumberLineStep;
  width?: number;
  height?: number;
}

export function NumberLine({ step, width = 700, height = 200 }: NumberLineProps) {
  const lineY = 120;
  const paddingX = 50;
  const lineWidth = width - paddingX * 2;
  const totalTicks = step.max - step.min;
  const tickSpacing = lineWidth / totalTicks;

  const startX = paddingX + (step.start - step.min) * tickSpacing;
  const targetX = paddingX + (step.target - step.min) * tickSpacing;

  // Jump arc control point
  const midX = (startX + targetX) / 2;
  const arcHeight = Math.min(80, Math.abs(targetX - startX) * 0.45 + 30);
  const arcY = lineY - arcHeight;

  return (
    <div className="number-line-container flex flex-col items-center p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-2xl select-none"
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
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Axis arrows */}
        <polygon
          points={`${width - paddingX + 22},${lineY} ${width - paddingX + 12},${lineY - 6} ${width - paddingX + 12},${lineY + 6}`}
          fill="#94a3b8"
        />
        <polygon
          points={`${paddingX - 22},${lineY} ${paddingX - 12},${lineY - 6} ${paddingX - 12},${lineY + 6}`}
          fill="#94a3b8"
        />

        {/* Ticks and number labels */}
        {Array.from({ length: totalTicks + 1 }).map((_, i) => {
          const val = step.min + i;
          const x = paddingX + i * tickSpacing;
          const isKey = val === step.start || val === step.target;

          return (
            <g key={val}>
              <line
                x1={x}
                y1={lineY - (isKey ? 10 : 6)}
                x2={x}
                y2={lineY + (isKey ? 10 : 6)}
                stroke={isKey ? '#38bdf8' : '#64748b'}
                strokeWidth={isKey ? '3' : '1.5'}
              />
              <text
                x={x}
                y={lineY + 28}
                fill={isKey ? '#38bdf8' : '#cbd5e1'}
                fontSize={isKey ? '15' : '12'}
                fontWeight={isKey ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Jump Arc */}
        {step.kind !== 'start' && (
          <g>
            <path
              d={`M ${startX} ${lineY} Q ${midX} ${arcY} ${targetX} ${lineY}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeDasharray={step.kind === 'jump' ? '6 6' : 'none'}
            />
            {/* Jump label */}
            <rect
              x={midX - 22}
              y={arcY - 22}
              width="44"
              height="24"
              rx="4"
              fill="#fbbf24"
            />
            <text
              x={midX}
              y={arcY - 6}
              fill="#0f172a"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {step.operation}{step.jump}
            </text>
          </g>
        )}

        {/* Start Position Marker */}
        <circle cx={startX} cy={lineY} r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />

        {/* Current / Result Marker */}
        {step.kind === 'result' && (
          <circle cx={targetX} cy={lineY} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        )}
      </svg>

      <div className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-slate-200 text-sm font-medium text-center">
        {step.noteBn}
      </div>
    </div>
  );
}
