import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './052.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-domain",
  "title": "문제를 정의하는 능력이 더 중요해집니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "역할의 변화"
} satisfies SlideMetadata;

export default function Slide052({ step, instant }: SlideProps) {
  const showDefinition = step >= 1;
  const showCriteria = step >= 2;

  return <div className="industry-content career-s05">
    <Heading eyebrow="역할의 변화 / 무엇을 풀 것인가" subtitle="실행이 쉬워질수록, 풀어야 할 문제를 정확히 정하는 일이 중요합니다.">문제를 정의하는 능력이 더 중요해집니다</Heading>

    <div className="c05-composition">
      <div className="c05-possibilities">
        <p className="c05-label">넓어진 실행 범위</p>
        <h2>AI로 무엇을<br />만들 수 있을까?</h2>
        <p className="c05-examples">코드 · 문서 · 화면 · 자동화</p>
      </div>

      <svg className="c05-arrow" viewBox="0 0 80 60" aria-hidden="true" style={reveal(showDefinition, instant, 'none')}>
        <path d="M7 30H69M53 14L69 30L53 46" />
      </svg>

      <div className="c05-answer">
        <ReferenceLink to="곡성 명대사" className="c05-meme" style={reveal(!showDefinition, instant, 'none')} aria-hidden={showDefinition}>
          <img src="/slides/052/what-matters-meme.jpg" width="300" height="171" alt="곡성에서 아버지를 바라보는 김환희" />
          <span>뭣이 중헌디?</span>
        </ReferenceLink>
        <section className="c05-definition" aria-label="문제 정의에서 답할 질문" style={reveal(showDefinition, instant, 'translateY(6px)')} aria-hidden={!showDefinition}>
          <header><p className="c05-label">무엇을 해결해야 할까?</p><h2>문제 정의</h2></header>
          <dl>
            <div><dt>대상과 불편</dt><dd>누가, 어떤 불편을 겪는가?</dd></div>
            <div><dt>원하는 변화</dt><dd>무엇이 달라져야 하는가?</dd></div>
            <div className="c05-criteria" style={reveal(showCriteria, instant, 'translateY(5px)')} aria-hidden={!showCriteria}><dt>확인 기준</dt><dd>어떤 결과로 확인할 것인가?</dd></div>
          </dl>
        </section>
      </div>
    </div>

    <p className="c05-takeaway" style={reveal(showCriteria, instant, 'translateY(6px)')} aria-hidden={!showCriteria}>
      AI와 실행할 방향을 정하는 역량, <strong>문제 정의 능력</strong>이 중요해집니다.
    </p>
  </div>;
}
