import { Heading, reveal, type SlideProps } from '../components/kit';
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
        <Heading eyebrow="PRESENTER · 발표자 소개">[발표자 이름]</Heading>
        <p className="presenter-intro-role">[현재 역할 · 소속]</p>
      </section>

      <aside className="presenter-intro-experience" style={reveal(showExperience, instant, 'translateY(8px)')} aria-hidden={!showExperience}>
        <p className="presenter-intro-experience-label">오늘의 이야기와 연결되는 경험</p>
        <ol>
          <li><span>01</span><p>[산업·제품과 연결되는 경험]</p></li>
          <li><span>02</span><p>[AI·업무와 연결되는 경험]</p></li>
        </ol>
      </aside>
    </div>

  </div>;
}
