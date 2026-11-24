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

  const switchMode = useCallback(
    (targetMode: UserMode) => {
      if (phase !== 'idle' || mode === targetMode) return;

      // Set curtain accent color based on mode
      curtainColorRef.current = targetMode === 'student' ? '#fbbf24' : '#0f2a43';
      setPhase('falling');

      setTimeout(() => {
        setMode(targetMode);
        try {
          localStorage.setItem('primary_lab_mode', targetMode);
        } catch {}
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-mode', targetMode);
        }

        setPhase('rising');
        setTimeout(() => setPhase('idle'), DURATION + 60);
      }, DURATION);
    },
    [phase, mode]
  );

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
    <div className="header-control-cluster">
      {/* Curtain animation overlay */}
      <div aria-hidden="true" style={curtainStyle} />

      {/* Segmented Mode Switcher (Teacher Formal vs Student Playful) */}
      <div
        className="segmented-mode-switch"
        role="group"
        aria-label="Typography and Audience Mode"
      >
        <button
          type="button"
          onClick={() => switchMode('teacher')}
          className={`segment-btn ${mode === 'teacher' ? 'active' : ''}`}
          title={isBn ? 'শিক্ষক মোড (ফর্মাল টাইপোগ্রাফি)' : 'Teacher Mode (Formal Typography)'}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span className="segment-label">{isBn ? 'শিক্ষক' : 'Teacher'}</span>
        </button>

        <button
          type="button"
          onClick={() => switchMode('student')}
          className={`segment-btn ${mode === 'student' ? 'active' : ''}`}
          title={isBn ? 'শিক্ষার্থী মোড (মজার ও প্লেফুল ফন্ট)' : 'Student Mode (Playful Typography)'}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="segment-label">{isBn ? 'শিক্ষার্থী' : 'Student'}</span>
        </button>
      </div>

      {/* Curtain Theme Toggle (Light / Dark) */}
      <div className="theme-toggle-cluster-item" title="Toggle Light/Dark Theme">
        <ThemeToggle variant="icon" defaultTheme="dark" duration={DURATION} buttonSize={34} />
      </div>
    </div>
  );
}
