import { Heading, reveal, type SlideProps } from '../components/kit';
import './031.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-sample-check",
  "title": "샘플로 무엇을 확인할까요?",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "샘플"
} satisfies SlideMetadata;

export default function Slide031({ step, instant }: SlideProps) {
  const showScope = step >= 1;
  const showCriterion = step >= 2;

  return <div className="industry-content workflow-s05">
    <Heading eyebrow="샘플 / 무엇을 알아낼 것인가">샘플로 무엇을 확인할까요?</Heading>

    <div className="w05-workbench">
      <svg viewBox="0 0 1100 370" role="img" aria-label="확인할 질문을 중심으로 샘플의 범위를 정하고, 결과를 판단할 기준을 연결하는 개념도">
        <rect className="w05-paper-shadow" x="398" y="85" width="330" height="245" rx="8" />
        <rect className="w05-paper" x="388" y="75" width="330" height="245" rx="8" />
        <path className="w05-paper-rule" d="M388 138H718" />
        <text className="w05-sample-title" x="553" y="117" textAnchor="middle">샘플</text>

        <path className="w05-quiet-line" d="M589 172H686M589 194H668M589 216H680M421 278H685" />
        <rect className="w05-sample-area" x="420" y="160" width="143" height="90" rx="7" />

        <path className="w05-question-leader" d="M292 82H344L388 109" />
        <circle className="w05-question-point" cx="388" cy="109" r="5" />
        <text className="w05-label w05-blue" x="40" y="69">확인할 질문</text>
        <text className="w05-detail" x="40" y="109">무엇이 불확실한가?</text>

        <g style={reveal(showScope, instant, 'none')} aria-hidden={!showScope}>
          <rect className="w05-focus-area" x="420" y="160" width="143" height="90" rx="7" />
          <text className="w05-focus-text" x="491.5" y="212" textAnchor="middle">확인할 부분</text>
          <path className="w05-scope-leader" d="M292 285H352L420 234" />
          <circle className="w05-scope-point" cx="420" cy="234" r="5" />
          <text className="w05-label w05-green" x="40" y="268">샘플의 범위</text>
          <text className="w05-detail" x="40" y="308">무엇까지 만들까?</text>
        </g>

        <g style={reveal(showCriterion, instant, 'none')} aria-hidden={!showCriterion}>
          <path className="w05-criterion-leader" d="M718 192H783L812 169" />
          <circle className="w05-criterion-point" cx="718" cy="192" r="5" />
          <text className="w05-label w05-amber" x="835" y="165">판단 기준</text>
          <text className="w05-detail" x="835" y="205">
            <tspan x="835">어떤 결과면</tspan>
            <tspan x="835" dy="35">다음 단계로 갈까?</tspan>
          </text>
          <circle className="w05-check-circle" cx="685" cy="297" r="23" />
          <path className="w05-check" d="M674 297L682 305L696 288" />
        </g>
      </svg>
    </div>

    <p className="w05-takeaway" style={reveal(showCriterion, instant, 'translateY(5px)')} aria-hidden={!showCriterion}>
      <strong>무엇을 확인할지 정하면,</strong> 샘플의 범위가 정해집니다.
    </p>
  </div>;
}
