import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './036.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-orchestration",
  "title": "Orca CLI로 여러 AI의 작업을 조율합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "작업 분담"
} satisfies SlideMetadata;

const workers = [
  { x: 200, name: 'Claude Code' },
  { x: 550, name: 'Codex' },
  { x: 900, name: 'Antigravity' },
] as const;
const captions = [
  '조율하는 AI가 Orca CLI를 도구로 사용합니다.',
  '작업 범위를 나누고, 담당 에이전트를 실행합니다.',
  '질문과 완료 보고를 받아, 결과를 검토하고 다음 작업을 정합니다.',
];

export default function Slide036({ step, instant }: SlideProps) {
  const delegated = step >= 1;
  const reported = step >= 2;
  const phase = Math.max(0, Math.min(step, 2));

  return <div className="industry-content workflow-s10">
    <Heading eyebrow="작업 분담 / Orca의 오케스트레이션">Orca CLI로 여러 AI의 작업을 조율합니다</Heading>
    <div className="w10-visual">
      <svg viewBox="0 0 1100 420" role="group" aria-label="조율하는 에이전트가 Orca CLI로 작업을 배정하고, 별도 작업 공간의 에이전트들에게 질문과 완료 보고를 받아 결과를 검토하는 구조">
        <defs>
          <marker id="workflow-s10-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto" overflow="visible">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.7" />
          </marker>
        </defs>
        <text className="w10-case" x="48" y="41">먼저 정할 것</text>
        <text className="w10-criteria-label" x="48" y="80">목표 · 작업 범위</text>
        <text className="w10-criteria" x="48" y="113">담당과 완료 기준</text>
        <path className="w10-criteria-link" d="M280 59H412" markerEnd="url(#workflow-s10-arrow)" />

        <rect className="w10-coordinator" x="430" y="14" width="240" height="72" rx="14" />
        <text className="w10-coordinator-label" x="550" y="44" textAnchor="middle">조율하는 에이전트</text>
        <text className="w10-coordinator-title" x="550" y="73" textAnchor="middle">계획 · 판단</text>
        <path className="w10-cli-link" d="M550 86V104" />
        <ReferenceLink to="Orca CLI"><rect className="w10-cli" x="464" y="104" width="172" height="42" rx="7" />
        <text className="w10-cli-label" x="550" y="132" textAnchor="middle">Orca CLI</text></ReferenceLink>
        <text className="w10-cli-detail" x="692" y="131">작업 만들기 · 실행 · 상태 확인</text>

        <g style={reveal(delegated, instant, 'translateY(6px)')} aria-hidden={!delegated}>
          <path className="w10-fan-out" d="M550 146V170H200V190M550 170H900V190M550 170V190" />
          {workers.map((worker) => <g key={worker.name} transform={`translate(${worker.x} 0)`}>
            <ReferenceLink to={worker.name}><rect className="w10-workspace" x="-110" y="198" width="220" height="72" rx="9" />
            <path className="w10-workspace-bar" d="M-110 219H110" />
            <circle className="w10-workspace-dot" cx="-93" cy="209" r="3" />
            <circle className="w10-workspace-dot" cx="-81" cy="209" r="3" />
            <text className="w10-task-title" x="0" y="251" textAnchor="middle">{worker.name}</text></ReferenceLink>
            <text className="w10-task-detail" x="0" y="298" textAnchor="middle">별도 작업 공간</text>
          </g>)}
        </g>

        <g style={reveal(reported, instant, 'none')} aria-hidden={!reported}>
          <path className="w10-fan-in" d="M200 310V334H550M900 310V334H550M550 310V350" markerEnd="url(#workflow-s10-arrow)" />
          <rect className="w10-review" x="411" y="359" width="278" height="49" rx="10" />
          <path className="w10-check" d="M434 383L442 391L457 374" />
          <text className="w10-review-title" x="570" y="391" textAnchor="middle">조율 에이전트 검토</text>
          <text className="w10-review-detail" x="745" y="390">질문 · 완료 보고</text>
        </g>
      </svg>
    </div>
    <p className="w10-caption">{captions[phase]}</p>
  </div>;
}
