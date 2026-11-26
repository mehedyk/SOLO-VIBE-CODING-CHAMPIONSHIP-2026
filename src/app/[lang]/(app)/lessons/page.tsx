import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dict, fill, isLang } from "@/lib/i18n/dict";
import { formatInt } from "@/lib/math/numerals";
import { LESSONS, TOPICS, REVIEWS, SORTS, lessonText } from "@/lib/lessons/registry";
import { parseQuery, filterLessons, facetCounts } from "@/lib/lessons/catalogue";
import { NCTB_CURRICULUM, getChaptersByGrade } from "@/lib/curriculum/nctb";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isLang(lang) ? { title: dict[lang].catalogueTitle } : {};
}

const MANIPULATIVE_NAMES: Record<string, { bn: string; en: string }> = {
  base10: { bn: '🧮 বেস-১০ ব্লক', en: '🧮 Base-10 Blocks' },
  fraction_bars: { bn: '📊 ভগ্নাংশ বার', en: '📊 Fraction Bars' },
  number_line: { bn: '📏 সংখ্যারেখা', en: '📏 Number Line' },
  counting_dots: { bn: '⚪ ডট কাউন্টার', en: '⚪ Dot Counter' },
  multiplication_grid: { bn: '📐 নামতা ম্যাট্রিক্স', en: '📐 Multiplication Array' },
  decimals_grid: { bn: '▦ দশমিক গ্রিড', en: '▦ Decimals Grid' },
  geoboard: { bn: '📌 জিওবোর্ড জ্যামিতি', en: '📌 Geoboard' },
};

export default async function Catalogue({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  const sp = await searchParams;
  const q = parseQuery(sp);
  const results = filterLessons(LESSONS, q, lang);
  const facets = facetCounts();
  const filtered = q.q !== "" || q.topic !== "" || q.review !== "";

  const selectedGradeRaw = typeof sp.grade === 'string' ? parseInt(sp.grade, 10) : undefined;
  const selectedGrade = selectedGradeRaw && selectedGradeRaw >= 1 && selectedGradeRaw <= 5 ? selectedGradeRaw : undefined;
  const nctbChapters = getChaptersByGrade(selectedGrade);

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

      {/* NCTB Primary Curriculum Section (Class 1 to 5) */}
      <section className="nctb-curriculum-section" style={{ marginTop: '3.5rem' }}>
        <div className="section-header">
          <h2>{lang === 'bn' ? '📚 জাতীয় শিক্ষাক্রম (NCTB) ১ম থেকে ৫ম শ্রেণি' : '📚 NCTB Primary Curriculum (Class 1-5)'}</h2>
          <p className="meta">
            {lang === 'bn'
              ? 'সকল শ্রেণির পূর্ণ সিলেবাসভিত্তিক ইন্টারঅ্যাক্টিভ ভার্চুয়াল ল্যাব ও অফলাইন স্লাইড:'
              : 'Complete 56-chapter curriculum labs with single-click offline presentation decks:'}
          </p>
        </div>

        {/* Grade quick selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link
            href={`/${lang}/lessons`}
            className={`quick-pill ${!selectedGrade ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {lang === 'bn' ? 'সকল শ্রেণি (৫৬ অধ্যায়)' : 'All Classes (56 Chapters)'}
          </Link>
          {[1, 2, 3, 4, 5].map((g) => {
            const count = getChaptersByGrade(g).length;
            const isActive = selectedGrade === g;
            return (
              <Link
                key={g}
                href={`/${lang}/lessons?grade=${g}`}
                className={`quick-pill ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {lang === 'bn' ? `${formatInt(g, lang)}ম শ্রেণি (${formatInt(count, lang)})` : `Class ${g} (${count})`}
              </Link>
            );
          })}
        </div>

        <div className="chapter-cards-list">
          {nctbChapters.map((ch) => {
            const manipName = MANIPULATIVE_NAMES[ch.manipulative] || { bn: ch.manipulative, en: ch.manipulative };
            return (
              <div key={ch.id} className="chapter-row-card">
                <div className="chapter-info">
                  <div className="chapter-index">
                    <span className="grade-badge" style={{ marginRight: '0.5rem' }}>
                      {lang === 'bn' ? `${formatInt(ch.grade, lang)}ম শ্রেণি` : `Class ${ch.grade}`}
                    </span>
                    <span style={{ fontWeight: 700, marginRight: '0.75rem' }}>
                      {lang === 'bn' ? `অধ্যায় ${formatInt(ch.chapterNumber, lang)}` : `Chapter ${ch.chapterNumber}`}
                    </span>
                    <span className="badge" style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1' }}>
                      {lang === 'bn' ? manipName.bn : manipName.en}
                    </span>
                  </div>
                  <h4 className="chapter-title" style={{ marginTop: '0.35rem' }}>
                    {lang === 'bn' ? ch.titleBn : ch.titleEn}
                  </h4>
                  <p className="chapter-objective">{lang === 'bn' ? ch.objectiveBn : ch.objectiveEn}</p>
                </div>

                <div className="chapter-actions">
                  <Link
                    href={`/${lang}${ch.interactiveRoute}`}
                    className="btn primary"
                  >
                    {lang === 'bn' ? '🚀 ল্যাব খুলুন' : '🚀 Open Lab'}
                  </Link>
                  <Link
                    href={`/api/slides/${ch.slideSlug}`}
                    className="btn"
                    download
                    title="Download standalone offline HTML presentation"
                  >
                    {lang === 'bn' ? '📥 স্লাইড (HTML)' : '📥 Slide (HTML)'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
