import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './048.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-roles",
  "title": "기획·조율·구현의 경계가 겹칩니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "역할의 변화"
} satisfies SlideMetadata;

export default function Slide048({ step, instant }: SlideProps) {
  return <div className="industry-content career-s04">
    <Heading eyebrow="경험을 연결하다 / PM · TPM · 엔지니어">기획·조율·구현의 경계가 겹칩니다</Heading>
    <div className="c04-composition">
      <ReferenceLink to="Ring Builder 공고" className="c04-posting">
        <p className="c04-company">채용 사례 <span>Amazon Ring</span></p>
        <p className="c04-role">Builder</p>
        <h2>Mobile (Platform)</h2>
        <p className="c04-context">모바일 앱의 공통 기반을<br />만드는 역할</p>
        <p className="c04-job-id">공개 채용 공고 · 업무 요약</p>
      </ReferenceLink>
      <div className="c04-work">
        <section><p className="c04-label">만들기</p><h2>코드 · 테스트 · 개발 도구</h2></section>
        <section style={reveal(step >= 1, instant, 'translateY(5px)')} aria-hidden={step < 1}><p className="c04-label">판단하기</p><h2>성능 · 품질 · 아키텍처</h2></section>
        <section style={reveal(step >= 1, instant, 'translateY(5px)')} aria-hidden={step < 1}><p className="c04-label">연결하기</p><h2>제품 · UX · 다른 개발팀</h2></section>
        <p className="c04-ai" style={reveal(step >= 2, instant, 'translateY(5px)')} aria-hidden={step < 2}>AI를 <strong>작성·검토·디버깅 전반</strong>에 활용</p>
      </div>
    </div>
    <div className="c04-footer"><p style={reveal(step >= 2, instant, 'none')} aria-hidden={step < 2}>AI와 함께, <strong>여러 역할을 넘나들며 결과를 만드는 역량</strong>이 중요해집니다.</p><a href="https://www.amazon.jobs/en/jobs/10470031/builder-mobile-platform-ring" target="_blank" rel="noreferrer">공고 원문 ↗</a></div>
  </div>;
}
