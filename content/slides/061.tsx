import { Heading, reveal, type SlideProps } from '../components/kit';
import './061.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-interview",
  "title": "AI와 모의 면접을 연습합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "면접"
} satisfies SlideMetadata;

export default function Slide061({ step, instant }: SlideProps) {
  const showPractice = step >= 1;
  const showFeedback = step >= 2;

  return <div className="industry-content career-s15">
    <Heading eyebrow="AI로 면접 준비 / 내 자료로 질문·답변·피드백 반복">AI와 모의 면접을 연습합니다</Heading>

    <div className="c15-layout">
      <aside className="c15-materials" aria-label="모의 면접을 위해 AI에게 제공할 자료">
        <p className="c15-materials-label">함께 제공할 자료</p>
        <section className="c15-source c15-role"><p>지원할 직무</p><h2>채용 공고</h2><span>업무 · 역량 · 지원 조건</span></section>
        <section className="c15-source c15-record"><p>내 경험 자료</p><h2>이력서와<br />경험 기록</h2><span>내 역할 · 선택 · 확인 자료</span></section>
      </aside>

      <svg className="c15-feed" viewBox="0 0 80 80" aria-hidden="true"><path d="M9 40H68M49 21L68 40L49 59" /></svg>

      <section className="c15-sheet" aria-label="AI를 면접관으로 삼아 대화하며 연습하는 방법">
        <header className="c15-sheet-header"><p>AI에게 면접관 역할 요청</p><span>요청·질문 예시</span></header>
        <p className="c15-prompt-copy">공고와 이력서로 면접 질문을 하나씩 해 주세요.<br />제 답변 뒤에는 꼬리 질문과 피드백을 주세요.</p>

        <div className="c15-practice" style={reveal(showPractice, instant, 'translateY(6px)')} aria-hidden={!showPractice}>
          <div className="c15-ai-question"><p className="c15-section-label">AI 질문 예시</p><p>이 방법을 고른 이유는 무엇인가요?</p></div>
          <p className="c15-my-answer"><span>내 차례</span>내 경험으로 직접 답하기</p>
        </div>

        <div className="c15-feedback" style={reveal(showFeedback, instant, 'translateY(6px)')} aria-hidden={!showFeedback}>
          <p className="c15-section-label">꼬리 질문·피드백으로 더 설명할 것</p>
          <p>선택 이유 · 검증 근거 · 나와 AI의 역할</p>
        </div>
      </section>
    </div>

    <p className="c15-takeaway" style={reveal(showFeedback, instant, 'translateY(5px)')} aria-hidden={!showFeedback}>질문·답변·피드백을 반복하며, <strong>핵심부터 명확하고 간결하게</strong> 말하는 연습을 합니다.</p>
  </div>;
}
