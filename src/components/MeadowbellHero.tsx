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
      {/* Background Living Motion Scene */}
      <div className="hero-scene-wrap" aria-hidden="true">
        <picture>
          <source srcSet="/meadowbell/plate_crisp.webp" type="image/webp" />
          <source srcSet="/meadowbell/plate_original.jpg" type="image/jpeg" />
          <img
            src="/meadowbell/plate_crisp.webp"
            alt="Meadowbell living visual landscape"
            className="hero-plate-bg"
            loading="eager"
          />
        </picture>
        <video
          className="hero-motion-video"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src="/meadowbell/scene_motion.mp4" type="video/mp4" />
          <source
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/d2cb5bef-f92b-4e91-ae93-8dc6555e56ac.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-scene-scrim" />
      </div>

      <div className="hero-container">
        {/* Animated Badge */}
        <div className="hero-badge">
          <span className="pulse-dot" />
          <span>
            {isBn
              ? 'জাতীয় শিক্ষাক্রম (NCTB) ১ম থেকে ৫ম শ্রেণি · দৃশ্যমান গাণিতিক ভিত্তি'
              : 'NCTB Curriculum Class 1 to 5 · Concrete-Pictorial-Abstract Math'}
          </span>
        </div>

        {/* Heading & Tagline */}
        <h1 className="hero-title">{appName}</h1>
        <p className="hero-tagline">{tagline}</p>

        {/* Hero Visual Chapter Cards with Meadowbell Crisp Artwork */}
        <div className="hero-grid">
          {/* Card 1: Regrouping */}
          <Link
            href={`/${lang}/lessons/subtraction-regrouping`}
            className="hero-card hero-card-with-art"
          >
            <div className="hero-card-thumb">
              <picture>
                <source srcSet="/meadowbell/card1_crisp.webp" type="image/webp" />
                <img
                  src="/meadowbell/card1_crisp.webp"
                  alt="Regrouping & Exchange artwork"
                  loading="lazy"
                />
              </picture>
              <span className="hero-card-grade-badge">Class 2-3</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-card-topic" style={{ color: '#fbbf24' }}>
                {isBn ? 'স্থান মান ও রিগ্রুপিং' : 'Place Value & Exchange'}
              </div>
              <h3 className="hero-card-title">
                {isBn ? 'হাতে রেখে বিয়োগ ও যোগ' : 'Regrouping & Exchange'}
              </h3>
              <p className="hero-card-desc">
                {isBn
                  ? '১০ একক = ১ দশক; মান অপরিবর্তিত রেখে ভাঙা ও গড়া।'
                  : '10 ones bundle into 1 ten with invariant sum.'}
              </p>
            </div>
          </Link>

          {/* Card 2: Fraction Bars */}
          <Link
            href={`/${lang}/lessons`}
            className="hero-card hero-card-with-art"
          >
            <div className="hero-card-thumb">
              <picture>
                <source srcSet="/meadowbell/card2_crisp.webp" type="image/webp" />
                <img
                  src="/meadowbell/card2_crisp.webp"
                  alt="Fraction Bars & Equivalence artwork"
                  loading="lazy"
                />
              </picture>
              <span className="hero-card-grade-badge">Class 3-4</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-card-topic" style={{ color: '#38bdf8' }}>
                {isBn ? 'ভগ্নাংশ ও সমতুল্যতা' : 'Fractions & Equivalence'}
              </div>
              <h3 className="hero-card-title">
                {isBn ? 'ভগ্নাংশ বার ও সমতুল্যতা' : 'Fraction Bars & Equivalence'}
              </h3>
              <p className="hero-card-desc">
                {isBn
                  ? '১/২ = ২/৪ = ৪/৮ বার কেটে সরাসরি চোখে প্রমাণ।'
                  : 'Cut and align bars to visually prove equivalence.'}
              </p>
            </div>
          </Link>

          {/* Card 3: Number Line */}
          <Link
            href={`/${lang}/lessons`}
            className="hero-card hero-card-with-art"
          >
            <div className="hero-card-thumb">
              <picture>
                <source srcSet="/meadowbell/card3_crisp.webp" type="image/webp" />
                <img
                  src="/meadowbell/card3_crisp.webp"
                  alt="Number Line Jumps artwork"
                  loading="lazy"
                />
              </picture>
              <span className="hero-card-grade-badge">Class 1-3</span>
            </div>
            <div className="hero-card-body">
              <div className="hero-card-topic" style={{ color: '#34d399' }}>
                {isBn ? 'সংখ্যারেখা ও দূরত্ব' : 'Number Line & Distance'}
              </div>
              <h3 className="hero-card-title">
                {isBn ? 'সংখ্যারেখায় লাফ' : 'Number Line Jumps'}
              </h3>
              <p className="hero-card-desc">
                {isBn
                  ? 'ডানে-বামে লাফিয়ে যোগ, বিয়োগ ও ধনাত্মক মান বোঝা।'
                  : 'Directed steps on scale for intuitive addition & subtraction.'}
              </p>
            </div>
          </Link>
        </div>

        {/* Primary CTA Actions */}
        <div className="hero-actions">
          <Link href={`/${lang}/lessons`} className="hero-btn-primary">
            {browseLabel} (Class 1 - 5) →
          </Link>
          <Link
            href={`/${lang}/lessons/subtraction-regrouping/present`}
            className="hero-btn-secondary"
          >
            {isBn ? '🖥️ শ্রেণিকক্ষ প্রজেক্টর মোড' : '🖥️ Classroom Presenter'}
          </Link>
          <Link
            href={`/api/slides/subtraction-regrouping`}
            className="hero-btn-slide"
            download
          >
            {isBn ? '📥 অফলাইন স্লাইড ডেক (HTML)' : '📥 Offline Slide Deck (HTML)'}
          </Link>
        </div>
      </div>
    </div>
  );
}
