import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import { ProductUsageNav } from '../components/ProductUsageNav';
import './006.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-products",
  "title": "AI 제품과 제품 속의 AI",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "제품"
} satisfies SlideMetadata;

const companies = [
  { company: 'OpenAI', to: 'ChatGPT', products: 'ChatGPT' },
  { company: 'Anthropic', to: 'Claude Code', products: 'Claude Code' },
  { company: 'Microsoft', to: 'Microsoft Copilot', products: 'Word·Excel의 Copilot' },
  { company: 'Zoom', to: 'Zoom AI Companion', products: '회의 자동 전사·AI 요약' },
] as const;

export default function Slide006({ step, instant }: SlideProps) {
  return <div className="industry-content industry-s03" data-instant={instant}>
    <Heading eyebrow="제품·활용 / 영역 소개" subtitle="AI를 직접 쓰는 제품부터, 기존 서비스에 들어간 AI 기능까지">
      AI 제품과 제품 속의 AI
    </Heading>

    <div className="s03-usage-intro" style={reveal(step >= 2, instant, 'none')} aria-hidden={step < 2}>
      <ProductUsageNav />
    </div>

    <div className="industry-visual s03-visual">
      <svg className="s03-workbench" viewBox="0 0 1200 250" role="img" aria-label="모델의 기능이 AI 제품을 거쳐 사용자와 업무에 연결되는 관계">
        <defs>
          <marker id="s03-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M1 1L6 4L1 7" fill="none" stroke="#177c68" strokeWidth="1.5" />
          </marker>
        </defs>

        <g className="s03-capability">
          <path d="M126 33L173 60V114L126 141L79 114V60Z" fill="#eff3f8" stroke="#4269a5" strokeWidth="2" />
          <path d="M126 33V87L173 114M79 60L126 87L173 60M126 87V141M79 114L126 87" fill="none" stroke="#4269a5" strokeWidth="1.5" />
          <circle cx="126" cy="87" r="9" fill="#4269a5" />
          <text x="126" y="192" textAnchor="middle" className="s03-svg-label">모델의 기능</text>
          <text x="126" y="221" textAnchor="middle" className="s03-svg-caption">생성 · 이해 · 추론</text>
        </g>

        <path d="M209 90H319" stroke="#177c68" strokeWidth="2.5" markerEnd="url(#s03-arrow)" />

        <g className="s03-product">
          <path d="M350 24H724Q740 24 740 40V157Q740 173 724 173H350Q334 173 334 157V40Q334 24 350 24Z" fill="#fffefa" stroke="#177c68" strokeWidth="2" />
          <path d="M350 24H724Q740 24 740 40V64H334V40Q334 24 350 24Z" fill="#e5f1eb" />
          <circle cx="354" cy="44" r="4" fill="#177c68" opacity=".45" />
          <circle cx="368" cy="44" r="4" fill="#177c68" opacity=".3" />
          <circle cx="382" cy="44" r="4" fill="#177c68" opacity=".2" />
          <text x="720" y="50" textAnchor="end" className="s03-svg-interface-title">제품의 기능</text>
          <path d="M366 93H539M366 109H508M366 125H522" stroke="#b4c7bd" strokeWidth="5" strokeLinecap="round" />
          <path d="M572 108H604" stroke="#177c68" strokeWidth="2" markerEnd="url(#s03-arrow)" />
          <path d="M636 80H681L699 98V147H636Z" fill="#edf5ee" stroke="#177c68" strokeWidth="1.5" />
          <path d="M681 80V98H699M648 112H686M648 125H679M648 137H671" fill="none" stroke="#177c68" strokeWidth="1.5" />
          <text x="537" y="212" textAnchor="middle" className="s03-svg-label s03-svg-green">제품 + 업무 흐름</text>
        </g>

        <path d="M755 90H857" stroke="#177c68" strokeWidth="2.5" markerEnd="url(#s03-arrow)" />

        <g className="s03-person">
          <circle cx="1006" cy="53" r="23" fill="#f0d9bc" />
          <path d="M984 47Q988 22 1009 28Q1027 30 1030 47L1012 41L996 47Z" fill="#22354a" />
          <path d="M966 135L974 96Q981 79 1006 79Q1031 79 1038 96L1046 135" fill="#177c68" />
          <path d="M975 99L951 130H920M1035 99L1056 130H1080" fill="none" stroke="#177c68" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M882 139H1124" stroke="#22354a" strokeWidth="3" strokeLinecap="round" />
          <path d="M903 139L891 96H950L962 139" fill="#edf1f2" stroke="#22354a" strokeWidth="2" strokeLinejoin="round" />
          <path d="M1094 116V139M1084 121H1104" stroke="#b87927" strokeWidth="3" strokeLinecap="round" />
          <text x="1006" y="192" textAnchor="middle" className="s03-svg-label">사용자·업무</text>
          <text x="1006" y="221" textAnchor="middle" className="s03-svg-caption">사람이 일하는 자리</text>
        </g>
      </svg>

      <div className="s03-companies" style={reveal(step >= 1, instant)} aria-hidden={step < 1}>
        <p className="s03-row-label">대표 기업·제품</p>
        <div className="s03-company-line">
          {companies.map(({ company, products, to }) => <ReferenceLink to={to} className="s03-company" key={company}>
            <strong>{company}</strong><span>{products}</span>
          </ReferenceLink>)}
        </div>
      </div>

    </div>
  </div>;
}
