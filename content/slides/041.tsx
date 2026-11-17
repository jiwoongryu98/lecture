import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './041.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-validation",
  "title": "실행이 빨라질수록, 검증이 병목이 됩니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "검증"
} satisfies SlideMetadata;

export default function Slide041({ step, instant }: SlideProps) {
  const specified = step >= 1;
  const repeatable = step >= 2;

  return <div className="industry-content workflow-validation">
    <Heading eyebrow="실무 관점 / 결과 검증">실행이 빨라질수록, 검증이 병목이 됩니다</Heading>

    <div className="wv-composition">
      <svg viewBox="0 0 1100 400" role="group" aria-label="생성한 결과의 검증을 명세와 테스트와 반복 실행 환경이 받친다. Chrome DevTools MCP는 실제 브라우저에서 동작과 화면을 확인하고 성능을 분석할 수 있게 한다.">
        <defs>
          <marker id="workflow-validation-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#177c68" strokeWidth="1.8" />
          </marker>
        </defs>

        <path className="wv-funnel" d="M229 70C382 70 425 118 520 118V186C425 186 382 233 229 233Z" />
        <g className="wv-pages">
          <g transform="translate(97 45) rotate(-7 35 48)">
            <rect width="70" height="96" rx="7" />
            <path d="M15 23H55M15 42H47M15 61H55M15 79H41" />
          </g>
          <g transform="translate(164 103) rotate(7 35 48)">
            <rect width="70" height="96" rx="7" />
            <path d="M15 23H55M15 42H47M15 61H55M15 79H41" />
          </g>
          <g transform="translate(82 154) rotate(-4 35 48)">
            <rect width="70" height="96" rx="7" />
            <path d="M15 23H55M15 42H47M15 61H55M15 79H41" />
          </g>
        </g>
        <text className="wv-source-label" x="161" y="286" textAnchor="middle">생성·수정한 결과물</text>

        <path className="wv-gate" d="M525 217V98Q525 76 547 76H613Q635 76 635 98V217" />
        <text className="wv-gate-label" x="580" y="158" textAnchor="middle">검증</text>
        <text className="wv-question" x="914" y="160" textAnchor="middle" style={reveal(!specified, instant, 'none')} aria-hidden={specified}>원하는 결과인가?</text>
        <g style={reveal(specified, instant, 'translateY(6px)')} aria-hidden={!specified}>
          <path className="wv-result-link" d="M649 151H773" markerEnd="url(#workflow-validation-arrow)" />
          <ReferenceLink to="Chrome DevTools MCP"><text className="wv-browser-title" x="938" y="24" textAnchor="middle">Chrome DevTools MCP</text>
          <rect className="wv-browser" x="791" y="47" width="294" height="215" rx="10" />
          <path className="wv-browser-rule" d="M791 76H1085M809 138H1067M809 200H1067" />
          <circle className="wv-browser-dot" cx="808" cy="62" r="3" />
          <circle className="wv-browser-dot" cx="821" cy="62" r="3" />
          <circle className="wv-browser-dot" cx="834" cy="62" r="3" />
          <text className="wv-check-label" x="817" y="116">동작</text>
          <text className="wv-check-detail" x="904" y="116">클릭·입력</text>
          <text className="wv-check-label" x="817" y="178">화면</text>
          <text className="wv-check-detail" x="904" y="178">배치·표시</text>
          <text className="wv-check-label" x="817" y="240">성능</text>
          <text className="wv-check-detail" x="904" y="240">추적·분석</text></ReferenceLink>
        </g>

        <g style={reveal(specified, instant, 'translateY(6px)')} aria-hidden={!specified}>
          <path className="wv-support-link" d="M580 217V239" />
          <rect className="wv-spec" x="410" y="239" width="340" height="49" rx="3" />
          <text className="wv-spec-label" x="580" y="271" textAnchor="middle">명세 · 모습과 동작</text>
        </g>

        <g style={reveal(repeatable, instant, 'translateY(6px)')} aria-hidden={!repeatable}>
          <rect className="wv-tests" x="375" y="292" width="410" height="49" rx="3" />
          <text className="wv-test-label" x="580" y="324" textAnchor="middle">테스트 · 기대한 결과 확인</text>
          <rect className="wv-environment" x="340" y="345" width="480" height="49" rx="3" />
          <text className="wv-environment-label" x="580" y="377" textAnchor="middle">반복 실행 환경 · 같은 조건으로</text>
        </g>
      </svg>
    </div>

    <p className="wv-takeaway" style={reveal(repeatable, instant, 'translateY(6px)')} aria-hidden={!repeatable}>
      기대한 결과를 <strong>명세로 정하고, 테스트로 반복해서 확인합니다.</strong>
    </p>
  </div>;
}
