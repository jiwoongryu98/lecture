import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './004.css';
import type { ReferenceName } from '../references';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-history",
  "title": "AI는 어떻게 여기까지 왔을까?",
  "section": "1부 · 산업을 읽다",
  "maxStep": 5,
  "subsection": "역사"
} satisfies SlideMetadata;

const epochs = [
  { year: '2014', label: '관련된 부분에 집중하다', detail: <><ReferenceLink to="Attention">Attention</ReferenceLink> · 출력할 단어마다 입력의 관련 부분을 참조</>, phase: '연구의 아이디어' },
  { year: '2017', label: 'Attention으로 구조를 만들다', detail: <><ReferenceLink to="Transformer">Transformer</ReferenceLink> · Attention을 중심으로 설계한 모델 아키텍처</>, phase: '연구의 아이디어' },
  { year: '2020', label: '언어와 이미지, 생성 능력의 확장', detail: <><ReferenceLink to="GPT-3">GPT-3</ReferenceLink> · 입력 예시로 과제 수행  /  <ReferenceLink to="DDPM">DDPM</ReferenceLink> · 노이즈를 점차 제거</>, phase: '모델과 생성 방법' },
  { year: '2021', label: '텍스트와 이미지가 연결되다', detail: <><ReferenceLink to="CLIP">CLIP</ReferenceLink> · 텍스트–이미지 연결  /  <ReferenceLink to="Latent diffusion">Latent diffusion</ReferenceLink> · 압축 표현에서 생성</>, phase: '서로 다른 두 기여' },
  { year: '2022', label: '모델의 능력이 사용 경험으로', detail: <><ReferenceLink to="Stable Diffusion">Stable Diffusion</ReferenceLink> 모델 공개 · <ReferenceLink to="ChatGPT 공개">ChatGPT</ReferenceLink> 대화형 서비스 공개</>, phase: '모델 공개와 제품 경험' },
  { year: '2025', label: '답변을 넘어 작업을 수행하다', detail: <><ReferenceLink to="Claude Code 공개">Claude Code</ReferenceLink> · 코드와 도구를 다루는 작업 도구, 연구 프리뷰 공개</>, phase: '제품과 업무의 연결' },
];

type Kind = 'research' | 'model' | 'product';
const columns = [130, 290, 450, 610, 770, 930];

function Mark({ kind, x, y }: { kind: Kind; x: number; y: number }) {
  if (kind === 'model') return <path className="s01-mark s01-model" d={`M ${x} ${y - 6} l 6 6 l -6 6 l -6 -6 Z`} />;
  if (kind === 'product') return <rect className="s01-mark s01-product" x={x - 5.5} y={y - 5.5} width="11" height="11" rx="2" />;
  return <circle className="s01-mark s01-research" cx={x} cy={y} r="5.5" />;
}

function EpochDiagram({ epoch }: { epoch: number }) {
  return <svg className="s01-epoch-diagram" viewBox="0 0 320 112" role="group" aria-label="이정표의 핵심 개념">
    {epoch === 0 && <>
      <text x="12" y="15" className="s01-diagram-caption">입력의 관련도</text>
      {[30, 61, 92].map((y, index) => <g key={y}>
        <rect x="10" y={y - 10} width="62" height="22" rx="5" className={index === 1 ? 's01-fill-blue' : 's01-fill-pale'} />
        <text x="41" y={y + 5} textAnchor="middle" className="s01-diagram-small">입력 {index + 1}</text>
        <path d={`M 77 ${y + 1} L 212 59`} className={index === 1 ? 's01-link s01-link-bold' : 's01-link s01-link-faint'} />
      </g>)}
      <circle cx="234" cy="59" r="26" className="s01-fill-green" />
      <text x="234" y="64" textAnchor="middle" className="s01-diagram-small s01-text-light">출력</text>
    </>}
    {epoch === 1 && <>
      <path d="M 51 78 L 157 25 L 267 78 M 51 78 H 267 M 157 25 V 89" className="s01-link" />
      {[{ x: 51, y: 78, text: '문장' }, { x: 157, y: 25, text: '안의' }, { x: 267, y: 78, text: '관계' }].map((token) => <g key={token.text}>
        <circle cx={token.x} cy={token.y} r="22" className="s01-fill-blue" />
        <text x={token.x} y={token.y + 5} textAnchor="middle" className="s01-diagram-small">{token.text}</text>
      </g>)}
      <text x="157" y="109" textAnchor="middle" className="s01-diagram-caption">토큰 사이의 관계를 계산</text>
    </>}
    {epoch === 2 && <>
      <text x="9" y="24" className="s01-diagram-caption">언어</text>
      <text x="70" y="24" className="s01-diagram-small">입력 예시</text>
      <path d="M 146 19 H 198 m -7 -5 l 7 5 l -7 5" className="s01-link" />
      <text x="216" y="24" className="s01-diagram-small">새 응답</text>
      <text x="9" y="83" className="s01-diagram-caption">이미지</text>
      {Array.from({ length: 16 }, (_, index) => <circle key={index} cx={80 + (index % 4) * 10} cy={61 + Math.floor(index / 4) * 10} r={index % 3 === 0 ? 2.8 : 1.5} className="s01-noise" />)}
      <path d="M 146 77 H 198 m -7 -5 l 7 5 l -7 5" className="s01-link" />
      <rect x="222" y="53" width="58" height="47" rx="4" className="s01-image-outline" />
      <circle cx="264" cy="65" r="5" className="s01-fill-amber" />
      <path d="M 225 95 L 244 73 L 257 85 L 266 78 L 277 95" className="s01-landscape" />
    </>}
    {epoch === 3 && <>
      <ReferenceLink to="CLIP"><text x="8" y="21" className="s01-diagram-caption">CLIP</text></ReferenceLink>
      <text x="8" y="47" className="s01-diagram-small">텍스트</text>
      <path d="M 78 42 H 194 m -7 -5 l 7 5 l -7 5 M 85 37 l -7 5 l 7 5" className="s01-link" />
      <text x="213" y="47" className="s01-diagram-small">이미지</text>
      <path d="M 8 64 H 296" className="s01-diagram-rule" />
      <ReferenceLink to="Latent diffusion"><text x="8" y="88" className="s01-diagram-caption">Latent diffusion</text></ReferenceLink>
      <text x="8" y="109" className="s01-diagram-small">압축 표현</text>
      <path d="M 122 104 H 194 m -7 -5 l 7 5 l -7 5" className="s01-link" />
      <text x="213" y="109" className="s01-diagram-small">생성</text>
    </>}
    {epoch === 4 && <>
      <path d="M 13 20 H 140 Q 150 20 150 30 V 62 Q 150 72 140 72 H 57 L 34 88 V 72 H 13 Q 3 72 3 62 V 30 Q 3 20 13 20 Z" className="s01-chat" />
      <path d="M 24 39 H 127 M 24 53 H 96" className="s01-chat-lines" />
      <ReferenceLink to="ChatGPT 공개"><text x="76" y="108" textAnchor="middle" className="s01-diagram-caption">ChatGPT · 대화형 제품</text></ReferenceLink>
      <ReferenceLink to="Stable Diffusion">
        <image href="/shared/stable-diffusion-2022.jpg" x="209" y="16" width="81" height="65" preserveAspectRatio="xMidYMid slice" />
        <text x="250" y="108" textAnchor="middle" className="s01-diagram-caption">Stable Diffusion · 모델</text>
      </ReferenceLink>
    </>}
    {epoch === 5 && <>
      <text x="10" y="27" className="s01-diagram-small">목표</text>
      <text x="10" y="49" className="s01-diagram-caption">+ 코드 맥락</text>
      <path d="M 94 37 H 128 m -7 -5 l 7 5 l -7 5" className="s01-link" />
      <rect x="145" y="8" width="152" height="82" rx="7" className="s01-terminal" />
      <circle cx="158" cy="21" r="2.5" className="s01-terminal-dot" />
      <path d="M 169 21 H 284 M 158 40 l 5 5 l -5 5 M 174 47 H 264 M 174 64 H 247" className="s01-terminal-lines" />
      <text x="221" y="109" textAnchor="middle" className="s01-diagram-caption">수정 · 실행 · 검토</text>
    </>}
  </svg>;
}

export default function Slide004({ step, instant }: SlideProps) {
  const current = Math.min(Math.max(step, 0), 5);
  const milestone = (epoch: number, y: number, label: ReferenceName, kind: Kind, secondLabel?: ReferenceName, secondKind?: Kind) => {
    const x = columns[epoch];
    const visible = current >= epoch;
    return <g key={`${epoch}-${y}`} className={`s01-milestone ${current === epoch ? 'is-current' : 'is-past'}`} style={reveal(visible, instant, 'translateY(5px)')} aria-hidden={!visible}>
      <ReferenceLink to={label === 'ChatGPT' ? 'ChatGPT 공개' : label === 'Claude Code' ? 'Claude Code 공개' : label}>
        <Mark x={x} y={y} kind={kind} />
        <text x={x} y={y - 18} className="s01-milestone-label" textAnchor="middle">{label}</text>
      </ReferenceLink>
      {secondLabel && <ReferenceLink to={secondLabel}>
        <Mark x={x - 58} y={y + 24} kind={secondKind ?? 'research'} />
        <text x={x - 46} y={y + 29} className="s01-milestone-secondary">{secondLabel}</text>
      </ReferenceLink>}
    </g>;
  };

  return <div className="industry-content industry-s01" data-instant={instant}>
    <Heading eyebrow="01 · 생성형 AI의 주요 이정표" subtitle="연구의 아이디어가 모델의 능력으로, 다시 사람이 쓰는 도구로 연결됩니다.">AI는 어떻게 여기까지 왔을까?</Heading>

    <div className="s01-focus" aria-live="polite">
      {epochs.map((epoch, index) => <div key={epoch.year} className="s01-epoch" style={reveal(current === index, instant, 'translateY(9px)')} aria-hidden={current !== index}>
        <div className="s01-year">{epoch.year}<span>{epoch.phase}</span></div>
        <div className="s01-epoch-copy"><h2>{epoch.label}</h2><p>{epoch.detail}</p></div>
        <EpochDiagram epoch={index} />
      </div>)}
    </div>

    <div className="s01-timeline-wrap">
      <div className="s01-timeline-top"><span>두 흐름이 쌓이며 이어진 발전</span><div className="s01-legend" aria-label="이정표 종류"><span><i className="is-research" />연구</span><span><i className="is-model" />모델</span><span><i className="is-product" />제품·도구</span></div></div>
      <svg className="s01-timeline" viewBox="0 0 1000 205" role="group" aria-label={`${epochs[current].year}까지 공개한 언어 및 이미지 생성형 AI의 주요 이정표`}>
        <rect x={columns[current] - 73} y="4" width="146" height="194" rx="12" className="s01-current-band" style={{ transition: instant ? 'none' : 'x 480ms cubic-bezier(.2,.7,.2,1)' }} />
        <path d="M 95 56 H 970 M 95 137 H 970" className="s01-track" />
        <path d={`M 95 56 H ${columns[current]}`} className="s01-track-progress s01-language-progress" />
        {current >= 2 && <path d={`M 450 137 H ${columns[Math.min(current, 4)]}`} className="s01-track-progress s01-image-progress" />}
        <text x="1" y="61" className="s01-track-name">언어</text>
        <text x="1" y="142" className="s01-track-name">이미지</text>
        {milestone(0, 56, 'Attention', 'research')}
        {milestone(1, 56, 'Transformer', 'research')}
        {milestone(2, 56, 'GPT-3', 'model')}
        {milestone(2, 137, 'DDPM', 'research')}
        {milestone(3, 137, 'CLIP', 'model', 'Latent diffusion', 'research')}
        {milestone(4, 56, 'ChatGPT', 'product')}
        {milestone(4, 137, 'Stable Diffusion', 'model')}
        {milestone(5, 56, 'Claude Code', 'product')}
        {columns.map((x, index) => <g key={epochs[index].year} className={index === current ? 's01-axis-year is-current' : 's01-axis-year'}>
          <text x={x} y="190" textAnchor="middle">{epochs[index].year}</text>
        </g>)}
      </svg>
      <p className="s01-timeline-caption">현대 생성형 AI로 이어지는 선택된 이정표 · 연도 간 간격은 동일하게 배치</p>
    </div>
  </div>;
}
