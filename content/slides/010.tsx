import { Heading, ReferenceLink, reveal, Takeaway, type SlideProps } from '../components/kit';
import { ProductUsageNav } from '../components/ProductUsageNav';
import './010.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-api",
  "title": "API로 연결하는 AI",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "제품"
} satisfies SlideMetadata;

export default function Slide010({ step, instant }: SlideProps) {
  const showManaged = step >= 1;
  const showProduct = step >= 2;

  return <div className="industry-content industry-s06" data-instant={instant} data-product={showProduct}>
    <Heading eyebrow="제품·활용 / 활용 방식">모델의 기능을 서비스에 연결합니다</Heading>
    <ProductUsageNav active="api" />

    <figure className="industry-visual s06-cutaway">
      <svg viewBox="0 25 1200 335" role="group" aria-label={showProduct
        ? '우리 팀의 서비스가 Claude API 또는 Amazon Bedrock으로 모델 기능에 연결되는 개념도. 사용자 화면, 데이터, 업무 흐름과 결과 검증은 서비스 안에서 연결한다.'
        : showManaged
          ? '모델 제공사의 Claude API에 직접 연결하거나, AWS의 Amazon Bedrock을 이용할 수 있다.'
          : '우리 팀의 서비스에서 Anthropic의 Claude API로 요청을 보내고 응답을 받는다.'}>
        <defs>
          <marker id="s06-forward" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" overflow="visible">
            <path d="M1 1L6 3.5L1 6" fill="none" stroke="#4269a5" strokeWidth="1.5" />
          </marker>
          <marker id="s06-back" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" overflow="visible">
            <path d="M1 1L6 3.5L1 6" fill="none" stroke="#177c68" strokeWidth="1.5" />
          </marker>
        </defs>

        <path className="s06-service-shadow" d="M35 67H555V343H35Z" />
        <rect className="s06-service-shell" x="20" y="45" width="525" height="278" rx="20" />
        <text x="53" y="85" className="s06-service-title">우리 팀의 서비스</text>
        <text x="512" y="82" textAnchor="end" className="s06-small s06-green">제품·업무 영역</text>
        <path d="M52 102H513" className="s06-divider" />

        <g className="s06-interface">
          <rect x="59" y="124" width="145" height="86" rx="7" />
          <path d="M59 144H204M73 135H78M87 135H92M102 135H107M74 160H144M74 173H123M74 188H188" />
          <circle cx="174" cy="166" r="9" />
          <path d="M159 193V188Q160 179 174 179Q188 179 189 188V193" />
          <text x="230" y="163" className="s06-part-title">사용자 화면</text>
          <text x="230" y="191" className="s06-small">우리 제품의 접점</text>
        </g>

        <g style={reveal(!showProduct, instant, 'none')} aria-hidden={showProduct}>
          <text x="282" y="265" textAnchor="middle" className="s06-service-message">사용자는 우리 서비스를 이용</text>
          <text x="282" y="293" textAnchor="middle" className="s06-small">모델의 기능은 그 안으로 연결</text>
        </g>

        <g style={reveal(showProduct, instant, 'translateY(8px)')} aria-hidden={!showProduct}>
          <path d="M53 228H512" className="s06-divider" />
          <g className="s06-data-icon" transform="translate(78 247)">
            <ellipse cx="21" cy="7" rx="21" ry="7" />
            <path d="M0 7V34C0 44 42 44 42 34V7M0 20C0 30 42 30 42 20" />
          </g>
          <text x="133" y="272" className="s06-part-title">데이터</text>
          <g className="s06-flow-icon" transform="translate(244 248)">
            <path d="M0 7H36V31H13M26 21L36 31L26 41" />
            <circle cx="0" cy="7" r="5" />
            <circle cx="13" cy="31" r="5" />
          </g>
          <text x="295" y="272" className="s06-part-title">업무 흐름</text>
          <g className="s06-check-icon" transform="translate(422 246)">
            <circle cx="22" cy="22" r="21" />
            <path d="M11 22L19 30L33 14" />
          </g>
          <text x="444" y="310" textAnchor="middle" className="s06-small s06-green">결과 검증</text>
        </g>

        <path d="M443 167H548" className="s06-wire-internal" />
        <path d="M529 139H559V196H529" className="s06-plug" />
        <path d="M557 151H578M557 184H578" className="s06-plug-pins" />
        <text x="620" y="252" textAnchor="middle" className="s06-api-label">API</text>
        <text x="620" y="277" textAnchor="middle" className="s06-api-caption">연결 규칙</text>

        <g className="s06-primary-route">
          <path d="M584 151H695Q711 151 711 135V111Q711 95 727 95H843" className="s06-request" markerEnd="url(#s06-forward)" />
          <path d="M844 131H747Q734 131 734 145V168Q734 184 718 184H584" className="s06-response" markerEnd="url(#s06-back)" />
          <text x="639" y="133" textAnchor="middle" className="s06-route-label s06-blue">요청</text>
          <text x="639" y="211" textAnchor="middle" className="s06-route-label s06-green">응답</text>
        </g>

        <g className="s06-provider-direct">
          <ReferenceLink to="Anthropic"><text x="870" y="64" className="s06-provider">Anthropic</text></ReferenceLink>
          <ReferenceLink to="Claude API"><text x="870" y="102" className="s06-provider-title">Claude API</text></ReferenceLink>
          <text x="870" y="134" className="s06-model">모델 제공사에 직접 연결</text>
          <path d="M869 151H1164" className="s06-provider-rule" />
          <text x="870" y="174" className="s06-small">모델 기능을 API로 제공</text>
        </g>

        <g style={reveal(showManaged, instant, 'translateY(8px)')} aria-hidden={!showManaged}>
          <path d="M596 151H684Q699 151 699 166V257Q699 272 714 272H844" className="s06-request s06-alternative" markerEnd="url(#s06-forward)" />
          <path d="M844 303H698Q678 303 678 283V198Q678 184 664 184" className="s06-response s06-alternative" />
          <text x="747" y="245" className="s06-small">다른 연결 경로</text>
          <ReferenceLink to="AWS"><text x="870" y="231" className="s06-provider">Amazon · AWS</text></ReferenceLink>
          <ReferenceLink to="Amazon Bedrock"><text x="870" y="269" className="s06-provider-title">Amazon Bedrock</text></ReferenceLink>
          <text x="870" y="302" className="s06-model">클라우드로 여러 모델 이용</text>
          <path d="M869 319H1164" className="s06-provider-rule" />
          <text x="870" y="343" className="s06-small">모델을 선택해 앱에 연결</text>
        </g>
      </svg>
      <figcaption>공식 제품의 제공 관계를 단순화한 개념도 · 두 경로는 선택 가능한 예</figcaption>
    </figure>

    <div className="s06-takeaway" style={reveal(showProduct, instant)} aria-hidden={!showProduct}>
      <Takeaway>API를 연결한 뒤에도 <strong>제품의 화면·데이터·업무 흐름·검증</strong>을 설계해야 합니다.</Takeaway>
    </div>
  </div>;
}
