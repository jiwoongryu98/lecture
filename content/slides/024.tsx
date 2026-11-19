import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './024.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-hardware",
  "title": "가속기, HBM, SRAM",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "인프라"
} satisfies SlideMetadata;

export default function Slide024({ step, instant }: SlideProps) {
  const memoryPath = step >= 1;
  const balanced = step >= 2;

  return <div className="industry-content industry-s20" data-instant={instant} data-balanced={balanced}>
    <Heading eyebrow="AI 인프라 / 하드웨어">계산만큼 중요한 데이터 공급</Heading>

    <div className="s20-hardware">
      <figure className="s20-hbm">
        <div className="s20-photo">
          <ReferenceLink to="삼성전자 HBM" className="reference-block"><img src="/shared/samsung-hbm4.png" alt="삼성전자가 공개한 HBM4 메모리 제품 이미지" /></ReferenceLink>
        </div>
        <figcaption>삼성전자 HBM4 · 공식 제품 이미지</figcaption>
        <div className="s20-memory-label"><h2>HBM</h2><p>데이터를 공급하는<br />고대역폭 적층 DRAM</p></div>
        <p className="s20-companies"><ReferenceLink to="삼성전자 HBM">삼성전자</ReferenceLink>{' · '}<ReferenceLink to="SK hynix">SK hynix</ReferenceLink></p>
      </figure>

      <div className="s20-chip-region">
        <p className="s20-accelerator-label"><strong>GPU 가속기</strong><span><ReferenceLink to="NVIDIA">NVIDIA</ReferenceLink>{' · '}<ReferenceLink to="AMD">AMD</ReferenceLink></span></p>
        <svg viewBox="0 0 700 310" role="img" aria-labelledby="s20-title s20-description">
          <title id="s20-title">HBM과 GPU 내부 SRAM, 연산부의 관계</title>
          <desc id="s20-description">HBM은 GPU 칩 외부의 메모리입니다. GPU 칩 내부에는 연산부와, 캐시 및 가까운 작업 공간으로 쓰이는 SRAM이 있습니다. 양쪽 화살표는 데이터의 이동을 단순화합니다. 실제 배치나 모든 메모리 계층을 나타내지 않습니다.</desc>
          <defs>
            <marker id="s20-arrow" viewBox="0 0 8 8" refX="6.8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse" overflow="visible">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#b87927" strokeWidth="1.5" />
            </marker>
          </defs>

          <path className="s20-chip-shadow" d="M136 48H641L666 73V276H161L136 251Z" />
          <rect className="s20-chip-outline" x="124" y="37" width="516" height="216" rx="19" />
          <g className="s20-pins" aria-hidden="true">
            {[164, 212, 260, 308, 356, 404, 452, 500, 548, 596].map(x => <path key={x} d={`M${x} 24V37M${x} 253V267`} />)}
            {[77, 112, 147, 182, 217].map(y => <path key={y} d={`M111 ${y}H124M640 ${y}H653`} />)}
          </g>
          <text className="s20-boundary-label" x="151" y="66">GPU 칩 내부</text>

          <g className="s20-compute">
            <g className="s20-compute-array" aria-hidden="true">
              {[0, 1, 2].flatMap(row => [0, 1, 2, 3].map(column => <rect key={`${row}-${column}`} x={448 + column * 35} y={91 + row * 29} width="25" height="19" rx="3" />))}
            </g>
            <text className="s20-compute-title" x="513" y="207" textAnchor="middle">연산부</text>
          </g>

          <g className="s20-sram" style={reveal(memoryPath, instant, 'none')} aria-hidden={!memoryPath}>
            <rect className="s20-sram-outline" x="177" y="91" width="151" height="130" rx="12" />
            <path className="s20-sram-lines" d="M195 109H310M195 117H310M195 125H310" aria-hidden="true" />
            <text className="s20-sram-title" x="252" y="166" textAnchor="middle">SRAM</text>
            <text className="s20-sram-copy" x="252" y="193" textAnchor="middle">가까운 작업 공간</text>
          </g>

          <g className="s20-data-path" style={reveal(memoryPath, instant, 'none')} aria-hidden={!memoryPath}>
            <path d="M12 155H162" markerStart="url(#s20-arrow)" markerEnd="url(#s20-arrow)" />
            <path d="M344 155H428" markerStart="url(#s20-arrow)" markerEnd="url(#s20-arrow)" />
            <text className="s20-transfer-label" x="62" y="128" textAnchor="middle">데이터 이동</text>
          </g>

          <text className="s20-diagram-caption" x="382" y="300" textAnchor="middle">메모리 관계를 단순화한 개념도 · 실제 배치·비율과 다름</text>
        </svg>
      </div>
    </div>

    <div className="s20-balance" style={reveal(balanced, instant, 'translateY(8px)')} aria-hidden={!balanced}>
      <p>함께 봐야 할 것</p>
      <div><strong>연산 성능</strong><span aria-hidden="true">/</span><strong>메모리 용량·대역폭</strong><span aria-hidden="true">/</span><strong>데이터 이동</strong></div>
    </div>
  </div>;
}
