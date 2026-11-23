"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Board from "./Board";
import { digitsOf, valueOf } from "../lib/math/subtraction";
import { needsPrediction } from "../lib/math/prediction";
import { ENGINES, type Engine } from "../lib/lessons/engines";
import { findLesson } from "../lib/lessons/registry";
import type { BoardStep } from "../lib/math/board";
import { formatInt } from "../lib/math/numerals";
import { dict, fill, noteText, unitName, type Lang } from "../lib/i18n/dict";

type Mode = "student" | "present";
type Place = 0 | 1 | 2;

export default function LessonLab({ lang, mode, slug }: { lang: Lang; mode: Mode; slug: string }) {
  const d = dict[lang];
  const meta = findLesson(slug);
  if (!meta) throw new Error("unknown lesson");
  const eng = ENGINES[meta.kind];
  const K = eng.keys;
  const f = (n: number) => formatInt(n, lang);
  const rootRef = useRef<HTMLDivElement>(null);

  const [mStr, setMStr] = useState(String(eng.defaults[0]));
  const [sStr, setSStr] = useState(String(eng.defaults[1]));
  const [nums, setNums] = useState({ m: eng.defaults[0], s: eng.defaults[1] });
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [ask, setAsk] = useState<Place | null>(null);
  const [pred, setPred] = useState<{ choice: boolean; correct: boolean } | null>(null);
  const [view, setView] = useState<"board" | "text">("board");
  const [reduce, setReduce] = useState(false);
  const [notes, setNotes] = useState(mode === "present" ? false : true);
  const [full, setFull] = useState(false);

  const check = useMemo(() => eng.checkInputs(mStr, sStr), [eng, mStr, sStr]);
  const steps = useMemo<BoardStep[]>(() => eng.build(nums.m, nums.s), [eng, nums]);
    const step = steps[idx]!;
  const prev = idx > 0 ? steps[idx - 1] : undefined;

  const resetFlow = useCallback(() => { setIdx(0); setDone(new Set()); setAsk(null); setPred(null); }, []);

  useEffect(() => {
    if (check.ok && (check.m !== nums.m || check.s !== nums.s)) { setNums({ m: check.m, s: check.s }); resetFlow(); }
  }, [check, nums, resetFlow]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const goNext = useCallback(() => {
    if (ask !== null || idx >= steps.length - 1) return;
    const nxt = idx + 1;
    if (needsPrediction(steps, nxt, done)) { setAsk(steps[nxt]!.place as Place); setPred(null); return; }
    setIdx(nxt);
  }, [ask, idx, steps, done]);

  const goPrev = useCallback(() => {
    if (ask !== null) { setAsk(null); setPred(null); return; } // Previous cancels an open prediction
    setIdx((i) => Math.max(0, i - 1));
  }, [ask]);

  const finishPrediction = () => {
    if (ask === null) return;
    setDone((s) => new Set(s).add(ask));
    setAsk(null); setPred(null); setIdx((i) => i + 1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  };

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen?.();
  };

  const err = (field: "m" | "s") => (!check.ok && check.field === field ? d[`err_${check.code}` as const] : null);
  const note = noteText(step.note, lang);
  const boardValue = valueOf(step.counts);
  const sideValue = valueOf(step.side);
  const askPlace = ask;
  const boardBefore = steps[idx]!.counts;
  const pr = askPlace === null ? null : eng.prediction(nums.m, nums.s, boardBefore, askPlace);
  const why = pr === null ? "" : fill(pr.expectedYes ? d[K.predWhyYes] : d[K.predWhyNo], { c: f(pr.c), s: f(pr.s), t: f(pr.t) });

  return (
    <div ref={rootRef} className={`lab ${mode}`} data-motion={reduce ? "reduce" : "full"} onKeyDown={onKey}>
      <header className="lab-head">
        <div>
          <h1>{d[K.title]}</h1>
          <p className="meta">{d[K.objective]}</p>
          <p className="meta">{d[K.prerequisite]}</p>
          <p className="meta">{d.sourceDemo}</p>
        </div>
        <span className="badge" role="status">{d.reviewStatus}</span>
      </header>

      <section className="inputs" aria-label={d[K.rangeHint]}>
        {(["m", "s"] as const).map((k) => (
          <div key={k} className="field">
            <label htmlFor={`in-${k}`}>{k === "m" ? d[K.aLabel] : d[K.bLabel]}</label>
            <input
              id={`in-${k}`} inputMode="numeric" autoComplete="off" maxLength={12}
              value={k === "m" ? mStr : sStr}
              onChange={(e) => (k === "m" ? setMStr(e.target.value) : setSStr(e.target.value))}
              aria-invalid={err(k) ? true : undefined} aria-describedby={`hint-${k}`}
            />
            <p id={`hint-${k}`} className={err(k) ? "error" : "hint"} role={err(k) ? "alert" : undefined}>{err(k) ?? d[K.rangeHint]}</p>
          </div>
        ))}
      </section>

      <div className="stage">
        <div className="visual">
          <p className="stepno" aria-live="off">{fill(d.stepOf, { i: f(idx + 1), n: f(steps.length) })}</p>
          {view === "board" ? (
            <Board step={step} prev={prev} lang={lang} title={d[K.title]} sideLabel={d[K.sideLabel]} />
          ) : (
            <section aria-labelledby="text-steps">
              <h2 id="text-steps">{d.textStepsTitle}</h2>
              <ol className="textsteps">
                {steps.slice(0, idx + 1).map((s, i) => (
                  <li key={i} aria-current={i === idx ? "step" : undefined} className={i === idx ? "cur" : ""}>{noteText(s.note, lang)}</li>
                ))}
              </ol>
            </section>
          )}
          <p className="valuecheck">{fill(d[K.valueCheck], { a: f(boardValue), b: f(sideValue), m: f(eng.kind === "addition" ? nums.m + nums.s : nums.m) })}</p>
        </div>

        <aside className="side">
          {ask !== null ? (
            <section className="predict" aria-labelledby="pred-h">
              <h2 id="pred-h">{d.predHeading}</h2>
              <p>{fill(d[K.predQ], { unit: unitName(ask, lang), c: f(pr!.c), s: f(pr!.s) })}</p>
              {pred === null ? (
                <div className="row">
                  <button onClick={() => setPred({ choice: true, correct: pr!.expectedYes })}>{d[K.predYes]}</button>
                  <button onClick={() => setPred({ choice: false, correct: !pr!.expectedYes })}>{d[K.predNo]}</button>
                </div>
              ) : (
                <p role="status" className={pred.correct ? "ok" : "bad"}>
                  {fill(pred.correct ? d.predRight : d.predWrong, { why })}
                </p>
              )}
              <div className="row">
                {pred !== null && <button className="primary" onClick={finishPrediction}>{d.predContinue}</button>}
                {mode === "present" && pred === null && <button className="ghost" onClick={finishPrediction}>{d.predSkip}</button>}
              </div>
            </section>
          ) : (
            <section aria-labelledby="exp-h">
              <h2 id="exp-h">{d.teacherTitle}</h2>
              <p className="note">{note}</p>
            </section>
          )}

          <section aria-labelledby="wr-h">
            <h2 id="wr-h">{d.writtenTitle}</h2>
            <table className="written">
              <thead><tr><td className="corner"></td>{[2, 1, 0].map((p) => <th key={p} scope="col">{unitName(p, lang)}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row" className="rowh">{d.rowBoard}</th>{[2, 1, 0].map((p) => <td key={p}>{f(step.counts[p as Place])}</td>)}</tr>
                <tr><th scope="row" className="rowh">{d[K.rowSub]}</th>{[2, 1, 0].map((p) => <td key={p}>{eng.sign}{f(digitsOf(nums.s)[p as Place])}</td>)}</tr>
                <tr><th scope="row" className="rowh">{d.rowAnswer}</th>{[2, 1, 0].map((p) => <td key={p} className="ans">{step.answerDigits[p as Place] < 0 ? "?" : f(step.answerDigits[p as Place])}</td>)}</tr>
              </tbody>
            </table>
          </section>

          {notes && (
            <section aria-labelledby="tn-h" className="tnotes">
              <h2 id="tn-h">{d.notesTitle}</h2>
              <ul>{K.notes.map((k) => <li key={k}>{d[k]}</li>)}</ul>
            </section>
          )}
        </aside>
      </div>

      <div className="sr-only" aria-live="polite">{note}</div>

      <nav className="controls" aria-label={d.controls}>
        <button onClick={goPrev} disabled={idx === 0 && ask === null}>{d.prev}</button>
        <button className="primary" onClick={goNext} disabled={idx >= steps.length - 1 || ask !== null}>{d.next}</button>
        <button onClick={resetFlow}>{d.reset}</button>
        <button aria-pressed={view === "text"} onClick={() => setView(view === "board" ? "text" : "board")}>{view === "board" ? d.textMode : d.boardMode}</button>
        <button aria-pressed={reduce} onClick={() => setReduce((r) => !r)}>{d.reduceMotion}</button>
        <button aria-pressed={notes} onClick={() => setNotes((n) => !n)}>{notes ? d.hideNotes : d.showNotes}</button>
        {mode === "present" && <button onClick={toggleFull}>{full ? d.exitFullscreen : d.fullscreen}</button>}
      </nav>
      {mode === "present" && <p className="hint center">{d.presentHint}</p>}

      {mode === "student" && (
        <Practice lang={lang} eng={eng} nums={nums} onLoad={(m, s) => { setMStr(String(m)); setSStr(String(s)); }} />
      )}
    </div>
  );
}

function Practice({ lang, eng, nums, onLoad }: { lang: Lang; eng: Engine; nums: { m: number; s: number }; onLoad: (m: number, s: number) => void }) {
  const d = dict[lang];
  const f = (n: number) => formatInt(n, lang);
  const [tIdx, setTIdx] = useState(0);
  const [stats, setStats] = useState({ n: 0, c: 0 });
  const t = eng.transfer[tIdx % eng.transfer.length]!;

  return (
    <section className="practice" aria-labelledby="pr-h">
      <h2 id="pr-h">{d.guidedTitle} · {d.transferTitle}</h2>
      <div className="cards">
        <AnswerCard
          lang={lang} eng={eng} title={d.guidedTitle} prompt={fill(d[eng.keys.guidedPrompt], { m: f(nums.m), s: f(nums.s) })}
          m={nums.m} s={nums.s} keyId={`g-${nums.m}-${nums.s}`}
          onResult={(ok) => setStats((x) => ({ n: x.n + 1, c: x.c + (ok ? 1 : 0) }))}
        />
        <AnswerCard
          lang={lang} eng={eng} title={d.transferTitle} prompt={fill(d[eng.keys.transferPrompt], { m: f(t[0]), s: f(t[1]) })}
          m={t[0]} s={t[1]} keyId={`t-${tIdx}`}
          onResult={(ok) => setStats((x) => ({ n: x.n + 1, c: x.c + (ok ? 1 : 0) }))}
          extra={
            <div className="row">
              <button onClick={() => setTIdx((i) => i + 1)}>{d.newExample}</button>
              <button onClick={() => onLoad(t[0], t[1])}>{d.loadInBoard}</button>
            </div>
          }
        />
      </div>
      <p className="hint">{fill(d.sessionStats, { n: f(stats.n), c: f(stats.c) })}</p>
      <p className="hint">{d.noMastery}</p>
    </section>
  );
}

function AnswerCard(props: {
  lang: Lang; eng: Engine; title: string; prompt: string; m: number; s: number; keyId: string;
  onResult: (ok: boolean) => void; extra?: React.ReactNode;
}) {
  const { lang, m, s } = props;
  const d = dict[lang];
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "bad"; text: string } | null>(null);
  useEffect(() => { setVal(""); setMsg(null); }, [props.keyId]);
  const id = `ans-${props.keyId}`;

  const submit = () => {
    const r = props.eng.checkAnswer(m, s, val);
    if (r.kind === "invalid") { setMsg({ kind: "bad", text: d[`err_${r.code}` as const] }); return; }
    props.onResult(r.kind === "correct");
    if (r.kind === "correct") setMsg({ kind: "ok", text: d.correctMsg });
    else {
      const k = r.diagnosis === "other" ? undefined : props.eng.keys.wrongMap[r.diagnosis];
      setMsg({ kind: "bad", text: k ? d[k] : d.wrongGeneric });
    }
  };

  return (
    <div className="card">
      <h3>{props.title}</h3>
      <p>{props.prompt}</p>
      <label htmlFor={id}>{d.answerLabel}</label>
      <input id={id} inputMode="numeric" autoComplete="off" maxLength={12} value={val}
        onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
      <div className="row"><button className="primary" onClick={submit}>{d.check}</button></div>
      {props.extra}
      {msg && <p role="status" className={msg.kind}>{msg.text}</p>}
    </div>
  );
}
