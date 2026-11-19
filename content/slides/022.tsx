import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './022.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-firmware-compiler",
  "title": "장치를 제어하고 연산을 최적화하기",
  "section": "1부 · 산업을 읽다",
  "maxStep": 1,
  "subsection": "인프라"
} satisfies SlideMetadata;

export default function Slide022({ step, instant }: SlideProps) {
  const showFirmware = step >= 1;
  const laneStyle = {
    transform: showFirmware ? 'translateY(0)' : 'translateY(54px)',
    transition: instant ? 'none' : 'transform 550ms cubic-bezier(.2,.7,.2,1)',
  };

  return <div className="industry-content industry-s19" data-instant={instant} data-step={showFirmware ? 1 : 0}>
    <Heading eyebrow="AI 인프라 / Firmware & Compiler">하드웨어 실행에도 소프트웨어가 필요합니다</Heading>

    <div className="industry-visual s19-visual">
      <svg viewBox="0 0 1040 360" role="group" aria-labelledby="s19-title s19-desc">
        <title id="s19-title">모델 연산을 바꾸는 컴파일러와 장치를 제어하는 펌웨어</title>
        <desc id="s19-desc">XLA 같은 ML 컴파일러는 모델의 연산을 대상 하드웨어에 맞게 변환하고 최적화합니다. 연산 묶기는 그 방법 중 하나입니다.{showFirmware ? ' GPU 내부에서 실행되는 NVIDIA GSP 펌웨어는 GPU 초기화와 관리를 담당합니다. 컴파일러와 펌웨어는 서로 다른 역할입니다.' : ''}</desc>
        <defs>
          <marker id="s19-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
            <path d="M1 1 L7 4 L1 7" fill="none" stroke="context-stroke" strokeWidth="1.5" />
          </marker>
        </defs>

        <g className="s19-device">
          <rect className="s19-device-outline" x="796" y="40" width="218" height="274" rx="22" />
          {[81, 124, 167, 210, 253, 296].map(y => <path key={y} d={`M783 ${y} H796 M1014 ${y} H1027`} />)}
          {[832, 875, 918, 961].map(x => <path key={x} d={`M${x} 27 V40 M${x} 314 V327`} />)}
          <text className="s19-device-label" x="905" y="72" textAnchor="middle">GPU</text>
        </g>

        <g className="s19-compiler-lane" style={laneStyle}>
          <text className="s19-lane-heading" x="146" y="48" textAnchor="middle">모델의 연산</text>
          <text className="s19-role" x="405" y="48" textAnchor="middle">ML 컴파일러</text>
          <ReferenceLink to="XLA"><text className="s19-source" x="405" y="73" textAnchor="middle">OpenXLA · XLA</text></ReferenceLink>

          <g className="s19-operation-chain">
            {[62, 146, 230].map((x, index) => <g key={x}>
              <circle cx={x} cy="126" r="29" />
              <text x={x} y="133" textAnchor="middle">연산</text>
              {index < 2 && <path className="s19-flow" d={`M${x + 30} 126 H${x + 49}`} markerEnd="url(#s19-arrow)" />}
            </g>)}
          </g>

          <path className="s19-flow s19-main-flow" d="M270 126 H326" markerEnd="url(#s19-arrow)" />
          <path className="s19-compiler-mark" d="M357 99 L380 126 L357 153 M398 99 L421 126 L398 153 M439 99 L462 126 L439 153" />
          <path className="s19-flow s19-main-flow" d="M483 126 H530" markerEnd="url(#s19-arrow)" />

          <text className="s19-lane-heading" x="638" y="48" textAnchor="middle">하드웨어에 맞게</text>
          <rect className="s19-fused-outline" x="552" y="93" width="173" height="66" rx="33" />
          <g className="s19-fused-operations" aria-hidden="true">
            <path d="M592 126 H685" />
            {[592, 638, 685].map(x => <circle key={x} cx={x} cy="126" r="9" />)}
          </g>
          <text className="s19-detail" x="638" y="191" textAnchor="middle">연산 묶기 등으로 최적화</text>
          <path className="s19-flow s19-main-flow" d="M737 126 H825" markerEnd="url(#s19-arrow)" />

          <g className="s19-execution">
            <path d="M849 99 H965 M849 153 H965" />
            <text x="906" y="134" textAnchor="middle">연산 실행</text>
          </g>
          <text className="s19-detail" x="405" y="191" textAnchor="middle">변환 · 최적화</text>
        </g>

        <g className="s19-firmware-lane" style={reveal(showFirmware, instant, 'translateY(10px)')} aria-hidden={!showFirmware}>
          <path className="s19-separator" d="M33 220 H739" />
          <text className="s19-role s19-firmware-role" x="34" y="269">펌웨어</text>
          <text className="s19-firmware-copy" x="34" y="300">장치 초기화 · 관리</text>
          <text className="s19-control-caption" x="536" y="263" textAnchor="middle">장치 내부를 제어</text>
          <path className="s19-control-flow" d="M282 283 H830" markerEnd="url(#s19-arrow)" />
          <rect className="s19-gsp" x="843" y="237" width="126" height="60" rx="12" />
          <ReferenceLink to="NVIDIA GSP"><text className="s19-gsp-label" x="906" y="261" textAnchor="middle">NVIDIA GSP</text></ReferenceLink>
          <text className="s19-gsp-detail" x="906" y="284" textAnchor="middle">펌웨어</text>
          <path className="s19-internal-control" d="M906 227 V177" markerEnd="url(#s19-arrow)" />
        </g>
      </svg>
    </div>

    <div className="s19-takeaway">
      <p style={reveal(!showFirmware, instant)} aria-hidden={showFirmware}>
        <strong>컴파일러는 연산을 변환</strong>하고, 하드웨어에 맞게 최적화합니다.
      </p>
      <p style={reveal(showFirmware, instant)} aria-hidden={!showFirmware}>
        <strong>컴파일러는 연산을 변환</strong>하고, <span>펌웨어는 장치를 제어합니다.</span>
      </p>
    </div>
  </div>;
}
