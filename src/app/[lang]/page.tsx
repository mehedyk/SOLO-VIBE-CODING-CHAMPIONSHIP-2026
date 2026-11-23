import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLang } from "../../lib/i18n/dict";
import { LESSONS, lessonText } from "../../lib/lessons/registry";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  return (
    <div className="home">
      <h1>{d.appName}</h1>
      <p className="lead">{d.tagline}</p>
      <p>{d.homeIntro}</p>
      <div className="row"><Link className="btn primary" href={`/${lang}/lessons`}>{d.browseLessons}</Link></div>
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
      <section className="status"><h2>{d.homeStatusTitle}</h2><p>{d.homeStatus}</p></section>
    </div>
  );
}
