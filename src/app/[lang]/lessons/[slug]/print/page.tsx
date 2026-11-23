import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import PrintButton from "../../../../../components/PrintButton";
import { dict, fill, isLang, LANGS, noteText } from "../../../../../lib/i18n/dict";
import { ENGINES } from "../../../../../lib/lessons/engines";
import { LESSONS, findLesson, lessonText } from "../../../../../lib/lessons/registry";
import { formatInt } from "../../../../../lib/math/numerals";

export const dynamicParams = false;
export function generateStaticParams() { return LANGS.flatMap((lang) => LESSONS.map((l) => ({ lang, slug: l.slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = findLesson(slug);
  return l && isLang(lang) ? { title: `${dict[lang].printTitle}: ${lessonText(l, lang).title}` } : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const meta = findLesson(slug);
  if (!isLang(lang) || !meta) notFound();
  const d = dict[lang];
  const eng = ENGINES[meta.kind];
  const f = (n: number) => formatInt(n, lang);
  const [m, s] = eng.defaults;
  const steps = eng.build(m, s);
  return (
    <article className="printpage">
      <div className="row no-print">
        <PrintButton label={d.printButton} />
        <Link className="btn" href={`/${lang}/lessons/${slug}`}>{d[eng.keys.title]}</Link>
      </div>
      <h1>{d.printTitle}: {d[eng.keys.title]}</h1>
      <p>{d[eng.keys.objective]}</p>
      <p>{d[eng.keys.prerequisite]}</p>
      <p className="meta">{d.sourceDemo} · {d.reviewStatus}</p>

      <h2>{d.printChecklist}</h2>
      <ul>{(["checklist1", "checklist2", "checklist3", "checklist4"] as const).map((k) => <li key={k}>☐ {d[k]}</li>)}</ul>

      <h2>{d.printSteps}</h2>
      <p><strong>{fill(d.printExample, { m: f(m), sym: eng.sign, s: f(s) })}</strong></p>
      <ol>{steps.map((st, i) => <li key={i}>{noteText(st.note, lang)}</li>)}</ol>

      <h2>{d.notesTitle}</h2>
      <ul>{eng.keys.notes.map((k) => <li key={k}>{d[k]}</li>)}</ul>

      <h2>{d.printPractice}</h2>
      <ol className="pq">
        {eng.transfer.map(([a, b]) => (
          <li key={`${a}-${b}`}>{f(a)} {eng.sign} {f(b)} = <span className="line">&nbsp;</span></li>
        ))}
      </ol>
      <p className="meta">{d.noMastery}</p>
    </article>
  );
}
