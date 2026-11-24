'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected errors
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="error-container min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-lg w-full bg-slate-900/95 border border-rose-900/40 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 mb-2 flex items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <svg className="w-8 h-8 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <span className="text-rose-400 text-xs font-bold uppercase tracking-wider mt-2 mb-1">
          অনাকাঙ্ক্ষিত ত্রুটি · Runtime Notice
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          একটি অপ্রত্যাশিত সমস্যা হয়েছে
        </h1>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
          {error?.message || 'The application encountered an unexpected runtime state. You can try reloading the step or return safely to the home page.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-md cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            আবার চেষ্টা করুন (Try Again)
          </button>
          <Link
            href="/bn"
            className="inline-flex items-center justify-center py-2.5 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
          >
            মূল পাতায় ফিরুন
          </Link>
        </div>

        <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-800/80 w-full">
          Primary Visual Lab · Safe recovery enabled.
        </p>
      </div>
    </div>
  );
}
