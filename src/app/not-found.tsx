import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-page min-h-screen bg-[#0a1827] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        {/* 'P' monogram brand mark */}
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl bg-slate-800 border border-slate-700/80">
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="6" y="4" width="8" height="32" rx="2" fill="#34d399" />
            <rect x="18" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="4" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="12" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="26" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
            <rect x="18" y="20" width="6" height="6" rx="1.5" fill="#fbbf24" />
          </svg>
        </div>

        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          ত্রুটি ৪০৪ · ৪04 Page Not Found
        </span>

        <h1 className="text-3xl font-extrabold text-slate-100 mb-3">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          The requested lesson or route is not on the map or may have been moved.
          নিচের বোতামগুলো ব্যবহার করে মূল পাতায় বা পাঠ ক্যাটালগে ফিরে যান।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/bn"
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-md"
          >
            মূল পাতা (Home)
          </Link>
          <Link
            href="/bn/lessons"
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
          >
            পাঠ তালিকা (Lessons)
          </Link>
        </div>
      </div>
    </div>
  );
}
