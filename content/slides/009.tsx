import { Heading, ReferenceLink, reveal, Takeaway, type SlideProps } from '../components/kit';
import { ProductUsageNav } from '../components/ProductUsageNav';
import './009.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-expert",
  "title": "업무를 수행하는 AI 도구",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "제품"
} satisfies SlideMetadata;

export default function Slide009({ step, instant }: SlideProps) {
  const working = step >= 1;
  const reviewing = step >= 2;

  return <div className="industry-content industry-s05" data-step={step} data-instant={instant}>
    <Heading eyebrow="제품·활용 / 활용 방식">업무 자료와 함께 일하는 AI</Heading>
    <ProductUsageNav active="tool" />

    <div className="industry-visual s05-workspace">
      <svg viewBox="0 0 1100 350" role="group" aria-label="목표와 기준, 업무 자료, AI 도구, 검토할 산출물을 배치한 작업 공간 개념도">
        <defs>
          <marker id="s05-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" overflow="visible">
            <path d="M1 1 9 5 1 9" fill="none" stroke="var(--green)" strokeWidth="1.5" />
          </marker>
        </defs>

        <path className="s05-work-surface" d="M44 100Q44 76 68 76H735Q759 76 759 100V270H44Z" />
        <path className="s05-desk-edge" d="M27 270H777M68 270V286M735 270V286" />

        <g className="s05-brief s05-state-change">
          <text className="s05-section" x="71" y="40">목표와 기준</text>
          <path d="M215 33H229" className="s05-rule" />
          <text className="s05-brief-copy" x="244" y="40">무엇을 만들고, 무엇을 확인할까</text>
        </g>

        <g className="s05-context s05-state-change">
          <text className="s05-paper-title" x="70" y="107">작업에 필요한 맥락</text>
          <g className="s05-input-file" transform="translate(77 132)">
            <path d="M0 0H67L83 16V115H0ZM67 0V16H83" />
            <text x="41" y="49" textAnchor="middle">코드</text>
            <path className="s05-input-lines" d="M15 70H67M15 83H55M15 96H63" />
          </g>
          <g className="s05-input-file" transform="translate(176 147)">
            <path d="M0 0H67L83 16V115H0ZM67 0V16H83" />
            <ReferenceLink to="Word"><text x="41" y="49" textAnchor="middle">Word</text></ReferenceLink>
            <path className="s05-input-lines" d="M15 70H67M15 83H55M15 96H63" />
          </g>
          <g className="s05-input-file" transform="translate(275 132)">
            <path d="M0 0H67L83 16V115H0ZM67 0V16H83" />
            <ReferenceLink to="Excel"><text x="41" y="49" textAnchor="middle">Excel</text></ReferenceLink>
            <path className="s05-input-lines" d="M15 69H67V98H15ZM15 83H67M40 69V98" />
          </g>
        </g>

        <g className="s05-tool s05-state-change" transform="translate(46 0)">
          <circle cx="494" cy="175" r="90" className="s05-tool-orbit" />
          <path className="s05-tool-symbol" d="m476 131-16 15 16 15m35-30 16 15-16 15m-14-36-9 42" transform="translate(0 -8)" />
          <text className="s05-tool-name" x="494" y="190" textAnchor="middle">AI 작업 도구</text>
          <text className="s05-tool-role" x="494" y="217" textAnchor="middle">읽기 · 수정 · 실행</text>
        </g>

        <g className="s05-work-connection" style={reveal(working, instant, 'none')} aria-hidden={!working}>
          <path d="M381 177H437" markerEnd="url(#s05-arrow)" />
        </g>
        <g className="s05-output-connection" style={reveal(reviewing, instant, 'none')} aria-hidden={!reviewing}>
          <path d="M651 177H798" markerEnd="url(#s05-arrow)" />
        </g>

        <g className="s05-capabilities s05-state-change">
          <text className="s05-capability-name" x="70" y="313"><ReferenceLink to="Claude Code">Claude Code</ReferenceLink>{' · '}<ReferenceLink to="Codex">Codex</ReferenceLink></text>
          <text className="s05-capability-detail" x="70" y="340">코드 읽기·수정·실행</text>
          <path className="s05-capability-divider" d="M407 302V346" />
          <ReferenceLink to="Claude 파일 작업"><text className="s05-capability-name" x="438" y="313">Claude</text></ReferenceLink>
          <text className="s05-capability-detail" x="438" y="340">Word·Excel 생성·편집</text>
        </g>

        <g className="s05-artifact s05-state-change" transform="translate(0 -10)">
          <path className="s05-artifact-shadow" d="M827 99H1038V296H827Z" />
          <path className="s05-artifact-page" d="M817 86H1027V286H817Z" />
          <text className="s05-artifact-heading" x="840" y="124">검토할 산출물</text>
          <path className="s05-artifact-rule" d="M840 141H1003" />
          <text className="s05-artifact-item" x="840" y="176">코드 변경</text>
          <text className="s05-artifact-item" x="840" y="214">문서 내용</text>
          <text className="s05-artifact-item" x="840" y="252">표와 수식</text>
          <path className="s05-review-marks" d="M973 164h20m-20 38h20m-20 38h20" />
        </g>

        <g className="s05-review" style={reveal(reviewing, instant, 'translateY(7px)')} aria-hidden={!reviewing}>
          <path className="s05-review-circle" d="M1003 156C1021 146 1021 258 1002 265M1003 156C970 151 964 156 963 172M963 172V248Q963 265 1002 265" transform="translate(0 -10)" />
          <path className="s05-review-leader" d="M976 276V291H890" />
          <text className="s05-review-title" x="819" y="319">원문과 기준으로 확인</text>
          <text className="s05-review-sub" x="819" y="346">필요한 부분은 다시 수정</text>
        </g>
      </svg>
    </div>

    <div className="s05-bottom">
      <Takeaway>목표와 맥락을 주고, <strong>진행 과정과 산출물을 검토</strong>합니다.</Takeaway>
      <p className="industry-caption">도구별 역할을 설명하는 개념도</p>
    </div>
  </div>;
}
