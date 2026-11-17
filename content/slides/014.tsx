import { Heading, ReferenceLink, Takeaway, reveal, type SlideProps } from '../components/kit';
import './014.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-models",
  "title": "AI 모델 산업의 세 전략",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "모델"
} satisfies SlideMetadata;

export default function Slide014({ step, instant }: SlideProps) {
  const focused = step >= 1;
  const adapted = step >= 2;

  return <div className="industry-content industry-s11" data-instant={instant}>
    <Heading
      eyebrow="AI 모델 · 영역과 기업"
      subtitle="언어·이미지·추론 등, 제품에 필요한 기능의 기반을 만듭니다."
    >능력을 넓히고, 목적에 맞춥니다</Heading>

    <div className="s11-overview">
      <figure className="s11-landscape">
        <svg viewBox="0 0 740 400" role="img" aria-label={adapted
          ? '범용 역량 개발, 특정 문제 특화, 기존 모델 적응의 세 전략이 겹친다. 한 기업이 여러 전략을 함께 사용할 수 있다.'
          : focused
            ? '폭넓은 과제의 공통 기반을 만드는 범용 역량 개발과 한 문제나 분야에 집중하는 특화 전략이 겹친다.'
            : '범용 역량 개발은 폭넓은 과제의 공통 기반을 만드는 전략이다.'}>
          <g className="s11-broad-field">
            <ellipse className="s11-broad-fill" cx="280" cy="173" rx="260" ry="148" />
            <path className="s11-broad-contour" d="M358 58A227 122 0 1 1 106 251" />
            <path className="s11-broad-contour" d="M346 83A194 96 0 1 1 131 235" />
            <text className="s11-strategy-number" x="100" y="93">01</text>
            <text className="s11-strategy-title" x="100" y="131">범용 역량 개발</text>
            <text className="s11-strategy-detail" x="100" y="163">폭넓은 과제의 공통 기반</text>
            <path className="s11-capability-rule" d="M102 192H290" />
            <circle className="s11-capability-dot" cx="102" cy="192" r="4" />
            <circle className="s11-capability-dot" cx="198" cy="192" r="4" />
            <circle className="s11-capability-dot" cx="290" cy="192" r="4" />
            <text className="s11-capability" x="102" y="222" textAnchor="middle">언어</text>
            <text className="s11-capability" x="198" y="222" textAnchor="middle">이미지</text>
            <text className="s11-capability" x="290" y="222" textAnchor="middle">추론</text>
          </g>

          <g style={reveal(focused, instant, 'scale(.94)')} aria-hidden={!focused} className="s11-focused-field">
            <ellipse className="s11-focus-fill" cx="526" cy="183" rx="183" ry="121" />
            <ellipse className="s11-focus-contour" cx="526" cy="183" rx="159" ry="98" />
            <path className="s11-focus-mark" d="M586 102H613V125M613 147V170H586M564 170H541V147M541 125V102H564" transform="translate(9 -12)" />
            <circle className="s11-focus-dot" cx="586" cy="124" r="5" />
            <text className="s11-strategy-number" x="410" y="154">02</text>
            <text className="s11-strategy-title" x="410" y="196">특정 문제 특화</text>
            <text className="s11-strategy-detail" x="410" y="228">한 문제·분야에 집중</text>
          </g>

          <g style={reveal(adapted, instant, 'translateY(12px)')} aria-hidden={!adapted}>
            <path className="s11-adapt-fill" d="M85 302C103 253 269 232 428 240C579 245 691 271 683 313C675 356 531 382 365 379C205 378 68 350 85 302Z" />
            <path className="s11-adapt-contour" d="M116 304C134 269 277 252 425 259C559 265 655 285 651 312C646 340 519 362 368 360C228 358 104 338 116 304Z" />
            <text className="s11-strategy-number" x="160" y="307">03</text>
            <text className="s11-strategy-title" x="218" y="310">기존 모델 적응</text>
            <text className="s11-strategy-detail" x="218" y="342">기존 모델 + 목적에 맞는 추가 학습</text>
          </g>
        </svg>
        <figcaption>개발 전략의 개념도 · 영역 크기는 규모·성능과 무관</figcaption>
      </figure>

      <aside className="s11-players" aria-label="대표 기업과 공개 모델 예시">
        <p className="s11-players-heading">대표 기업 <span>공개 모델 예</span></p>
        <dl>
          <div className="s11-player">
            <dt><ReferenceLink to="OpenAI">OpenAI</ReferenceLink></dt>
            <dd><strong><ReferenceLink to="GPT">GPT</ReferenceLink></strong><span>범용 모델</span></dd>
          </div>
          <div className="s11-player">
            <dt><ReferenceLink to="Anthropic">Anthropic</ReferenceLink></dt>
            <dd><strong><ReferenceLink to="Claude">Claude</ReferenceLink></strong><span>범용 모델</span></dd>
          </div>
          <div className="s11-player">
            <dt><ReferenceLink to="Google DeepMind">Google DeepMind</ReferenceLink></dt>
            <dd><strong><ReferenceLink to="Gemini">Gemini</ReferenceLink></strong><span>범용 모델</span></dd>
          </div>
          <div className={adapted ? 's11-player s11-player-emphasis' : 's11-player'}>
            <dt><ReferenceLink to="Meta">Meta</ReferenceLink></dt>
            <dd><strong><ReferenceLink to="Llama">Llama</ReferenceLink></strong><span>공개 모델 기반 활용·학습</span></dd>
          </div>
          <div className={focused && !adapted ? 's11-player s11-player-emphasis' : 's11-player'} style={reveal(focused, instant, 'translateY(5px)')} aria-hidden={!focused}>
            <dt><ReferenceLink to="Stability AI">Stability AI</ReferenceLink></dt>
            <dd><strong><ReferenceLink to="Stable Diffusion">Stable Diffusion</ReferenceLink></strong><span>이미지 생성 모델</span></dd>
          </div>
        </dl>
      </aside>
    </div>

    <div className="s11-conclusion" style={reveal(adapted, instant)} aria-hidden={!adapted}>
      <Takeaway><strong>범용 개발·특화·적응</strong>은 서로 겹치는 전략입니다. 한 기업도 여러 전략을 함께 씁니다.</Takeaway>
    </div>
  </div>;
}
