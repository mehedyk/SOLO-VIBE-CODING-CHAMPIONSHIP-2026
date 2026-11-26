import Link from 'next/link';
import Icon from '@/components/Icon';
import { TOPIC_LABELS, type NCTBChapter } from '@/lib/curriculum/nctb';
import type { Lang } from '@/lib/i18n/dict';
import { formatInt } from '@/lib/math/numerals';

export default function ChapterBanner({ chapter, lang }: { chapter: NCTBChapter; lang: Lang }) {
  const isBn = lang === 'bn';
  return (
    <div className="chapter-banner" role="region" aria-label={isBn ? 'অধ্যায় পরিচিতি' : 'Chapter context'}>
      <div style={{ flex: '1 1 320px' }}>
        <div className="chapter-index">
          <span className="grade-badge">
            {isBn ? `${formatInt(chapter.grade, lang)}ম শ্রেণি` : `Class ${chapter.grade}`}
          </span>
          <span className="chapter-num">
            {isBn ? `অধ্যায় ${formatInt(chapter.chapterNumber, lang)}` : `Chapter ${chapter.chapterNumber}`}
          </span>
          <span className="chip mint">{TOPIC_LABELS[chapter.topic][lang]}</span>
        </div>
        <h2>{isBn ? chapter.titleBn : chapter.titleEn}</h2>
        <p>{isBn ? chapter.summaryBn : chapter.summaryEn}</p>
      </div>
      <div className="chapter-actions">
        <Link className="btn btn-ghost btn-sm" href={`/${lang}/lessons?grade=${chapter.grade}#nctb-curriculum`}>
          <Icon name="left" />
          {isBn ? `${formatInt(chapter.grade, lang)}ম শ্রেণির পাঠ` : `Class ${chapter.grade} chapters`}
        </Link>
        <a className="btn btn-ghost btn-sm" href={`/api/slides/${chapter.slideSlug}`} download>
          <Icon name="download" />
          {isBn ? 'অফলাইন স্লাইড' : 'Slide'}
        </a>
      </div>
    </div>
  );
}
