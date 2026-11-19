import { Heading, reveal, type SlideProps } from '../components/kit';
import './059.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-resume",
  "title": "AI와 함께 이력서를 만듭니다",
  "section": "3부 · 커리어를 설계하다",
  "maxStep": 2,
  "subsection": "이력서"
} satisfies SlideMetadata;

export default function Slide059({ step, instant }: SlideProps) {
  const showRequest = step >= 1;
  const showCheck = step >= 2;

  return <div className="industry-content career-resume-ai">
    <Heading eyebrow="AI로 이력서·자기소개서 작성 / 자료 제공 → 초안·편집 → 사실 확인">AI와 함께 이력서를 만듭니다</Heading>

    <div className="crai-layout">
      <aside className="crai-materials" aria-label="AI에게 제공할 이력서 작성 자료">
        <p className="crai-materials-label">함께 제공할 자료</p>
        <section className="crai-source crai-role"><p>지원할 직무</p><h2>채용 공고</h2><span>업무 · 역량 · 지원 조건</span></section>
        <section className="crai-source crai-record"><p>실제로 한 일</p><h2>내 경험 기록</h2><span>내 역할 · 선택 · 확인 자료</span></section>
      </aside>

      <svg className="crai-feed" viewBox="0 0 80 80" aria-hidden="true" style={reveal(showRequest, instant, 'none')}><path d="M9 40H68M49 21L68 40L49 59" /></svg>

      <section className="crai-sheet" aria-label="AI와 이력서를 작성하고 확인하는 방법">
        <header className="crai-sheet-header"><p>AI와 이력서·자기소개서 편집</p><span>요청 예시</span></header>
        <p className="crai-empty" style={reveal(!showRequest, instant, 'none')} aria-hidden={showRequest}>공고와 기록을 함께 제공해<br />지원 직무에 맞춰 작성합니다.</p>

        <div className="crai-request" style={reveal(showRequest, instant, 'translateY(6px)')} aria-hidden={!showRequest}>
          <p className="crai-label">AI에게 요청</p>
          <p className="crai-request-copy">공고에 맞는 경험을 골라<br />내 역할과 결과를 명확하고 간결하게 써 주세요.<br />빠진 정보는 질문해 주세요.</p>
        </div>

        <div className="crai-check" style={reveal(showCheck, instant, 'translateY(6px)')} aria-hidden={!showCheck}>
          <p className="crai-label">초안을 받은 뒤, 내가 확인</p>
          <p>내 역할 · 숫자 · 성과 · 기간을<br /><strong>원래 기록과 대조합니다.</strong></p>
        </div>
      </section>
    </div>

    <p className="crai-takeaway" style={reveal(showCheck, instant, 'translateY(5px)')} aria-hidden={!showCheck}>이력서·자기소개서는 <strong>핵심이 바로 읽히도록 명확하고 간결하게</strong> 씁니다.</p>
  </div>;
}
