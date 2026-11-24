'use client';

import React from 'react';
import Link from 'next/link';
import { Lang } from '../lib/i18n/dict';

interface MeadowbellHeroProps {
  lang: Lang;
  appName: string;
  tagline: string;
  browseLabel: string;
}

export function MeadowbellHero({ lang, appName, tagline, browseLabel }: MeadowbellHeroProps) {
  const isBn = lang === 'bn';

  return (
    <div className="meadowbell-hero relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f2a43] via-[#163a5c] to-[#0f2a43] text-white p-6 sm:p-10 mb-8 border border-sky-900/60 shadow-xl">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isBn ? '১০ একক = ১ দশক · দৃশ্যমান গাণিতিক ভিত্তি' : '10 Ones = 1 Ten · Visual Mathematical Foundations'}
        </div>

        {/* Heading & Tagline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-slate-50">
          {appName}
        </h1>
        <p className="text-lg sm:text-xl text-sky-200/90 font-medium max-w-2xl mb-8">
          {tagline}
        </p>

        {/* Hero Visual Chapter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8 text-left">
          {/* Card 1: Regrouping */}
          <Link
            href={`/${lang}/lessons/subtraction-regrouping`}
            className="group block p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/60 transition shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isBn ? 'স্থান মান' : 'Place Value'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">Class 2-3</span>
            </div>
            <h3 className="font-bold text-slate-100 group-hover:text-amber-300 transition text-base">
              {isBn ? 'হাতে রেখে বিয়োগ ও যোগ' : 'Regrouping & Exchange'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn ? 'দশক ভেঙে একক করার প্রত্যক্ষ রূপ' : '10 ones regroup into 1 ten with invariant value'}
            </p>
          </Link>

          {/* Card 2: Fraction Bars */}
          <Link
            href={`/${lang}/lessons`}
            className="group block p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-sky-400/60 transition shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {isBn ? 'ভগ্নাংশ' : 'Fractions'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">Class 3-4</span>
            </div>
            <h3 className="font-bold text-slate-100 group-hover:text-sky-300 transition text-base">
              {isBn ? 'ভগ্নাংশ বার ও সমতুল্যতা' : 'Fraction Bars & Equivalence'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn ? '১/২ = ২/৪ = ৪/৮ বার কেটে তুলনা' : 'Partitioning bars to visually prove equivalence'}
            </p>
          </Link>

          {/* Card 3: Number Line */}
          <Link
            href={`/${lang}/lessons`}
            className="group block p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-400/60 transition shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isBn ? 'সংখ্যারেখা' : 'Number Line'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">Class 1-3</span>
            </div>
            <h3 className="font-bold text-slate-100 group-hover:text-emerald-300 transition text-base">
              {isBn ? 'সংখ্যারেখায় লাফ' : 'Number Line Jumps'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn ? 'ডানে ও বামে লাফিয়ে যোগ-বিয়োগ' : 'Forward and backward directed steps on axis'}
            </p>
          </Link>
        </div>

        {/* Primary CTA Action */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${lang}/lessons`}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg hover:shadow-amber-500/20"
          >
            {browseLabel} →
          </Link>
          <Link
            href={`/${lang}/lessons/subtraction-regrouping/present`}
            className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-600 transition"
          >
            {isBn ? 'শ্রেণিকক্ষ মোড খুলুন' : 'Open Classroom Presenter'}
          </Link>
        </div>
      </div>
    </div>
  );
}
