# TEST_PLAN

## How to run
```bash
npm install
npm test                      # unit tests (Node test runner + tsx)
npm run build && npm start    # then, in another shell:
pip install playwright && playwright install chromium
BASE=http://localhost:3000 python3 tests/e2e/ui_check.py   # real-browser checks
```

## Executed results (Phase 2, last run)
| Suite | Result |
|---|---|
| `tests/subtraction`, `ui-logic`, `addition`, `catalogue` | **36 / 36 passed** |
| `tests/e2e/ui_check.py` (Chromium via Playwright, against `next start`) | **111 / 111 passed** (`tests/e2e/last-run.json`) |
| `tsc --noEmit` (strict) and `next build` | passed |

## Not executed yet
Authorization matrix (Phases 4–8), workflow retry/duplicate/stale-approval (Phase 7), real screen reader (NVDA/TalkBack), touch devices, a real projector, automated accessibility audit (axe). These are **not** claimed.

## Honest notes
- The e2e script is a real browser, but it runs on the author's machine/container; layouts were checked by measurement (no horizontal scroll, minimum sizes) plus screenshots, not by a design review on physical devices.
- Phases 1–2 have no server state, so there are no persistence tests yet (Phase 3).
