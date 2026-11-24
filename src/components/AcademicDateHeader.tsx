'use client';

import React from 'react';
import { Lang } from '../lib/i18n/dict';
import { getAcademicDate } from '../lib/i18n/banglaDate';

interface AcademicDateHeaderProps {
  lang: Lang;
}

export function AcademicDateHeader({ lang }: AcademicDateHeaderProps) {
  const isBn = lang === 'bn';
  const { dateStr, banglaYearStr, termNotice } = getAcademicDate(lang);

  return (
    <div className="academic-date-bar" role="complementary" aria-label="Academic Calendar and Session">
      <div className="academic-date-inner">
        <div className="academic-date-left">
          <span className="cal-icon" aria-hidden="true">📅</span>
          <span className="date-text">{dateStr}</span>
          <span className="dot-sep" aria-hidden="true">·</span>
          <span className="bangla-year-badge">{banglaYearStr}</span>
        </div>

        <div className="academic-date-right">
          <span className="academic-term-badge">
            <span className="live-dot" aria-hidden="true" />
            <span>{termNotice}</span>
          </span>
          <span className="dot-sep hide-mobile" aria-hidden="true">·</span>
          <a
            href="http://www.nctb.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="academic-portal-link hide-mobile"
          >
            NCTB কারিকুলাম ↗
          </a>
        </div>
      </div>
    </div>
  );
}
