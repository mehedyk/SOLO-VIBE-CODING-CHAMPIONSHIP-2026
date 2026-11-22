import type { Step, Cols } from "../lib/math/subtraction";
import { dict, fill, unitName, type Lang } from "../lib/i18n/dict";
import { formatInt } from "../lib/math/numerals";

interface Props { step: Step; prev?: Step; lang: Lang }

const COL_ORDER = [2, 1, 0] as const; // hundreds | tens | ones, left to right
const COL_W = 250;
const COLORS = ["#fbbf24", "#34d399", "#60a5fa"] as const; // ones, tens, hundreds

function Blocks({ place, n, prevN, ghost }: { place: 0 | 1 | 2; n: number; prevN: number; ghost: boolean }) {
  const out: React.ReactNode[] = [];
  const color = COLORS[place];
  for (let i = 0; i < n; i++) {
    let x: number, y: number, w: number, h: number;
    if (place === 0) { const col = i % 5, row = Math.floor(i / 5); x = col * 26; y = row * 26; w = 20; h = 20; }
    else if (place === 1) { const col = i % 10, row = Math.floor(i / 10); x = col * 18; y = row * 66; w = 12; h = 56; }
    else { const col = i % 4, row = Math.floor(i / 4); x = col * 50; y = row * 50; w = 44; h = 44; }
    out.push(
      <rect
        key={i} x={x} y={y} width={w} height={h} rx={3}
        className={!ghost && i >= prevN ? "blk pop" : "blk"}
        fill={ghost ? "none" : color}
        stroke={ghost ? "#64748b" : "#0f2a43"}
        strokeWidth={ghost ? 1.5 : 1}
        strokeDasharray={ghost ? "4 3" : undefined}
      />,
    );
  }
  return <>{out}</>;
}

export function boardDescription(step: Step, lang: Lang): string {
  const d = dict[lang];
  const f = (n: number) => formatInt(n, lang);
  return fill(d.boardDesc, {
    h: f(step.counts[2]), t: f(step.counts[1]), o: f(step.counts[0]),
    rh: f(step.removed[2]), rt: f(step.removed[1]), ro: f(step.removed[0]),
  });
}

export default function Board({ step, prev, lang }: Props) {
  const d = dict[lang];
  const prevCounts: Cols = prev?.counts ?? step.counts;
  const title = d.lessonTitle;
  const desc = boardDescription(step, lang);
  return (
    <div className="boardwrap" tabIndex={0} role="region" aria-label={title}>
    <svg viewBox="0 0 770 468" role="img" aria-labelledby="board-title board-desc" className="board">
      <title id="board-title">{title}</title>
      <desc id="board-desc">{desc}</desc>
      {COL_ORDER.map((p, di) => {
        const x0 = 10 + di * COL_W;
        const active = step.place === p || step.from === p;
        return (
          <g key={p} transform={`translate(${x0},38)`}>
            <rect x={0} y={30} width={230} height={220} rx={10} className={active ? "panel active" : "panel"} />
            <text x={115} y={20} textAnchor="middle" className="col-title">
              {fill(d.colLabel, { unit: unitName(p, lang) })}
            </text>
            <text x={218} y={52} textAnchor="end" className="count">{formatInt(step.counts[p], lang)}</text>
            <g transform="translate(16,62)">
              <Blocks place={p} n={step.counts[p]} prevN={prevCounts[p]} ghost={false} />
            </g>
            <rect x={0} y={262} width={230} height={150} rx={10} className="panel removed" />
            <text x={10} y={282} className="small">{d.removedLabel}</text>
            <text x={218} y={282} textAnchor="end" className="count small">{formatInt(step.removed[p], lang)}</text>
            <g transform="translate(16,292) scale(0.62)">
              <Blocks place={p} n={step.removed[p]} prevN={0} ghost />
            </g>
          </g>
        );
      })}
      {step.kind === "exchange" && step.from !== undefined && step.place !== undefined && (() => {
        const fx = 10 + COL_ORDER.indexOf(step.from as 0 | 1 | 2) * COL_W + 115;
        const tx = 10 + COL_ORDER.indexOf((step.from - 1) as 0 | 1 | 2) * COL_W + 115;
        return (
          <g aria-hidden="true">
            <path d={`M${fx},36 C${fx},6 ${tx},6 ${tx},36`} fill="none" stroke="#0f2a43" strokeWidth={3} markerEnd="url(#arr)" />
            <text x={(fx + tx) / 2} y={24} textAnchor="middle" className="xchg" paintOrder="stroke" stroke="#f6f8fb" strokeWidth={6}>
              {formatInt(1, lang)} → {formatInt(10, lang)}
            </text>
          </g>
        );
      })()}
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0f2a43" />
        </marker>
      </defs>
    </svg>
    </div>
  );
}
