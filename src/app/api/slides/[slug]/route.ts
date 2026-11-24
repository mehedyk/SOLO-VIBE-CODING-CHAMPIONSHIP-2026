import { NextRequest, NextResponse } from 'next/server';
import { findChapterBySlug, NCTB_CURRICULUM } from '@/lib/curriculum/nctb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const chapter = findChapterBySlug(slug) || NCTB_CURRICULUM[0]!;

  const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chapter.titleBn} · অফলাইন ক্লাসরুম স্লাইড</title>
  <style>
    :root {
      --navy: #0f2a43;
      --bg: #09131d;
      --card: #132232;
      --amber: #fbbf24;
      --mint: #34d399;
      --sky: #38bdf8;
      --ink: #f1f5f9;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--ink);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      user-select: none;
    }
    header {
      padding: 1.2rem 2rem;
      background: rgba(15, 42, 67, 0.85);
      border-bottom: 1px solid #1e3a5f;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--amber);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .grade-badge {
      background: rgba(52, 211, 153, 0.15);
      border: 1px solid var(--mint);
      color: var(--mint);
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 700;
    }
    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }
    .slide {
      display: none;
      width: 100%;
      max-width: 900px;
      background: var(--card);
      border: 1px solid #233b55;
      border-radius: 20px;
      padding: 3rem 2.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      animation: fadeIn 0.3s ease;
    }
    .slide.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .slide-tag {
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--sky);
      margin-bottom: 0.8rem;
    }
    h1 { font-size: 2.2rem; color: #ffffff; margin-bottom: 1rem; line-height: 1.3; }
    h2 { font-size: 1.8rem; color: #ffffff; margin-bottom: 1rem; }
    p.lead { font-size: 1.25rem; color: #bae6fd; line-height: 1.6; margin-bottom: 1.5rem; }
    .interactive-box {
      background: #0b1724;
      border: 2px dashed #2a486c;
      border-radius: 14px;
      padding: 2rem;
      margin: 1.5rem 0;
      text-align: center;
    }
    .val-display {
      font-size: 3rem;
      font-weight: 900;
      color: var(--amber);
      margin: 1rem 0;
    }
    .slide-btns {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    button.act-btn {
      font: inherit;
      padding: 0.75rem 1.6rem;
      border-radius: 12px;
      border: none;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      background: var(--amber);
      color: #0f172a;
      transition: all 0.2s;
    }
    button.act-btn:hover { background: #f59e0b; transform: scale(1.02); }
    button.act-btn.secondary { background: #1e293b; color: #f1f5f9; border: 1px solid #334155; }
    footer {
      padding: 1.2rem 2rem;
      background: #060e17;
      border-top: 1px solid #1e3a5f;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-btns { display: flex; gap: 0.8rem; }
    .nav-btn {
      padding: 0.6rem 1.2rem;
      background: #1e3a5f;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }
    .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>📐 Primary Visual Lab</span>
      <span class="grade-badge">Class ${chapter.grade} · Chapter ${chapter.chapterNumber}</span>
    </div>
    <div style="color: var(--muted); font-size: 0.9rem;">
      কীবোর্ড তীরচিহ্ন (← / →) দিয়ে স্লাইড বদলান
    </div>
  </header>

  <main>
    <!-- Slide 1: Introduction -->
    <div class="slide active" id="slide-1">
      <div class="slide-tag">NCTB কারিকুলাম পাঠ্যবই নির্দেশিত</div>
      <h1>${chapter.titleBn}</h1>
      <p class="lead">${chapter.objectiveBn}</p>
      <div class="interactive-box">
        <p style="color: var(--muted);">${chapter.summaryBn}</p>
      </div>
      <div class="slide-btns">
        <button class="act-btn" onclick="nextSlide()">পাঠ শুরু করুন →</button>
      </div>
    </div>

    <!-- Slide 2: Interactive Concept -->
    <div class="slide" id="slide-2">
      <div class="slide-tag">বাস্তব ম্যানিপুলেশন ও মডেল</div>
      <h2>দৃশ্যমান গাণিতিক ভিত্তি</h2>
      <p class="lead">মান স্থির রেখে রূপান্তর কীভাবে ঘটে তা প্রত্যক্ষ করুন:</p>
      <div class="interactive-box">
        <div style="color: var(--sky); font-weight: 700;">নমুনা উদাহরণ:</div>
        <div class="val-display" id="valDisplay">${chapter.demoNumbers[0]}</div>
        <div style="display: flex; gap: 0.8rem; justify-content: center;">
          <button class="act-btn secondary" onclick="stepDown()">− ১ কমাও</button>
          <button class="act-btn" onclick="stepUp()">+ ১ বাড়াও</button>
        </div>
      </div>
      <p style="color: var(--muted); text-align: center;">টেনে বা ক্লিক করে প্রত্যক্ষ ফলাফল পর্যবেক্ষণ করুন।</p>
    </div>

    <!-- Slide 3: Mathematical Invariant -->
    <div class="slide" id="slide-3">
      <div class="slide-tag">মূল গাণিতিক সত্য (Invariant)</div>
      <h2>কেন এই নিয়মটি সত্য?</h2>
      <p class="lead">মুখস্থ না করে চোখে দেখে যুক্তি বোঝা:</p>
      <div class="interactive-box">
        <p style="font-size: 1.3rem; color: var(--mint); font-weight: 700; margin-bottom: 0.5rem;">
          ✓ রূপ বদলালেও মোট পরিমাণ অপরিবর্তিত থাকে।
        </p>
        <p style="color: var(--muted);">${chapter.summaryBn}</p>
      </div>
      <div class="slide-btns">
        <button class="act-btn" onclick="nextSlide()">পরবর্তী ধাপ →</button>
      </div>
    </div>

    <!-- Slide 4: Student Practice -->
    <div class="slide" id="slide-4">
      <div class="slide-tag">শ্রেণিকক্ষ অনুশীলন</div>
      <h2>শিক্ষার্থীদের জন্য প্রশ্ন</h2>
      <p class="lead">নিজে চিন্তা করে উত্তর দাও:</p>
      <div class="interactive-box">
        <p style="font-size: 1.4rem; color: #fff; font-weight: 800; margin-bottom: 1rem;">
          ${chapter.titleBn} সম্পর্কিত সমস্যা সমাধানের সঠিক উপায় কোনটি?
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.6rem; max-width: 480px; margin: 0 auto; text-align: left;">
          <button class="act-btn secondary" onclick="alert('সঠিক! দৃশ্যমান যুক্তি দিয়ে প্রমাণ করা যায়।')">ক) বাস্তব ব্লক বা চিত্র এঁকে যাচাই করা</button>
          <button class="act-btn secondary" onclick="alert('ভুল! কোনো কিছু না বুঝে মুখস্থ করা উচিত নয়।')">খ) কোনো যুক্তি ছাড়া সরাসরি মুখস্থ করা</button>
        </div>
      </div>
      <div class="slide-btns">
        <button class="act-btn" onclick="nextSlide()">সমাপ্তি →</button>
      </div>
    </div>

    <!-- Slide 5: Summary & Offline Access -->
    <div class="slide" id="slide-5">
      <div class="slide-tag">পাঠ মূল্যায়ন ও সমাপ্তি</div>
      <h2>অভিনন্দন! অধ্যায় সমাপ্ত।</h2>
      <p class="lead">এই স্লাইডটি ১০০% অফলাইনে কাজ করে এবং যেকোনো শ্রেণিকক্ষ প্রজেক্টরে প্রদর্শনযোগ্য।</p>
      <div class="interactive-box">
        <p style="color: var(--mint); font-weight: 700;">Primary Visual Lab · উন্মুক্ত জাতীয় শিক্ষাক্রম গবেষণা</p>
      </div>
      <div class="slide-btns">
        <button class="act-btn secondary" onclick="goToSlide(0)">↺ প্রথম থেকে শুরু</button>
      </div>
    </div>
  </main>

  <footer>
    <div id="slideCounter" style="font-weight: 700; color: var(--sky);">১ / ৫</div>
    <div class="nav-btns">
      <button class="nav-btn" id="prevBtn" onclick="prevSlide()" disabled>← পূর্ববর্তী</button>
      <button class="nav-btn" id="nextBtn" onclick="nextSlide()">পরবর্তী →</button>
      <button class="nav-btn" onclick="toggleFullscreen()" style="background: var(--amber); color: #0f172a;">⛶ ফুলস্ক্রিন</button>
    </div>
  </footer>

  <script>
    let cur = 0;
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;
    let countVal = ${chapter.demoNumbers[0]};

    function updateSlide() {
      slides.forEach((s, i) => s.classList.toggle('active', i === cur));
      document.getElementById('slideCounter').textContent = (cur + 1) + ' / ' + total;
      document.getElementById('prevBtn').disabled = (cur === 0);
      document.getElementById('nextBtn').disabled = (cur === total - 1);
    }

    function nextSlide() { if (cur < total - 1) { cur++; updateSlide(); } }
    function prevSlide() { if (cur > 0) { cur--; updateSlide(); } }
    function goToSlide(i) { cur = i; updateSlide(); }

    function stepUp() { countVal++; document.getElementById('valDisplay').textContent = countVal; }
    function stepDown() { if (countVal > 0) countVal--; document.getElementById('valDisplay').textContent = countVal; }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(()=>{});
      } else {
        document.exitFullscreen().catch(()=>{});
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  </script>
</body>
</html>`;

  const download = req.nextUrl.searchParams.get('download');
  const headers = new Headers();
  headers.set('Content-Type', 'text/html; charset=utf-8');
  if (download !== 'false') {
    headers.set(
      'Content-Disposition',
      `attachment; filename="PrimaryLab-Class${chapter.grade}-${chapter.slug}.html"`
    );
  }

  return new NextResponse(htmlContent, {
    status: 200,
    headers,
  });
}
