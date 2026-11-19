import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './046.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-learning-loop",
  "title": "막히는 부분에는 설명과 그림을 더합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "학습"
} satisfies SlideMetadata;

export default function Slide046({ step, instant }: SlideProps) {
  const explain = step >= 1;
  const visualize = step >= 2;

  return <div className="industry-content workflow-s19">
    <Heading eyebrow="학습 자료 확장 / 설명과 시각화">막히는 부분에는 설명과 그림을 더합니다</Heading>

    <div className="w19-composition">
      <section className="w19-request">
        <p className="w19-label">AI에게 이어서 요청</p>
        <blockquote>NCCL과 NIXL의 차이를<br />설명하는 절을 더하고,<br />연결 관계를 그림으로 보여줘.</blockquote>
        <p className="w19-request-note">궁금한 부분을 짚으면,<br />필요한 설명을 더할 수 있습니다.</p>
      </section>

      <div className="w19-guide">
        <header className="w19-guide-heading"><span>FIELD GUIDE · 보충 요청 예시</span><h2>GPU 통신과 데이터 이동</h2></header>
        <section className="w19-new-section" style={reveal(explain, instant, 'translateY(6px)')} aria-hidden={!explain}>
          <h3><span>01</span> 설명 절 추가</h3>
          <dl>
            <div><dt><ReferenceLink to="NCCL">NCCL</ReferenceLink></dt><dd>GPU 간 통신</dd></div>
            <div><dt><ReferenceLink to="NIXL">NIXL</ReferenceLink></dt><dd>KV 캐시 등 데이터 이동</dd></div>
          </dl>
        </section>
        <figure className="w19-new-diagram" style={reveal(visualize, instant, 'translateY(6px)')} aria-hidden={!visualize}>
          <h3><span>02</span> 관계를 그림으로</h3>
          <img src="/slides/046/roles.svg" width="357" height="168" alt="Graphviz로 생성한 관계도. vLLM에서 NCCL로 GPU 통신 경로가 이어지고, NIXL로 선택적인 KV 데이터 이동 경로가 점선으로 이어진다." />
          <figcaption><ReferenceLink to="Graphviz">Graphviz</ReferenceLink><span>관계를 적으면, 그림을 자동 배치</span></figcaption>
        </figure>
      </div>
    </div>

    <p className="w19-takeaway" style={reveal(visualize, instant, 'translateY(5px)')} aria-hidden={!visualize}>
      <strong>설명과 그림은 빠르게 더하고,</strong> 관계가 맞는지는 원문으로 확인합니다.
    </p>
  </div>;
}
