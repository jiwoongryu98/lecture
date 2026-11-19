import { Heading, ReferenceLink, reveal, Takeaway, type SlideProps } from '../components/kit';
import './013.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-product-decisions",
  "title": "Zoom의 회의 전사·AI 요약",
  "section": "1부 · 산업을 읽다",
  "maxStep": 3,
  "subsection": "제품"
} satisfies SlideMetadata;

export default function Slide013({ step, instant }: SlideProps) {
  const showInteraction = step >= 1;
  const showImplementation = step >= 2;
  const showConditions = step >= 3;

  return <div className="industry-content industry-s09" data-instant={instant} data-complete={showConditions}>
    <Heading eyebrow="제품·활용 / 실제 제품 사례">회의 내용을 전사와 요약으로 남깁니다</Heading>

    <div className="industry-visual s09-case">
      <figure className="s09-screen">
        <div className="s09-screen-image">
          <ReferenceLink to="Zoom AI Companion" className="reference-block"><img
            src="/slides/013/zoom-meeting-assets-email.png"
            alt="Zoom 공식 도움말의 회의 요약 메일 화면. Meeting summary 아래 Quick recap과 Next steps가 표시되어 있다."
            width="2516"
            height="1658"
          /></ReferenceLink>
          <div className="s09-summary-focus" style={reveal(showInteraction, instant, 'none')} aria-hidden="true" />
        </div>
        <figcaption>Zoom 공식 도움말 · 회의 요약 메일 화면</figcaption>
      </figure>

      <div className="s09-explanation">
        <p className="s09-product"><ReferenceLink to="Zoom AI Companion">Zoom <strong>회의 전사·AI 요약</strong></ReferenceLink></p>
        <h2>회의에 집중하고,<br /><strong>핵심은 요약으로 남기고</strong></h2>

        <div className="s09-public-facts" aria-label="Zoom 공식 문서에 공개된 회의 요약 기능과 처리 흐름">
          <div className="s09-fact s09-interaction" style={reveal(showInteraction, instant)} aria-hidden={!showInteraction}>
            <span className="s09-step-mark" aria-hidden="true">01</span>
            <div>
              <p className="s09-question">사용자가 만나는 기능</p>
              <p className="s09-feature"><strong>회의 전사·핵심 요약</strong></p>
              <p className="s09-options">자동 시작·전사 저장은 설정에 따라</p>
            </div>
          </div>

          <div className="s09-fact s09-models" style={reveal(showImplementation, instant)} aria-hidden={!showImplementation}>
            <span className="s09-step-mark" aria-hidden="true">02</span>
            <div>
              <p className="s09-question">공개된 처리 흐름</p>
              <p>회의 음성 <span className="s09-plus">→</span> 텍스트 정보</p>
              <p><strong>텍스트 정보로 요약 생성</strong></p>
            </div>
          </div>

          <div className="s09-fact s09-conditions" style={reveal(showConditions, instant)} aria-hidden={!showConditions}>
            <span className="s09-step-mark" aria-hidden="true">03</span>
            <div>
              <p className="s09-question">업무로 이어지는 기능</p>
              <p className="s09-quality"><strong>호스트 편집</strong><span>·</span><strong>공유 대상 설정</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="s09-takeaway" style={reveal(showConditions, instant)} aria-hidden={!showConditions}>
      <Takeaway>익숙한 회의 흐름 안에, <strong>전사·요약·공유</strong>를 연결합니다.</Takeaway>
    </div>
  </div>;
}
