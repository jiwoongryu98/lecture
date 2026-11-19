import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './038.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-remote",
  "title": "실행은 서버에서, 확인은 어디서든",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "원격 실행"
} satisfies SlideMetadata;

export default function Slide038({ step, instant }: SlideProps) {
  const connected = step >= 1;
  const mobile = step >= 2;

  return <div className="industry-content workflow-s12">
    <Heading eyebrow="원격 실행 / 접속과 실행을 나누기" subtitle={<><ReferenceLink to="Orca">Orca</ReferenceLink>의 원격 실행 · 모바일 연결</>}>
      실행은 서버에서, 확인은 어디서든
    </Heading>

    <div className="w12-composition">
      <svg viewBox="0 0 1100 365" role="img" aria-label={mobile
        ? '데스크톱 앱과 모바일에서 원격 서버의 에이전트 작업에 접속한다. 작업은 서버에서 계속 실행된다.'
        : '데스크톱 앱은 작업을 요청하고 진행을 확인하며, 에이전트와 작업 파일·실행 도구는 원격 서버에 있다.'}>
        <defs>
          <marker id="workflow-s12-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.8" />
          </marker>
        </defs>

        <text className="w12-place-label" x="175" y="28" textAnchor="middle">접속하는 기기</text>
        <text className="w12-place-label w12-blue" x="905" y="28" textAnchor="middle">작업이 실행되는 곳</text>

        <g style={{ opacity: mobile ? .4 : 1, transition: instant ? 'none' : 'opacity 380ms ease' }}>
          <rect className="w12-laptop" x="50" y="66" width="250" height="143" rx="11" />
          <rect className="w12-screen" x="64" y="80" width="222" height="115" rx="4" />
          <path className="w12-command" d="M93 108L109 121L93 134M128 134H167M93 158H249" />
          <path className="w12-laptop-base" d="M35 210H315L298 229H52Z" />
          <text className="w12-device-label" x="175" y="269" textAnchor="middle">데스크톱 앱</text>
        </g>

        <g className="w12-server">
          <rect className="w12-server-body" x="780" y="66" width="250" height="223" rx="15" />
          <path className="w12-server-header" d="M795 66H1015Q1030 66 1030 81V118H780V81Q780 66 795 66Z" />
          <text className="w12-server-title" x="905" y="102" textAnchor="middle">원격 서버</text>
          <rect className="w12-agent" x="802" y="139" width="206" height="55" rx="10" />
          <text className="w12-agent-title" x="905" y="175" textAnchor="middle">AI 에이전트</text>
          <text className="w12-server-detail" x="905" y="226" textAnchor="middle">작업 파일 · 실행 도구</text>
          <g style={reveal(connected, instant, 'none')} aria-hidden={!connected}>
            <circle className="w12-running-dot" cx="832" cy="260" r="5" />
            <text className="w12-running-label" x="850" y="268">작업 실행 중</text>
          </g>
        </g>

        <g style={reveal(connected, instant, 'none')} aria-hidden={!connected}>
          <path className="w12-request" d="M327 128H750" markerEnd="url(#workflow-s12-arrow)" />
          <text className="w12-route-label" x="534" y="111" textAnchor="middle">작업 요청</text>
          <path className="w12-response" d="M750 190H327" markerEnd="url(#workflow-s12-arrow)" />
          <text className="w12-route-label w12-blue" x="534" y="225" textAnchor="middle">진행 · 결과 확인</text>
        </g>

        <g style={reveal(mobile, instant, 'translateY(8px)')} aria-hidden={!mobile}>
          <rect className="w12-phone" x="395" y="244" width="76" height="114" rx="13" />
          <path className="w12-phone-speaker" d="M424 254H442" />
          <rect className="w12-phone-screen" x="404" y="267" width="58" height="68" rx="3" />
          <path className="w12-phone-lines" d="M414 283H451M414 296H442M414 310H451" />
          <circle className="w12-phone-button" cx="433" cy="347" r="3" />
          <path className="w12-mobile-link" d="M486 282H650Q664 282 664 268V267Q664 253 678 253H751" markerStart="url(#workflow-s12-arrow)" markerEnd="url(#workflow-s12-arrow)" />
          <text className="w12-mobile-label" x="510" y="326">모바일에서도 연결</text>
          <text className="w12-away-label" x="175" y="310" textAnchor="middle">노트북을 닫아도</text>
        </g>
      </svg>
    </div>

    <p className="w12-takeaway" style={reveal(mobile, instant, 'translateY(6px)')} aria-hidden={!mobile}>
      접속하는 기기가 바뀌어도, <strong>작업은 서버에서 이어집니다.</strong>
    </p>
  </div>;
}
