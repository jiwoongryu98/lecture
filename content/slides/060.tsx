import { Heading, reveal, type SlideProps } from '../components/kit';
import './060.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-learning",
  "title": "빠르게 배우고, 유연하게 적응합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "학습"
} satisfies SlideMetadata;

export default function Slide060({ step, instant }: SlideProps) {
  const learn = step >= 1;
  const adapt = step >= 2;

  return <div className="industry-content career-s17">
    <Heading eyebrow="계속 배우기 / 변화에 맞춰 생각과 행동 바꾸기" subtitle="기술과 세상이 빠르게 바뀌는 만큼, 배우고 일하는 방식도 계속 바꿉니다.">빠르게 배우고, 유연하게 적응합니다</Heading>

    <div className="c17-landscape">
      <svg viewBox="0 0 1100 360" role="img" aria-label="기술과 일, 사회의 변화를 살피고, AI와 빠르게 배우고 연습하며, 직접 적용하고 피드백으로 조정하는 과정을 계속 반복한다.">
        <defs>
          <marker id="career-learning-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.8" />
          </marker>
        </defs>

        <text className="c17-title c17-blue" x="180" y="58" textAnchor="middle">변화를 살피고</text>
        <text className="c17-detail" x="180" y="102" textAnchor="middle">기술 · 일 · 사회</text>
        <circle className="c17-change" cx="180" cy="190" r="44" />
        <text className="c17-node-label c17-blue" x="180" y="200" textAnchor="middle">변화</text>

        <g className="c17-learn" style={reveal(learn, instant, 'none')} aria-hidden={!learn}>
          <path className="c17-forward" d="M236 190H420" markerEnd="url(#career-learning-arrow)" />
          <text className="c17-title c17-green" x="550" y="58" textAnchor="middle">빠르게 배우고</text>
          <text className="c17-detail" x="550" y="102" textAnchor="middle">AI로 이해 · 연습</text>
          <path className="c17-learning-page" d="M550 153C516 141 473 139 432 148V232C477 225 515 229 550 242C585 229 623 225 668 232V148C627 139 584 141 550 153Z" />
          <path className="c17-page-spine" d="M550 154V242M461 173H523M461 194H515M461 215H521M578 173H640M578 194H632M578 215H638" />
        </g>

        <g className="c17-adapt" style={reveal(adapt, instant, 'none')} aria-hidden={!adapt}>
          <path className="c17-forward" d="M680 190H864" markerEnd="url(#career-learning-arrow)" />
          <text className="c17-title c17-green" x="920" y="58" textAnchor="middle">써 보고 조정합니다</text>
          <text className="c17-detail" x="920" y="102" textAnchor="middle">작게 시도 · 피드백</text>
          <circle className="c17-trial" cx="920" cy="190" r="44" />
          <text className="c17-node-label c17-green" x="920" y="200" textAnchor="middle">시도</text>
          <path className="c17-return" d="M920 234V280Q920 300 900 300H200Q180 300 180 280V238" markerEnd="url(#career-learning-arrow)" />
          <text className="c17-repeat" x="550" y="340" textAnchor="middle">배우고 → 써 보고 → 다시 배우기</text>
        </g>
      </svg>
    </div>

    <p className="c17-takeaway" style={reveal(adapt, instant, 'translateY(5px)')} aria-hidden={!adapt}>
      빠르게 배우고 꾸준히 시도하며, <strong>변화에 맞춰 생각과 행동을 조정합니다.</strong>
    </p>
  </div>;
}
