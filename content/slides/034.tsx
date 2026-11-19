import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './034.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-mcp",
  "title": "MCP로 도구와 자료를 연결합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "도구"
} satisfies SlideMetadata;

export default function Slide034({ step, instant }: SlideProps) {
  const connected = step >= 1;
  const exchanging = step >= 2;

  return <div className="industry-content workflow-s08">
    <Heading eyebrow="도구 연결 / Model Context Protocol">MCP로 도구와 자료를 연결합니다</Heading>

    <div className="w08-diagram">
      <svg viewBox="0 0 1100 360" role="group" aria-label="AI 앱의 MCP 클라이언트가 GitHub MCP 서버에 연결되어 이슈를 검색하고 내용을 읽는 도구를 사용하는 구조">
        <defs>
          <marker id="workflow-s08-request-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#177c68" strokeWidth="1.8" />
          </marker>
          <marker id="workflow-s08-result-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#4269a5" strokeWidth="1.8" />
          </marker>
        </defs>

        <rect className="w08-host" x="30" y="80" width="348" height="220" rx="19" />
        <path className="w08-host-rule" d="M30 136H378" />
        <text className="w08-host-title" x="59" y="116">AI 앱</text>
        <circle className="w08-model" cx="125" cy="218" r="46" />
        <text className="w08-model-title" x="125" y="227" textAnchor="middle">모델</text>
        <path className="w08-inner-link" d="M171 218H230" />
        <ReferenceLink to="MCP"><rect className="w08-client" x="230" y="176" width="124" height="84" rx="12" />
        <text className="w08-client-top" x="292" y="208" textAnchor="middle">MCP</text>
        <text className="w08-client-title" x="292" y="237" textAnchor="middle">클라이언트</text></ReferenceLink>

        <path className="w08-guide" d="M354 218H635" />
        <circle className="w08-server-base" cx="704" cy="218" r="69" />
        <path className="w08-guide" d="M773 218C841 218 837 108 891 108M773 218C841 218 837 284 891 284" />

        <ReferenceLink to="GitHub MCP"><text className="w08-zone-label" x="927" y="45" textAnchor="middle">GitHub의 도구</text></ReferenceLink>
        <g className="w08-tool" transform="translate(927 108)">
          <circle r="35" />
          <path d="M-17-5H17V17H-17ZM-9-5V-15H9V-5M-17 4H17M-4 1V8H4V1" />
        </g>
        <text className="w08-end-title" x="975" y="108">이슈 검색</text>
        <text className="w08-end-detail" x="975" y="139">목록 찾기</text>

        <g className="w08-resource" transform="translate(927 284)">
          <circle r="35" />
          <path d="M-13-19H5L15-9V19H-13ZM5-19V-9H15M-5 0H8M-5 9H8" />
        </g>
        <text className="w08-end-title" x="975" y="283">이슈 읽기</text>
        <text className="w08-end-detail" x="975" y="314">내용·댓글</text>

        <g style={reveal(connected, instant, 'none')} aria-hidden={!connected}>
          <circle className="w08-server-active" cx="704" cy="218" r="69" />
          <path className="w08-service-link" d="M773 218C841 218 837 108 891 108M773 218C841 218 837 284 891 284" />
          <text className="w08-protocol-label" x="496" y="103" textAnchor="middle">같은 연결 규약</text>
        </g>

        <ReferenceLink to="GitHub MCP"><text className="w08-server-title" x="704" y="210" textAnchor="middle">GitHub</text></ReferenceLink>
        <ReferenceLink to="GitHub MCP"><text className="w08-server-title" x="704" y="242" textAnchor="middle">MCP 서버</text></ReferenceLink>

        <path className="w08-connection" d="M354 218H635" style={reveal(connected && !exchanging, instant, 'none')} aria-hidden={!connected || exchanging} />

        <g style={reveal(exchanging, instant, 'none')} aria-hidden={!exchanging}>
          <path className="w08-request" d="M354 194C451 194 547 145 641 189" markerEnd="url(#workflow-s08-request-arrow)" />
          <path className="w08-result" d="M641 247C547 289 451 244 354 244" markerEnd="url(#workflow-s08-result-arrow)" />
          <text className="w08-request-label" x="496" y="140" textAnchor="middle">검색 요청</text>
          <text className="w08-result-label" x="496" y="301" textAnchor="middle">이슈 목록</text>
        </g>
      </svg>
    </div>

    <p className="w08-takeaway" style={reveal(exchanging, instant, 'translateY(6px)')} aria-hidden={!exchanging}>
      MCP는 AI 앱과 외부 기능을 잇는 <strong>공통 연결 규약</strong>입니다.
    </p>
  </div>;
}
