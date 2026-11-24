import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dict, isLang } from '../../lib/i18n/dict';
import { LESSONS, lessonText } from '../../lib/lessons/registry';
import { MeadowbellHero } from '../../components/MeadowbellHero';
import { NCTB_CURRICULUM } from '../../lib/curriculum/nctb';
import { formatInt } from '../../lib/math/numerals';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  const isBn = lang === 'bn';

  const grades = [1, 2, 3, 4, 5] as const;

  return (
    <div className="home">
      {/* Living Motion Video Hero */}
      <MeadowbellHero
        lang={lang}
        appName={d.appName}
        tagline={d.tagline}
        browseLabel={d.browseLessons}
      />

      {/* Interactive Visual Manipulative Suite Section */}
      <section className="manipulatives-overview-section">
        <div className="section-header">
          <h2>{isBn ? '🛠️ ইন্টারঅ্যাক্টিভ ভিজ্যুয়াল ম্যানিপুলেটিভ' : '🛠️ Interactive Visual Manipulative Labs'}</h2>
          <p className="meta">
            {isBn
              ? 'মুখস্থের পরিবর্তে সরাসরি চোখে দেখে গণিতের সত্যতা প্রমাণের ৬টি ভার্চুয়াল ল্যাব:'
              : 'Six concrete-pictorial laboratories to prove mathematical rules visually:'}
          </p>
        </div>

        <div className="manipulatives-grid">
          {/* Lab 1: Base-10 Blocks */}
          <Link href={`/${lang}/lessons/subtraction-regrouping`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
              🧮
            </div>
            <h3>{isBn ? 'দশকের ব্লক ও রিগ্রুপিং' : 'Base-10 Blocks & Exchange'}</h3>
            <p className="teaser-desc">
              {isBn
                ? '১০টি একক রডে পরিণত হওয়া এবং দশক ভেঙে এককে রূপান্তরের রূপ।'
                : 'Decompose 1 ten into 10 ones with invariant place-value conservation.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '২য়-৩য় শ্রেণি' : 'Class 2-3'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>

          {/* Lab 2: Fraction Bars */}
          <Link href={`/${lang}/manipulatives/fractions`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              📊
            </div>
            <h3>{isBn ? 'ভগ্নাংশ বার কাটার বোর্ড' : 'Fraction Partitioning Bars'}</h3>
            <p className="teaser-desc">
              {isBn
                ? '১/২, ২/৪, ৪/৮ বার কেটে পাশাপাশি রেখে সমতুল্যতার জীবন্ত প্রমাণ।'
                : 'Cut, partition, and align fraction segments to prove equivalence.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '৩য়-৪র্থ শ্রেণি' : 'Class 3-4'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>

          {/* Lab 3: Number Line */}
          <Link href={`/${lang}/manipulatives/numberline`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
              📏
            </div>
            <h3>{isBn ? 'সংখ্যারেখা ও দূরত্বের স্কেল' : 'Directed Number Line Scale'}</h3>
            <p className="teaser-desc">
              {isBn
                ? 'ডানে-বামে নির্দিষ্ট দূরত্বে লাফিয়ে যোগ ও বিয়োগের দিক অনুধাবন।'
                : 'Visual steps and jumps representing directed additions and intervals.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '১ম-৩য় শ্রেণি' : 'Class 1-3'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>

          {/* Lab 4: Counting Dots */}
          <Link href={`/${lang}/manipulatives/counting`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa' }}>
              ⚪
            </div>
            <h3>{isBn ? 'ডট ও টোকেন কাউন্টার' : 'Dot & Token Counter'}</h3>
            <p className="teaser-desc">
              {isBn
                ? '১ থেকে ২০ পর্যন্ত বাস্তব গণনা, জোড়-বিজোড় জোড়া মেলানো।'
                : 'Pairing, sequencing, and parity analysis with tactile visual tokens.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '১ম শ্রেণি' : 'Class 1'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>

          {/* Lab 5: Multiplication Grid */}
          <Link href={`/${lang}/manipulatives/multiplication`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
              📐
            </div>
            <h3>{isBn ? 'নামতা ও গুণন ম্যাট্রিক্স' : 'Multiplication Array Matrix'}</h3>
            <p className="teaser-desc">
              {isBn
                ? 'সারি ও কলাম বাড়িয়ে পুনরাবৃত্তিমূলক যোগফল ক্ষেত্রফল হিসেবে বোঝা।'
                : 'Dynamic row × column grid illustrating area product models.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '২য়-৩য় শ্রেণি' : 'Class 2-3'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>

          {/* Lab 6: Decimals Grid */}
          <Link href={`/${lang}/manipulatives/decimals`} className="manipulative-teaser-card">
            <div className="teaser-icon" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
              ▦
            </div>
            <h3>{isBn ? 'দশমিক ও শতকরা ১০০-গ্রিড' : 'Decimals & Percentages Grid'}</h3>
            <p className="teaser-desc">
              {isBn
                ? '১০০টি ঘরের গ্রিডে ০.০১ থেকে ১.০০ এবং ১% থেকে ১০০% এর মেলবন্ধন।'
                : '100-cell grid mapping decimals (0.01-1.00) directly to percentages.'}
            </p>
            <div className="teaser-meta">
              <span>{isBn ? '৪র্থ-৫ম শ্রেণি' : 'Class 4-5'}</span>
              <span className="teaser-act">{isBn ? 'ল্যাব খুলুন →' : 'Launch Lab →'}</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Complete NCTB Curriculum Classes (1 to 5) */}
      <section className="nctb-curriculum-section">
        <div className="section-header">
          <h2>{isBn ? '📚 জাতীয় শিক্ষাক্রম (NCTB) ১ম থেকে ৫ম শ্রেণি' : '📚 NCTB Mathematics Curriculum (Class 1-5)'}</h2>
          <p className="meta">
            {isBn
              ? 'প্রতিটি অধ্যায়ের ইন্টারঅ্যাক্টিভ ল্যাব, প্রজেক্টর প্রেজেন্টার এবং অফলাইনে ডাউনলোডযোগ্য HTML স্লাইড ডেক:'
              : 'Every chapter equipped with interactive simulation, classroom presenter, and offline HTML slides:'}
          </p>
        </div>

        <div className="grades-stack">
          {grades.map((grade) => {
            const chapters = NCTB_CURRICULUM.filter((c) => c.grade === grade);
            return (
              <div key={grade} className="grade-curriculum-block">
                <div className="grade-header">
                  <span className="grade-num-badge">
                    {isBn ? `${formatInt(grade, lang)}ম শ্রেণি` : `Class ${grade}`}
                  </span>
                  <span className="grade-subtitle">
                    {grade === 1 && (isBn ? 'সংখ্যা পরিচিতি, গণনা ও প্রাথমিক যোগ-বিয়োগ' : 'Number Sense & Early Addition')}
                    {grade === 2 && (isBn ? 'স্থান মান, রিগ্রুপিং ও গুণের প্রাথমিক ধারণা' : 'Place Value, Regrouping & Arrays')}
                    {grade === 3 && (isBn ? '৪-অঙ্কের স্থানীয় মান, ভগ্নাংশ ও জ্যামিতিক কোণ' : '4-Digit Values, Fractions & Angles')}
                    {grade === 4 && (isBn ? 'সমতুল্য ভগ্নাংশ, দশমিক ও ক্ষেত্রফল' : 'Equivalent Fractions, Decimals & Area')}
                    {grade === 5 && (isBn ? 'শতকরা, ঐকিক নিয়ম ও উপাত্ত বিন্যাস' : 'Percentages, Unitary Method & Data')}
                  </span>
                </div>

                <div className="chapter-cards-list">
                  {chapters.map((ch) => (
                    <div key={ch.id} className="chapter-row-card">
                      <div className="chapter-info">
                        <div className="chapter-index">
                          {isBn ? `অধ্যায় ${formatInt(ch.chapterNumber, lang)}` : `Chapter ${ch.chapterNumber}`}
                        </div>
                        <h4 className="chapter-title">{isBn ? ch.titleBn : ch.titleEn}</h4>
                        <p className="chapter-objective">{isBn ? ch.objectiveBn : ch.objectiveEn}</p>
                      </div>

                      <div className="chapter-actions">
                        <Link
                          href={`/${lang}${ch.interactiveRoute}`}
                          className="btn primary"
                        >
                          {isBn ? '🚀 ইন্টারঅ্যাক্টিভ ল্যাব' : '🚀 Open Lab'}
                        </Link>
                        <Link
                          href={`/api/slides/${ch.slideSlug}`}
                          className="btn"
                          download
                          title="Download standalone offline HTML presentation"
                        >
                          {isBn ? '📥 অফলাইন স্লাইড (HTML)' : '📥 Offline Slide'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Lessons (Subtraction & Addition Regrouping) */}
      <section className="demo-lessons-section">
        <div className="section-header">
          <h2>{isBn ? '🔢 রিগ্রুপিং বেস-১০ প্রধান ইঞ্জিন' : '🔢 Core Base-10 Regrouping Engines'}</h2>
          <p className="meta">{d.homeIntro}</p>
        </div>

        <ul className="cards-list">
          {LESSONS.map((l) => {
            const t = lessonText(l, lang);
            return (
              <li key={l.slug} className="lesson-card">
                <h2>{t.title}</h2>
                <p className="meta">{t.objective}</p>
                <p className="badge">{d.reviewStatus}</p>
                <div className="row">
                  <Link className="btn primary" href={`/${lang}/lessons/${l.slug}`}>
                    {d.openStudent}
                  </Link>
                  <Link className="btn" href={`/${lang}/lessons/${l.slug}/present`}>
                    {d.openPresent}
                  </Link>
                  <Link
                    className="btn ghost"
                    href={`/api/slides/${l.slug}`}
                    download
                  >
                    {isBn ? '📥 অফলাইন স্লাইড (HTML)' : '📥 Offline Slide (HTML)'}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
