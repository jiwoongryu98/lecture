import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './016.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-frontier",
  "title": "범용 모델의 기반 만들기",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "모델"
} satisfies SlideMetadata;

export default function Slide016({ step, instant }: SlideProps) {
  const directed = step >= 1;
  const evaluated = step >= 2;

  return <div className="industry-content industry-s12">
    <Heading eyebrow="AI 모델 · 범용 모델 개발">넓게 배우고, 쓸 수 있게 다듬는다</Heading>

    <div className="industry-s12-visual">
      <svg viewBox="0 0 1000 300" role="img" aria-labelledby="industry-s12-title industry-s12-description">
        <title id="industry-s12-title">범용 모델의 능력을 만드는 학습과 개선</title>
        <desc id="industry-s12-description">
          다양한 자료의 사전학습으로 폭넓은 능력 기반을 만듭니다.
          {directed && ' 후속 학습으로 지시 따르기와 과제 수행을 다듬습니다.'}
          {evaluated && ' 실제 과제의 평가에서 찾은 약점을 개선에 반영합니다.'}
          언어, 코드, 이미지 이해는 가능한 과제의 예이며 이미지 학습과 지원 여부는 모델마다 다릅니다.
        </desc>
        <defs>
          <linearGradient id="industry-s12-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5279b1" />
            <stop offset="1" stopColor="#345782" />
          </linearGradient>
          <marker id="industry-s12-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" overflow="visible">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#177c68" strokeWidth="1.7" />
          </marker>
        </defs>

        <text className="industry-s12-stage" x="30" y="25">① 사전학습</text>
        <text className="industry-s12-small" x="30" y="48">다양한 자료에서 패턴 학습</text>

        <g className="industry-s12-streams" fill="none" strokeLinecap="round">
          <path d="M 156 93 C 245 93, 260 122, 385 128" stroke="#8ca8cf" strokeWidth="13" />
          <path d="M 156 151 C 250 151, 280 151, 382 151" stroke="#4269a5" strokeWidth="13" />
          <path d="M 156 209 C 245 209, 260 180, 385 174" stroke="#b8cae2" strokeWidth="13" />
        </g>
        <g className="industry-s12-input">
          <text x="30" y="99">언어 자료</text>
          <text x="30" y="157">코드</text>
          <text x="30" y="215">이미지*</text>
        </g>

        <g fill="none" stroke="#b6c8df" strokeWidth="2">
          <path d="M 552 116 C 650 116, 654 86, 741 86" />
          <path d="M 561 151 H 741" />
          <path d="M 552 186 C 650 186, 654 216, 741 216" />
        </g>

        <circle cx="473" cy="151" r="89" fill="url(#industry-s12-core)" />
        <circle cx="473" cy="151" r="76" fill="none" stroke="#a7bedb" strokeWidth="1" opacity=".42" />
        <g className="industry-s12-core-copy" textAnchor="middle">
          <text x="473" y="136">폭넓은</text>
          <text x="473" y="171">능력 기반</text>
          <text className="industry-s12-core-label" x="473" y="202">범용 모델</text>
        </g>

        <g style={reveal(directed, instant, 'scale(.94)')} aria-hidden={!directed} className="industry-s12-direction">
          <circle cx="473" cy="151" r="108" fill="none" stroke="#177c68" strokeWidth="5" />
          <text className="industry-s12-stage industry-s12-green" x="473" y="25" textAnchor="middle">② 후속 학습</text>
          <path d="M 473 31 V 43" stroke="#177c68" strokeWidth="2" />
          <rect x="356" y="248" width="234" height="30" rx="15" fill="#edf5f0" />
          <text className="industry-s12-direction-copy" x="473" y="268" textAnchor="middle">지시 따르기 · 과제 수행</text>
        </g>

        <g className="industry-s12-capabilities">
          <text className="industry-s12-small" x="777" y="48">가능한 과제의 예</text>
          <circle cx="755" cy="86" r="5" fill="#4269a5" />
          <text x="777" y="92">언어 이해·생성</text>
          <circle cx="755" cy="151" r="5" fill="#4269a5" />
          <text x="777" y="157">코드 작성</text>
          <circle cx="755" cy="216" r="5" fill="#4269a5" />
          <text x="777" y="222">이미지 이해*</text>
        </g>

        <g style={reveal(evaluated, instant, 'translateY(6px)')} aria-hidden={!evaluated}>
          <path d="M 938 232 V 266 Q 938 291, 911 291 H 670 C 630 291, 628 270, 568 225" fill="none" stroke="#177c68" strokeWidth="2.5" markerEnd="url(#industry-s12-arrow)" />
          <rect x="678" y="275" width="191" height="25" fill="#fffefa" />
          <text className="industry-s12-evaluation" x="774" y="293" textAnchor="middle">③ 평가 → 약점 개선</text>
        </g>
      </svg>
      <p className="industry-s12-caveat">* 이미지 학습·지원 여부와 과제 범위는 모델마다 다름</p>
    </div>

    <aside className="industry-s12-examples" aria-label="범용 모델 개발 사례">
      <div className="industry-s12-model-example">
        <span>모델 예</span>
        <strong><ReferenceLink to="GPT">OpenAI · GPT</ReferenceLink></strong>
      </div>
      <p><ReferenceLink to="Claude">Anthropic · Claude</ReferenceLink> <span>/</span> <ReferenceLink to="Gemini">Google DeepMind · Gemini</ReferenceLink></p>
    </aside>
  </div>;
}
