import { Heading, ReferenceLink, Takeaway, reveal, type SlideProps } from '../components/kit';
import './021.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-infrastructure",
  "title": "AI 인프라의 세 영역",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "인프라"
} satisfies SlideMetadata;

function LayerSurface() {
  return <svg className="s17-layer-surface" viewBox="0 0 760 124" preserveAspectRatio="none" aria-hidden="true">
    <path className="s17-layer-top" d="M0 0H726L760 22V107H34L0 85Z" />
    <path className="s17-layer-edge" d="M0 85L34 107H760V124H34L0 102Z" />
    <path className="s17-layer-seam" d="M34 107H760M0 85L34 107" />
  </svg>;
}

export default function Slide021({ step, instant }: SlideProps) {
  const software = step >= 1;
  const hardware = step >= 2;

  return <div className="industry-content industry-s17" data-instant={instant}>
    <Heading
      eyebrow="AI 인프라 · 영역과 기업"
      subtitle="모델을 학습시키고, 요청에 응답시키는 실행 기반을 제공합니다."
    >소프트웨어에서 하드웨어까지</Heading>

    <div className="s17-overview">
      <div className="s17-stack" aria-label="AI 인프라를 구성하는 세 영역">
        <section className="s17-layer s17-serving">
          <LayerSurface />
          <div className="s17-layer-name">
            <p className="s17-layer-number">01</p>
            <h2>서빙 프레임워크</h2>
            <p className="s17-english">Serving framework</p>
          </div>
          <div className="s17-layer-role">
            <p className="s17-role">요청을 받아 모델을 실행</p>
            <p className="s17-example"><strong><ReferenceLink to="NVIDIA Triton Inference Server">NVIDIA</ReferenceLink></strong><span>서빙 소프트웨어</span></p>
          </div>
        </section>

        <section
          className="s17-layer s17-software"
          style={reveal(software, instant, 'translateY(-10px)')}
          aria-hidden={!software}
        >
          <LayerSurface />
          <div className="s17-layer-name">
            <p className="s17-layer-number">02</p>
            <h2>펌웨어·컴파일러</h2>
            <p className="s17-english">Firmware &amp; Compiler</p>
          </div>
          <dl className="s17-software-roles">
            <div><dt>펌웨어</dt><dd>장치 초기화·관리</dd></div>
            <div><dt>컴파일러</dt><dd>연산 변환·최적화</dd></div>
          </dl>
        </section>

        <section
          className="s17-layer s17-hardware"
          style={reveal(hardware, instant, 'translateY(-10px)')}
          aria-hidden={!hardware}
        >
          <LayerSurface />
          <div className="s17-layer-name">
            <p className="s17-layer-number">03</p>
            <h2>하드웨어</h2>
            <p className="s17-english">Hardware</p>
          </div>
          <dl className="s17-hardware-roles">
            <div><dt>GPU 가속기</dt><dd><ReferenceLink to="NVIDIA">NVIDIA</ReferenceLink>{' · '}<ReferenceLink to="AMD">AMD</ReferenceLink></dd></div>
            <div><dt>HBM 메모리</dt><dd><ReferenceLink to="삼성전자 HBM">삼성전자</ReferenceLink>{' · '}<ReferenceLink to="SK hynix">SK hynix</ReferenceLink></dd></div>
          </dl>
        </section>
      </div>

      <aside className="s17-context" aria-label="학습과 추론의 뜻, 실제 메모리 제품 사진">
        <dl className="s17-computing">
          <div><dt>학습</dt><dd>데이터로 모델을<br />만들고 개선하는 계산</dd></div>
          <div><dt>추론</dt><dd>모델로 결과를<br />만드는 계산</dd></div>
        </dl>
        <figure className="s17-memory" style={reveal(hardware, instant)} aria-hidden={!hardware}>
          <ReferenceLink to="삼성전자 HBM" className="reference-block"><img src="/shared/samsung-hbm4.png" alt="삼성전자가 공개한 HBM4 메모리 제품 이미지" /></ReferenceLink>
          <figcaption><strong>계산에는 메모리도 필요합니다</strong><span>삼성전자 HBM4 · 공식 제품 이미지</span></figcaption>
        </figure>
      </aside>
    </div>

    <div className="s17-conclusion" style={reveal(hardware, instant)} aria-hidden={!hardware}>
      <Takeaway>AI 인프라는 <strong>모델을 실행하는 소프트웨어와 계산·메모리 장치</strong>를 함께 다룹니다.</Takeaway>
    </div>
  </div>;
}
