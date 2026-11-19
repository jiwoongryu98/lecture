import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './027.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-agents",
  "title": "AI에게 작업을 맡기는 환경",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "작업 환경"
} satisfies SlideMetadata;

const products = [
  { name: 'Claude Code', company: 'Anthropic', image: '/slides/027/s01-claude-code.png', alt: 'Claude Code 공식 아이콘' },
  { name: 'Codex', company: 'OpenAI', image: '/slides/027/s01-openai.png', alt: 'OpenAI 공식 아이콘' },
  { name: 'Antigravity', company: 'Google', image: '/slides/027/s01-antigravity.png', alt: 'Google Antigravity 공식 아이콘' },
] as const;

export default function Slide027({ step, instant }: SlideProps) {
  const showActions = step >= 1;
  const showResult = step >= 2;

  return <div className="industry-content workflow-s01">
    <Heading eyebrow="실무를 만나다 / AI와 함께 일하는 환경">AI에게 일을 맡기는 작업 환경</Heading>

    <div className="w01-composition">
      <ul className="w01-products" aria-label="대표 AI 에이전트 제품">
        {products.map((product) => <li key={product.name}>
          <ReferenceLink to={product.name} aria-label={`${product.name} 공식 사이트`}><img src={product.image} alt={product.alt} width="192" height="192" /></ReferenceLink>
          <div><span>{product.company}</span><h2><ReferenceLink to={product.name}>{product.name}</ReferenceLink></h2></div>
        </li>)}
      </ul>

      <div className="w01-workspace">
        <svg viewBox="0 0 710 350" role="img" aria-label="AI 에이전트가 작업 공간에서 파일을 읽고 수정하고 명령을 실행하는 개념도">
          <ellipse className="w01-orbit" cx="349" cy="177" rx="300" ry="117" />

          <g className="w01-agent">
            <circle cx="349" cy="177" r="68" />
            <path d="M323 163h52v29h-52zM336 157v-8m26 8v-8M335 174h4m20 0h4M337 184h24" />
            <text x="349" y="96" textAnchor="middle">AI 에이전트</text>
          </g>

          <g style={reveal(showActions, instant, 'scale(.96)')} aria-hidden={!showActions}>
            <path className="w01-tool-link" d="M293 139L197 94M407 139L507 94M349 245V288" />

            <g className="w01-file" transform="translate(133 27)">
              <rect x="-14" y="-5" width="77" height="92" rx="8" />
              <path d="M4 13h35m-35 14h42M4 41h31M4 55h41" />
              <text x="24" y="119" textAnchor="middle">파일 읽기</text>
            </g>

            <g className="w01-edit" transform="translate(508 27)">
              <rect x="-13" y="-5" width="76" height="92" rx="8" />
              <path d="M5 15h36M5 30h24M5 58l7-22 30-30 15 15-30 30zM37 11l15 15M12 36l15 15" />
              <text x="26" y="119" textAnchor="middle">파일 수정</text>
            </g>

            <g className="w01-terminal" transform="translate(288 288)">
              <rect x="0" y="0" width="123" height="47" rx="8" />
              <path d="M18 15l12 9-12 9M43 32h25" />
              <text x="155" y="32">명령 실행</text>
            </g>
          </g>
        </svg>
        <p className="w01-workspace-label">파일과 실행 도구가 연결된 작업 공간</p>
      </div>
    </div>

    <p className="w01-takeaway" style={reveal(showResult, instant, 'translateY(6px)')} aria-hidden={!showResult}>
      요청을 이해하고, <strong>도구를 써서 실제 결과물을 만듭니다.</strong>
    </p>
  </div>;
}
