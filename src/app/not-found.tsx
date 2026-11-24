import React from 'react';
import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="bn">
      <body>
        <div className="error-screen-container">
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
            <h1 className="error-heading">Page Not Found · পৃষ্ঠা পাওয়া যায়নি</h1>
            <p className="error-desc">
              The page or lesson you requested does not exist on our map. Return to safe exploration.
            </p>

            <div className="error-actions">
              <Link href="/bn" className="btn primary">
                🏠 Return to Home / মূল পাতা
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
