import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLang } from "../../lib/i18n/dict";
import { LESSONS, lessonText } from "../../lib/lessons/registry";
import { MeadowbellHero } from "../../components/MeadowbellHero";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];

  return (
    <div className="home">
      <MeadowbellHero
        lang={lang}
        appName={d.appName}
        tagline={d.tagline}
        browseLabel={d.browseLessons}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-2">{isBnLang(lang) ? 'ডেমো পাঠসমূহ' : 'Available Labs'}</h2>
        <p className="text-sm text-slate-400 mb-4">{d.homeIntro}</p>
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
                <Link className="btn primary" href={`/${lang}/lessons/${l.slug}`}>{d.openStudent}</Link>
                <Link className="btn" href={`/${lang}/lessons/${l.slug}/present`}>{d.openPresent}</Link>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="status">
        <h2>{d.homeStatusTitle}</h2>
        <p>{d.homeStatus}</p>
      </section>
    </div>
  );
}

function isBnLang(lang: string) {
  return lang === 'bn';
}
