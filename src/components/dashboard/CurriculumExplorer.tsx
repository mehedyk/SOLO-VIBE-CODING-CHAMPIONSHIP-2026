'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
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
  type CurriculumManipulative,
  type CurriculumSort,
  type CurriculumTopic,
  type NCTBChapter,
} from '@/lib/curriculum/nctb';
import type { Lang } from '@/lib/i18n/dict';
import { formatInt } from '@/lib/math/numerals';

interface Props {
  lang: Lang;
  isTeacher?: boolean;
}

const GRADES = [1, 2, 3, 4, 5] as const;

export default function CurriculumExplorer({ lang, isTeacher = false }: Props) {
  const isBn = lang === 'bn';
  const L = (p: string) => `/${lang}${p}`;

  const [grade, setGrade] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [topic, setTopic] = useState<CurriculumTopic | ''>('');
  const [manipulative, setManipulative] = useState<CurriculumManipulative | ''>('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<CurriculumSort>('order');

  const facets = useMemo(() => curriculumFacetCounts(NCTB_CURRICULUM), []);

  const chapters = useMemo(
    () => filterChapters({ q, grade, topic, manipulative, sort }, lang),
    [q, grade, topic, manipulative, sort, lang]
  );

  const hasFilters = Boolean(grade || topic || manipulative || q.trim());

  const fullCatalogueHref = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (grade) params.set('grade', String(grade));
    if (topic) params.set('topic', topic);
    if (manipulative) params.set('tool', manipulative);
    if (sort !== 'order') params.set('sort', sort);
    const qs = params.toString();
    return L(`/lessons${qs ? `?${qs}` : ''}`);
  }, [q, grade, topic, manipulative, sort, lang]);

  // Group chapters by grade when showing multiple grades in curriculum order
  const grouped = useMemo(() => {
    const map = new Map<number, NCTBChapter[]>();
    for (const ch of chapters) {
      const list = map.get(ch.grade) ?? [];
      list.push(ch);
      map.set(ch.grade, list);
    }
    return Array.from(map.entries());
  }, [chapters]);

  const sortLabels: Record<CurriculumSort, { bn: string; en: string }> = {
    order: { bn: 'শ্রেণি ও অধ্যায় ক্রম', en: 'Class & Chapter order' },
    title: { bn: 'শিরোনাম (ক–হ / A–Z)', en: 'Title (A–Z)' },
    topic: { bn: 'গণিতের বিষয়', en: 'Math topic' },
    grade: { bn: 'শ্রেণি (১ম–৫ম)', en: 'Class (1–5)' },
  };

  function clearAll() {
    setGrade(undefined);
    setTopic('');
    setManipulative('');
    setQ('');
    setSort('order');
  }

  return (
    <div className="explorer-stack">
      {/* All Visual Math Tools */}
      <section className="panel-sheet" aria-labelledby="tools-heading">
        <div className="section-head-row">
          <div>
            <h2 id="tools-heading">
              {isBn ? 'সব গণিতের ভিজ্যুয়াল ল্যাব ও টুল (৭টি টুল · সব বিষয়)' : 'All Visual Math Tools & Labs (Every Math Type)'}
            </h2>
            <p className="meta">
              {isBn
                ? 'যোগ, বিয়োগ, গণনা, সংখ্যারেখা, ভগ্নাংশ, গুণ-ভাগ, দশমিক, শতকরা, পরিমাপ ও জ্যামিতি — সরাসরি যেকোনো টুল খুলুন।'
                : 'Addition, subtraction, counting, number line, fractions, multiplication/division, decimals, percentages, measurement, and geometry.'}
            </p>
          </div>
          <Link className="btn btn-ghost btn-sm" href={L('/lessons')}>
            {isBn ? 'পূর্ণ ক্যাটালগ' : 'Full catalogue'}
            <Icon name="right" />
          </Link>
        </div>

        <div className="tools-grid">
          {VISUAL_TOOLS.map((tool) => {
            const active =
              (topic !== '' && tool.topics.includes(topic)) ||
              (manipulative !== '' && tool.manipulative === manipulative);
            return (
              <div key={tool.id} className={`tool-card${active ? ' is-highlighted' : ''}`}>
                <div className="tool-card-top">
                  <span className={`chip ${tool.badgeColor}`}>{isBn ? tool.gradeRangeBn : tool.gradeRangeEn}</span>
                  <span className="tool-tag">{MANIPULATIVE_LABELS[tool.manipulative][lang]}</span>
                </div>
                <h3>{isBn ? tool.titleBn : tool.titleEn}</h3>
                <p className="meta">{isBn ? tool.descBn : tool.descEn}</p>
                <div className="tool-topics">
                  {tool.topics.map((tp) => (
                    <button
                      key={tp}
                      type="button"
                      className={`topic-mini-btn${topic === tp ? ' active' : ''}`}
                      onClick={() => setTopic((cur) => (cur === tp ? '' : tp))}
                      title={isBn ? 'এই বিষয়ের অধ্যায় ফিল্টার করুন' : 'Filter chapters by this topic'}
                    >
                      {TOPIC_LABELS[tp][lang]}
                    </button>
                  ))}
                </div>
                <div className="row-actions" style={{ marginTop: 'auto', paddingTop: '.5rem' }}>
                  <Link className="btn btn-navy btn-sm" href={L(tool.href)}>
                    {isBn ? 'ল্যাব খুলুন' : 'Open lab'}
                    <Icon name="right" />
                  </Link>
                  {isTeacher && tool.lessonSlug && (
                    <>
                      <Link className="btn btn-ghost btn-sm" href={L(`/lessons/${tool.lessonSlug}/present`)}>
                        {isBn ? 'শ্রেণিকক্ষ মোড' : 'Classroom'}
                      </Link>
                      <Link className="btn btn-ghost btn-sm" href={L(`/lessons/${tool.lessonSlug}/print`)}>
                        {isBn ? 'ছাপার শিট' : 'Print'}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Class-by-Class Searchable Curriculum Explorer */}
      <section className="panel-sheet" id="curriculum-explorer" aria-labelledby="curr-exp-heading">
        <div className="section-head-row">
          <div>
            <h2 id="curr-exp-heading">
              {isBn ? 'শ্রেণি ও বিষয়ভিত্তিক গণিত পাঠ (১ম–৫ম শ্রেণি · ৫৬টি অধ্যায়)' : 'Class-by-Class Math Curriculum (Classes 1–5 · 56 Chapters)'}
            </h2>
            <p className="meta">
              {isBn
                ? 'শ্রেণি, গণিতের ধরন বা টুল বেছে নিন অথবা বাংলা/ইংরেজিতে খুঁজুন।'
                : 'Browse by class (1–5), math topic, or visual tool, or search in Bangla and English.'}
            </p>
          </div>
          <Link className="btn btn-ghost btn-sm" href={fullCatalogueHref}>
            {isBn ? 'পাঠ ক্যাটালগে খুলুন' : 'Open in catalogue'}
            <Icon name="right" />
          </Link>
        </div>

        {/* Grade tabs */}
        <div className="explorer-pills" role="tablist" aria-label={isBn ? 'শ্রেণি নির্বাচন' : 'Select class'}>
          <button
            type="button"
            role="tab"
            aria-selected={grade === undefined}
            className={`quick-pill${grade === undefined ? ' active' : ''}`}
            onClick={() => setGrade(undefined)}
          >
            {isBn ? `সকল শ্রেণি (${formatInt(NCTB_CURRICULUM.length, lang)})` : `All Classes (${NCTB_CURRICULUM.length})`}
          </button>
          {GRADES.map((g) => {
            const count = facets.grades.get(g) ?? 0;
            return (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={grade === g}
                className={`quick-pill${grade === g ? ' active' : ''}`}
                onClick={() => setGrade((cur) => (cur === g ? undefined : g))}
              >
                {isBn ? `${formatInt(g, lang)}ম শ্রেণি (${formatInt(count, lang)})` : `Class ${g} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Search + Math Type + Tool + Sort */}
        <div className="explorer-filters">
          <div className="field">
            <label htmlFor="exp-q">{isBn ? 'খুঁজুন (বাংলা বা ইংরেজি)' : 'Search (Bangla or English)'}</label>
            <input
              id="exp-q"
              type="search"
              maxLength={80}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isBn ? 'যেমন: ভগ্নাংশ, গুণ, জ্যামিতি, fraction...' : 'e.g. fractions, addition, geometry, গুণ...'}
            />
          </div>

          <div className="field">
            <label htmlFor="exp-topic">{isBn ? 'গণিতের ধরন' : 'Math type'}</label>
            <select
              id="exp-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value as CurriculumTopic | '')}
            >
              <option value="">{isBn ? 'সব বিষয় (১০টি)' : 'All math types (10)'}</option>
              {CURRICULUM_TOPICS.map((tp) => (
                <option key={tp} value={tp}>
                  {TOPIC_LABELS[tp][lang]} ({formatInt(facets.topics.get(tp) ?? 0, lang)})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="exp-tool">{isBn ? 'ভিজ্যুয়াল টুল' : 'Visual tool'}</label>
            <select
              id="exp-tool"
              value={manipulative}
              onChange={(e) => setManipulative(e.target.value as CurriculumManipulative | '')}
            >
              <option value="">{isBn ? 'সব টুল (৭টি)' : 'All tools (7)'}</option>
              {CURRICULUM_MANIPULATIVES.map((m) => (
                <option key={m} value={m}>
                  {MANIPULATIVE_LABELS[m][lang]} ({formatInt(facets.manipulatives.get(m) ?? 0, lang)})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="exp-sort">{isBn ? 'সাজানো' : 'Sort by'}</label>
            <select id="exp-sort" value={sort} onChange={(e) => setSort(e.target.value as CurriculumSort)}>
              {CURRICULUM_SORTS.map((s) => (
                <option key={s} value={s}>
                  {sortLabels[s][lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="explorer-status-bar">
          <p role="status" className="count-line" style={{ margin: 0 }}>
            {isBn
              ? `${formatInt(chapters.length, lang)}টি অধ্যায় পাওয়া গেছে`
              : `${chapters.length} ${chapters.length === 1 ? 'chapter' : 'chapters'} shown`}
          </p>
          {hasFilters && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
              {isBn ? 'ফিল্টার মুছুন' : 'Clear filters'}
            </button>
          )}
        </div>

        {chapters.length === 0 ? (
          <p className="empty-note" style={{ marginTop: '.8rem' }}>
            {isBn
              ? 'কোনো অধ্যায় মেলেনি। অন্য শব্দ দিয়ে খুঁজুন বা ফিল্টার মুছুন।'
              : 'No matching chapters. Try another keyword or clear filters.'}
          </p>
        ) : grade === undefined && sort === 'order' ? (
          <div className="grade-groups">
            {grouped.map(([g, list]) => (
              <div key={g} className="grade-group">
                <div className="grade-group-head">
                  <h3>
                    {isBn ? `${formatInt(g, lang)}ম শ্রেণি` : `Class ${g}`}{' '}
                    <span className="chip amber">{formatInt(list.length, lang)}</span>
                  </h3>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setGrade(g as 1 | 2 | 3 | 4 | 5)}>
                    {isBn ? 'শুধু এই শ্রেণি দেখুন' : `Focus Class ${g}`}
                  </button>
                </div>
                <div className="chapter-cards-list">
                  {list.map((ch) => (
                    <ChapterRow key={ch.id} ch={ch} lang={lang} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="chapter-cards-list" style={{ marginTop: '.8rem' }}>
            {chapters.map((ch) => (
              <ChapterRow key={ch.id} ch={ch} lang={lang} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ChapterRow({ ch, lang }: { ch: NCTBChapter; lang: Lang }) {
  const isBn = lang === 'bn';
  return (
    <article className="chapter-row-card">
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
          <Icon name="right" />
        </Link>
        <a
          href={`/api/slides/${ch.slideSlug}`}
          className="btn btn-ghost btn-sm"
          download
          title={isBn ? 'অফলাইন HTML স্লাইড ডাউনলোড' : 'Download standalone offline HTML slide'}
        >
          <Icon name="download" />
          {isBn ? 'স্লাইড' : 'Slide'}
        </a>
      </div>
    </article>
  );
}
