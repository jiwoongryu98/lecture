import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './040.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-product",
  "title": "나를 돕는 AI에서, 서비스 속의 AI로",
  "section": "2부 · 실무를 만나다",
  "maxStep": 1,
  "subsection": "자동화"
} satisfies SlideMetadata;

export default function Slide040({ step, instant }: SlideProps) {
  const showProduct = step >= 1;

  return <div className="industry-content workflow-s13">
    <Heading eyebrow="활용 범위 넓히기 / 개인 도구와 서비스">나를 돕는 AI에서, 서비스 속의 AI로</Heading>

    <div className="w13-visual">
      <svg viewBox="0 0 1100 380" role="group" aria-label={showProduct
        ? '개인이 AI 도구에 직접 요청하고 결과를 확인하는 방식과, 사용자가 이용하는 서비스가 API로 모델을 연결하고 도구와 결과 확인을 담당하는 방식을 비교한다.'
        : '내 작업을 위해 Claude Code나 Codex 같은 AI 도구에 직접 요청하고 결과를 검토한다.'}>
        <defs>
          <marker id="workflow-s13-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.7" />
          </marker>
        </defs>

        <text className="w13-track-title w13-green" x="48" y="30">내 작업을 돕는 AI</text>

        <g className="w13-person">
          <circle cx="150" cy="95" r="16" />
          <path d="M119 141V131C119 107 181 107 181 131V141" />
        </g>
        <text className="w13-person-label" x="150" y="173" textAnchor="middle">나</text>

        <path className="w13-request" d="M205 111H365" markerEnd="url(#workflow-s13-arrow)" />
        <text className="w13-flow-label" x="285" y="92" textAnchor="middle">직접 요청</text>
        <rect className="w13-agent" x="385" y="65" width="260" height="104" rx="12" />
        <text className="w13-agent-title" x="515" y="107" textAnchor="middle">AI 도구</text>
        <text className="w13-agent-detail" x="515" y="143" textAnchor="middle"><ReferenceLink to="Claude Code">Claude Code</ReferenceLink>{' · '}<ReferenceLink to="Codex">Codex</ReferenceLink></text>
        <path className="w13-request" d="M665 111H830" markerEnd="url(#workflow-s13-arrow)" />
        <text className="w13-flow-label" x="748" y="92" textAnchor="middle">결과</text>

        <g className="w13-output">
          <path d="M855 79H887L901 93V143H855ZM887 79V94H901M866 105H890M866 117H890M866 129H883" />
        </g>
        <text className="w13-person-label" x="878" y="173" textAnchor="middle">내가 검토·활용</text>

        <g style={reveal(showProduct, instant, 'translateY(7px)')} aria-hidden={!showProduct}>
          <path className="w13-divider" d="M48 206H1052" />
          <text className="w13-track-title w13-blue" x="48" y="240">서비스 속의 AI</text>

          <g className="w13-users">
            <circle cx="126" cy="294" r="12" />
            <circle cx="158" cy="284" r="14" />
            <circle cx="190" cy="294" r="12" />
            <path d="M105 330V321C105 304 143 304 146 319M136 330V316C136 295 180 295 180 316V330M176 319C179 304 211 304 211 321V330" />
          </g>
          <text className="w13-person-label" x="158" y="366" textAnchor="middle">사용자</text>

          <path className="w13-service-request" d="M235 300H365" markerEnd="url(#workflow-s13-arrow)" />
          <path className="w13-service-response" d="M365 332H235" markerEnd="url(#workflow-s13-arrow)" />
          <text className="w13-flow-label" x="300" y="280" textAnchor="middle">이용</text>
          <text className="w13-flow-label" x="300" y="362" textAnchor="middle">결과</text>

          <rect className="w13-service" x="385" y="265" width="260" height="104" rx="12" />
          <text className="w13-service-title" x="515" y="307" textAnchor="middle">서비스의 업무 흐름</text>
          <text className="w13-service-detail" x="515" y="343" textAnchor="middle">요청 · 도구 · 결과 확인</text>

          <path className="w13-service-request" d="M665 300H825" markerEnd="url(#workflow-s13-arrow)" />
          <path className="w13-service-response" d="M825 332H665" markerEnd="url(#workflow-s13-arrow)" />
          <text className="w13-api-label" x="745" y="280" textAnchor="middle">API</text>
          <circle className="w13-model" cx="890" cy="316" r="61" />
          <text className="w13-model-label" x="890" y="325" textAnchor="middle">AI 모델</text>
        </g>
      </svg>
    </div>

    <p className="w13-caption">{showProduct
      ? '서비스가 요청과 결과를 연결하고, 사용자는 기능을 이용합니다.'
      : '내가 요청하고, 내가 결과를 확인합니다.'}</p>
  </div>;
}
