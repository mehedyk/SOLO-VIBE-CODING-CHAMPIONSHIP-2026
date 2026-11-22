import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, isLang } from "../../lib/i18n/dict";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = dict[lang];
  const base = `/${lang}/lessons/subtraction-regrouping`;
  return (
    <div className="home">
      <h1>{d.appName}</h1>
      <p className="lead">{d.tagline}</p>
      <p>{d.homeIntro}</p>
      <article className="lesson-card">
        <h2>{d.lessonTitle}</h2>
        <p className="meta">{d.objective}</p>
        <p className="badge">{d.reviewStatus}</p>
        <div className="row">
          <Link className="btn primary" href={base}>{d.openStudent}</Link>
          <Link className="btn" href={`${base}/present`}>{d.openPresent}</Link>
        </div>
      </article>
      <section className="status"><h2>{d.homeStatusTitle}</h2><p>{d.homeStatus}</p></section>
    </div>
  );
}
