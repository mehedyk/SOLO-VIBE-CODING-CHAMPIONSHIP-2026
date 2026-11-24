import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { isLang, LANGS, type Lang } from '../../../../lib/i18n/dict';
import { CountingDots } from '../../../../components/CountingDots';
import { NumberLine } from '../../../../components/NumberLine';
import { FractionBars } from '../../../../components/FractionBars';
import { MultiplicationGrid } from '../../../../components/MultiplicationGrid';
import { DecimalsGrid } from '../../../../components/DecimalsGrid';
import { GeoboardShapes } from '../../../../components/GeoboardShapes';

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

export default async function ManipulativePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang) || !SLUGS.includes(slug as ManipulativeSlug)) notFound();
  const isBn = lang === 'bn';

  return (
    <div className="manipulative-page-wrap">
      <div className="manipulative-page-nav">
        <Link href={`/${lang}/lessons`} className="btn ghost">
          ← {isBn ? 'সকল পাঠ ক্যাটালগ' : 'All Lessons'}
        </Link>
        <div className="manipulative-quick-nav">
          {SLUGS.map((s) => (
            <Link
              key={s}
              href={`/${lang}/manipulatives/${s}`}
              className={`quick-pill ${s === slug ? 'active' : ''}`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="manipulative-container">
        {slug === 'counting' && <CountingDots lang={lang as Lang} />}
        {slug === 'numberline' && (
          <div className="manipulative-card">
            <div className="manipulative-header">
              <div>
                <h3>{isBn ? 'সংখ্যারেখা ও দূরত্বের স্কেল (১ম-৩য় শ্রেণি)' : 'Directed Number Line Scale (Class 1-3)'}</h3>
                <p className="meta">
                  {isBn
                    ? 'সংখ্যারেখায় নির্দিষ্ট দূরত্বে লাফ দিয়ে যোগ ও বিয়োগের বাস্তব রূপ।'
                    : 'Directed intervals demonstrating arithmetic leaps across positive coordinates.'}
                </p>
              </div>
            </div>
            <NumberLine
              step={{
                kind: 'jump',
                min: 0,
                max: 20,
                start: 4,
                jump: 7,
                current: 11,
                target: 11,
                operation: '+',
                noteBn: '৪ + ৭ = ১১ (ডানদিকে ৭ ধাপ লাফ)',
                noteEn: '4 + 7 = 11 (Jump forward by 7)',
              }}
            />
          </div>
        )}
        {slug === 'fractions' && (
          <div className="manipulative-card">
            <div className="manipulative-header">
              <div>
                <h3>{isBn ? 'ভগ্নাংশ সমতুল্যতা ও বিভাজন বার (৩য়-৪র্থ শ্রেণি)' : 'Fraction Partitioning Bars (Class 3-4)'}</h3>
                <p className="meta">
                  {isBn
                    ? '১/২ এবং ২/৪ এর দৈর্ঘ্য সমান তা বার কেটে সরাসরি মিলিয়ে দেখার মডেল।'
                    : 'Visually proved equivalence: 1/2 and 2/4 occupy identical linear spans.'}
                </p>
              </div>
            </div>
            <FractionBars
              step={{
                kind: 'compare',
                bars: [
                  { numerator: 1, denominator: 2, shaded: 1, label: '1/2', color: '#38bdf8' },
                  { numerator: 2, denominator: 4, shaded: 2, label: '2/4', color: '#34d399' },
                ],
                equivalent: true,
                noteBn: '১/২ এবং ২/৪ সমান দৈর্ঘ্য নির্দেশ করে।',
                noteEn: '1/2 and 2/4 span identical lengths.',
              }}
            />
          </div>
        )}
        {slug === 'multiplication' && <MultiplicationGrid lang={lang as Lang} />}
        {slug === 'decimals' && <DecimalsGrid lang={lang as Lang} />}
        {slug === 'geometry' && <GeoboardShapes lang={lang as Lang} />}
      </div>
    </div>
  );
}
