import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './011.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-adoption",
  "title": "활용의 장벽과 AX",
  "section": "1부 · 산업을 읽다",
  "maxStep": 3,
  "subsection": "제품"
} satisfies SlideMetadata;

const viewpoints = [
  '가능한 기능을 실제 활용으로 연결하려면, 일하는 방식과의 접점이 필요합니다.',
  '새 도구를 쓰려면, 작업을 맡기고 확인하는 방식도 배워야 합니다.',
  '익숙한 방법을 바꾸는 데에는 학습과 전환의 부담이 있습니다.',
  'AX의 중요한 역할은, 더 많은 사람이 AI를 쉽게 활용할 업무 환경을 만드는 것입니다.',
];

export default function Slide011({ step, instant }: SlideProps) {
  const phase = Math.max(0, Math.min(step, 3));
  const detour = phase === 1 || phase === 2;
  const connected = phase === 3;

  return <div className="industry-content industry-s07" data-instant={instant} data-connected={connected}>
    <Heading eyebrow="제품·활용 / 관점 · 활용의 장벽과 AX">강력한 도구가 있어도, 활용에는 장벽이 있습니다</Heading>

    <figure className="s07-workflow">
      <svg viewBox="0 0 1000 340" role="group" aria-label={connected
        ? 'AX의 역할을 설명하는 개념도. 익숙한 업무 경로에 AI를 연결하고 접점, 필요한 자료, 검토 흐름을 함께 설계한다.'
        : '익숙한 업무 경로 밖에 AI 작업 도구가 있다. 새로운 사용법과 작업 방식으로 전환하는 부담을 설명하는 개념도.'}>
        <defs>
          <marker id="s07-flow-arrow" viewBox="0 0 8 8" refX="6.8" refY="4" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
            <path d="M1 1L7 4L1 7" fill="none" stroke="context-stroke" strokeWidth="1.5" />
          </marker>
        </defs>

        <path className="s07-route-ground" d="M105 230H895" />
        <path className="s07-familiar-line" d="M156 230H448" markerEnd="url(#s07-flow-arrow)" />
        <path className="s07-familiar-line" d="M552 230H843" markerEnd="url(#s07-flow-arrow)" />
        <text className="s07-route-label" x="105" y="177" textAnchor="middle">익숙한 업무</text>

        <g className="s07-file-node" transform="translate(105 230)">
          <circle r="35" />
          <path d="M-14-20H7L17-10V20H-14ZM7-20V-10H17M-6-1H9M-6 7H9" />
        </g>
        <text className="s07-task-label" x="105" y="310" textAnchor="middle">자료 확인</text>

        <g style={reveal(!connected, instant, 'none')} aria-hidden={connected}>
          <circle className="s07-work-node" cx="500" cy="230" r="35" />
          <path className="s07-work-symbol" d="M480 230L493 217L506 230L493 243ZM509 218H524M509 230H530M509 242H524" />
          <text className="s07-task-label" x="500" y="310" textAnchor="middle">작업</text>
        </g>

        <g className="s07-review-node" transform="translate(895 230)">
          <circle r="35" />
          <path d="M-15 0L-4 11L17-13" />
        </g>
        <text className="s07-task-label" x="895" y="310" textAnchor="middle">검토·다음 작업</text>

        <g style={reveal(detour, instant, 'none')} aria-hidden={!detour}>
          <path className="s07-detour" d="M265 230C304 230 310 85 420 85" markerEnd="url(#s07-flow-arrow)" />
          <path className="s07-detour" d="M580 85C691 85 697 230 735 230" markerEnd="url(#s07-flow-arrow)" />
          <text className="s07-detour-label" x="260" y="130" textAnchor="middle">새 사용법</text>
          <text className="s07-detour-label" x="740" y="130" textAnchor="middle">자료·검토 연결</text>
        </g>

        <g className="s07-ai" style={{
          transform: connected ? 'translateY(145px)' : 'translateY(0)',
          transition: instant ? 'none' : 'transform 620ms cubic-bezier(.2,.7,.2,1)',
        }}>
          <text className="s07-tool-names" x="500" y="0" textAnchor="middle"><ReferenceLink to="Claude Code">Claude Code</ReferenceLink>{' · '}<ReferenceLink to="Codex">Codex</ReferenceLink></text>
          <circle className="s07-ai-halo" cx="500" cy="85" r="76" />
          <circle className="s07-ai-core" cx="500" cy="85" r="65" />
          <text className="s07-ai-title" x="500" y="80" textAnchor="middle">AI 작업 도구</text>
          <text className="s07-ai-detail" x="500" y="106" textAnchor="middle">읽기·수정·실행</text>
        </g>

        <g style={reveal(phase === 2, instant, 'translateY(5px)')} aria-hidden={phase !== 2}>
          <text className="s07-inertia-title" x="58" y="64">경로의존성</text>
          <text className="s07-inertia-detail" x="58" y="93">익숙한 방식의 관성</text>
          <path className="s07-inertia-loop" d="M163 261C200 300 273 291 274 243" markerEnd="url(#s07-flow-arrow)" />
        </g>

        <g className="s07-ax" style={reveal(connected, instant, 'translateY(6px)')} aria-hidden={!connected}>
          <text className="s07-ax-title" x="500" y="43" textAnchor="middle">AX · AI를 익숙한 업무에 연결</text>
          <text className="s07-ax-detail" x="270" y="113" textAnchor="middle">익숙한 접점</text>
          <text className="s07-ax-detail" x="500" y="113" textAnchor="middle">필요한 자료 연결</text>
          <text className="s07-ax-detail" x="730" y="113" textAnchor="middle">검토·다음 행동</text>
          <path className="s07-ax-leader" d="M270 126V156L322 210M730 126V156L678 210" />
          <path className="s07-connected-line" d="M156 230H420" markerEnd="url(#s07-flow-arrow)" />
          <path className="s07-connected-line" d="M580 230H843" markerEnd="url(#s07-flow-arrow)" />
        </g>
      </svg>
      <figcaption>익숙한 업무와 AI 활용의 관계를 설명하는 개념도</figcaption>
    </figure>

    <div className="s07-viewpoint">
      <p className="s07-view-label">발표자의 관점</p>
      <div className="s07-view-copy">{viewpoints.map((copy, index) => <p key={copy}
        style={reveal(phase === index, instant, 'translateY(7px)')} aria-hidden={phase !== index}>{copy}</p>)}</div>
    </div>
  </div>;
}
