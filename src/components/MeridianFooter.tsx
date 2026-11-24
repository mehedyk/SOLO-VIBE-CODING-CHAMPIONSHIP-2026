'use client';

import React from 'react';
import Link from 'next/link';
import { Lang } from '../lib/i18n/dict';

interface MeridianFooterProps {
  lang: Lang;
}

export function MeridianFooter({ lang }: MeridianFooterProps) {
  const isBn = lang === 'bn';

  return (
    <footer className="meridian-footer">
      {/* Living Ambient Video Background from 404 resource */}
      <div className="footer-video-wrap" aria-hidden="true">
        <video
          className="footer-ambient-video"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
        >
          <source src="/video/meridian_ambient.mp4" type="video/mp4" />
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_144832_2b6b23aa-4416-4fcb-9df4-132349c59edc.mp4"
            type="video/mp4"
          />
        </video>
        <div className="footer-video-scrim" />
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img
                src="/images/logo_mark.svg"
                alt="Primary Visual Lab Logo"
                className="footer-brand-mark"
                width={32}
                height={32}
                style={{ width: '32px', height: '32px' }}
              />
              <span className="footer-brand-title">
                {isBn ? 'প্রাইমারি ভিজ্যুয়াল ল্যাব' : 'Primary Visual Lab'}
              </span>
            </div>
            <p className="footer-brand-desc">
              {isBn
                ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত প্রাথমিক গণিতের সকল অধ্যায়ের ভিজ্যুয়াল ও ইন্টারঅ্যাক্টিভ শিক্ষা প্ল্যাটফর্ম।'
                : 'Interactive visual mathematics laboratory designed for primary school students and educators based on national curriculum.'}
            </p>
            <div className="footer-curriculum-badge">
              {isBn ? '✓ ১ম থেকে ৫ম শ্রেণি সম্পূর্ণ কারিকুলাম' : '✓ Full Curriculum: Classes 1 to 5'}
            </div>
          </div>

          {/* Curriculum Classes Column */}
          <div className="footer-col">
            <h4>{isBn ? 'শ্রেণিভিত্তিক পাঠসমূহ' : 'Curriculum by Class'}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${lang}/lessons?grade=1`}>
                  {isBn ? '১ম শ্রেণি: গণনা ও প্রাথমিক আকৃতি' : 'Class 1: Counting & Basic Shapes'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping`}>
                  {isBn ? '২য় শ্রেণি: স্থানীয় মান ও রিগ্রুপিং' : 'Class 2: Place Value & Regrouping'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons?grade=3`}>
                  {isBn ? '৩য় শ্রেণি: ভগ্নাংশ ও জ্যামিতিক কোণ' : 'Class 3: Fractions & Angles'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons?grade=4`}>
                  {isBn ? '৪র্থ শ্রেণি: সমতুল্য ভগ্নাংশ ও দশমিক' : 'Class 4: Decimals & Equivalence'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons?grade=5`}>
                  {isBn ? '৫ম শ্রেণি: ঐকিক নিয়ম ও উপাত্ত' : 'Class 5: Unitary Method & Charts'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Visual Manipulatives Column */}
          <div className="footer-col">
            <h4>{isBn ? 'ভিজ্যুয়াল ম্যানিপুলেটিভ' : 'Visual Manipulatives'}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping`}>
                  {isBn ? 'দশকের ব্লক ও এক্সচেঞ্জ' : 'Base-10 Blocks & Exchange'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons`}>
                  {isBn ? 'ভগ্নাংশ বার কাটার বোর্ড' : 'Fraction Partitioning Bars'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons`}>
                  {isBn ? 'সংখ্যারেখা ও দূরত্বের স্কেল' : 'Directed Number Line Scale'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons`}>
                  {isBn ? 'গুণন ম্যাট্রিক্স ও আয়তাকার গ্রিড' : 'Multiplication Array Grid'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Teacher & Offline Tools Column */}
          <div className="footer-col">
            <h4>{isBn ? 'শিক্ষক ও অফলাইন সুবিধা' : 'Teacher & Offline'}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping/present`}>
                  {isBn ? 'প্রজেক্টর মোড (শ্রেণিকক্ষ)' : 'Classroom Projector Mode'}
                </Link>
              </li>
              <li>
                <Link href={`/api/slides/subtraction-regrouping`} download>
                  {isBn ? 'অফলাইন স্লাইড ডেক (HTML)' : 'Download Offline Slides (HTML)'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping/print`}>
                  {isBn ? 'ছাপানোর জন্য ওয়ার্কশিট' : 'Printable Worksheets'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/login`}>
                  {isBn ? 'ডেমো অ্যাকাউন্টস (১-ক্লিক লগইন)' : 'Demo Accounts (1-Click Login)'}
                </Link>
              </li>
            </ul>
          </div>
          {/* National Primary Portals Column */}
          <div className="footer-col">
            <h4>{isBn ? 'জাতীয় প্রাথমিক পোর্টাল' : 'National BD Portals'}</h4>
            <ul className="footer-links">
              <li>
                <a href="http://www.nctb.gov.bd" target="_blank" rel="noopener noreferrer">
                  {isBn ? 'এনসিটিবি (NCTB কারিকুলাম)' : 'NCTB (Curriculum & Books)'} ↗
                </a>
              </li>
              <li>
                <a href="https://dpe.gov.bd" target="_blank" rel="noopener noreferrer">
                  {isBn ? 'প্রাথমিক শিক্ষা অধিদপ্তর (DPE)' : 'Directorate of Primary Ed'} ↗
                </a>
              </li>
              <li>
                <a href="https://www.teachers.gov.bd" target="_blank" rel="noopener noreferrer">
                  {isBn ? 'শিক্ষক বাতায়ন (পাঠ পরিকল্পনা)' : 'Teachers\' Portal (Batayon)'} ↗
                </a>
              </li>
              <li>
                <a href="https://muktopaath.gov.bd" target="_blank" rel="noopener noreferrer">
                  {isBn ? 'মুক্তপাঠ ই-লার্নিং নেটওয়ার্ক' : 'Muktopaath E-Learning'} ↗
                </a>
              </li>
              <li>
                <a href="https://konnect.edu.bd" target="_blank" rel="noopener noreferrer">
                  {isBn ? 'কিশোর বাতায়ন (Konnect)' : 'Kishore Batayon (Konnect)'} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 {isBn ? 'প্রাইমারি ভিজ্যুয়াল ল্যাব · জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত গবেষণা' : 'Primary Visual Lab · National Primary Mathematics Research'}
          </div>
          <div className="footer-bottom-links">
            <Link href={`/${lang}/lessons`}>{isBn ? 'সকল পাঠ' : 'All Lessons'}</Link>
            <span>·</span>
            <Link href={`/${lang}/login`}>{isBn ? 'লগইন ও ভূমিকা' : 'Login & Roles'}</Link>
            <span>·</span>
            <a href="http://www.nctb.gov.bd" target="_blank" rel="noopener noreferrer">
              NCTB.gov.bd
            </a>
            <span>·</span>
            <a href="https://www.teachers.gov.bd" target="_blank" rel="noopener noreferrer">
              Teachers.gov.bd
            </a>
            <span>·</span>
            <a
              href="https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
