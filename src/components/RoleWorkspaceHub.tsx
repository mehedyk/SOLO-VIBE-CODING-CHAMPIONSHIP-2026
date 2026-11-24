'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lang } from '../lib/i18n/dict';

interface RoleWorkspaceHubProps {
  lang: Lang;
  initialRole?: 'student' | 'teacher' | 'contributor' | 'admin';
}

export function RoleWorkspaceHub({ lang, initialRole = 'student' }: RoleWorkspaceHubProps) {
  const isBn = lang === 'bn';
  const [activeRole, setActiveRole] = useState<'student' | 'teacher' | 'contributor' | 'admin'>(initialRole);

  return (
    <section className="role-workspace-section">
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.6rem' }}>👥</span>
          <h2>
            {isBn
              ? 'ভূমিকাভিত্তিক বিশেষায়িত ড্যাশবোর্ড ও ওয়ার্কস্পেস'
              : 'Role-Specific Specialized Workspaces & Action Hubs'}
          </h2>
        </div>
        <p className="meta">
          {isBn
            ? 'শিক্ষার্থী, শিক্ষক, কন্টেন্ট লেখক এবং প্রশাসকদের জন্য কাস্টমাইজড ফিচার ও টুলস:'
            : 'Tailored action launchpads for students, teachers, authors, and system administrators:'}
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="role-tabs-wrap" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'student'}
          onClick={() => setActiveRole('student')}
          className={`role-tab-btn ${activeRole === 'student' ? 'active-student' : ''}`}
        >
          <span className="tab-icon">👨‍🎓</span>
          <span className="tab-text">{isBn ? 'শিক্ষার্থী (Student)' : 'Student'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'teacher'}
          onClick={() => setActiveRole('teacher')}
          className={`role-tab-btn ${activeRole === 'teacher' ? 'active-teacher' : ''}`}
        >
          <span className="tab-icon">👩‍🏫</span>
          <span className="tab-text">{isBn ? 'শিক্ষক (Teacher)' : 'Teacher / Educator'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'contributor'}
          onClick={() => setActiveRole('contributor')}
          className={`role-tab-btn ${activeRole === 'contributor' ? 'active-author' : ''}`}
        >
          <span className="tab-icon">✍️</span>
          <span className="tab-text">{isBn ? 'লেখক (Author)' : 'Lesson Author'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'admin'}
          onClick={() => setActiveRole('admin')}
          className={`role-tab-btn ${activeRole === 'admin' ? 'active-admin' : ''}`}
        >
          <span className="tab-icon">🛡️</span>
          <span className="tab-text">{isBn ? 'প্রশাসক (Admin)' : 'Administrator'}</span>
        </button>
      </div>

      {/* Role Content Panels */}
      <div className="role-panel-content">
        {/* ─── STUDENT WORKSPACE ────────────────────────────────────── */}
        {activeRole === 'student' && (
          <div className="role-card-panel role-student-panel">
            <div className="role-panel-header">
              <div>
                <span className="role-pill-badge" style={{ background: '#34d399', color: '#09131d' }}>
                  STUDENT PORTAL · শিক্ষার্থী হাব
                </span>
                <h3>{isBn ? 'আনন্দময় গণিত চর্চা ও ভিজ্যুয়াল ল্যাব' : 'Playful Math Exploration & Visual Mastery'}</h3>
                <p className="meta">
                  {isBn
                    ? 'কোনো মুখস্থ নয়—ব্লক নেড়েচেড়ে, রেখায় লাফিয়ে এবং বার কেটে গণিতের আনন্দ উপভোগ করো!'
                    : 'Tactile, concrete manipulatives designed for primary visual comprehension.'}
                </p>
              </div>
            </div>

            <div className="role-actions-grid">
              <div className="role-action-box">
                <span className="box-icon">🧮</span>
                <h4>{isBn ? 'বেস-১০ স্থান মান অনুশীলন' : 'Base-10 Regrouping'}</h4>
                <p>{isBn ? '১০টি এককে ১টি দশ রড বানাও বা ভাঙো।' : 'Exchange 10 ones into 1 ten with invariant sum.'}</p>
                <Link href={`/${lang}/lessons/subtraction-regrouping`} className="btn primary">
                  {isBn ? 'চর্চা শুরু করো →' : 'Start Practice →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📊</span>
                <h4>{isBn ? 'ভগ্নাংশ বার কাটার বোর্ড' : 'Fraction Bars'}</h4>
                <p>{isBn ? '১/২ এবং ২/৪ যে সমান, তা চোখে দেখে প্রমাণ করো।' : 'Cut and match bars to prove 1/2 = 2/4.'}</p>
                <Link href={`/${lang}/manipulatives/fractions`} className="btn">
                  {isBn ? 'ল্যাব খেলো →' : 'Play Lab →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📏</span>
                <h4>{isBn ? 'সংখ্যারেখায় দূরত্বের লাফ' : 'Number Line Jumps'}</h4>
                <p>{isBn ? 'যোগ মানে ডানে লাফ, বিয়োগ মানে বামে পিছানো।' : 'Forward and backward jump intervals on axis.'}</p>
                <Link href={`/${lang}/manipulatives/numberline`} className="btn">
                  {isBn ? 'লাফিয়ে শেখো →' : 'Jump on Line →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">🏆</span>
                <h4>{isBn ? 'ব্যক্তিগত অগ্রগতি ও ব্যাজ' : 'Attempt Badges'}</h4>
                <p>{isBn ? 'গেস্ট ও লগইন উভয় অবস্থায় তোমার প্রচেষ্টা সংরক্ষিত থাকে।' : 'Full progress tracking saved locally and remotely.'}</p>
                <Link href={`/${lang}/login`} className="btn ghost">
                  {isBn ? 'অগ্রগতি দেখো →' : 'View Progress →'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── TEACHER WORKSPACE ────────────────────────────────────── */}
        {activeRole === 'teacher' && (
          <div className="role-card-panel role-teacher-panel">
            <div className="role-panel-header">
              <div>
                <span className="role-pill-badge" style={{ background: '#fbbf24', color: '#09131d' }}>
                  TEACHER LAUNCHPAD · শিক্ষক প্যানেল
                </span>
                <h3>{isBn ? 'শ্রেণিকক্ষ পরিচালনা ও শিক্ষক সহায়ক টুলবক্স' : 'Classroom Presentation & Pedagogical Toolbox'}</h3>
                <p className="meta">
                  {isBn
                    ? 'প্রজেক্টরে বড় হরফে পাঠ প্রদর্শন, সম্পূর্ণ অফলাইন স্লাইড ডেক এবং প্রিন্ট উপযোগী শিট:'
                    : 'High-contrast projector presenter, printable packs, and offline HTML slides:'}
                </p>
              </div>
            </div>

            <div className="role-actions-grid">
              <div className="role-action-box">
                <span className="box-icon">🖥️</span>
                <h4>{isBn ? 'শ্রেণিকক্ষ প্রজেক্টর মোড' : 'Classroom Presenter'}</h4>
                <p>{isBn ? 'বড় ফন্ট, হাই-কনট্রাস্ট এবং ফুলস্ক্রিন ব্ল্যাকবোর্ড ইন্টারফেস।' : 'Large typography and step navigation for screen sharing.'}</p>
                <Link href={`/${lang}/lessons/subtraction-regrouping/present`} className="btn primary">
                  {isBn ? 'প্রজেক্টরে উপস্থাপন করুন →' : 'Open Presenter →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📥</span>
                <h4>{isBn ? 'অফলাইন HTML স্লাইড ডেক' : 'Offline HTML Slide Packs'}</h4>
                <p>{isBn ? 'কোনো ইন্টারনেট ছাড়া যেকোনো কম্পিউটারে অফলাইনে স্লাইড চালান।' : 'Single-file HTML decks with embedded simulations.'}</p>
                <Link href={`/api/slides/subtraction-regrouping`} className="btn" download>
                  {isBn ? 'স্লাইড ডাউনলোড (HTML) →' : 'Download HTML Slide →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📄</span>
                <h4>{isBn ? 'ছাপার জন্য ওয়ার্কশিট' : 'Printable Worksheets'}</h4>
                <p>{isBn ? 'ছাত্র-ছাত্রীদের হাতে-কলমে অনুশীলনের জন্য প্রিন্ট উপযোগী পেজ।' : 'Clean print layout with workspace for student work.'}</p>
                <Link href={`/${lang}/lessons/subtraction-regrouping/print`} className="btn">
                  {isBn ? 'ওয়ার্কশিট প্রিন্ট করুন →' : 'Print Worksheet →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">👩‍🏫</span>
                <h4>{isBn ? 'শিক্ষক বাতায়ন সংযোগ' : 'Teachers\' Portal Sync'}</h4>
                <p>{isBn ? 'জাতীয় শিক্ষক বাতায়নের সাথে সংগতিপূর্ণ পাঠ পরিকল্পনা।' : 'Aligned with Shikkhok Batayon lesson plans.'}</p>
                <a href="https://www.teachers.gov.bd" target="_blank" rel="noopener noreferrer" className="btn ghost">
                  {isBn ? 'বাতায়ন ভিজিট করুন ↗' : 'Visit Batayon ↗'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ─── AUTHOR WORKSPACE ─────────────────────────────────────── */}
        {activeRole === 'contributor' && (
          <div className="role-card-panel role-author-panel">
            <div className="role-panel-header">
              <div>
                <span className="role-pill-badge" style={{ background: '#38bdf8', color: '#09131d' }}>
                  AUTHOR STUDIO · লেখক স্টুডিও
                </span>
                <h3>{isBn ? 'পাঠ রচনা, সংস্করণ নিয়ন্ত্রণ ও রিভিউ ওয়ার্কস্পেস' : 'Structured Authoring & Immutable Versions'}</h3>
                <p className="meta">
                  {isBn
                    ? 'ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ দিয়ে পাঠের প্রতিটি সংস্করণ অপরিবর্তনীয় রাখা হয়:'
                    : 'Cryptographic SHA-256 content hashes, structured schemas, and peer reviews:'}
                </p>
              </div>
            </div>

            <div className="role-actions-grid">
              <div className="role-action-box">
                <span className="box-icon">📝</span>
                <h4>{isBn ? 'নতুন পাঠের খসড়া রচনা' : 'Draft New Lesson'}</h4>
                <p>{isBn ? 'দ্বিভাষিক (বাংলা-ইংরেজি) উদ্দেশ্য ও ম্যাথ ইঞ্জিনের সংজ্ঞা।' : 'Schema-validated lesson creation with immutable hash.'}</p>
                <Link href={`/${lang}/lessons`} className="btn primary">
                  {isBn ? 'ক্যাটালগে দেখুন →' : 'Browse Catalogue →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">🔒</span>
                <h4>{isBn ? 'ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই' : 'SHA-256 Hash Verification'}</h4>
                <p>{isBn ? 'অননুমোদিত পরিবর্তন হলে সিস্টেম স্বয়ংক্রিয়ভাবে অডিট ফ্ল্যাগ করে।' : 'Content tampering triggers 403 and security log.'}</p>
                <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace', margin: '0.4rem 0' }}>
                  sha256: 3c9f8a...e7b2
                </div>
              </div>

              <div className="role-action-box">
                <span className="box-icon">👥</span>
                <h4>{isBn ? 'পিয়ার রিভিউ সাবমিশন' : 'Peer Review Queue'}</h4>
                <p>{isBn ? 'কন্টেন্ট প্রকাশের পূর্বে স্বাধীন পর্যালোচক দ্বারা অনুমোদন।' : 'Independent reviewer approval before catalogue release.'}</p>
                <Link href={`/${lang}/login`} className="btn">
                  {isBn ? 'রিভিউ কিউ খুলুন →' : 'Open Review Queue →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📖</span>
                <h4>{isBn ? 'NCTB কারিকুলাম ফ্রেমওয়ার্ক' : 'NCTB Author Guide'}</h4>
                <p>{isBn ? '১ম থেকে ৫ম শ্রেণির শিক্ষণফল ও প্রান্তিক যোগ্যতা নির্দেশিকা।' : 'National competency standards and pedagogical rubrics.'}</p>
                <a href="http://www.nctb.gov.bd" target="_blank" rel="noopener noreferrer" className="btn ghost">
                  {isBn ? 'কারিকুলাম গাইড ↗' : 'NCTB Guide ↗'}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ─── ADMIN WORKSPACE ──────────────────────────────────────── */}
        {activeRole === 'admin' && (
          <div className="role-card-panel role-admin-panel">
            <div className="role-panel-header">
              <div>
                <span className="role-pill-badge" style={{ background: '#f43f5e', color: '#ffffff' }}>
                  ADMIN CONTROL · প্রশাসক প্যানেল
                </span>
                <h3>{isBn ? 'সিস্টেম নিরাপত্তা, বহু-ধাপ প্রকাশনা ও অডিট ট্রেইল' : 'System Access Control & Multi-Step Workflows'}</h3>
                <p className="meta">
                  {isBn
                    ? 'ভূমিকা সাসপেনশন, বহু-ধাপ স্বয়ংক্রিয় ওয়ার্কফ্লো এবং স্থায়ী অডিট লগিং:'
                    : 'A03 Access Control capability guards and A07 bounded-retry publication pipelines:'}
                </p>
              </div>
            </div>

            <div className="role-actions-grid">
              <div className="role-action-box">
                <span className="box-icon">⚡</span>
                <h4>{isBn ? 'বহু-ধাপ প্রকাশনা পাইপলাইন' : 'Publication Workflow (A07)'}</h4>
                <p>{isBn ? '৪-ধাপ ভ্যালিডেশন, ইনডেক্সিং, স্ন্যাপশট ও ব্যর্থতায় অটো-রিকভারি।' : 'Integrity check → catalogue index → snapshot → publish.'}</p>
                <Link href={`/${lang}/login`} className="btn primary">
                  {isBn ? 'ওয়ার্কফ্লো স্ট্যাটাস →' : 'Workflow Engine →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">🛡️</span>
                <h4>{isBn ? 'কন্টেন্ট কোয়ারেন্টিন ও অ্যাক্সেস' : 'Access Control & Quarantine (A03)'}</h4>
                <p>{isBn ? 'অননুমোদিত পরিবর্তন তৎক্ষণাৎ ব্লক করে প্ল্যাটফর্ম সুরক্ষিত রাখা।' : 'Strict RBAC guard preventing privilege escalation.'}</p>
                <Link href={`/${lang}/login`} className="btn">
                  {isBn ? 'কোয়ারেন্টিন প্যানেল →' : 'Quarantine Panel →'}
                </Link>
              </div>

              <div className="role-action-box">
                <span className="box-icon">📋</span>
                <h4>{isBn ? 'স্থায়ী নিরাপত্তা অডিট লগ' : 'Security Audit Logs'}</h4>
                <p>{isBn ? 'প্রতিটি অনুমোদিত ও অস্বীকৃত অপারেশনের টাইমস্ট্যাম্পযুক্ত প্রমাণ।' : 'Tamper-evident audit events with actor ID & context.'}</p>
                <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontFamily: 'monospace', margin: '0.4rem 0' }}>
                  audit: 55/55 events verified
                </div>
              </div>

              <div className="role-action-box">
                <span className="box-icon">🔑</span>
                <h4>{isBn ? 'অ্যাডমিন ১-ক্লিক ডেমো লগইন' : '1-Click Admin Access'}</h4>
                <p>{isBn ? 'সিস্টেম মূল্যায়ন ও পরীক্ষার জন্য পূর্ণ ক্ষমতা সক্রিয় করুন।' : 'Full administrative capabilities for hackathon evaluators.'}</p>
                <Link href={`/${lang}/login`} className="btn ghost">
                  {isBn ? 'অ্যাডমিন প্যানেল খুলুন →' : 'Open Admin Panel →'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
