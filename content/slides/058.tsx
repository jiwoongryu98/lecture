import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './058.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-hiring-ai",
  "title": "채용하는 쪽도 AI를 활용합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "이력서"
} satisfies SlideMetadata;

const sourceUrl = 'https://business.linkedin.com/content/dam/lem/business/en/hire/hiring-assistant/hiring-assistant-data-compliance-white-paper-ai-flow-diagram.pdf#page=19';

export default function Slide058({ step, instant }: SlideProps) {
  const showInputs = step >= 1;
  const showAdvice = step >= 2;

  return <div className="industry-content career-s14">
    <Heading eyebrow="이력서 준비 / 채용 측의 AI 활용" subtitle={<><ReferenceLink to="LinkedIn Hiring Assistant">LinkedIn Hiring Assistant</ReferenceLink> · 실제 제품 사례</>}>
      채용하는 쪽도 AI를 활용합니다
    </Heading>

    <div className="c14-case">
      <figure className="c14-source">
        <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn Hiring Assistant 공식 자료 19쪽 열기">
          <img src="/slides/058/linkedin-hiring-assistant-flow.png" alt="LinkedIn 공식 자료의 Hiring Assistant 데이터 흐름도 원본" />
        </a>
        <figcaption><span>공식 자료 · 19쪽</span><a href={sourceUrl} target="_blank" rel="noreferrer">원문 보기 ↗</a></figcaption>
      </figure>

      <div className="c14-explanation">
        <svg viewBox="0 0 850 350" role="img" aria-label="후보자 정보를 AI의 후보 평가 지원에 활용하는 흐름">
          <defs>
            <marker id="career-s14-arrow" viewBox="0 0 10 10" markerWidth="8" markerHeight="8" refX="8" refY="5" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="#72928b" strokeWidth="1.7" /></marker>
          </defs>
          <g className="c14-inputs" style={reveal(showInputs, instant, 'translateY(6px)')} aria-hidden={!showInputs}>
            <path d="M33 26 H329 L370 67 V321 H33 Z" fill="#fffdf7" stroke="#b7c9bd" strokeWidth="2" />
            <path d="M329 26 V67 H370" fill="none" stroke="#b7c9bd" strokeWidth="2" />
            <text className="c14-paper-title" x="61" y="77">평가에 활용하는 정보</text>
            <path d="M61 95 H339" stroke="#d9e2df" />
            <text x="62" y="143">LinkedIn 프로필</text>
            <text x="62" y="190">공개 이력서</text>
            <text x="62" y="237">사전 질문 응답</text>
            <text x="62" y="284">채용 메모</text>
            <path d="M396 175 H520" fill="none" stroke="#72928b" strokeWidth="3" markerEnd="url(#career-s14-arrow)" />
          </g>
          <circle cx="669" cy="175" r="119" fill="#e9f1eb" stroke="#a4beb0" strokeWidth="2" />
          <text className="c14-ai-label" x="669" y="145" textAnchor="middle">AI</text>
          <text className="c14-ai-title" x="669" y="192" textAnchor="middle">후보 평가 지원</text>
        </svg>
        <p className="c14-scope" style={reveal(showInputs, instant, 'translateY(4px)')} aria-hidden={!showInputs}>
          공식 자료의 평가 입력 요약 · 해당 자료가 있을 때 활용
        </p>
      </div>
    </div>

    <p className="c14-advice" style={reveal(showAdvice, instant, 'translateY(6px)')} aria-hidden={!showAdvice}>
      <span>지원자가 정리할 것</span><strong>실제 경험 · 맡은 역할 · 확인할 근거</strong>
    </p>
  </div>;
}
