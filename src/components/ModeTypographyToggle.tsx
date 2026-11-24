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
    <div className="mode-toggle-wrap">
      {/* Curtain animation overlay */}
      <div aria-hidden="true" style={curtainStyle} />

      {/* Typography Mode Toggle Button */}
      <button
        onClick={toggleMode}
        type="button"
        className={`mode-toggle-btn ${mode === 'teacher' ? 'mode-teacher' : 'mode-student'}`}
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
            <span className="mode-icon">👨‍🏫</span>
            <span className="mode-label">{isBn ? 'শিক্ষক মোড (ফর্মাল)' : 'Teacher (Formal)'}</span>
          </>
        ) : (
          <>
            <span className="mode-icon">🎨</span>
            <span className="mode-label">{isBn ? 'শিক্ষার্থী মোড (প্লেফুল)' : 'Student (Playful)'}</span>
          </>
        )}
      </button>

      {/* Curtain Theme Toggle Icon */}
      <div className="theme-toggle-inline">
        <ThemeToggle variant="icon" defaultTheme="dark" duration={DURATION} buttonSize={32} />
      </div>
    </div>
  );
}
