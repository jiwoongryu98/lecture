import { Heading, reveal, type SlideProps } from '../components/kit';
import './032.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-tools",
  "title": "AI는 도구를 통해 행동합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "도구"
} satisfies SlideMetadata;

export default function Slide032({ step, instant }: SlideProps) {
  const showResult = step >= 1;
  const closeLoop = step >= 2;

  return <div className="industry-content workflow-s06">
    <Heading eyebrow="할 수 있는 일 넓히기 / Tool">AI는 도구를 통해 행동합니다</Heading>

    <div className="w06-visual">
      <svg viewBox="0 0 1100 390" role="img" aria-label={closeLoop
        ? 'AI가 도구를 선택하고, 도구가 실행한 결과를 관찰해 다음 행동을 정하는 순환 구조.'
        : showResult
          ? 'AI가 도구를 선택하면 파일·웹·명령 도구가 실행되고 결과 정보가 돌아온다.'
          : 'AI는 필요한 행동을 판단하고, 선택한 도구가 실제 작업을 실행한다.'}>
        <defs>
          <marker id="workflow-s06-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.7" />
          </marker>
        </defs>

        <path className="w06-select" d="M335 140C445 90 545 104 668 104" markerEnd="url(#workflow-s06-arrow)" />
        <text className="w06-action-label" x="487" y="63" textAnchor="middle">필요한 도구 선택</text>

        <circle className="w06-model" cx="235" cy="185" r="97" />
        <text className="w06-model-label" x="235" y="145" textAnchor="middle">AI 모델</text>
        <text className="w06-model-title" x="235" y="195" textAnchor="middle">판단</text>
        <text className="w06-model-detail" x="235" y="232" textAnchor="middle">무엇을 할까?</text>

        <text className="w06-tools-title" x="830" y="30" textAnchor="middle">Tool · 도구</text>
        <rect className="w06-tool-surface" x="680" y="49" width="300" height="128" rx="14" />
        <g className="w06-tool-icons">
          <path d="M716 77H741L752 88V120H716ZM740 77V89H752M725 98H743M725 108H739" />
          <rect x="803" y="78" width="47" height="37" rx="4" />
          <path d="M803 89H850M812 84H813M819 84H820M826 84H827" />
          <rect x="892" y="78" width="47" height="37" rx="4" />
          <path d="M903 89L912 96L903 103M918 103H927" />
        </g>
        <g className="w06-tool-labels">
          <text x="735" y="154" textAnchor="middle">파일</text>
          <text x="827" y="154" textAnchor="middle">웹</text>
          <text x="916" y="154" textAnchor="middle">명령</text>
        </g>

        <g style={reveal(showResult, instant, 'translateY(7px)')} aria-hidden={!showResult}>
          <path className="w06-execute" d="M830 187V253" markerEnd="url(#workflow-s06-arrow)" />
          <text className="w06-execute-label" x="862" y="225">실행</text>
          <rect className="w06-result" x="665" y="270" width="330" height="83" rx="12" />
          <text className="w06-result-title" x="830" y="300" textAnchor="middle">돌아온 정보</text>
          <text className="w06-result-detail" x="830" y="333" textAnchor="middle">내용 · 실행 상태 · 오류</text>
        </g>

        <g style={reveal(closeLoop, instant, 'none')} aria-hidden={!closeLoop}>
          <path className="w06-observe" d="M651 312C507 393 335 379 285 282" markerEnd="url(#workflow-s06-arrow)" />
          <text className="w06-observe-label" x="442" y="326" textAnchor="middle">관찰하고 다시 판단</text>
        </g>
      </svg>
    </div>

    <p className="w06-takeaway" style={reveal(closeLoop, instant, 'translateY(6px)')} aria-hidden={!closeLoop}>
      <strong>도구의 결과를 다음 행동에 연결합니다.</strong>
    </p>
  </div>;
}
