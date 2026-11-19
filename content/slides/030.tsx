import { Heading, reveal, type SlideProps } from '../components/kit';
import './030.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-sample-first",
  "title": "샘플이 있으면, 판단이 달라집니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 1,
  "subsection": "샘플"
} satisfies SlideMetadata;

const positions = [90, 305, 520, 735, 950];
const investmentSteps = ['아이디어', '상사 설득·승인', '상세 기획', '구현', '결과 확인'];
const sampleSteps = ['아이디어', '샘플 제작', '결과 확인', '논의·승인', '확대 적용'];

export default function Slide030({ step, instant }: SlideProps) {
  const sampleFirst = step >= 1;

  return <div className="industry-content workflow-s04">
    <Heading eyebrow="실행 비용의 변화 / 샘플부터 만들어 보기">샘플이 있으면, 판단이 달라집니다</Heading>

    <div className="w04-comparison">
      <svg viewBox="0 0 1100 350" role="img" aria-label={sampleFirst
        ? '큰 투자가 필요한 경우에는 구현 뒤에 결과를 확인한다. 샘플을 먼저 만드는 경우에는 결과를 확인한 뒤 논의하고 확대 적용한다.'
        : '큰 투자가 필요한 경우의 비교 흐름: 아이디어, 상사 설득과 승인, 상세 기획, 구현, 결과 확인.'}>
        <defs>
          <marker id="workflow-s04-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" />
          </marker>
        </defs>

        <g className="w04-investment">
          <text className="w04-route-label" x="45" y="29">구현에 큰 투자가 필요한 경우</text>
          {positions.slice(0, -1).map((x, index) => <path key={x} className="w04-route"
            d={`M${x + 20} 90H${positions[index + 1] - (!sampleFirst && index === 3 ? 41 : 24)}`} markerEnd="url(#workflow-s04-arrow)" />)}
          {investmentSteps.map((label, index) => <g key={label}>
            <circle className="w04-investment-node" cx={positions[index]} cy="90" r="8" />
            <text className="w04-step-label" x={positions[index]} y="154" textAnchor="middle">{label}</text>
          </g>)}
        </g>

        <g className="w04-sample" style={reveal(sampleFirst, instant, 'translateY(8px)')} aria-hidden={!sampleFirst}>
          <text className="w04-route-label" x="45" y="205">샘플을 먼저 만들어 보는 경우</text>
          {positions.slice(0, -1).map((x, index) => <path key={x} className="w04-route"
            d={`M${x + (index === 2 ? 41 : 20)} 258H${positions[index + 1] - (index === 1 ? 41 : 24)}`} markerEnd="url(#workflow-s04-arrow)" />)}
          {sampleSteps.map((label, index) => <g key={label}>
            <circle className="w04-sample-node" cx={positions[index]} cy="258" r="8" />
            <text className={`w04-step-label${index === 1 || index === 2 ? ' w04-key-step' : ''}`}
              x={positions[index]} y="322" textAnchor="middle">{label}</text>
          </g>)}
        </g>

        <g className="w04-evidence" aria-hidden="true" style={{
          transform: sampleFirst ? 'translate(520px, 258px)' : 'translate(950px, 90px)',
          transition: instant ? 'none' : 'transform 700ms cubic-bezier(.2,.7,.2,1)',
        }}>
          <circle r="29" />
          <path d="M-12 0L-3 9L14-10" />
        </g>
      </svg>

      <a className="w04-meme" href="https://media.giphy.com/media/UqZ4imFIoljlr5O2sM/giphy.gif"
        target="_blank" rel="noopener noreferrer" title="GIPHY 원본 · 새 탭에서 열기"
        style={reveal(sampleFirst, instant, 'translateY(8px)')} aria-hidden={!sampleFirst}>
        <img src="/slides/030/just-do-it.gif" width="470" height="352"
          alt="JUST DO IT! 문구와 함께 실행을 독려하는 밈 GIF" />
      </a>
    </div>

    <p className="w04-takeaway" style={reveal(sampleFirst, instant, 'none')} aria-hidden={!sampleFirst}>
      <strong>샘플을 먼저 보고,</strong> 다음 투자를 결정합니다.
    </p>
  </div>;
}
