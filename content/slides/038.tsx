import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './038.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-orchestration-products",
  "title": "여러 에이전트의 작업을 한곳에서",
  "section": "2부 · 실무를 만나다",
  "maxStep": 1,
  "subsection": "작업 분담"
} satisfies SlideMetadata;

export default function Slide038({ step, instant }: SlideProps) {
  const crew = step >= 1;

  return <div className="industry-content workflow-s11">
    <Heading eyebrow="작업 분담 / 실제 제품">여러 에이전트의 작업을 한곳에서</Heading>

    <div className="w11-composition">
      <figure className="w11-product-screen">
        <ReferenceLink to={crew ? 'Kiro Crew' : 'Orca'} className="w11-image-stage reference-block">
          <img
            className="w11-orca-screen"
            src="/slides/038/s11-orca-orchestration.jpg"
            width="960"
            height="600"
            alt="Orca 공식 기능 시연 화면. 왼쪽에 분리된 작업 공간, 오른쪽에 작업 에이전트의 결과가 모여 있다."
            style={reveal(!crew, instant, 'translateY(6px)')}
            aria-hidden={crew}
          />
          <img
            className="w11-crew-screen"
            src="/slides/038/s11-kiro-crew-session.png"
            width="3840"
            height="2160"
            alt="Kiro Crew 공식 화면. 세션 목록, 에이전트와의 대화, 변경 결과를 나란히 확인한다."
            style={reveal(crew, instant, 'translateY(6px)')}
            aria-hidden={!crew}
          />
        </ReferenceLink>
        <figcaption>{crew ? 'Kiro Crew · 공식 사이트 공개 화면' : 'Orca · 공식 저장소 기능 시연 화면'}</figcaption>
      </figure>

      <div className="w11-product-roles">
        <section className={`w11-product-role${crew ? '' : ' w11-active'}`}>
          <h2><ReferenceLink to="Orca">Orca</ReferenceLink></h2>
          <p>여러 코딩 에이전트의<br /><strong>작업 공간과 결과</strong>를 조율</p>
        </section>
        <section className={`w11-product-role${crew ? ' w11-active' : ''}`}>
          <h2><ReferenceLink to="Kiro Crew">Kiro Crew</ReferenceLink></h2>
          <p>여러 세션과 병렬 작업을<br /><strong>이어 가며 관리</strong></p>
        </section>
      </div>
    </div>

    <p className="w11-takeaway" style={reveal(crew, instant, 'translateY(6px)')} aria-hidden={!crew}>
      작업을 나누고, 진행을 보고, <strong>결과를 모아 판단합니다.</strong>
    </p>
  </div>;
}
