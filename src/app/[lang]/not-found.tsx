import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-container min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        {/* Brand Compass / Monogram Mark */}
        <div className="w-16 h-16 mb-2 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700/80">
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="6" y="4" width="8" height="32" rx="2" fill="#34d399" />
            <rect x="18" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="12" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="18" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
          </svg>
        </div>

        {/* 404 Display */}
        <div className="text-6xl sm:text-7xl font-extrabold text-amber-400 font-serif tracking-tight mt-2 mb-1">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          Off the Beaten Track · পথ ভুল হয়েছে
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
          যে পাঠ বা পৃষ্ঠাটি খুঁজছেন তা মানচিত্রে পাওয়া যায়নি। হয়তো ঠিকানা ভুল হয়েছে অথবা পৃষ্ঠাটি সরানো হয়েছে। নিচের বোতামের মাধ্যমে নিরাপদে মূল পাতায় ফিরে যান।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/bn"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            মূল পাতায় ফিরুন
          </Link>
          <Link
            href="/bn/lessons"
            className="inline-flex items-center justify-center py-2.5 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
          >
            পাঠ তালিকা দেখুন
          </Link>
        </div>

        <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-800/80 w-full">
          Primary Visual Lab · All trails lead home.
        </p>
      </div>
    </div>
  );
}
