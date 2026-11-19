import { Heading, reveal, type SlideProps } from '../components/kit';
import './018.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-evaluation",
  "title": "데이터, 학습, 평가, 개선",
  "section": "1부 · 산업을 읽다",
  "maxStep": 3,
  "subsection": "모델"
} satisfies SlideMetadata;

const phases = [
  { x: 190, y: 79, title: '데이터 준비', detail: '정리 · 라벨링' },
  { x: 440, y: 79, title: '학습', detail: '학습용 자료로' },
  { x: 440, y: 279, title: '검증', detail: '별도로 나눈 자료로' },
  { x: 190, y: 279, title: '실패 분석 · 개선', detail: '자료 · 설정 보완' },
];

const focusCopy = [
  ['먼저 나눕니다', '학습할 자료와', '실력을 확인할 자료'],
  ['학습합니다', '학습용 자료로', '모델을 업데이트'],
  ['확인합니다', '학습에 쓰지 않은', '자료에서의 결과'],
  ['다시 개선합니다', '검증 결과를 보고', '실패의 원인부터'],
];

export default function Slide018({ step, instant }: SlideProps) {
  const phase = Math.max(0, Math.min(step, 3));
  const focused = phases[phase];

  return <div className="industry-content industry-s15" data-instant={instant} data-step={phase}>
    <Heading
      eyebrow="모델 / 공통 개발 흐름"
      subtitle="범용 개발 · 특화 개발 · 기존 모델 적응에 공통인 원칙"
    >배운 자료만으로 실력을 판단하지 않습니다</Heading>

    <div className="industry-visual s15-loop-visual">
      <svg viewBox="0 0 1000 355" role="img" aria-labelledby="s15-diagram-title s15-diagram-desc">
        <title id="s15-diagram-title">데이터 준비, 학습, 검증, 실패 분석과 개선의 순환</title>
        <desc id="s15-diagram-desc">학습용 자료와 검증용 자료를 분리합니다. 검증 결과는 개선에 활용하고, 테스트용 자료는 마지막 확인을 위해 별도로 보관합니다.</desc>
        <defs>
          <marker id="s15-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse" overflow="visible">
            <path d="M1 1 L7 4 L1 7" fill="none" stroke="context-stroke" strokeWidth="1.5" />
          </marker>
        </defs>

        <g className="s15-loop-arrows" fill="none" markerEnd="url(#s15-arrow)">
          <path className={phase === 1 ? 's15-active' : ''} d="M282 59 Q315 30 348 59" />
          <path className={phase === 2 ? 's15-active' : ''} d="M515 135 Q565 179 515 225" />
          <path className={phase === 3 ? 's15-active' : ''} d="M348 301 Q315 330 282 301" />
          <path className={phase === 3 ? 's15-active' : ''} d="M115 225 Q64 179 115 135" />
        </g>

        <g className="s15-focus-marker" style={{
          transform: `translate(${focused.x}px, ${focused.y - 32}px)`,
          transition: instant ? 'none' : 'transform 620ms cubic-bezier(.2,.7,.2,1)',
        }} aria-hidden="true">
          <circle r="14" />
          <circle r="5" />
        </g>

        {phases.map((item, index) => <g
          key={item.title}
          className={`s15-phase${phase === index ? ' s15-current' : ''}`}
          transform={`translate(${item.x},${item.y})`}
        >
          <text className="s15-phase-title" textAnchor="middle" y="9">{item.title}</text>
          <text className="s15-phase-detail" textAnchor="middle" y="35">{item.detail}</text>
        </g>)}

        <circle className="s15-center-disc" cx="315" cy="181" r="77" />
        {focusCopy.map((copy, index) => <g key={copy[0]}
          className="s15-center-copy"
          style={reveal(index === phase, instant, 'translateY(7px)')}
          aria-hidden={index !== phase}
        >
          <text className="s15-center-title" x="315" y="160" textAnchor="middle">{copy[0]}</text>
          <text className="s15-center-detail" x="315" y="188" textAnchor="middle">{copy[1]}</text>
          <text className="s15-center-detail" x="315" y="212" textAnchor="middle">{copy[2]}</text>
        </g>)}

        <path className="s15-separation" d="M630 28 V326" />
        <text className="s15-heldout-heading" x="710" y="45">학습에 넣지 않는 자료</text>

        <g className={`s15-material s15-validation${phase === 2 ? ' s15-material-active' : ''}`}>
          <g className="s15-paper" transform="translate(714,83)" aria-hidden="true">
            <path d="M7 0 H48 V49 H7 Z M0 7 V56 H41" />
            <path d="M17 15 H38 M17 25 H38 M17 35 H31" />
          </g>
          <text className="s15-material-title" x="785" y="104">검증용</text>
          <text className="s15-material-detail" x="785" y="130">반복 중 선택 · 개선</text>
        </g>

        <path className={`s15-validation-link${phase >= 2 ? ' s15-link-active' : ''}`}
          d="M700 111 H617 Q585 111 585 143 V247 Q585 279 553 279 H500"
          markerEnd="url(#s15-arrow)"
        />

        <path className="s15-material-divider" d="M710 193 H974" />

        <g className="s15-material s15-test">
          <g className="s15-paper" transform="translate(714,228)" aria-hidden="true">
            <path d="M7 0 H48 V49 H7 Z M0 7 V56 H41" />
            <path d="M17 15 H38 M17 25 H38 M17 35 H31" />
          </g>
          <text className="s15-material-title" x="785" y="250">테스트용</text>
          <text className="s15-material-detail" x="785" y="277">마지막 확인에 보관</text>
        </g>
        <text className="s15-holdout-note" x="710" y="324">테스트 결과에 맞춰 반복 조정하지 않기</text>
      </svg>
    </div>

    <p className="s15-takeaway" style={reveal(phase >= 2, instant)} aria-hidden={phase < 2}>
      <strong>학습에 쓰지 않은 예로 평가하고,</strong> 실패를 분석해 다시 개선합니다.
    </p>
  </div>;
}
