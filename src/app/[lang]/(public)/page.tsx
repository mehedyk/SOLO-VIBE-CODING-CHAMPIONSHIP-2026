import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icon';
import TenBreaker from '@/components/TenBreaker';
import RolesTabs from '@/components/RolesTabs';
import { getCurrentUserSafe } from '@/lib/auth/current';
import { isLang } from '@/lib/i18n/dict';
import { site } from '@/lib/i18n/site';
import { NCTB_CURRICULUM } from '@/lib/curriculum/nctb';
import { formatInt } from '@/lib/math/numerals';

export default async function Landing({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const s = site[lang];
  const user = await getCurrentUserSafe();
  const L = (p: string) => `/${lang}${p}`;
  const grades = [1, 2, 3, 4, 5].map((g) => {
    const ch = NCTB_CURRICULUM.filter((c) => c.grade === g);
    return { g, count: ch.length, sample: ch.slice(0, 3).map((c) => (lang === 'bn' ? c.titleBn : c.titleEn)) };
  });

  return (
    <>
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-copy">
          <p className="eyebrow"><i />{s.hero.eyebrow}</p>
          <h1 id="hero-h">{s.hero.title}</h1>
          <p className="hero-sub">{s.hero.sub}</p>
          <div className="hero-cta">
            {user ? (
              <Link className="btn btn-amber" href={L('/dashboard')}>{s.hero.ctaDash}<Icon name="right" /></Link>
            ) : (
              <>
                <Link className="btn btn-amber" href={L('/signup')}>{s.hero.ctaSignup}<Icon name="right" /></Link>
                <Link className="btn btn-glass" href={L('/login')}>{s.hero.ctaLogin}</Link>
              </>
            )}
          </div>
          <p className="hero-fine">{s.hero.fine}</p>
        </div>
        <TenBreaker lang={lang} />
      </section>

      <section className="sheet" id="how" aria-labelledby="how-h">
        <div className="sheet-head"><span className="kicker">{s.how.kicker}</span><h2 id="how-h">{s.how.title}</h2><p>{s.how.lead}</p></div>
        <ol className="beats">{s.how.beats.map((b) => <li key={b.t}><h3>{b.t}</h3><p>{b.d}</p></li>)}</ol>
      </section>

      <section className="sheet" id="labs" aria-labelledby="labs-h">
        <div className="sheet-head"><span className="kicker">{s.labs.kicker}</span><h2 id="labs-h">{s.labs.title}</h2><p>{s.labs.lead}</p></div>
        <ul className="index">
          {s.labs.items.map((it, i) => (
            <li key={it.slug}>
              <Link href={L(it.href)}>
                <span className="no">{formatInt(i + 1, lang)}</span>
                <span><strong>{it.name}</strong><span className="d">{it.d}</span></span>
                <span className="chip mint">{it.cls}</span>
                <span className="go">{s.labs.open}<Icon name="right" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="sheet" id="roles" aria-labelledby="roles-h">
        <div className="sheet-head"><span className="kicker">{s.roles.kicker}</span><h2 id="roles-h">{s.roles.title}</h2><p>{s.roles.lead}</p></div>
        <RolesTabs lang={lang} />
      </section>

      <section className="sheet" id="curriculum" aria-labelledby="curr-h">
        <div className="sheet-head"><span className="kicker">{s.curr.kicker}</span><h2 id="curr-h">{s.curr.title}</h2><p>{s.curr.lead}</p></div>
        <div className="grades">
          {grades.map((r) => (
            <div className="grade" key={r.g}>
              <span className="num" aria-hidden="true">{formatInt(r.g, lang)}</span>
              <div>
                <h3>{s.curr.cls} {formatInt(r.g, lang)} <span className="chip amber">{formatInt(r.count, lang)} {s.curr.chapters}</span></h3>
                <p>{r.sample.join(' · ')}</p>
              </div>
              <Link className="go" href={L(`/lessons?grade=${r.g}`)}>{s.curr.signIn}<Icon name="right" /></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="sheet cta-band" aria-labelledby="cta-h">
        <h2 id="cta-h">{s.cta.title}</h2>
        <p>{s.cta.sub}</p>
        <div className="hero-cta">
          {user ? <Link className="btn btn-navy" href={L('/dashboard')}>{s.hero.ctaDash}<Icon name="right" /></Link> : (
            <>
              <Link className="btn btn-amber" href={L('/signup')}>{s.hero.ctaSignup}<Icon name="right" /></Link>
              <Link className="btn btn-ghost" href={L('/login')}>{s.hero.ctaLogin}</Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}
