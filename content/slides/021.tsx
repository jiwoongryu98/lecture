import { Heading, ReferenceLink, Takeaway, reveal, type SlideProps } from '../components/kit';
import './021.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-serving",
  "title": "모델을 서비스로 실행하기",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "인프라"
} satisfies SlideMetadata;

function Model({ label }: { label: string }) {
  return <>
    <path className="s18-pins" d="M647 136h-12m12 24h-12m12 24h-12m168-48h12m-12 24h12m-12 24h12" />
    <rect className="s18-model" x="647" y="117" width="156" height="86" rx="15" />
    <path className="s18-matrix" d="M670 139h9m7 0h9m-25 10h9m7 0h9m-25 10h9m7 0h9" />
    <text className="s18-model-label" x="725" y="184" textAnchor="middle">{label}</text>
  </>;
}

export default function Slide021({ step, instant }: SlideProps) {
  const serving = step >= 1;
  const distributed = step >= 2;

  return <div className="industry-content industry-s18" data-instant={instant}>
    <Heading eyebrow="AI 인프라 / 서빙">서빙은 모델이 요청에 응답하게 합니다</Heading>

    <div className="industry-visual s18-flow">
      <svg viewBox="0 0 1100 350" role="img" aria-label={serving
        ? (distributed ? '요청을 대기열에서 배치로 묶고 여러 장비에 분배해 실행한 뒤 응답하는 서빙 흐름' : '요청을 대기열에서 배치로 묶어 모델을 실행하고 응답하는 서빙 흐름')
        : '여러 요청과 모델 가중치 사이에 요청을 관리하고 실행하는 연결이 필요한 상태'}>
        <defs>
          <marker id="s18-arrow" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
            <path d="M1 1l5 3-5 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </marker>
        </defs>

        <g className="s18-serving-region" style={reveal(serving, instant, 'none')} aria-hidden={!serving}>
          <rect x="279" y="57" width="580" height="223" rx="25" />
          <text x="301" y="42">서빙: 요청을 받아 실행을 관리</text>
        </g>

        <text className="s18-stage" x="121" y="43" textAnchor="middle">들어오는 요청</text>
        <g className="s18-requests">
          {[96, 160, 224].map((y, i) => <g key={y}>
            <rect x={i === 1 ? 97 : 55} y={y - 19} width="88" height="38" rx="19" />
            <text x={i === 1 ? 141 : 99} y={y + 7} textAnchor="middle">요청</text>
          </g>)}
          <path className="s18-incoming" d="M153 96h32q35 0 35 32v32h55M195 160h80M153 224h32q35 0 35-32v-32" />
        </g>

        <g style={reveal(!serving, instant, 'none')} aria-hidden={serving}>
          <path className="s18-gap-line" d="M297 160H607" />
          <circle className="s18-gap" cx="440" cy="160" r="30" />
          <text className="s18-question" x="440" y="169" textAnchor="middle">?</text>
          <text className="s18-gap-label" x="440" y="229" textAnchor="middle">누가, 어떤 순서로 실행할까?</text>
          <text className="s18-gap-caption" x="725" y="244" textAnchor="middle">파일 보유 ≠ 서비스 제공</text>
        </g>

        <g className="s18-batching" style={reveal(serving, instant, 'none')} aria-hidden={!serving}>
          <path className="s18-queue-rail" d="M310 128v64h184v-64" />
          {[334, 386, 438].map(x => <g key={x}>
            <rect x={x} y="138" width="39" height="39" rx="8" />
            <path d={`M${x + 11} 151h17m-17 9h12`} />
          </g>)}
          <text className="s18-stage" x="403" y="235" textAnchor="middle">대기 → 배치</text>
          <text className="s18-small" x="403" y="258" textAnchor="middle">요청을 묶어 실행</text>
        </g>

        <g className="s18-route" style={reveal(serving && !distributed, instant, 'none')} aria-hidden={!serving || distributed}>
          <path d="M503 160H623" markerEnd="url(#s18-arrow)" />
          <path d="M824 160H943" markerEnd="url(#s18-arrow)" />
        </g>
        <g className="s18-route" style={reveal(distributed, instant, 'none')} aria-hidden={!distributed}>
          <path d="M503 160h51q21 0 21-21v-18q0-21 21-21h27" markerEnd="url(#s18-arrow)" />
          <path d="M554 160q21 0 21 21v18q0 21 21 21h27" markerEnd="url(#s18-arrow)" />
          <path d="M824 100h35q22 0 22 22v16q0 22 22 22h40" markerEnd="url(#s18-arrow)" />
          <path d="M824 220h35q22 0 22-22v-16q0-22 22-22" />
          <text className="s18-small" x="569" y="307" textAnchor="middle">여러 장비로 분배·확장</text>
        </g>

        <g className="s18-model-unit" style={{
          transform: distributed ? 'translateY(-60px)' : 'translateY(0)',
          transition: instant ? 'none' : 'transform 480ms cubic-bezier(.2,.7,.2,1)',
        }}>
          <Model label={serving ? '모델 실행' : '모델 가중치'} />
        </g>
        <g transform="translate(0 60)">
          <g style={reveal(distributed, instant, 'translateY(-60px)')} aria-hidden={!distributed}>
            <Model label="모델 실행" />
          </g>
        </g>

        <g className="s18-responses" style={reveal(serving, instant, 'none')} aria-hidden={!serving}>
          <text className="s18-stage" x="1004" y="43" textAnchor="middle">응답</text>
          {[96, 160, 224].map(y => <g key={y}>
            <rect x="960" y={y - 19} width="88" height="38" rx="19" />
            <path d={`M976 ${y}l5 5 9-10`} />
            <text x="1015" y={y + 6} textAnchor="middle">결과</text>
          </g>)}
        </g>

        <g style={reveal(distributed, instant, 'none')} aria-hidden={!distributed}>
          <text className="s18-tradeoff" x="550" y="336" textAnchor="middle">한 번에 더 많이 처리하기 ↔ 각 요청을 더 빨리 응답하기</text>
        </g>
      </svg>
    </div>

    <p className="s18-tools"><span>실제 도구</span> <strong><ReferenceLink to="vLLM">vLLM</ReferenceLink></strong><small>오픈소스 프로젝트</small><i aria-hidden="true">·</i><strong><ReferenceLink to="NVIDIA Triton Inference Server">NVIDIA Triton Inference Server</ReferenceLink></strong><small>추론 서버</small></p>
    <Takeaway>모델을 호출 가능하게 연결하고, <strong>응답 시간·처리량·비용의 균형</strong>을 설계합니다.</Takeaway>
  </div>;
}
