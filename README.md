<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=26&duration=3200&pause=1000&color=34D399&center=true&vCenter=true&width=760&height=55&lines=%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%87%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A6%BF+%E0%A6%AD%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%AF%E0%A7%81%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B2+%E0%A6%B2%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AC;Primary+Visual+Lab;See+how+numbers+change;52+%E2%88%92+27+%3D+25" alt="Typing title" />

<img src="assets/banner.svg" width="900" alt="Primary Visual Lab banner: ten ones become one ten"/>

<img src="assets/divider.svg" width="900" alt=""/>

[![Next.js](https://img.shields.io/badge/Next.js-15-000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20M0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Vercel-Hobby-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Bangla first](https://img.shields.io/badge/%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-default-fbbf24?style=for-the-badge)](#-bilingual)
[![Tests](https://img.shields.io/badge/unit-19%20passed-34D399?style=for-the-badge)](TEST_PLAN.md) [![Browser](https://img.shields.io/badge/browser-76%20passed-34D399?style=for-the-badge)](TEST_PLAN.md)
[![Cost](https://img.shields.io/badge/cost-%240-0f2a43?style=for-the-badge)](#-free-to-run)

**Teacher-led visual maths lessons for primary school.**
Input → one calculation → a visible change → *why it changed* → next step.

</div>

<img src="assets/divider.svg" width="900" alt=""/>

## 🎬 The idea in one picture

```text
  ৫২ − ২৭          ones: 2 < 7  → cannot take 7 yet
    │
    ▼
  exchange 1 ten ──► 10 ones      value stays 52 ✔
    │
    ▼
  ones: 12 − 7 = 5 ; tens: 4 − 2 = 2
    │
    ▼
  answer ২৫  (objects and written method agree)
```

The engine checks that **the total value never changes during an exchange** across the whole 0–999 range (see `tests/subtraction.test.ts`).

## 🧭 Status (honest)

| Phase | What | State |
|:--:|---|:--:|
| 0 | Inspect, plan, docs | ✅ |
| 1 | First lesson: exact engine, SVG board, presenter mode, bilingual UI | ✅ |
| 2–10 | Catalogue, DB, auth, review, workflow, moderation, deploy | ⬜ see [MASTER_PLAN](MASTER_PLAN.md) |

The first lesson is **demonstration content**, not claimed as official curriculum alignment.

## 📸 Screenshots (synthetic numbers only)

<div align="center">

| Classroom mode (1920 px) | Learner view (phone) |
|:---:|:---:|
| <img src="assets/screenshots/present-projector-1920.png" width="520" alt="Classroom mode showing 52 minus 27 after one exchange"/> | <img src="assets/screenshots/student-phone.png" width="200" alt="Phone layout"/> |

</div>

## ✨ What works now
- 🧱 Place-value blocks that stay in sync with the numbers, the written method and the explanation
- 🔮 A **prediction question** before each column, with specific feedback
- ➗ Exact integer arithmetic; exchanges never change the total value (checked exhaustively)
- 🎬 Presenter mode, keyboard ← →, full screen, teacher notes you can hide
- 📝 Text-only view, reduced motion (OS setting + button)
- 🇧🇩 Bangla by default, English switch, Bangla or English digits accepted

## 🌐 Bilingual
Bangla is the default; English is one switch away. Bangla text uses **Kalpurush**. Numerals follow the interface language (০–৯ / 0–9) and learners may type either. See the font licence caveat in [LIMITATIONS](LIMITATIONS.md).

## 💸 Free to run
Vercel Hobby + MongoDB Atlas M0 + GitHub. **Secrets live only in Vercel Environment Variables**; the repo contains an empty `.env.example`. Never commit `.env*`.

## 🏆 Hack the Vibe 2026
Track: **Educational Problem Solver** · Advanced challenges: **A03** (access control) and **A07** (multi-step workflow). Details and checklist: [SUBMISSION](SUBMISSION.md). Repo: https://github.com/mehedyk/SOLO-VIBE-CODING-CHAMPIONSHIP-2026

## 🚀 Run the tests
```bash
npm install
npm test        # 19 unit tests
npm run dev     # open http://localhost:3000  (redirects to /bn)
```
Browser checks: see [TEST_PLAN](TEST_PLAN.md).

## 🗂 Docs
[MASTER_PLAN](MASTER_PLAN.md) · [TEST_PLAN](TEST_PLAN.md) · [LIMITATIONS](LIMITATIONS.md) · [SUBMISSION](SUBMISSION.md) · [ASSET_PROMPTS](ASSET_PROMPTS.md) (logo / favicon / banner prompts for other AIs)

<img src="assets/divider.svg" width="900" alt=""/>
