import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './029.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-plan-mode",
  "title": "좋은 AI 사용법도 계속 바뀝니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "사용법의 변화"
} satisfies SlideMetadata;

export default function Slide029({ step, instant }: SlideProps) {
  const changing = step >= 1;
  const takeaway = step >= 2;

  return <div className="industry-content workflow-s03">
    <Heading eyebrow="계획과 실행 / Plan Mode">좋은 AI 사용법도 계속 바뀝니다</Heading>

    <div className="w03-composition">
      <section className="w03-purpose">
        <p className="w03-feature"><ReferenceLink to="Plan Mode">Plan Mode</ReferenceLink></p>
        <div className="w03-purpose-scene">
          <ReferenceLink to="기생충 예고편" className="w03-meme" style={reveal(!changing, instant, 'none')} aria-hidden={changing}>
            <img src="/slides/029/plan-meme.jpg" width="740" height="598" alt="기생충의 송강호와 ‘아들아, 역시 너는 계획이 다 있구나!’ 대사" />
          </ReferenceLink>
          <div className="w03-purpose-copy" style={reveal(changing, instant, 'translateY(6px)')} aria-hidden={!changing}>
            <h2>실행 전에<br />함께 계획하기</h2>
            <p className="w03-purpose-detail">접근 방식과 작업 범위를<br />먼저 맞춥니다.</p>
          </div>
        </div>
      </section>

      <div className="w03-evolution">
        <svg viewBox="0 0 660 285" role="img" aria-label={changing
          ? '계획과 실행 사이에서 대화하고 확인하며 계획을 반복해서 조정하는 흐름.'
          : '실행하기 전에 계획을 함께 검토하는 흐름.'}>
          <defs>
            <marker id="workflow-s03-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.7" />
            </marker>
          </defs>

          <path className="w03-route-ground" d="M150 143H510" />
          <path className="w03-route" d="M220 143H437" markerEnd="url(#workflow-s03-arrow)" />
          <circle className="w03-plan" cx="150" cy="143" r="67" />
          <circle className="w03-action" cx="510" cy="143" r="67" />
          <text className="w03-node-title w03-blue" x="150" y="152" textAnchor="middle">계획</text>
          <text className="w03-node-title w03-green" x="510" y="152" textAnchor="middle">실행</text>

          <g style={reveal(!changing, instant, 'none')} aria-hidden={changing}>
            <text className="w03-route-label" x="330" y="116" textAnchor="middle">접근 방식 검토</text>
            <text className="w03-diagram-caption" x="330" y="258" textAnchor="middle">실행 전에 생각을 맞추는 단계</text>
          </g>

          <g style={reveal(changing, instant, 'none')} aria-hidden={!changing}>
            <path className="w03-return" d="M459 206C409 268 251 268 201 206" markerEnd="url(#workflow-s03-arrow)" />
            <path className="w03-dialogue" d="M201 80C251 18 409 18 459 80" markerEnd="url(#workflow-s03-arrow)" />
            <text className="w03-loop-label" x="330" y="4" textAnchor="middle">대화하며 조정</text>
            <text className="w03-loop-label" x="330" y="288" textAnchor="middle">결과를 보고 다시 확인</text>
          </g>
        </svg>

        <div className="w03-perspective" style={reveal(changing, instant, 'translateY(6px)')} aria-hidden={!changing}>
          <p className="w03-person">Boris Cherny · Claude Code 개발자</p>
          <p>모델이 발전하면서, 자신의 Plan Mode 사용도 줄었다고 설명</p>
        </div>
      </div>
    </div>

    <div className="w03-takeaway" style={reveal(takeaway, instant, 'translateY(6px)')} aria-hidden={!takeaway}>
      <p><strong>익숙한 사용법도 다시 점검합니다.</strong></p>
      <p className="w03-status"><ReferenceLink to="Plan Mode">Plan Mode 기능은 유지</ReferenceLink></p>
    </div>
  </div>;
}
