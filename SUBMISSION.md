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
| M01 Complete system | 12 | 3+ linked modules: lessons/presenter, contributor+review, moderation/admin; end-to-end draft→review→publish→learn→report | 1–9 | ⬜ |
| M02 DB + persistence | 8 | MongoDB CRUD, relations (lesson↔versions↔reviews↔reports), indexes | 3 | ⬜ |
| M03 Auth + authz | 8 | Managed auth, capabilities, ownership, session revocation | 4 | ⬜ |
| M04 Business logic | 10 | Publication state machine, review rules, application workflow | 5–7 | ⬜ |
| M05 Data processing | 6 | Search, filters, sort, quiz scoring, report counts | 2, 8 | ⬜ |
| M06 Errors/edge cases | 8 | Input validation (engine ✅), duplicate actions, failure recovery | 1–8 | 🟡 engine validation done |
| M07 Responsive + a11y | 4 | Keyboard, reduced motion, phone/projector | 1, 10 | ⬜ |
| M08 Deploy + docs | 4 | Vercel live URL, README, setup | 10 | ⬜ |

## Advanced challenges (20 each; judges may use hidden tests and live questions)
- **A03 test the judges named:** a user modifies another user's restricted record → must be rejected + audit event.
- **A07 test the judges named:** an intermediate step fails after earlier steps succeeded → visible persisted state, bounded retry, recovery, no duplicate publication.
- Evidence must not be double-counted: A03 evidence = authorization/audit scenarios; A07 evidence = workflow failure/recovery. A status change shown for one must not be reused for the other.
- Using a library (e.g. auth) earns nothing by itself; we must show our own capability checks.

## Checklist before submitting
- [ ] Repo public, README + setup + architecture summary, **no secrets** (credentials only in Vercel env)
- [ ] Live build matches the repo commit (note the commit hash in the video description)
- [ ] Test accounts shared **privately** with judges (not in repo/video)
- [ ] Video shows: problem, main workflow, A03 + A07 demos, one edge case; no credentials on screen
- [ ] All three URLs open in a private browser window
