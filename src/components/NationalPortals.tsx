'use client';

import React from 'react';
import { Lang } from '../lib/i18n/dict';

interface PortalItem {
  nameBn: string;
  nameEn: string;
  deptBn: string;
  deptEn: string;
  url: string;
  icon: string;
  tagBn: string;
  tagEn: string;
}

export const BD_PRIMARY_PORTALS: readonly PortalItem[] = [
  {
    nameBn: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)',
    nameEn: 'National Curriculum & Textbook Board (NCTB)',
    deptBn: 'প্রাথমিক পাঠ্যবই ও মূল্যায়ন নির্দেশিকা',
    deptEn: 'Primary Textbooks & Curriculum Framework',
    url: 'http://www.nctb.gov.bd',
    icon: '📖',
    tagBn: 'পাঠ্যবই ও সিলেবাস',
    tagEn: 'Curriculum & Books',
  },
  {
    nameBn: 'প্রাথমিক শিক্ষা অধিদপ্তর (DPE)',
    nameEn: 'Directorate of Primary Education (DPE)',
    deptBn: 'সারাদেশের প্রাথমিক বিদ্যালয় পরিচালনা',
    deptEn: 'National Primary School Administration',
    url: 'https://dpe.gov.bd',
    icon: '🏛️',
    tagBn: 'প্রাথমিক শিক্ষা কার্যক্রম',
    tagEn: 'Primary Education Gov',
  },
  {
    nameBn: 'প্রাথমিক ও গণশিক্ষা মন্ত্রণালয় (MoPME)',
    nameEn: 'Ministry of Primary & Mass Education',
    deptBn: 'জাতীয় প্রাথমিক শিক্ষা নীতি ও উন্নয়ন',
    deptEn: 'National Primary Policy & Strategy',
    url: 'https://mopme.gov.bd',
    icon: '🇧🇩',
    tagBn: 'মন্ত্রণালয় পোর্টাল',
    tagEn: 'Ministry Portal',
  },
  {
    nameBn: 'শিক্ষক বাতায়ন (Teachers\' Portal)',
    nameEn: 'Teachers\' Portal (Shikkhok Batayon)',
    deptBn: 'শিক্ষকদের তৈরি ডিজিটাল পাঠ পরিকল্পনা ও প্রেজেন্টেশন',
    deptEn: 'Educator Content & Digital Lesson Plans',
    url: 'https://www.teachers.gov.bd',
    icon: '👩‍🏫',
    tagBn: 'শিক্ষক রিসোর্স',
    tagEn: 'Teacher Hub',
  },
  {
    nameBn: 'মুক্তপাঠ ই-লার্নিং (Muktopaath)',
    nameEn: 'Muktopaath E-Learning Platform',
    deptBn: 'শিক্ষক প্রশিক্ষণ ও আধুনিক শিক্ষাদান কোর্স',
    deptEn: 'Teacher Continuous Professional Development',
    url: 'https://muktopaath.gov.bd',
    icon: '💻',
    tagBn: 'ই-লার্নিং ও প্রশিক্ষণ',
    tagEn: 'Teacher Training',
  },
  {
    nameBn: 'কিশোর বাতায়ন (Konnect)',
    nameEn: 'Kishore Batayon (Konnect)',
    deptBn: 'শিক্ষার্থীদের জন্য আনন্দময় শিক্ষামূলক প্ল্যাটফর্ম',
    deptEn: 'Interactive Student Co-Curricular Learning',
    url: 'https://konnect.edu.bd',
    icon: '📱',
    tagBn: 'শিক্ষার্থী পোর্টাল',
    tagEn: 'Student Portal',
  },
];

interface NationalPortalsProps {
  lang: Lang;
}

export function NationalPortals({ lang }: NationalPortalsProps) {
  const isBn = lang === 'bn';

  return (
    <section className="national-portals-section">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.6rem' }}>🇧🇩</span>
          <h2>
            {isBn
              ? 'বাংলাদেশ প্রাথমিক শিক্ষা নেটওয়ার্ক ও সহযোগী পোর্টাল'
              : 'Bangladesh National Primary Education Network & Portals'}
          </h2>
        </div>
        <p className="meta">
          {isBn
            ? 'সরকারি শিক্ষাক্রম, পাঠ্যবই এবং শিক্ষক বাতায়নের সাথে সংগতিপূর্ণ ওপেন সোর্স শিক্ষা গবেষণা:'
            : 'Official national education boards, teacher repositories, and curriculum gateways:'}
        </p>
      </div>

      <div className="portals-grid">
        {BD_PRIMARY_PORTALS.map((portal) => (
          <a
            key={portal.url}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-card"
          >
            <div className="portal-top">
              <span className="portal-icon">{portal.icon}</span>
              <span className="portal-tag">{isBn ? portal.tagBn : portal.tagEn}</span>
            </div>
            <h4 className="portal-name">{isBn ? portal.nameBn : portal.nameEn}</h4>
            <p className="portal-dept">{isBn ? portal.deptBn : portal.deptEn}</p>
            <div className="portal-link-hint">
              <span>{portal.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
              <span>↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
