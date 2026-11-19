import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './003.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "website-intro",
  "title": "AI와 함께 만든 발표 웹사이트",
  "section": "들어가며",
  "maxStep": 1,
  "subsection": "웹사이트"
} satisfies SlideMetadata;

export default function Slide003({ step, instant }: SlideProps) {
  const showDetails = step >= 1;

  return <div className="industry-content introduction-website">
    <Heading eyebrow="시작하기 / 이 웹사이트">이 웹사이트도 AI와 함께 만들었습니다</Heading>

    <div className="website-intro-layout">
      <figure className="website-intro-screen">
        <img
          src="/slides/003/static-viewer.png"
          alt="슬라이드와 목차, 이전·다음 버튼이 보이는 발표 자료 웹사이트 화면."
          width="1600"
          height="900"
        />
        <figcaption>발표 자료를 보는 화면</figcaption>
      </figure>

      <div className="website-intro-context">
        <div className="website-intro-making">
          <p className="website-intro-label">기술 스택</p>
          <h2>AI와 함께</h2>
          <p className="website-intro-detail"><ReferenceLink to="React">React</ReferenceLink> · <ReferenceLink to="TypeScript">TypeScript</ReferenceLink> · <ReferenceLink to="Vite">Vite</ReferenceLink></p>
        </div>

        <div className="website-intro-hosting">
          <p className="website-intro-label">정적 호스팅</p>
          <h2><ReferenceLink to="Cloudflare">Cloudflare</ReferenceLink></h2>
          <p className="website-intro-detail"><ReferenceLink to="Cloudflare Static Assets">Workers Static Assets</ReferenceLink></p>
        </div>

        <div className="website-intro-source" style={reveal(showDetails, instant)} aria-hidden={!showDetails}>
          <div>
            <p className="website-intro-label">소스 코드 · <ReferenceLink to="발표 웹사이트 라이선스">MIT 라이선스</ReferenceLink></p>
            <p className="website-intro-source-link">
              <ReferenceLink to="발표 웹사이트 소스 코드">jiwoongryu98/lecture <span aria-hidden="true">↗</span></ReferenceLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="website-intro-navigation" style={reveal(showDetails, instant, 'translateY(6px)')} aria-hidden={!showDetails}>
      <p><strong>목차</strong>에서 원하는 슬라이드로 이동 <span aria-hidden="true">·</span> <strong>화살표</strong>로 앞뒤 단계 보기</p>
    </div>
  </div>;
}
