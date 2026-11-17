import { Heading, reveal, type SlideProps } from '../components/kit';
import './042.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-operation",
  "title": "만든 다음에는 운영 기준을 봅니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "실제 적용"
} satisfies SlideMetadata;

const questions = [
  '내용이 맞고, 필요한 형식인가요?',
  '시간과 비용을 감당할 수 있나요?',
  '실패를 확인하고, 다시 실행할 수 있나요?',
];

export default function Slide042({ step, instant }: SlideProps) {
  const phase = Math.max(0, Math.min(step, 2));

  return <div className="industry-content workflow-s15">
    <Heading eyebrow="실제 적용 / 사용할 기준">만든 다음에는 운영 기준을 봅니다</Heading>

    <div className="w15-composition">
      <svg viewBox="0 0 1100 390" role="img" aria-label="같은 샘플 결과를 결과·형식, 시간·비용, 반복 실행이라는 세 기준으로 살펴본다.">
        <circle className="w15-result-ground" cx="550" cy="172" r="115" />
        <rect className="w15-result-page" x="490" y="83" width="120" height="164" rx="10" />
        <path className="w15-result-ink" d="M511 115H589M511 139H569M511 163H589M511 187H578M511 211H554" />
        <text className="w15-result-label" x="550" y="61" textAnchor="middle">샘플 결과</text>

        <g className={`w15-criterion w15-quality${phase === 0 ? ' w15-active' : ''}`}>
          <path className="w15-link" d="M255 105H365Q400 105 430 135L470 160" />
          <circle cx="220" cy="105" r="33" />
          <path className="w15-symbol" d="M204 105L215 116L236 94" />
          <text x="220" y="179" textAnchor="middle">결과 · 형식</text>
        </g>

        <g className={`w15-criterion w15-cost${phase === 1 ? ' w15-active' : ''}`}>
          <path className="w15-link" d="M845 105H735Q700 105 670 135L630 160" />
          <circle cx="880" cy="105" r="33" />
          <path className="w15-symbol" d="M880 85V105L894 113" />
          <text x="880" y="179" textAnchor="middle">시간 · 비용</text>
        </g>

        <g className={`w15-criterion w15-reliability${phase === 2 ? ' w15-active' : ''}`}>
          <path className="w15-link" d="M550 247V300" />
          <circle cx="550" cy="330" r="30" />
          <path className="w15-symbol" d="M535 324A17 17 0 0 1 565 320M565 320V308M565 320H553M565 336A17 17 0 0 1 535 340M535 340V352M535 340H547" />
          <text x="602" y="340">반복 실행</text>
        </g>
      </svg>
    </div>

    <div className="w15-question-area">
      {questions.map((question, index) => <p key={question} className={`w15-question w15-question-${index}`}
        style={reveal(index === phase, instant, 'translateY(6px)')} aria-hidden={index !== phase}>
        {question}
      </p>)}
    </div>
  </div>;
}
