import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { isLang, LANGS, type Lang } from '@/lib/i18n/dict';
import { CountingDots } from '@/components/CountingDots';
import Icon from '@/components/Icon';
import ChapterBanner from '@/components/ChapterBanner';
import { NumberLine } from '@/components/NumberLine';
import { FractionBars } from '@/components/FractionBars';
import { MultiplicationGrid } from '@/components/MultiplicationGrid';
import { DecimalsGrid } from '@/components/DecimalsGrid';
import { GeoboardShapes } from '@/components/GeoboardShapes';
import { findChapterBySlug } from '@/lib/curriculum/nctb';

const SLUGS = ['counting', 'numberline', 'fractions', 'multiplication', 'decimals', 'geometry'] as const;
type ManipulativeSlug = (typeof SLUGS)[number];

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => SLUGS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang) || !SLUGS.includes(slug as ManipulativeSlug)) return {};
  const isBn = lang === 'bn';
  const titles: Record<ManipulativeSlug, { bn: string; en: string }> = {
    counting: { bn: 'ডট ও টোকেন কাউন্টার', en: 'Dot & Token Counter' },
    numberline: { bn: 'সংখ্যারেখা ও দূরত্বের স্কেল', en: 'Directed Number Line Scale' },
    fractions: { bn: 'ভগ্নাংশ বার ও সমতুল্যতা', en: 'Fraction Partitioning Bars' },
    multiplication: { bn: 'নামতা ও গুণন ম্যাট্রিক্স', en: 'Multiplication Array Matrix' },
    decimals: { bn: 'দশমিক ও শতকরা ১০০-গ্রিড', en: 'Decimals & Percentages Grid' },
    geometry: { bn: 'জিওবোর্ড ও কোণ', en: 'Interactive Geoboard & Polygons' },
  };
  return {
    title: isBn ? titles[slug as ManipulativeSlug].bn : titles[slug as ManipulativeSlug].en,
  };
}

const LAB_NAMES: Record<string, { bn: string; en: string }> = {
  counting: { bn: 'গণনা', en: 'Counting' }, numberline: { bn: 'সংখ্যারেখা', en: 'Number line' }, fractions: { bn: 'ভগ্নাংশ', en: 'Fractions' },
  multiplication: { bn: 'গুণ', en: 'Multiplication' }, decimals: { bn: 'দশমিক', en: 'Decimals' }, geometry: { bn: 'জ্যামিতি', en: 'Geometry' },
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default async function ManipulativePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang) || !SLUGS.includes(slug as ManipulativeSlug)) notFound();
  const isBn = lang === 'bn';
  const sp = await searchParams;
  const chapterSlug = typeof sp.chapter === 'string' ? sp.chapter : undefined;
  const chapter = chapterSlug ? findChapterBySlug(chapterSlug) : undefined;
  const [d0, d1] = chapter?.demoNumbers ?? [0, 0];

  const nlOp: '+' | '−' = chapter?.topic === 'subtraction' ? '−' : '+';
  const nlStart = chapter ? clamp(d0, 0, 15) : 4;
  const nlJump = chapter ? clamp(d1 || 1, 1, 10) : 7;

  const den1 = chapter ? clamp(d1 >= 2 ? d1 : 4, 2, 12) : 2;
  const num1 = chapter ? clamp(d0 >= 1 ? d0 : 1, 1, den1) : 1;
  const den2 = chapter ? (den1 * 2 <= 12 ? den1 * 2 : den1) : 4;
  const num2 = chapter ? (den2 === den1 ? num1 : Math.min(den2, num1 * 2)) : 2;

  const geoText = chapter ? `${chapter.titleEn} ${chapter.titleBn}` : '';
  const geoShape: 'square' | 'triangle' | 'rectangle' = /triangle|ত্রিভুজ|area/i.test(geoText)
    ? 'triangle'
    : /square|বর্গ/i.test(geoText)
      ? 'square'
      : 'rectangle';

  return (
    <div className="manipulative-page-wrap">
      <div className="manipulative-page-nav">
        <Link href={`/${lang}/lessons`} className="btn ghost">
          <Icon name="left" />{isBn ? 'সকল পাঠ' : 'All lessons'}
        </Link>
        <div className="manipulative-quick-nav">
          <Link href={`/${lang}/lessons/subtraction-regrouping`} className="quick-pill">
            {isBn ? 'বিয়োগ ব্লক' : 'Subtraction'}
          </Link>
          <Link href={`/${lang}/lessons/addition-regrouping`} className="quick-pill">
            {isBn ? 'যোগ ব্লক' : 'Addition'}
          </Link>
          {SLUGS.map((s) => (
            <Link
              key={s}
              href={`/${lang}/manipulatives/${s}`}
              className={`quick-pill ${s === slug ? 'active' : ''}`}
            >
              {LAB_NAMES[s]?.[isBn ? 'bn' : 'en'] ?? s}
            </Link>
          ))}
        </div>
      </div>

      {chapter && <ChapterBanner chapter={chapter} lang={lang} />}

      <div className="manipulative-container">
        {slug === 'counting' && <CountingDots lang={lang as Lang} initialCount={chapter ? clamp(d0, 1, 20) : 7} />}
        {slug === 'numberline' && (
          <div className="manipulative-card">
            <div className="manipulative-header">
              <div>
                <h3>{isBn ? 'ইন্টারঅ্যাক্টিভ সংখ্যারেখা ও দূরত্বের স্কেল (১ম-৩য় শ্রেণি)' : 'Interactive Directed Number Line (Class 1-3)'}</h3>
                <p className="meta">
                  {isBn
                    ? 'শুরুর অবস্থান ও লাফের পরিমাণ পরিবর্তন করে যোগ (+) ও বিয়োগের (−) দিক প্রত্যক্ষ করুন।'
                    : 'Adjust start coordinate, jump magnitude, and operation to see dynamic directed leaps.'}
                </p>
              </div>
            </div>
            <NumberLine interactive={true} lang={lang as Lang} initialStart={nlStart} initialJump={nlJump} initialOp={nlOp} />
          </div>
        )}
        {slug === 'fractions' && (
          <div className="manipulative-card">
            <div className="manipulative-header">
              <div>
                <h3>{isBn ? 'ইন্টারঅ্যাক্টিভ ভগ্নাংশ সমতুল্যতা ও বিভাজন বার (৩য়-৪র্থ শ্রেণি)' : 'Interactive Fraction Equivalence Bars (Class 3-4)'}</h3>
                <p className="meta">
                  {isBn
                    ? 'লব ও হর পরিবর্তন করে দুটি ভগ্নাংশের দৈর্ঘ্য সরাসরি পাশাপাশি মিলিয়ে সমতুল্যতা পরীক্ষা করুন।'
                    : 'Slide numerators and denominators to prove fraction equivalence against the hairline reference.'}
                </p>
              </div>
            </div>
            <FractionBars interactive={true} lang={lang as Lang} initialNum1={num1} initialDen1={den1} initialNum2={num2} initialDen2={den2} />
          </div>
        )}
        {slug === 'multiplication' && (
          <MultiplicationGrid
            lang={lang as Lang}
            initialRows={chapter ? clamp(d0, 1, 10) : 4}
            initialCols={chapter ? clamp(d1, 1, 10) : 6}
          />
        )}
        {slug === 'decimals' && (
          <DecimalsGrid
            lang={lang as Lang}
            initialFilled={chapter ? clamp(d0 <= 100 ? d0 : 50, 0, 100) : 65}
          />
        )}
        {slug === 'geometry' && <GeoboardShapes lang={lang as Lang} initialShape={geoShape} />}
      </div>
    </div>
  );
}
