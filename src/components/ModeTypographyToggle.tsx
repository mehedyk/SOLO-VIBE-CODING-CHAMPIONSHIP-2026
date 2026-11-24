'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lang } from '../lib/i18n/dict';
import { ThemeToggle } from './ui/curtain-theme-toggle';

export type UserMode = 'teacher' | 'student';

const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';
const DURATION = 550;

interface ModeTypographyToggleProps {
  lang: Lang;
}

export function ModeTypographyToggle({ lang }: ModeTypographyToggleProps) {
  const [mode, setMode] = useState<UserMode>('teacher');
  const [phase, setPhase] = useState<'idle' | 'falling' | 'rising'>('idle');
  const curtainColorRef = useRef<string>('#0f2a43');
  const isBn = lang === 'bn';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('primary_lab_mode') as UserMode | null;
      if (saved === 'student' || saved === 'teacher') {
        setMode(saved);
        document.documentElement.setAttribute('data-mode', saved);
      } else {
        document.documentElement.setAttribute('data-mode', 'teacher');
      }
    } catch {
      document.documentElement.setAttribute('data-mode', 'teacher');
    }
  }, []);

  const toggleMode = useCallback(() => {
    if (phase !== 'idle') return;
    const next: UserMode = mode === 'teacher' ? 'student' : 'teacher';

    // Set curtain color based on mode
    curtainColorRef.current = next === 'student' ? '#fbbf24' : '#0f2a43';
    setPhase('falling');

    setTimeout(() => {
      setMode(next);
      try {
        localStorage.setItem('primary_lab_mode', next);
      } catch {}
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-mode', next);
      }

      setPhase('rising');
      setTimeout(() => setPhase('idle'), DURATION + 60);
    }, DURATION);
  }, [phase, mode]);

  const curtainStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: curtainColorRef.current,
    transformOrigin: 'top',
    transform: phase === 'falling' ? 'scaleY(1)' : 'scaleY(0)',
    transition: phase !== 'idle' ? `transform ${DURATION}ms ${EASING}` : 'none',
    zIndex: 9997,
    pointerEvents: 'none',
    opacity: 0.95,
  };

  return (
    <div className="flex items-center gap-2">
      {/* Curtain animation overlay */}
      <div aria-hidden="true" style={curtainStyle} />

      {/* Typography Mode Toggle Button */}
      <button
        onClick={toggleMode}
        type="button"
        className={`mode-toggle-btn px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm border ${
          mode === 'teacher'
            ? 'bg-slate-800 text-amber-300 border-amber-400/40 hover:bg-slate-700'
            : 'bg-amber-400 text-slate-950 border-amber-500 hover:bg-amber-300'
        }`}
        title={
          mode === 'teacher'
            ? isBn
              ? 'শিক্ষার্থী মোডে বদলান (প্লেফুল ফ্রন্ট)'
              : 'Switch to Student Mode (Playful Typography)'
            : isBn
              ? 'শিক্ষক মোডে বদলান (ফর্মাল ফ্রন্ট)'
              : 'Switch to Teacher Mode (Formal Typography)'
        }
        aria-label="Toggle typography mode between teacher and student"
      >
        {mode === 'teacher' ? (
          <>
            <span className="text-sm">👨‍🏫</span>
            <span className="font-serif tracking-wide">{isBn ? 'শিক্ষক মোড (ফর্মাল)' : 'Teacher (Formal)'}</span>
          </>
        ) : (
          <>
            <span className="text-sm">🎒</span>
            <span className="tracking-tight">{isBn ? 'শিক্ষার্থী মোড (মজার)' : 'Student (Playful)'}</span>
          </>
        )}
      </button>

      {/* Curtain Theme Toggle Icon */}
      <div className="hidden sm:flex items-center">
        <ThemeToggle variant="icon" defaultTheme="dark" duration={DURATION} buttonSize={32} />
      </div>
    </div>
  );
}
