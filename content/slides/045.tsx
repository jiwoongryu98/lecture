import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './045.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-learning-site",
  "title": "Field Guide — 관계도에서 소스 코드까지",
  "section": "2부 · 실무를 만나다",
  "maxStep": 1,
  "subsection": "학습"
} satisfies SlideMetadata;

export default function Slide045({ step, instant }: SlideProps) {
  const showBrief = step >= 1;

  return <div className="industry-content workflow-s18">
    <Heading eyebrow="학습 사례 / Distributed Inference Field Guide">복잡한 구조를 학습 사이트로 정리합니다</Heading>

    <div className="w18-layout">
      <section className="w18-request">
        <p className="w18-label">분산 추론 학습 가이드</p>
        <h2>역할과 관계를<br />한눈에</h2>
        <p className="w18-goal">개념 설명에서<br />실제 코드로 이어집니다.</p>

        <div className="w18-brief" style={reveal(showBrief, instant, 'translateY(8px)')} aria-hidden={!showBrief}>
          <div><p className="w18-concept-label">구조 이해</p><p>도구의 역할 · 연결 관계</p></div>
          <div><p className="w18-concept-label">깊이 살펴보기</p><p>개념 설명 · 프로젝트별 코드</p></div>
          <ReferenceLink to="Distributed Inference Field Guide" aria-label="분산 추론 학습 사이트 새 창에서 열기">
            학습 사이트 열기 <span aria-hidden="true">↗</span>
          </ReferenceLink>
        </div>
      </section>

      <figure className="w18-website">
        <ReferenceLink to="Distributed Inference Field Guide" aria-label="Distributed Inference Field Guide의 실제 시스템 맵 열기">
          <img src="/slides/045/di-system-map.png" width="1046" height="700"
            alt="Distributed Inference Field Guide의 실제 시스템 맵 일부. Dynamo, vLLM·SGLang·DeepInfer, NCCL·DeepEP, NIXL·Mooncake를 역할과 관계로 정리한다." />
        </ReferenceLink>
        <figcaption>Distributed Inference Field Guide · 실제 시스템 맵 일부</figcaption>
      </figure>
    </div>
  </div>;
}
