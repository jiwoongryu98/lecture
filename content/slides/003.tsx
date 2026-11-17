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
  const showParticipation = step >= 1;

  return <div className="industry-content introduction-website">
    <Heading eyebrow="시작하기 / 이 웹사이트">이 웹사이트도 AI와 함께 만들었습니다</Heading>

    <div className="website-intro-layout">
      <figure className="website-intro-screen">
        <img
          src="/shared/lecture-website.png"
          alt="이 발표 웹사이트의 실제 화면. 왼쪽에 슬라이드와 이동 버튼, 오른쪽에 질문 패널이 있다."
          width="1600"
          height="900"
        />
        <figcaption>지금 접속한 발표 웹사이트의 실제 화면</figcaption>
      </figure>

      <div className="website-intro-context">
        <div className="website-intro-making">
          <p className="website-intro-label">만들기</p>
          <h2>AI와 함께</h2>
          <p className="website-intro-detail">슬라이드부터 실시간 질문까지</p>
        </div>

        <div className="website-intro-hosting">
          <p className="website-intro-label">배포하기</p>
          <h2><ReferenceLink to="Cloudflare">Cloudflare</ReferenceLink></h2>
          <p className="website-intro-detail">브라우저에서 바로 보는 강연</p>
        </div>

        <div className="website-intro-source" style={reveal(showParticipation, instant)} aria-hidden={!showParticipation}>
          <p className="website-intro-label">소스 코드</p>
          <p className="website-intro-source-placeholder"><span aria-hidden="true">&lt;/&gt;</span> 공개 링크 준비 중</p>
        </div>
      </div>
    </div>

    <div className="website-intro-participation" style={reveal(showParticipation, instant, 'translateY(6px)')} aria-hidden={!showParticipation}>
      <p><strong>재생</strong>으로 발표 따라가기 <span aria-hidden="true">·</span> <strong>질문 패널</strong>로 함께 참여하기</p>
    </div>
  </div>;
}
