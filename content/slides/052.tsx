import { Heading, reveal, type SlideProps } from '../components/kit';
import './052.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-goals",
  "title": "포트폴리오는 문제 선택에서 시작합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "포트폴리오"
} satisfies SlideMetadata;

export default function Slide052({ step, instant }: SlideProps) {
  const goal = step >= 1;
  const judgment = step >= 2;

  return <div className="industry-content career-s01">
    <Heading eyebrow="포트폴리오 / 목표와 문제 선택">포트폴리오는 문제 선택에서 시작합니다</Heading>

    <div className="c01-composition">
      <svg viewBox="0 0 1100 360" role="img" aria-label="다양한 코드와 문서, 화면을 만들 수 있을 때, 풀고 싶은 문제를 정해 방향을 선택하는 모습">
        <defs>
          <marker id="career-s01-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#177c68" strokeWidth="1.8" />
          </marker>
        </defs>

        <g className="c01-outputs">
          <g className="c01-screen" transform="translate(85 47)">
            <rect width="218" height="124" rx="12" />
            <path d="M0 31H218" />
            <circle cx="17" cy="16" r="3" />
            <circle cx="29" cy="16" r="3" />
            <circle cx="41" cy="16" r="3" />
            <path className="c01-screen-ink" d="M23 56H126M23 76H159M23 96H113" />
          </g>
          <g className="c01-code" transform="translate(94 207)">
            <rect width="218" height="85" rx="11" />
            <path d="M45 28L29 43L45 58M89 28L105 43L89 58M73 22L61 64M129 36H180M129 53H161" />
          </g>
          <g className="c01-document" transform="translate(245 107) rotate(6 49 70)">
            <path d="M0 0H65L96 31V137H0ZM65 0V31H96" />
            <path className="c01-document-ink" d="M20 54H76M20 75H63M20 96H76M20 117H51" />
          </g>
        </g>
        <text className="c01-outputs-label" x="213" y="337" textAnchor="middle">코드·문서·화면</text>

        <circle className="c01-origin" cx="385" cy="181" r="8" />
        <path className="c01-route-guide" d="M397 181C530 181 651 144 829 144M397 181C529 181 654 285 829 285" />
        <circle className="c01-option-end" cx="840" cy="285" r="7" />
        <text className="c01-options-label" x="653" y="325" textAnchor="middle">넓어진 선택의 범위</text>

        <g style={reveal(goal, instant, 'none')} aria-hidden={!goal}>
          <path className="c01-chosen-route" d="M397 181C530 181 651 144 829 144" markerEnd="url(#career-s01-arrow)" />
          <path className="c01-flag-pole" d="M871 66V185M846 186H896" />
          <path className="c01-flag" d="M871 67L946 82L871 112Z" />
          <text className="c01-goal-label" x="892" y="228" textAnchor="middle">풀고 싶은 문제</text>
          <text className="c01-goal-question" x="892" y="267" textAnchor="middle">누구의 문제인가?</text>
        </g>

        <g style={reveal(judgment, instant, 'translateY(6px)')} aria-hidden={!judgment}>
          <text className="c01-choice-label" x="600" y="103" textAnchor="middle">먼저 방향을 정합니다</text>
        </g>
      </svg>
    </div>

    <p className="c01-takeaway" style={reveal(judgment, instant, 'translateY(6px)')} aria-hidden={!judgment}>
      포트폴리오에는 <strong>누구의 문제를 왜 골랐는지</strong> 담습니다.
    </p>
  </div>;
}
