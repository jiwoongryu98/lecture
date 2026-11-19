import { Heading, reveal, type SlideProps } from '../components/kit';
import { presenterProfile as profile } from '../presenter';
import './002.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "presenter-intro",
  "title": "발표자 소개",
  "section": "들어가며",
  "maxStep": 1,
  "subsection": "발표자"
} satisfies SlideMetadata;

export default function Slide002({ step, instant }: SlideProps) {
  const showExperience = step >= 1;

  return <div className="industry-content presenter-intro" data-instant={instant}>
    <div className="presenter-intro-layout">
      <section className="presenter-intro-identity">
        <p className="presenter-intro-greeting">반갑습니다.</p>
        <Heading eyebrow="PRESENTER · 발표자 소개">{profile.name}</Heading>
        <div className="presenter-intro-current">
          <p className="presenter-intro-current-label">현재</p>
          <p className="presenter-intro-organization">{profile.organizationUrl
            ? <a className="reference-link" href={profile.organizationUrl} target="_blank" rel="noopener noreferrer">{profile.organization}</a>
            : profile.organization}</p>
          <p className="presenter-intro-role">{profile.role}</p>
          {profile.focus && <p className="presenter-intro-focus">{profile.focus}</p>}
        </div>
      </section>

      <aside className="presenter-intro-experience" style={reveal(showExperience, instant, 'translateY(8px)')} aria-hidden={!showExperience}>
        <ul className="presenter-intro-highlights">
          {profile.highlights.map(({ title, detail, href }) => <li key={title}>
            <h2>{href ? <a className="reference-link" href={href} target="_blank" rel="noopener noreferrer">{title}</a> : title}</h2>
            {detail && <p>{detail}</p>}
          </li>)}
        </ul>
      </aside>
    </div>
  </div>;
}
