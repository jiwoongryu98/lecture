import type { CSSProperties } from 'react';
import { Heading, reveal, Takeaway, type SlideProps } from '../components/kit';
import './006.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-map",
  "title": "AI 산업의 세 영역",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "지도"
} satisfies SlideMetadata;

type Sector = 'products' | 'models' | 'infrastructure';

interface SectorMapProps extends SlideProps {
  focus?: Sector;
}

/** The same cutaway is used when introducing a sector and when returning to the map. */
export function SectorMap({ step, instant, focus }: SectorMapProps) {
  const sectorStyle = (sector: Sector, visible: boolean): CSSProperties => ({
    ...reveal(visible, instant, 'translateY(14px)'),
    opacity: visible ? (focus && focus !== sector ? 0.3 : 1) : 0,
  });
  const modelVisible = step >= 1;
  const infrastructureVisible = step >= 2;

  return (
    <svg
      className="industry-sector-map"
      viewBox="0 0 1000 370"
      role="img"
      aria-label={infrastructureVisible
        ? '제품과 활용은 모델의 기능을 사용하고, 인프라는 모델의 학습과 추론을 지원합니다.'
        : modelVisible
          ? '사용자와 업무를 만나는 제품과 활용이 API 등의 인터페이스로 모델과 연결됩니다.'
          : 'AI 제품과 활용은 사용자와 업무를 만나는 접점입니다. AX도 이 영역에서 살펴봅니다.'}
      data-instant={instant ? 'true' : 'false'}
    >
      <title>AI 산업의 세 영역을 연결한 건축 단면도</title>

      <g className="sector-map-infrastructure" style={sectorStyle('infrastructure', infrastructureVisible)} aria-hidden={!infrastructureVisible}>
        {/* Infrastructure is the foundation and execution space under the model floor. */}
        <path className="sector-map-support" d="M420 227V316M841 227V316" />
        <path className="sector-map-foundation-top" d="M396 316L851 316L947 286L492 286Z" />
        <path className="sector-map-foundation-front" d="M396 316H851V343H396Z" />
        <path className="sector-map-foundation-side" d="M851 316L947 286V313L851 343Z" />

        <g className="sector-map-rack" transform="translate(497 247)">
          <path className="sector-map-rack-side" d="M55 0L68 -5V57L55 62Z" />
          <rect width="55" height="62" rx="3" />
          <path d="M9 13H43M9 27H43M9 41H43" />
          <circle cx="43" cy="53" r="2" />
        </g>
        <g className="sector-map-rack" transform="translate(578 247)">
          <path className="sector-map-rack-side" d="M55 0L68 -5V57L55 62Z" />
          <rect width="55" height="62" rx="3" />
          <path d="M9 13H43M9 27H43M9 41H43" />
          <circle cx="43" cy="53" r="2" />
        </g>

        <g className="sector-map-chip" transform="translate(728 270)">
          <path d="M-10 9H0M-10 21H0M-10 33H0M64 9H74M64 21H74M64 33H74M10 -10V0M23 -10V0M36 -10V0M49 -10V0M10 42V52M23 42V52M36 42V52M49 42V52" />
          <rect width="64" height="42" rx="3" />
          <rect className="sector-map-chip-core" x="13" y="10" width="38" height="22" rx="2" />
        </g>

        <path className="sector-map-infra-link" d="M898 228V278" />
        <path className="sector-map-infra-link" d="M892 235L898 228L904 235M892 271L898 278L904 271" />
        <text className="sector-map-connector-caption" x="925" y="258">학습·추론</text>

        <text className="sector-map-number" x="20" y="278">03</text>
        <text className="sector-map-sector-title" x="60" y="278">AI 인프라</text>
        <text className="sector-map-sector-description" x="60" y="310">학습·추론을 뒷받침</text>
        <text className="sector-map-sector-examples" x="60" y="338">실행 환경 · 컴퓨팅 · 메모리</text>
        <path className="sector-map-leader" d="M333 296H382" />
      </g>

      <g className="sector-map-models" style={sectorStyle('models', modelVisible)} aria-hidden={!modelVisible}>
        <path className="sector-map-model-top" d="M396 207H851L947 177H492Z" />
        <path className="sector-map-model-front" d="M396 207H851V228H396Z" />
        <path className="sector-map-model-side" d="M851 207L947 177V198L851 228Z" />

        {/* One engine with several capabilities, rather than three separate products. */}
        <path className="sector-map-model-trace" d="M526 179H581L630 163H688L740 180H811M630 163L608 190M688 163L710 190" />
        <g className="sector-map-model-node">
          <ellipse cx="526" cy="177" rx="26" ry="15" />
          <path d="M515 177H537M515 172H532M515 182H528" />
          <ellipse cx="811" cy="177" rx="26" ry="15" />
          <path d="M802 178L809 171L816 178M809 171V184" />
          <ellipse cx="607" cy="190" rx="15" ry="8" />
          <ellipse cx="711" cy="190" rx="15" ry="8" />
        </g>
        <g className="sector-map-model-engine">
          <path d="M625 145L657 133L690 145V172L657 185L625 172Z" />
          <path d="M625 145L657 158L690 145M657 158V185" />
          <circle cx="657" cy="146" r="4" />
        </g>

        <path className="sector-map-api-link" d="M910 116V174" />
        <path className="sector-map-api-link" d="M904 123L910 116L916 123M904 167L910 174L916 167" />
        <rect className="sector-map-api-badge" x="878" y="134" width="64" height="24" rx="12" />
        <text className="sector-map-api-label" x="910" y="151" textAnchor="middle">API 등</text>

        <text className="sector-map-number" x="20" y="166">02</text>
        <text className="sector-map-sector-title" x="60" y="166">AI 모델</text>
        <text className="sector-map-sector-description" x="60" y="198">필요한 기능을 제공</text>
        <text className="sector-map-sector-examples" x="60" y="226">이해 · 생성 · 검색</text>
        <path className="sector-map-leader" d="M333 184H382" />
      </g>

      <g className="sector-map-products" style={sectorStyle('products', true)}>
        <path className="sector-map-product-top" d="M396 98H851L947 68H492Z" />
        <path className="sector-map-product-front" d="M396 98H851V119H396Z" />
        <path className="sector-map-product-side" d="M851 98L947 68V89L851 119Z" />

        <g className="sector-map-person" transform="translate(423 35)">
          <circle cx="0" cy="8" r="8" />
          <path d="M-13 50V32C-13 18 13 18 13 32V50M0 29V57" />
        </g>
        <path className="sector-map-user-link" d="M442 62H466M461 57L466 62L461 67" />

        {/* Application screen, professional tool, and a connected workflow share the terrace. */}
        <g className="sector-map-screen" transform="translate(482 15)">
          <rect width="143" height="78" rx="5" />
          <path className="sector-map-screen-bar" d="M0 16H143" />
          <circle cx="9" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <path className="sector-map-chat" d="M17 29H92V45H43L33 52V45H17Z" />
          <path className="sector-map-chat-answer" d="M52 52H125V67H52Z" />
          <path className="sector-map-chat-line" d="M61 59H112" />
        </g>
        <g className="sector-map-tool" transform="translate(653 29)">
          <rect width="112" height="63" rx="4" />
          <path d="M11 14L18 20L11 26M25 26H43M11 38H88M11 47H67" />
        </g>
        <g className="sector-map-workflow" transform="translate(802 39)">
          <path d="M12 25H41V7H70M41 25V43H70" />
          <rect x="0" y="15" width="23" height="20" rx="3" />
          <rect x="65" y="-2" width="23" height="20" rx="3" />
          <rect x="65" y="33" width="23" height="20" rx="3" />
        </g>

        <text className="sector-map-number" x="20" y="52">01</text>
        <text className="sector-map-sector-title" x="60" y="52">AI 제품·활용</text>
        <text className="sector-map-sector-description" x="60" y="84">사용자·업무의 가치로 연결</text>
        <text className="sector-map-sector-examples" x="60" y="112">앱 · 전문 도구 · AX</text>
        <path className="sector-map-leader" d="M333 72H382" />
      </g>
    </svg>
  );
}

export default function Slide006({ step, instant }: SlideProps) {
  return (
    <div className="industry-content industry-s02">
      <Heading eyebrow="산업 지도" subtitle="사용자에게 보이는 것부터, 그 아래를 받치는 것까지">
        AI 산업은 이렇게 연결됩니다
      </Heading>
      <div className="industry-visual industry-s02-map">
        <SectorMap step={step} instant={instant} />
      </div>
      <Takeaway>
        {step === 0
          ? <><strong>제품·활용</strong>은 AI의 기능을 사용자의 문제와 연결합니다.</>
          : step === 1
            ? <><strong>모델</strong>은 제품이 사용하는 이해·생성·검색 기능을 제공합니다.</>
            : <>제품은 <strong>모델의 기능</strong>을, 모델은 <strong>인프라의 실행 기반</strong>을 활용합니다.</>}
      </Takeaway>
    </div>
  );
}
