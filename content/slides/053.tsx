import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './053.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-contribution",
  "title": "어떻게 만들고 검증할지 구체화합니다",
  "section": "3부 · 커리어를 설계하다",
  "maxStep": 2,
  "subsection": "역할의 변화"
} satisfies SlideMetadata;

export default function Slide053({ step, instant }: SlideProps) {
  const showWork = step >= 1;
  const showTests = step >= 2;

  return <div className="industry-content career-s06">
    <Heading eyebrow="문제 정의에서 실행으로 / 기술 선택 · 작업 분해 · 테스트">어떻게 만들고 검증할지 구체화합니다</Heading>

    <div className="c06-composition">
      <section className="c06-plan" aria-label="정의한 문제를 바탕으로 작성할 실행 계획">
        <header className="c06-plan-header"><h2>실행 계획</h2><p>웹서비스 개발 도구는 선택 예시</p></header>

        <div className="c06-row c06-tools">
          <div className="c06-question"><p>기술 선택</p><h3>무엇으로 만들까?</h3></div>
          <div className="c06-answer">
            <p><ReferenceLink to="React">React</ReferenceLink> <span>화면</span><b>·</b><ReferenceLink to="FastAPI">FastAPI</ReferenceLink> <span>API</span></p>
            <p className="c06-detail">요구사항에 맞는 라이브러리·프레임워크와 선택 이유</p>
          </div>
        </div>

        <div className="c06-row c06-work" style={reveal(showWork, instant, 'translateY(6px)')} aria-hidden={!showWork}>
          <div className="c06-question"><p>작업 분해</p><h3>어떤 순서로 만들까?</h3></div>
          <div className="c06-answer">
            <p className="c06-flow">입력·화면 <span>→</span> 처리·API <span>→</span> 결과 표시</p>
            <p className="c06-detail">핵심 흐름부터 샘플로 연결</p>
          </div>
        </div>

        <div className="c06-row c06-tests" style={reveal(showTests, instant, 'translateY(6px)')} aria-hidden={!showTests}>
          <div className="c06-question"><p>테스트 설계</p><h3>어떻게 확인할까?</h3></div>
          <div className="c06-answer">
            <p><ReferenceLink to="Vitest">Vitest</ReferenceLink> <span>로직</span><b>·</b><ReferenceLink to="Playwright">Playwright</ReferenceLink> <span>사용자 흐름</span></p>
            <p className="c06-detail">정상·오류·예외 조건과 기대 결과 정의</p>
          </div>
        </div>
      </section>
    </div>

    <p className="c06-takeaway" style={reveal(showTests, instant, 'translateY(5px)')} aria-hidden={!showTests}>
      도구 선택부터 작업 순서와 테스트까지, <strong>AI와 함께 실행 계획을 구체화합니다.</strong>
    </p>
  </div>;
}
