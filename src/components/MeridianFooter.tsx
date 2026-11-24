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
    <footer className="meridian-footer mt-16 border-t border-slate-800 bg-[#0a1827] text-slate-400 py-12 px-6 sm:px-12 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-7 h-7 text-emerald-400 shrink-0"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="font-bold text-slate-100 text-base">
              {isBn ? 'প্রাইমারি ভিজ্যুয়াল ল্যাব' : 'Primary Visual Lab'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBn
              ? 'প্রাথমিক গণিতে সংখ্যা কীভাবে বদলায়, তা চোখে দেখে বোঝার ওপেন সোর্স শিক্ষা প্ল্যাটফর্ম।'
              : 'Open-source visual mathematics laboratory designed for primary classroom screen workflows.'}
          </p>
          <div className="text-xs text-emerald-400 font-medium">
            {isBn ? '১০০% ফ্রি টিয়ার পরিচালিত · Atlas M0 + Vercel' : '100% Free-Tier Architecture · Atlas M0 + Vercel'}
          </div>
        </div>

        {/* Lessons Column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
            {isBn ? 'মূল পাঠসমূহ' : 'Visual Labs'}
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href={`/${lang}/lessons/subtraction-regrouping`} className="hover:text-amber-400 transition">
                {isBn ? 'হাতে রেখে বিয়োগ' : 'Subtraction with Regrouping'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/lessons/addition-regrouping`} className="hover:text-amber-400 transition">
                {isBn ? 'হাতে রেখে যোগ' : 'Addition with Regrouping'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/lessons`} className="hover:text-amber-400 transition">
                {isBn ? 'পাঠ ক্যাটালগ ও ফিল্টার' : 'Full Lesson Catalogue'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/lessons/subtraction-regrouping/print`} className="hover:text-amber-400 transition">
                {isBn ? 'ছাপার জন্য ওয়ার্কশিট' : 'Printable Worksheets'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Architecture & Challenges Column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
            {isBn ? 'উন্নত চ্যালেঞ্জ (Track A03/A07)' : 'Advanced Challenges'}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">A03:</span>
              <span>{isBn ? 'ক্যাপাবিলিটি মডেল ও নিরাপত্তা অডিট লগ' : 'Capability Security & Audit Logs'}</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">A07:</span>
              <span>{isBn ? 'বহু-ধাপ প্রকাশনা ওয়ার্কফ্লো ও রিকভারি' : 'Multi-Step Workflow & Recovery'}</span>
            </li>
            <li className="text-slate-500 pt-1">
              {isBn ? 'কঠোর CSP ও XSS সুরক্ষা সক্ষম' : 'Strict CSP & Security Headers Active'}
            </li>
          </ul>
        </div>

        {/* Standards & Accessibility Column */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
            {isBn ? 'মান ও গ্রহণযোগ্যতা' : 'Standards & A11y'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBn
              ? 'কীবোর্ড ও রিডিউসড মোশন সমর্থনসহ প্রজেক্টর উপযোগী উচ্চ কনট্রাস্ট ডিজাইন। কোনো অননুমোদিত ট্র্যাকার নেই।'
              : 'Classroom projector-ready high contrast, keyboard navigable, reduced-motion friendly with zero third-party trackers.'}
          </p>
          <p className="text-xs text-slate-500">
            {isBn ? 'লাইসেন্স: ওপেন সোর্স শিক্ষা গবেষণা' : 'Licence: Open Source Educational Research'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © 2026 Primary Visual Lab · Hack the Vibe 2026 (CODE-ARENAX)
        </div>
        <div className="flex gap-4">
          <a
            href="https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition"
          >
            GitHub Repository
          </a>
          <span>·</span>
          <span>Kalpurush Bangla Unicode Font</span>
        </div>
      </div>
    </footer>
  );
}
