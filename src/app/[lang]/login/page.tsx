'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Lang } from '../../../lib/i18n/dict';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  capabilities?: string[];
}

const DEMO_USERS = [
  {
    role: 'student',
    titleBn: 'শিক্ষার্থী (Student)',
    titleEn: 'Student',
    icon: '👨‍🎓',
    email: 'student@primarylab.org',
    password: 'demo1234',
    descBn: 'ভিজ্যুয়াল ল্যাব অনুশীলন, ফলাফল সংরক্ষণ ও অগ্রগতি ট্র্যাকিং।',
    descEn: 'Interactive visual practice, attempt tracking & personal mastery.',
    badgeColor: '#34d399',
  },
  {
    role: 'teacher',
    titleBn: 'শিক্ষক (Teacher)',
    titleEn: 'Teacher / Educator',
    icon: '👩‍🏫',
    email: 'teacher@primarylab.org',
    password: 'demo1234',
    descBn: 'প্রজেক্টর মোড, পাঠদান নিয়ন্ত্রণ, অফলাইন স্লাইড ও ওয়ার্কশিট প্রিন্ট।',
    descEn: 'Classroom presenter, lesson orchestration, printable packs.',
    badgeColor: '#fbbf24',
  },
  {
    role: 'contributor',
    titleBn: 'লেখক (Author / Contributor)',
    titleEn: 'Lesson Author',
    icon: '✍️',
    email: 'author@primarylab.org',
    password: 'demo1234',
    descBn: 'নতুন পাঠ রচনা, সংস্করণ হ্যাশ জেনারেশন ও পিয়ার রিভিউ সাবমিশন।',
    descEn: 'Draft new lessons, cryptographic version hashes, review lifecycle.',
    badgeColor: '#38bdf8',
  },
  {
    role: 'admin',
    titleBn: 'অ্যাডমিনিস্ট্রেটর (Admin)',
    titleEn: 'System Administrator',
    icon: '🛡️',
    email: 'admin@primarylab.org',
    password: 'demo1234',
    descBn: 'ক্যাপাবিলিটি ম্যানেজমেন্ট, প্রকাশনা ওয়ার্কফ্লো ও নিরাপত্তা অডিট লগ।',
    descEn: 'Access control, multi-step publication workflow & security audit trails.',
    badgeColor: '#f43f5e',
  },
];

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as Lang) || 'bn';
  const isBn = lang === 'bn';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check active session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const token = localStorage.getItem('primary_lab_token');
        if (!token) return;
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch {}
    }
    checkSession();
  }, []);

  const handleLogin = async (loginEmail?: string, loginPass?: string) => {
    const e = loginEmail || email;
    const p = loginPass || password;
    if (!e || !p) {
      setError(isBn ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please provide email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e, password: p }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isBn ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
        return;
      }

      if (data.token) {
        localStorage.setItem('primary_lab_token', data.token);
        setUser(data.user);
      }
    } catch {
      setError(isBn ? 'সার্ভারে সংযোগ করা যায়নি।' : 'Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('primary_lab_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {}
    localStorage.removeItem('primary_lab_token');
    setUser(null);
  };

  const fillAndLogin = (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    handleLogin(u.email, u.password);
  };

  return (
    <div className="login-page-wrap">
      <div className="login-container">
        {/* Top Navigation */}
        <div className="login-top-nav">
          <Link href={`/${lang}`} className="btn ghost">
            ← {isBn ? 'মূল পাতায় ফিরে যান' : 'Back to Home'}
          </Link>
        </div>

        {/* Guest Friendly Notice */}
        <div className="guest-banner">
          <span className="guest-badge">🌟 {isBn ? 'উন্মুক্ত শিক্ষা' : 'Open Access'}</span>
          <p>
            {isBn
              ? 'অতিথিরা কোনো অ্যাকাউন্ট ছাড়াই সকল পাঠ, ইন্টারঅ্যাক্টিভ ম্যানিপুলেটিভ এবং স্লাইড ব্যবহার করতে পারেন।'
              : 'Guests can explore all lessons, interactive manipulatives, and slides freely without logging in.'}
          </p>
        </div>

        {/* If user is already logged in */}
        {user ? (
          <div className="logged-in-card">
            <div className="user-avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2>{isBn ? 'সক্রিয় সেশন' : 'Active Session'}</h2>
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
            <div className="user-role-tag" style={{ background: '#34d399', color: '#09131d' }}>
              Role: {user.role.toUpperCase()}
            </div>

            <div className="user-capabilities-box">
              <h4>{isBn ? 'অনুমোদিত সুবিধাসমূহ:' : 'Granted Capabilities:'}</h4>
              <ul>
                {user.role === 'admin' && (
                  <>
                    <li>✓ সকল ব্যবহারকারী ও অডিট লগ পর্যবেক্ষণ</li>
                    <li>✓ বহু-ধাপ প্রকাশনা ওয়ার্কফ্লো এক্সিকিউশন</li>
                    <li>✓ কন্টেন্ট কোয়ারেন্টিন ও অ্যাক্সেস কন্ট্রোল</li>
                  </>
                )}
                {user.role === 'teacher' && (
                  <>
                    <li>✓ শ্রেণিকক্ষ উপস্থাপনা মোড ও বড় পর্দা</li>
                    <li>✓ প্রিন্ট উপযোগী কাস্টম ওয়ার্কশিট প্যাকেজ</li>
                    <li>✓ পূর্ণ অফলাইন স্লাইড ডেক ডাউনলোড</li>
                  </>
                )}
                {user.role === 'contributor' && (
                  <>
                    <li>✓ নতুন পাঠ ও কন্টেন্ট খসড়া তৈরি</li>
                    <li>✓ ক্রিপ্টোগ্রাফিক হ্যাশ সহ পিয়ার রিভিউ সাবমিশন</li>
                  </>
                )}
                {user.role === 'student' && (
                  <>
                    <li>✓ ব্যক্তিগত অনুশীলন ইতিহাস সংরক্ষণ</li>
                    <li>✓ স্থান মান, ভগ্নাংশ ও সংখ্যারেখা ম্যানিপুলেটিভ</li>
                  </>
                )}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              <Link href={`/${lang}/lessons`} className="btn primary">
                {isBn ? 'পাঠসমূহ শুরু করুন →' : 'Start Lessons →'}
              </Link>
              <button type="button" onClick={handleLogout} className="btn ghost">
                {isBn ? 'লগআউট' : 'Logout'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1-Click Demo Accounts Section */}
            <div className="demo-accounts-section">
              <div className="demo-header">
                <h3>{isBn ? '⚡ ১-ক্লিক ডেমো অ্যাকাউন্টস' : '⚡ 1-Click Demo Accounts'}</h3>
                <p className="meta">
                  {isBn
                    ? 'হ্যাকাথন মূল্যায়নের জন্য যেকোনো ভূমিকায় এক ক্লিকে লগইন করুন:'
                    : 'Click any role card below to instantly populate and authenticate:'}
                </p>
              </div>

              <div className="demo-cards-grid">
                {DEMO_USERS.map((u) => (
                  <div
                    key={u.role}
                    className="demo-role-card"
                    onClick={() => fillAndLogin(u)}
                  >
                    <div className="role-icon-header">
                      <span className="role-emoji">{u.icon}</span>
                      <span className="role-badge" style={{ borderColor: u.badgeColor, color: u.badgeColor }}>
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                    <h4>{isBn ? u.titleBn : u.titleEn}</h4>
                    <p className="role-desc">{isBn ? u.descBn : u.descEn}</p>
                    <div className="demo-credentials">
                      <code>{u.email}</code>
                      <code>{u.password}</code>
                    </div>
                    <button
                      type="button"
                      className="demo-login-action-btn"
                      style={{ background: u.badgeColor }}
                    >
                      {isBn ? 'এই ভূমিকায় লগইন করুন →' : 'Login as this Role →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Form Section */}
            <div className="manual-login-card">
              <h3>{isBn ? 'ম্যানুয়াল লগইন' : 'Manual Sign In'}</h3>
              {error && <div className="error-banner">{error}</div>}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="login-form"
              >
                <div className="field">
                  <label htmlFor="login-email">{isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@primarylab.org"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="login-password">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn primary"
                  style={{ width: '100%', marginTop: '1rem', minHeight: '48px', fontSize: '1.05rem' }}
                >
                  {loading
                    ? isBn
                      ? 'যাচাই করা হচ্ছে...'
                      : 'Authenticating...'
                    : isBn
                    ? 'লগইন করুন →'
                    : 'Sign In →'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
