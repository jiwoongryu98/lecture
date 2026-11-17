import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './056.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-open-source",
  "title": "무엇을 만들지 막막하다면, 오픈소스에 기여해 보세요",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "오픈소스"
} satisfies SlideMetadata;

export default function Slide056({ step, instant }: SlideProps) {
  const guide = step >= 1;
  const contribution = step >= 2;

  return <div className="industry-content career-s08">
    <Heading eyebrow="실제 문제에서 출발하기 / 오픈소스 기여">무엇을 만들지 막막하다면,<br />오픈소스에 기여해 보세요</Heading>

    <div className="c08-composition">
      <div className="c08-projects">
        <ReferenceLink to="LangChain" className="c08-project-area">
          <p className="c08-area-label">AI 앱·에이전트</p>
          <img src="/slides/056/c08-langchain.svg" width="472" height="100" alt="LangChain 공식 로고" />
        </ReferenceLink>
        <ReferenceLink to="vLLM" className="c08-project-area">
          <p className="c08-area-label">모델 추론·서빙</p>
          <img src="/slides/056/c08-vllm.png" width="3000" height="860" alt="vLLM 공식 로고" />
        </ReferenceLink>
        <ReferenceLink to="React" className="c08-project-area">
          <p className="c08-area-label">웹 화면 개발</p>
          <img src="/slides/056/c08-react.svg" width="600" height="181" alt="React 공식 로고" />
        </ReferenceLink>
        <ReferenceLink to="pandas" className="c08-project-area">
          <p className="c08-area-label">데이터 분석</p>
          <img src="/slides/056/c08-pandas.svg" width="819" height="331" alt="pandas 공식 로고" />
        </ReferenceLink>
      </div>

      <div className="c08-entry">
        <section className="c08-entry-question" style={reveal(!guide, instant, 'translateY(6px)')} aria-hidden={guide}>
          <p>새로운 주제를 찾기 어렵다면</p>
          <h2>이미 필요한 문제에서<br />시작할 수 있습니다</h2>
        </section>

        <div className="c08-guide" style={reveal(guide, instant, 'translateY(6px)')} aria-hidden={!guide}>
          <p className="c08-guide-label">실제 요구와 피드백이 있는 환경</p>
          <svg viewBox="0 0 600 270" role="img" aria-label="오픈소스는 이미 필요한 문제와 다른 사람의 피드백을 만날 수 있는 환경이다.">
            <path className="c08-book" d="M300 58C233 32 164 29 82 43V222C164 208 233 211 300 238C367 211 436 208 518 222V43C436 29 367 32 300 58Z" />
            <path className="c08-spine" d="M300 58V238" />
            <text className="c08-book-title" x="187" y="105" textAnchor="middle">필요한 문제</text>
            <text className="c08-book-title" x="414" y="105" textAnchor="middle">검토·피드백</text>
            <path className="c08-book-ink" d="M122 132H252M122 155H237M122 178H249M347 132H477M347 155H459M347 178H475" />
          </svg>
          <p className="c08-contribution-types" style={reveal(contribution, instant, 'translateY(6px)')} aria-hidden={!contribution}>문서 · 예제 · 테스트 · 작은 버그 수정</p>
        </div>
      </div>
    </div>

    <p className="c08-takeaway" style={reveal(contribution, instant, 'translateY(6px)')} aria-hidden={!contribution}>
      필요한 변화에 기여하며, <strong>내가 한 일을 보여줄 근거</strong>를 남깁니다.
    </p>
  </div>;
}
