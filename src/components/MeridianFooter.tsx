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
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="footer-brand-mark"
                style={{ width: '28px', height: '28px', minWidth: '28px', maxWidth: '28px' }}
                aria-hidden="true"
              >
                {/* Ten-rod stem */}
                <rect x="6" y="4" width="8" height="32" rx="2" fill="#34d399" />
                {/* Ones squares forming P */}
                <rect x="18" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
                <rect x="26" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
                <rect x="26" y="12" width="6" height="6" rx="1.5" fill="#fbbf24" />
                <rect x="26" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
                <rect x="18" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
              </svg>
              <span className="footer-brand-title">
                {isBn ? 'প্রাইমারি ভিজ্যুয়াল ল্যাব' : 'Primary Visual Lab'}
              </span>
            </div>
            <p className="footer-brand-desc">
              {isBn
                ? 'প্রাথমিক গণিতে সংখ্যা কীভাবে বদলায়, তা চোখে দেখে বোঝার ওপেন সোর্স শিক্ষা প্ল্যাটফর্ম।'
                : 'Open-source visual mathematics laboratory designed for primary classroom screen workflows.'}
            </p>
            <div className="footer-free-tier">
              {isBn ? '১০০% ফ্রি টিয়ার পরিচালিত · Atlas M0 + Vercel' : '100% Free-Tier Architecture · Atlas M0 + Vercel'}
            </div>
          </div>

          {/* Lessons Column */}
          <div className="footer-col">
            <h4>{isBn ? 'মূল পাঠসমূহ' : 'Visual Labs'}</h4>
            <ul className="footer-links">
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping`}>
                  {isBn ? 'হাতে রেখে বিয়োগ' : 'Subtraction with Regrouping'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons/addition-regrouping`}>
                  {isBn ? 'হাতে রেখে যোগ' : 'Addition with Regrouping'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons`}>
                  {isBn ? 'পাঠ ক্যাটালগ ও ফিল্টার' : 'Full Lesson Catalogue'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/lessons/subtraction-regrouping/print`}>
                  {isBn ? 'ছাপার জন্য ওয়ার্কশিট' : 'Printable Worksheets'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Challenges Column */}
          <div className="footer-col">
            <h4>{isBn ? 'উন্নত চ্যালেঞ্জ (Track A03/A07)' : 'Advanced Challenges'}</h4>
            <ul className="footer-links" style={{ color: '#94a3b8' }}>
              <li>
                <strong style={{ color: '#34d399' }}>A03:</strong>{' '}
                {isBn ? 'ক্যাপাবিলিটি মডেল ও নিরাপত্তা অডিট লগ' : 'Capability Security & Audit Logs'}
              </li>
              <li>
                <strong style={{ color: '#34d399' }}>A07:</strong>{' '}
                {isBn ? 'বহু-ধাপ প্রকাশনা ওয়ার্কফ্লো ও রিকভারি' : 'Multi-Step Workflow & Recovery'}
              </li>
              <li style={{ color: '#64748b', fontSize: '0.8rem' }}>
                {isBn ? 'কঠোর CSP ও XSS সুরক্ষা সক্ষম' : 'Strict CSP & Security Headers Active'}
              </li>
            </ul>
          </div>

          {/* Standards & Accessibility Column */}
          <div className="footer-col">
            <h4>{isBn ? 'মান ও গ্রহণযোগ্যতা' : 'Standards & A11y'}</h4>
            <p>
              {isBn
                ? 'কীবোর্ড ও রিডিউসড মোশন সমর্থনসহ প্রজেক্টর উপযোগী উচ্চ কনট্রাস্ট ডিজাইন। কোনো অননুমোদিত ট্র্যাকার নেই।'
                : 'Classroom projector-ready high contrast, keyboard navigable, reduced-motion friendly with zero third-party trackers.'}
            </p>
            <p style={{ color: '#64748b' }}>
              {isBn ? 'লাইসেন্স: ওপেন সোর্স শিক্ষা গবেষণা' : 'Licence: Open Source Educational Research'}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 Primary Visual Lab · Hack the Vibe 2026 (CODE-ARENAX)
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <a
              href="https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
            <span>·</span>
            <span>Kalpurush Bangla Unicode Font</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
