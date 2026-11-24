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
    <div className="meadowbell-hero">
      <div className="hero-container">
        {/* Animated Badge */}
        <div className="hero-badge">
          <span className="pulse-dot" />
          <span>{isBn ? '১০ একক = ১ দশক · দৃশ্যমান গাণিতিক ভিত্তি' : '10 Ones = 1 Ten · Visual Mathematical Foundations'}</span>
        </div>

        {/* Heading & Tagline */}
        <h1 className="hero-title">
          {appName}
        </h1>
        <p className="hero-tagline">
          {tagline}
        </p>

        {/* Hero Visual Chapter Cards */}
        <div className="hero-grid">
          {/* Card 1: Regrouping */}
          <Link
            href={`/${lang}/lessons/subtraction-regrouping`}
            className="hero-card"
          >
            <div className="hero-card-header">
              <span className="hero-card-topic" style={{ color: '#fbbf24' }}>
                {isBn ? 'স্থান মান' : 'Place Value'}
              </span>
              <span className="hero-card-grade">Class 2-3</span>
            </div>
            <h3 className="hero-card-title">
              {isBn ? 'হাতে রেখে বিয়োগ ও যোগ' : 'Regrouping & Exchange'}
            </h3>
            <p className="hero-card-desc">
              {isBn ? 'দশক ভেঙে একক করার প্রত্যক্ষ রূপ' : '10 ones regroup into 1 ten with invariant value'}
            </p>
          </Link>

          {/* Card 2: Fraction Bars */}
          <Link
            href={`/${lang}/lessons`}
            className="hero-card"
          >
            <div className="hero-card-header">
              <span className="hero-card-topic" style={{ color: '#38bdf8' }}>
                {isBn ? 'ভগ্নাংশ' : 'Fractions'}
              </span>
              <span className="hero-card-grade">Class 3-4</span>
            </div>
            <h3 className="hero-card-title">
              {isBn ? 'ভগ্নাংশ বার ও সমতুল্যতা' : 'Fraction Bars & Equivalence'}
            </h3>
            <p className="hero-card-desc">
              {isBn ? '১/২ = ২/৪ = ৪/৮ বার কেটে তুলনা' : 'Partitioning bars to visually prove equivalence'}
            </p>
          </Link>

          {/* Card 3: Number Line */}
          <Link
            href={`/${lang}/lessons`}
            className="hero-card"
          >
            <div className="hero-card-header">
              <span className="hero-card-topic" style={{ color: '#34d399' }}>
                {isBn ? 'সংখ্যারেখা' : 'Number Line'}
              </span>
              <span className="hero-card-grade">Class 1-3</span>
            </div>
            <h3 className="hero-card-title">
              {isBn ? 'সংখ্যারেখায় লাফ' : 'Number Line Jumps'}
            </h3>
            <p className="hero-card-desc">
              {isBn ? 'ডানে ও বামে লাফিয়ে যোগ-বিয়োগ' : 'Forward and backward directed steps on axis'}
            </p>
          </Link>
        </div>

        {/* Primary CTA Action */}
        <div className="hero-actions">
          <Link
            href={`/${lang}/lessons`}
            className="hero-btn-primary"
          >
            {browseLabel} →
          </Link>
          <Link
            href={`/${lang}/lessons/subtraction-regrouping/present`}
            className="hero-btn-secondary"
          >
            {isBn ? 'শ্রেণিকক্ষ মোড খুলুন' : 'Open Classroom Presenter'}
          </Link>
        </div>
      </div>
    </div>
  );
}
