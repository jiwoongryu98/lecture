import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './017.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-adaptation",
  "title": "기존 모델을 우리 문제에 맞추기",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "모델"
} satisfies SlideMetadata;

function ModelGlyph({ x, y, adapted = false }: { x: number; y: number; adapted?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r="48" fill={adapted ? '#e5f1ec' : '#eaf0f8'} stroke={adapted ? '#177c68' : '#4269a5'} strokeWidth="2" />
    <g fill="none" stroke={adapted ? '#177c68' : '#7f9fc8'} strokeWidth="2">
      <path d="M -23 -19 L 21 -22 L -1 4 L -23 -19 L -20 25 L -1 4 L 24 24 L 21 -22" />
      <path d="M -20 25 L 24 24" />
      {adapted && <path d="M -23 -19 Q 27 -5 24 24 M -20 25 Q 19 8 21 -22" strokeWidth="3" />}
    </g>
    {[[-23, -19], [21, -22], [-1, 4], [-20, 25], [24, 24]].map(([cx, cy], index) =>
      <circle key={index} cx={cx} cy={cy} r={adapted && (index === 2 || index === 4) ? 6 : 4.5} fill={adapted ? '#177c68' : '#4269a5'} />,
    )}
  </g>;
}

export default function Slide017({ step, instant }: SlideProps) {
  const context = step >= 1;
  const training = step >= 2;

  return <div className="industry-content industry-s14">
    <Heading eyebrow="AI 모델 · 기존 모델의 적응">우리 문제에 맞추는 방법은 다르다</Heading>

    <div className="industry-s14-visual">
      <svg viewBox="0 0 1000 330" role="img" aria-labelledby="industry-s14-title industry-s14-desc">
        <title id="industry-s14-title">사전학습 모델을 활용하는 두 가지 방법</title>
        <desc id="industry-s14-desc">
          이미 학습한 모델의 능력에서 출발합니다.
          {context && ' 요청 시 지시와 참고 자료를 주는 방법은 기존 학습값을 유지하며 맥락을 활용합니다.'}
          {training && ' 파인튜닝은 과제나 도메인 데이터로 추가 학습하여 모델에 학습 결과를 반영합니다.'}
        </desc>
        <defs>
          <marker id="industry-s14-arrow-context" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto" overflow="visible">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#4269a5" strokeWidth="1.7" />
          </marker>
          <marker id="industry-s14-arrow-training" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto" overflow="visible">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="#177c68" strokeWidth="1.7" />
          </marker>
        </defs>

        <circle cx="157" cy="161" r="79" fill="#f2f5fa" />
        <ModelGlyph x={157} y={161} />
        <text className="industry-s14-base-title" x="157" y="276" textAnchor="middle">사전학습 모델</text>
        <text className="industry-s14-small" x="157" y="301" textAnchor="middle">이미 배운 능력에서 출발</text>

        <g style={reveal(!context, instant, 'translateX(-7px)')} aria-hidden={context}>
          <path d="M 273 162 H 359" stroke="#b5c7df" strokeWidth="2" markerEnd="url(#industry-s14-arrow-context)" />
          <text className="industry-s14-opening" x="407" y="146">처음부터 만들지 않고,</text>
          <text className="industry-s14-opening" x="407" y="186">기존 능력을 우리 문제에 연결</text>
        </g>

        <g style={reveal(context, instant, 'translateY(8px)')} aria-hidden={!context}>
          <path d="M 236 147 C 285 147, 299 86, 358 86 H 647" fill="none" stroke="#4269a5" strokeWidth="2.5" markerEnd="url(#industry-s14-arrow-context)" />
          <text className="industry-s14-path-title industry-s14-blue" x="370" y="54">요청할 때 맥락 제공</text>
          <text className="industry-s14-small" x="370" y="116">지시 · 참고 자료</text>

          <rect x="656" y="16" width="137" height="139" rx="13" fill="#e8f1f7" fillOpacity=".45" stroke="#9db7d0" strokeWidth="1.5" strokeDasharray="5 5" />
          <ModelGlyph x={725} y={86} />
          <path d="M 763 8 H 783 L 795 20 V 50 H 763 Z M 783 8 V 20 H 795" fill="#fffefa" stroke="#4269a5" strokeWidth="1.5" />
          <path d="M 771 30 H 787 M 771 37 H 787" stroke="#7f9fc8" strokeWidth="1.5" />
          <text className="industry-s14-result" x="821" y="79">맥락을 보고 응답</text>
          <text className="industry-s14-small" x="821" y="105">기존 학습값 유지</text>
        </g>

        <g style={reveal(training, instant, 'translateY(-8px)')} aria-hidden={!training}>
          <path d="M 236 175 C 285 175, 299 244, 358 244 H 664" fill="none" stroke="#177c68" strokeWidth="2.5" markerEnd="url(#industry-s14-arrow-training)" />
          <text className="industry-s14-path-title industry-s14-green" x="370" y="211">데이터로 추가 학습</text>
          <text className="industry-s14-small" x="370" y="274">파인튜닝 · 과제·도메인에 적응</text>
          <ModelGlyph x={725} y={244} adapted />
          <text className="industry-s14-result industry-s14-green" x="821" y="237">모델 자체를 조정</text>
          <text className="industry-s14-small" x="821" y="263">학습 결과를 모델에 반영</text>
        </g>
      </svg>
    </div>

    <aside className="industry-s14-product" aria-label="기존 모델을 활용하는 실제 예">
      <div><span>모델 예</span><strong><ReferenceLink to="Llama">Meta · Llama</ReferenceLink></strong></div>
      <p>공개된 모델에서 출발 <span style={reveal(training, instant, 'translateX(-5px)')} aria-hidden={!training}>· 목적에 맞게 추가 학습</span></p>
    </aside>
  </div>;
}
