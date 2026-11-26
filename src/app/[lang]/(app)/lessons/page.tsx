import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dict, fill, isLang } from "@/lib/i18n/dict";
import { formatInt } from "@/lib/math/numerals";
import { LESSONS, TOPICS, REVIEWS, SORTS, lessonText } from "@/lib/lessons/registry";
import { parseQuery, filterLessons, facetCounts } from "@/lib/lessons/catalogue";
import {
  CURRICULUM_MANIPULATIVES,
  CURRICULUM_SORTS,
  CURRICULUM_TOPICS,
  MANIPULATIVE_LABELS,
  NCTB_CURRICULUM,
  TOPIC_LABELS,
  VISUAL_TOOLS,
  chapterInteractiveHref,
  curriculumFacetCounts,
  filterChapters,
  parseCurriculumQuery,
} from "@/lib/curriculum/nctb";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: dict[lang].catalogueTitle } : {};
}

export default async function Catalogue({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const isBn = lang === "bn";
  const d = dict[lang];
  const sp = await searchParams;
  const q = parseQuery(sp);
  const results = filterLessons(LESSONS, q, lang);
  const facets = facetCounts();
  const filtered = q.q !== "" || q.topic !== "" || q.review !== "";

  const cq = parseCurriculumQuery(sp);
  const nctbChapters = filterChapters(cq, lang);
  const nctbFacets = curriculumFacetCounts(NCTB_CURRICULUM);
  const nctbFiltered = Boolean(cq.q || cq.grade || cq.topic || cq.manipulative || cq.sort !== "order");

  const gradeHref = (g?: number) => {
    const params = new URLSearchParams();
    if (cq.q) params.set("q", cq.q);
    if (g) params.set("grade", String(g));
    if (cq.topic) params.set("topic", cq.topic);
    if (cq.manipulative) params.set("tool", cq.manipulative);
    if (cq.sort !== "order") params.set("sort", cq.sort);
    const qs = params.toString();
    return `/${lang}/lessons${qs ? `?${qs}` : ""}#nctb-curriculum`;
  };

  const sortLabels = {
    order: { bn: "শ্রেণি ও অধ্যায় ক্রম", en: "Class & Chapter order" },
    title: { bn: "শিরোনাম", en: "Title" },
    topic: { bn: "গণিতের বিষয়", en: "Math topic" },
    grade: { bn: "শ্রেণি (১ম–৫ম)", en: "Class (1–5)" },
  };

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
                  <Link className="btn ghost" href={`/api/slides/${l.slug}`} download>
                    {lang === 'bn' ? '📥 অফলাইন স্লাইড (HTML)' : '📥 Offline Slide'}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Interactive Visual Math Tools */}
      <section className="panel-sheet" style={{ marginTop: '2.5rem' }} aria-labelledby="cat-tools-h">
        <div className="section-head-row">
          <div>
            <h2 id="cat-tools-h">
              {isBn ? 'ভিজ্যুয়াল গণিত ল্যাবসমূহ (সব বিষয়)' : 'Visual Math Tools (All Topics)'}
            </h2>
            <p className="meta">
              {isBn
                ? 'বেস-১০ ব্লক, ডট কাউন্টার, সংখ্যারেখা, ভগ্নাংশ, গুণ-ভাগ, দশমিক ও জ্যামিতি:'
                : 'Jump directly into any interactive visual tool across all primary math topics:'}
            </p>
          </div>
        </div>
        <div className="tools-grid">
          {VISUAL_TOOLS.map((tool) => (
            <div key={tool.id} className="tool-card">
              <div className="tool-card-top">
                <span className={`chip ${tool.badgeColor}`}>{isBn ? tool.gradeRangeBn : tool.gradeRangeEn}</span>
                <span className="tool-tag">{MANIPULATIVE_LABELS[tool.manipulative][lang]}</span>
              </div>
              <h3>{isBn ? tool.titleBn : tool.titleEn}</h3>
              <p className="meta">{isBn ? tool.descBn : tool.descEn}</p>
              <div className="row-actions" style={{ marginTop: 'auto', paddingTop: '.4rem' }}>
                <Link className="btn btn-navy btn-sm" href={`/${lang}${tool.href}`}>
                  {isBn ? 'ল্যাব খুলুন' : 'Open lab'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NCTB Primary Curriculum Section (Class 1 to 5) */}
      <section id="nctb-curriculum" className="nctb-curriculum-section panel-sheet" style={{ marginTop: '2rem' }}>
        <div className="section-head-row">
          <div>
            <h2>{isBn ? 'জাতীয় শিক্ষাক্রম (NCTB) ১ম থেকে ৫ম শ্রেণি' : 'NCTB Primary Curriculum (Class 1–5)'}</h2>
            <p className="meta">
              {isBn
                ? 'শ্রেণি, গণিতের ধরন ও টুল অনুযায়ী ৫৬টি অধ্যায় খুঁজুন এবং ল্যাব বা অফলাইন স্লাইড খুলুন:'
                : 'Search and filter all 56 chapters across Classes 1–5, all 10 math types, and all 7 visual tools:'}
            </p>
          </div>
        </div>

        {/* Grade quick selector tabs */}
        <div className="explorer-pills">
          <Link
            href={gradeHref(undefined)}
            className={`quick-pill ${!cq.grade ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {isBn ? `সকল শ্রেণি (${formatInt(NCTB_CURRICULUM.length, lang)})` : `All Classes (${NCTB_CURRICULUM.length})`}
          </Link>
          {[1, 2, 3, 4, 5].map((g) => {
            const count = nctbFacets.grades.get(g) ?? 0;
            const isActive = cq.grade === g;
            return (
              <Link
                key={g}
                href={gradeHref(g)}
                className={`quick-pill ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {isBn ? `${formatInt(g, lang)}ম শ্রেণি (${formatInt(count, lang)})` : `Class ${g} (${count})`}
              </Link>
            );
          })}
        </div>

        {/* Dedicated curriculum search + topic + tool + sort GET form */}
        <form method="get" action={`/${lang}/lessons#nctb-curriculum`} className="explorer-filters" role="search" aria-label={isBn ? 'শ্রেণি ও বিষয় অনুসন্ধান' : 'Search curriculum chapters'}>
          <div className="field">
            <label htmlFor="nctb-q">{isBn ? 'অধ্যায় খুঁজুন' : 'Search chapters'}</label>
            <input
              id="nctb-q"
              name="q"
              type="search"
              defaultValue={cq.q}
              maxLength={80}
              placeholder={isBn ? 'ভগ্নাংশ, গুণ, জ্যামিতি, fraction...' : 'fractions, multiplication, geometry...'}
            />
          </div>
          <div className="field">
            <label htmlFor="nctb-grade">{isBn ? 'শ্রেণি' : 'Class'}</label>
            <select id="nctb-grade" name="grade" defaultValue={cq.grade ? String(cq.grade) : ''}>
              <option value="">{isBn ? 'সকল শ্রেণি' : 'All classes'}</option>
              {[1, 2, 3, 4, 5].map((g) => (
                <option key={g} value={String(g)}>
                  {isBn ? `${formatInt(g, lang)}ম শ্রেণি` : `Class ${g}`}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="nctb-topic">{isBn ? 'গণিতের ধরন' : 'Math type'}</label>
            <select id="nctb-topic" name="topic" defaultValue={cq.topic}>
              <option value="">{isBn ? 'সব বিষয়' : 'All topics'}</option>
              {CURRICULUM_TOPICS.map((tp) => (
                <option key={tp} value={tp}>
                  {TOPIC_LABELS[tp][lang]} ({formatInt(nctbFacets.topics.get(tp) ?? 0, lang)})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="nctb-tool">{isBn ? 'ভিজ্যুয়াল টুল' : 'Visual tool'}</label>
            <select id="nctb-tool" name="tool" defaultValue={cq.manipulative}>
              <option value="">{isBn ? 'সব টুল' : 'All tools'}</option>
              {CURRICULUM_MANIPULATIVES.map((m) => (
                <option key={m} value={m}>
                  {MANIPULATIVE_LABELS[m][lang]} ({formatInt(nctbFacets.manipulatives.get(m) ?? 0, lang)})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="nctb-sort">{isBn ? 'সাজানো' : 'Sort'}</label>
            <select id="nctb-sort" name="sort" defaultValue={cq.sort}>
              {CURRICULUM_SORTS.map((s) => (
                <option key={s} value={s}>
                  {sortLabels[s][lang]}
                </option>
              ))}
            </select>
          </div>
          <div className="row-actions">
            <button className="btn btn-navy btn-sm" type="submit">
              {isBn ? 'খুঁজুন' : 'Filter chapters'}
            </button>
            {nctbFiltered && (
              <Link className="btn btn-ghost btn-sm" href={`/${lang}/lessons#nctb-curriculum`}>
                {isBn ? 'সব দেখুন' : 'Reset'}
              </Link>
            )}
          </div>
        </form>

        <p className="chapter-count-line" style={{ fontWeight: 700, margin: '.6rem 0 1rem' }}>
          {isBn
            ? `${formatInt(nctbChapters.length, lang)}টি অধ্যায়`
            : `${nctbChapters.length} ${nctbChapters.length === 1 ? 'chapter' : 'chapters'}`}
        </p>

        {nctbChapters.length === 0 ? (
          <p className="empty-note">
            {isBn ? 'এই শর্তে কোনো অধ্যায় পাওয়া যায়নি।' : 'No curriculum chapters matched these filters.'}
          </p>
        ) : (
          <div className="chapter-cards-list">
            {nctbChapters.map((ch) => (
              <div key={ch.id} className="chapter-row-card">
                <div className="chapter-info">
                  <div className="chapter-index">
                    <span className="grade-badge">
                      {isBn ? `${formatInt(ch.grade, lang)}ম শ্রেণি` : `Class ${ch.grade}`}
                    </span>
                    <span className="chapter-num">
                      {isBn ? `অধ্যায় ${formatInt(ch.chapterNumber, lang)}` : `Chapter ${ch.chapterNumber}`}
                    </span>
                    <span className="chip mint">{TOPIC_LABELS[ch.topic][lang]}</span>
                    <span className="chip sky">{MANIPULATIVE_LABELS[ch.manipulative][lang]}</span>
                  </div>
                  <h4 className="chapter-title">{isBn ? ch.titleBn : ch.titleEn}</h4>
                  <p className="chapter-objective">{isBn ? ch.objectiveBn : ch.objectiveEn}</p>
                </div>

                <div className="chapter-actions">
                  <Link href={chapterInteractiveHref(ch, lang)} className="btn btn-navy btn-sm">
                    {isBn ? 'ল্যাব খুলুন' : 'Open Lab'}
                  </Link>
                  <a
                    href={`/api/slides/${ch.slideSlug}`}
                    className="btn btn-ghost btn-sm"
                    download
                    title="Download standalone offline HTML presentation"
                  >
                    {isBn ? 'অফলাইন স্লাইড' : 'Slide (HTML)'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
