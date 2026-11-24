# MASTER_PLAN — Primary Visual Lab

Status legend: ✅ done and tested · 🟡 partly done · ⬜ not started

## Observed vs tested (reference project)
Observed by reading the uploaded source of `Numerical-Analysis-main` (shared `core.js`, per-method engines, step tables, graph per step, export). **Not tested in a browser** and the live URL was not opened. Reusable principle: *input → one calculation → visible change → explanation → next step → result*, with one shared core and pluggable engines. We reuse the **architecture idea**, not its styling or code.

The five uploaded HTML files (AXIOMA, Forge, Atelier, Calculus field guide, The Pulse) are unrelated design samples (Tailwind CDN, Three.js, KaTeX). They are **not used**: they depend on CDNs/third-party scripts, which conflicts with a strict CSP and with the no-arbitrary-script rule. All 2D visuals are original trusted SVG components.

## Decisions (assumptions, change freely)
| # | Decision | Why / risk |
|---|---|---|
| D1 | Next.js 15 App Router + TypeScript, Vercel Hobby | Free. Hobby is for non-commercial use. |
| D2 | MongoDB Atlas **M0 free** | Free tier limits storage (512 MB). No binaries stored. |
| D3 | Bangla default (`bn`), English (`en`), Kalpurush for Bangla | Font licence note says personal use free, commercial needs designer permission, do not modify/rename → see LIMITATIONS. |
| D4 | Credentials **only** in Vercel env vars | `.env*` git-ignored; `.env.example` has empty keys. |
| D5 | Auth: managed library (Better Auth or Auth.js) with Mongo adapter, **no custom crypto** | Final pick in Phase 4 after checking current docs. |
| D6 | No file upload in v1 (policy allows it) | Removes the largest risk surface; assets are SVG templates + text. |
| D7 | Durable workflow = Mongo-persisted job state machine, stepped by (a) request-time trigger, (b) admin retry, (c) Vercel Cron | **Verify**: Hobby cron is limited (about once per day), so the workflow must not depend on frequent cron. |
| D8 | First lesson = subtraction with regrouping, **demonstration content**, labelled "not official curriculum alignment" until the NCTB edition/objective is verified | Source textbook was not provided. |
| D9 | Integers only for exact arithmetic; fractions later via BigInt-free rational pairs | Avoids float artefacts. |

## Competition constraints (from the official PDF)
Track: Educational. Score: M01–M08 = 60, two declared advanced challenges = 40 (we declare **A03 + A07**; extra challenges earn nothing). Judges verify live behaviour and may ask live questions and run hidden cases, so every claim in the docs must be demonstrable on the deployed app. Submission needs a public repo, a live URL and a YouTube video; see SUBMISSION.md.

## Phases
| Phase | Deliverable | Status |
|---|---|---|
| 0 | Inspect, plan, decisions, doc skeleton, asset prompts, animated README | ✅ |
| 1 | Exact maths engine, SVG place-value board, prediction gate, presenter mode, bilingual (bn default/en) UI with Kalpurush, practice cards, tests | ✅ |
| 2 | Public catalogue (search, topic filter, sort), per-lesson routes, second lesson (addition with regrouping) on a shared engine interface, print/prep page | ✅ |
| 3 | MongoDB persistence, guest progress (local) + optional saved attempts, indexes | ✅ |
| 4 | Authentication, sessions, capability model, suspension, audit log | ✅ |
| 5 | Contributor applications + admin decisions | ✅ |
| 6 | Structured authoring, validation, immutable versions + content hash, reviews | ✅ |
| 7 | Publication workflow with failure/retry/recovery (A07) | ✅ |
| 8 | Reports, moderation, quarantine, replacement; A03 evidence | ⬜ |
| 9 | Two more templates (fraction bars, number line) + small lesson set | ⬜ |
| 10 | Security headers/CSP, a11y pass, deploy guide, demo runbook, final docs | ⬜ |
| 11 | Future resources integration: Meadowbell hero, Meridian footer, brand identity SVG/PNG, Kalpurush fonts & custom 404 page | ⬜ |

## Requirement → test matrix (Phase 0–1 rows executed)
| Requirement | Test | Result |
|---|---|---|
| Known examples (52−27, 305−168, 100−1, 999−999, 0−0) | `tests/subtraction.test.ts` | ✅ passed |
| Value never changes during exchange (all steps) | exhaustive invariant test, 0..999 | ✅ passed |
| No impossible counts (negative/non-integer) | same test | ✅ passed |
| Boundary + invalid input rejected with a code | validate tests | ✅ passed |
| Equivalent forms accepted (০২৫ = 25) | parse tests | ✅ passed |
| Decimals/letters/negatives rejected, not guessed | parse tests | ✅ passed |
| Prediction gate once per column; Previous cancels it | ui-logic tests + browser | ✅ passed |
| bn/en dictionaries have identical keys & placeholders; no ASCII digits in bn notes | `tests/ui-logic.test.ts` | ✅ passed |
| Keyboard (Tab, Enter, ←/→, arrows ignored inside inputs) | `tests/e2e/ui_check.py` (real Chromium) | ✅ passed |
| Reduced motion (OS setting and manual toggle) | e2e | ✅ passed |
| Layouts 1920/1366/768/390/320 px, no page-level horizontal scroll, long Bangla labels | e2e | ✅ passed |
| Text alternative, board title/desc, Bangla/English routes, 404 for unknown language | e2e | ✅ passed |
| Font file blocked → page still usable | e2e | ✅ passed |
| Addition engine: invariant board+pending = a+b at every step, one exchange moves exactly 10 → 1 | `tests/addition.test.ts` | ✅ passed |
| Catalogue: whitelist query parsing, bn/en/cross-language search, filters combine, empty result | `tests/catalogue.test.ts` + e2e | ✅ passed |
| Hostile query params / script text in search are inert | e2e | ✅ passed |
| Print page: checklist, steps, practice lines; print media hides chrome | e2e | ✅ passed |
| Unknown lesson slug/language → 404 | e2e | ✅ passed |
| Screen-reader behaviour with a real assistive technology | — | ⬜ **not tested** |
| Touch-device and real projector testing | — | ⬜ **not tested** |
| All authorization/workflow rows | Phases 4–8 | ⬜ not run |

## Free-tier operating rule
Everything runs on Vercel Hobby + Atlas M0 + GitHub. No paid API, no paid storage, no email provider required (applications and decisions are in-app).
