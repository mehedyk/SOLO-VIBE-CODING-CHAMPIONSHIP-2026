import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dict, fill, isLang } from "../../../lib/i18n/dict";
import { formatInt } from "../../../lib/math/numerals";
import { LESSONS, TOPICS, REVIEWS, SORTS, lessonText } from "../../../lib/lessons/registry";
import { parseQuery, filterLessons, facetCounts } from "../../../lib/lessons/catalogue";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: dict[lang].catalogueTitle } : {};
}

export default async function Catalogue({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  const q = parseQuery(await searchParams);
  const results = filterLessons(LESSONS, q, lang);
  const facets = facetCounts();
  const filtered = q.q !== "" || q.topic !== "" || q.review !== "";
  return (
    <div className="catalogue">
      <h1>{d.catalogueTitle}</h1>
      <p className="meta">{d.catalogueIntro}</p>

      <form method="get" className="filters" role="search" aria-label={d.catalogueTitle}>
        <div className="field">
          <label htmlFor="f-q">{d.searchLabel}</label>
          <input id="f-q" name="q" type="search" defaultValue={q.q} maxLength={80} placeholder={d.searchPlaceholder} />
        </div>
        <div className="field">
          <label htmlFor="f-topic">{d.topicLabel}</label>
          <select id="f-topic" name="topic" defaultValue={q.topic}>
            <option value="">{d.allTopics}</option>
            {TOPICS.map((t) => <option key={t} value={t}>{d[`topic_${t}` as const]} ({formatInt(facets.topics.get(t) ?? 0, lang)})</option>)}
          </select>
        </div>
        {facets.reviews.size > 1 && (
          <div className="field">
            <label htmlFor="f-review">{d.reviewFilterLabel}</label>
            <select id="f-review" name="review" defaultValue={q.review}>
              <option value="">{d.allReviews}</option>
              {REVIEWS.map((r) => <option key={r} value={r}>{d[`review_${r}` as const]}</option>)}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="f-sort">{d.sortLabel}</label>
          <select id="f-sort" name="sort" defaultValue={q.sort}>
            {SORTS.map((s) => <option key={s} value={s}>{d[`sort_${s}` as const]}</option>)}
          </select>
        </div>
        <div className="row">
          <button className="primary" type="submit">{d.applyFilters}</button>
          {filtered && <Link className="btn" href={`/${lang}/lessons`}>{d.clearFilters}</Link>}
        </div>
      </form>

      <p role="status" className="count-line">{fill(d.resultsCount, { n: formatInt(results.length, lang) })}</p>
      {results.length === 0 ? (
        <p className="empty">{d.noResults}</p>
      ) : (
        <ul className="cards-list">
          {results.map((l) => {
            const t = lessonText(l, lang);
            return (
              <li key={l.slug} className="lesson-card">
                <h2>{t.title}</h2>
                <p className="meta">{t.objective}</p>
                <p className="tags">
                  <span className="badge">{d[`topic_${l.topic}` as const]}</span>{" "}
                  <span className="badge">{d[`review_${l.review}` as const]}</span>{" "}
                  <span className="badge">{d.gradeUnverified}</span>
                </p>
                <p className="meta">{d.templateName} · {l.version}</p>
                <div className="row">
                  <Link className="btn primary" href={`/${lang}/lessons/${l.slug}`}>{d.openStudent}</Link>
                  <Link className="btn" href={`/${lang}/lessons/${l.slug}/present`}>{d.openPresent}</Link>
                  <Link className="btn" href={`/${lang}/lessons/${l.slug}/print`}>{d.printView}</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
