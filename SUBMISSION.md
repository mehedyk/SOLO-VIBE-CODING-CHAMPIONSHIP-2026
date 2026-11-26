# SUBMISSION — Hack the Vibe 2026 (CODE-ARENAX)

Source: the official problem statement PDF supplied by the participant.

| Field | Value |
|---|---|
| Project title | Primary Visual Lab / প্রাইমারি ভিজ্যুয়াল ল্যাব |
| Selected track | **Educational Problem Solver** (teaching, learning, classroom workflows, accessibility) |
| Advanced challenges (declare exactly two) | **A03** Advanced Security & Access Control · **A07** Automated Multi-Step Workflow |
| GitHub (must be public) | https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026.git |
| Live URL | _fill after Vercel deploy_ |
| YouTube (public/unlisted) | _fill after recording_ |
| Problem statement | Primary teachers in classrooms with one shared screen lack trustworthy, reviewed, step-by-step visual explanations of how operations change quantities. |

## Mandatory requirements → where they are met (60 marks)
| ID | Marks | Planned evidence | Phase | Status |
|---|---|---|---|---|
| M01 Complete system | 12 | 3+ linked modules: lessons/presenter, contributor+review, moderation/admin; end-to-end draft→review→publish→learn→report | 1–9 | ✅ Completed |
| M02 DB + persistence | 8 | MongoDB Atlas M0 CRUD (`users`, `sessions`, `attempts`, `lessons`, `lesson_versions`, `reviews`, `workflows`, `reports`, `applications`, `audit_logs`, `throttle`), indexes, offline guest fallback | 3 | ✅ Completed |
| M03 Auth + authz | 8 | Scrypt hashing (with automatic PBKDF2 rehash), SHA-256 HttpOnly cookie sessions, 5-role RBAC + ownership checks, IP/email rate limiting, session revocation, opt-in passwordless judge login (`ENABLE_DEMO_ACCOUNTS=true`) | 4 | ✅ Completed |
| M04 Business logic | 10 | Publication state machine, review rules, application workflow, retry bounds | 5–7 | ✅ Completed |
| M05 Data processing | 6 | Whitelist search, topic filters, sort, attempt scoring, statistics aggregation | 2, 3, 8 | ✅ Completed |
| M06 Errors/edge cases | 8 | Input validation (integers, ranges), duplicate actions rejected, workflow failure recovery | 1–8 | ✅ Completed |
| M07 Responsive + a11y | 4 | Keyboard (Tab/Enter/Arrows), reduced motion, phone/projector responsive, high contrast | 1, 10 | ✅ Completed |
| M08 Deploy + docs | 4 | Vercel deployment guide, judge demo runbook, setup instructions, security headers | 10 | ✅ Completed |

## Advanced challenges (20 marks each; total 40 marks)
- **A03 Advanced Security & Access Control:**
  - Demonstrated: user modifying another user's restricted record is rejected (HTTP 403) and logged to MongoDB `audit_logs` table.
  - Granular role capability matrix (`guest`, `student`, `teacher`, `contributor`, `reviewer`, `admin`).
  - Account suspension immediately revokes all active session tokens and blocks subsequent requests.
  - Verified by `tests/auth.test.ts`, `tests/auth-hardening.test.ts`, and `tests/moderation_a03.test.ts`.
- **A07 Automated Multi-Step Workflow:**
  - Demonstrated: 4-step publication pipeline (`validate_integrity` → `build_catalogue_index` → `generate_static_snapshot` → `finalize_publication`).
  - Intermediate step failure leaves workflow state visibly persisted in DB with detailed error logs.
  - Bounded retry mechanism (`retryCount < maxRetries`).
  - Resumption from failed step recovers to published state idempotently without duplicate records.
  - Verified by `tests/workflow_a07.test.ts`.

## Checklist before submitting
- [x] Repo public, README + setup + architecture summary, **no secrets** (credentials only in Vercel env)
- [x] Strict Content Security Policy (CSP) and security headers configured
- [x] 100% free tier architecture (Vercel Hobby + MongoDB Atlas M0 + GitHub)
- [x] Comprehensive automated test suite passing
- [ ] Live Vercel deployment URL added
- [ ] YouTube demo video recorded and link added
