import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './041.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-ticket-automation",
  "title": "티켓을 모아 정리하는 자동화",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "자동화"
} satisfies SlideMetadata;

export default function Slide041({ step, instant }: SlideProps) {
  const connecting = step >= 1;
  const handling = step >= 2;

  return <div className="industry-content workflow-s14">
    <Heading eyebrow="자동화 구조 / 일정·이벤트에서 API까지">티켓을 모아 정리하는 자동화</Heading>

    <div className="w14-architecture">
      <svg viewBox="0 0 1100 390" role="group" aria-label="일정이나 이벤트가 서버리스 작업을 시작하고, 티켓을 수집해 OpenAI API를 호출한 뒤 결과를 확인하고 저장하거나 전달하는 구조">
        <defs>
          <marker id="workflow-s14-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#177c68" strokeWidth="1.8" />
          </marker>
          <marker id="workflow-s14-answer-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#4269a5" strokeWidth="1.8" />
          </marker>
        </defs>

        <g className="w14-trigger">
          <circle cx="447" cy="32" r="15" />
          <path d="M447 22V33L454 38" />
          <text x="475" y="41">일정·이벤트</text>
        </g>
        <path className="w14-start" d="M550 61V101" markerEnd="url(#workflow-s14-arrow)" />

        <circle className="w14-job" cx="550" cy="191" r="86" />
        <path className="w14-job-symbol" d="M553 122L540 145H552L547 162L566 139H554L560 122Z" />
        <text className="w14-job-title" x="550" y="195" textAnchor="middle">서버리스</text>
        <text className="w14-job-title" x="550" y="231" textAnchor="middle">작업</text>

        <g style={reveal(connecting, instant, 'none')} aria-hidden={!connecting}>
          <g className="w14-tickets" transform="translate(170 176)">
            <rect x="-28" y="-52" width="77" height="99" rx="9" />
            <rect x="-39" y="-42" width="77" height="99" rx="9" />
            <rect x="-50" y="-32" width="77" height="99" rx="9" />
            <path d="M-33-10H9M-33 5H9M-33 20H-2M-33 41H9" />
          </g>
          <text className="w14-node-title" x="170" y="281" textAnchor="middle">회사 티켓</text>
          <path className="w14-data" d="M234 190H457" markerEnd="url(#workflow-s14-arrow)" />
          <text className="w14-data-label" x="346" y="166" textAnchor="middle">조회·수집</text>

          <ReferenceLink to="OpenAI API"><circle className="w14-api" cx="930" cy="191" r="74" />
          <text className="w14-api-title" x="930" y="184" textAnchor="middle">OpenAI</text>
          <text className="w14-api-title" x="930" y="219" textAnchor="middle">API</text></ReferenceLink>
          <path className="w14-request" d="M642 172H848" markerEnd="url(#workflow-s14-arrow)" />
          <path className="w14-answer" d="M848 216H642" markerEnd="url(#workflow-s14-answer-arrow)" />
          <text className="w14-request-label" x="746" y="151" textAnchor="middle">요청</text>
          <text className="w14-answer-label" x="746" y="252" textAnchor="middle">응답</text>
        </g>

        <g style={reveal(handling, instant, 'translateY(6px)')} aria-hidden={!handling}>
          <path className="w14-output" d="M550 281V307" markerEnd="url(#workflow-s14-arrow)" />
          <text className="w14-output-title" x="550" y="343" textAnchor="middle">결과 확인</text>
          <path className="w14-output" d="M625 334H707" markerEnd="url(#workflow-s14-arrow)" />
          <g className="w14-storage" transform="translate(747 333)">
            <path d="M-17-14V13C-17 23 17 23 17 13V-14M-17 0C-17 10 17 10 17 0" />
            <ellipse cx="0" cy="-14" rx="17" ry="7" />
          </g>
          <text className="w14-output-title" x="786" y="343">저장·전달</text>
        </g>
      </svg>
    </div>

    <p className="w14-takeaway" style={reveal(handling, instant, 'translateY(6px)')} aria-hidden={!handling}>
      정해진 조건이 시작하고, <strong>코드가 실행 흐름을 이어갑니다.</strong>
    </p>
  </div>;
}
