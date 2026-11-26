import Link from 'next/link';
import Icon from './Icon';

export default function ErrorScreen({ code, title, body, homeHref, homeLabel, children }: { code: string; title: string; body: string; homeHref: string; homeLabel: string; children?: React.ReactNode }) {
  return (
    <div className="err-wrap">
      <div className="err-card" role="alert">
        <div className="big" aria-hidden="true">{code}</div>
        <h1>{title}</h1>
        <p>{body}</p>
        <div className="hero-cta" style={{ justifyContent: 'center' }}>
          {children}
          <Link className="btn btn-navy" href={homeHref}><Icon name="home" />{homeLabel}</Link>
        </div>
      </div>
    </div>
  );
}
