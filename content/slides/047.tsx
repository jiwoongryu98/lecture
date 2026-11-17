import { Heading, reveal, type SlideProps } from '../components/kit';
import './047.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-next-cycle",
  "title": "다음 작업은 더 나은 출발점에서",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "연결"
} satisfies SlideMetadata;

export default function Slide047({ step, instant }: SlideProps) {
  const keeping = step >= 1;
  const next = step >= 2;

  return <div className="industry-content workflow-s20">
    <Heading eyebrow="2부 복습 / 다음 작업으로">다음 작업은 더 나은 출발점에서</Heading>

    <div className="w20-cycle">
      <svg viewBox="0 0 1100 370" role="img" aria-label="이번 작업에서 남긴 실행 도구, 작업 지침, 직접 확인한 이해를 다음 작업에 다시 활용하는 순환">
        <defs>
          <marker id="workflow-s20-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse" overflow="visible">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#177c68" strokeWidth="1.8" />
          </marker>
        </defs>

        <path className="w20-cycle-guide" d="M386 103C483 25 669 49 719 151C762 240 666 324 550 324C456 324 388 277 374 223" />
        <circle className="w20-task" cx="550" cy="189" r="78" />

        <g style={reveal(!next, instant, 'none')} aria-hidden={next}>
          <text className="w20-task-label" x="550" y="182" textAnchor="middle">이번</text>
          <text className="w20-task-label" x="550" y="221" textAnchor="middle">작업</text>
        </g>

        <g style={reveal(keeping, instant, 'translateY(6px)')} aria-hidden={!keeping}>
          <g className="w20-tool" transform="translate(220 168)">
            <rect x="-33" y="-30" width="66" height="51" rx="9" />
            <path d="M-16-13L-4-4L-16 5M5 5H20" />
          </g>
          <text className="w20-anchor-title" x="220" y="223" textAnchor="middle">다시 쓸 도구</text>
          <text className="w20-anchor-detail" x="220" y="255" textAnchor="middle">반복 작업을 실행하는 방법</text>
          <path className="w20-anchor-link" d="M253 168H475" />

          <g className="w20-skill" transform="translate(819 64)">
            <path d="M-23-25H8L24-9V29H-23ZM8-25V-9H24M-10 2H10M-10 13H10" />
          </g>
          <text className="w20-anchor-title" x="819" y="130" textAnchor="middle">남겨 둔 작업 지침</text>
          <text className="w20-anchor-detail" x="819" y="162" textAnchor="middle">순서와 판단 기준</text>
          <path className="w20-anchor-link" d="M796 64H734L618 151" />

          <g className="w20-learning" transform="translate(819 247)">
            <rect x="-35" y="-27" width="70" height="53" rx="8" />
            <path d="M-35-12H35M-20 4H20M-20 15H20" />
            <circle cx="-7" cy="4" r="4" />
            <circle cx="11" cy="15" r="4" />
          </g>
          <text className="w20-anchor-title" x="819" y="310" textAnchor="middle">직접 확인한 이해</text>
          <text className="w20-anchor-detail" x="819" y="342" textAnchor="middle">예상과 결과를 비교한 기록</text>
          <path className="w20-anchor-link" d="M784 247L624 215" />
        </g>

        <g style={reveal(next, instant, 'none')} aria-hidden={!next}>
          <path className="w20-reuse" d="M386 103C483 25 669 49 719 151C762 240 666 324 550 324C456 324 388 277 374 223" markerEnd="url(#workflow-s20-arrow)" />
          <text className="w20-reuse-label" x="552" y="44" textAnchor="middle">다음에도 활용</text>
          <text className="w20-next-label" x="550" y="182" textAnchor="middle">다음</text>
          <text className="w20-next-label" x="550" y="221" textAnchor="middle">작업</text>
        </g>
      </svg>
    </div>

    <p className="w20-takeaway" style={reveal(next, instant, 'translateY(6px)')} aria-hidden={!next}>
      <strong>무엇을 맡기고, 확인하고, 개선할지</strong> 판단합니다.
    </p>
  </div>;
}
