import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-screen-container">
      {/* Living Ambient Video Background */}
      <div className="error-video-bg" aria-hidden="true">
        <video
          className="error-ambient-video"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
        >
          <source src="/video/meridian_ambient.mp4" type="video/mp4" />
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260928_144832_2b6b23aa-4416-4fcb-9df4-132349c59edc.mp4"
            type="video/mp4"
          />
        </video>
        <div className="error-scrim" />
      </div>

      <div className="error-card">
        {/* Brand Logo */}
        <div className="error-brand-icon">
          <img
            src="/images/logo_mark.svg"
            alt="Primary Visual Lab Logo"
            width={48}
            height={48}
            style={{ width: '48px', height: '48px' }}
          />
        </div>

        <div className="error-code">404</div>
        <h1 className="error-heading">Off the Beaten Track · পথ ভুল হয়েছে</h1>
        <p className="error-desc">
          যে পাঠ বা পৃষ্ঠাটি খুঁজছেন তা মানচিত্রে পাওয়া যায়নি। হয়তো ঠিকানা ভুল হয়েছে অথবা পৃষ্ঠাটি সরানো হয়েছে।
          নিচের বোতামের মাধ্যমে নিরাপদে মূল পাঠ্যক্রমে ফিরে যান।
        </p>

        <div className="error-actions">
          <Link href="/bn" className="btn primary">
            🏠 মূল পাতায় ফিরুন
          </Link>
          <Link href="/bn/lessons" className="btn secondary">
            📚 পাঠ ক্যাটালগ দেখুন
          </Link>
        </div>

        <div className="error-footer-note">
          Primary Visual Lab · Open Source NCTB Mathematics Research
        </div>
      </div>
    </div>
  );
}
