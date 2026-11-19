import { CareerDomainNav } from '../components/CareerDomainNav';
import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import type { SlideMetadata } from '../../shared/presentation';
import './051.css';

// Training/evaluation background: https://huggingface.co/docs/transformers/training
// https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html
export const metadata = {
  id: 'career-model-experience',
  title: '모델은 실험으로 개선을 입증합니다',
  section: '3부 · 커리어를 설계하다',
  subsection: '영역별 역량',
  maxStep: 2,
} satisfies SlideMetadata;

export default function Slide051({ step, instant }: SlideProps) {
  return <div className="industry-content career-domain-slide career-model-experience">
    <Heading eyebrow="영역별 역량 / AI 모델 개발">모델은 실험으로 개선을 입증합니다</Heading>
    <CareerDomainNav active="model" />

    <div className="career-model-layout">
      <div className="career-model-experiment">
        <p className="career-model-data">같은 평가 데이터<span>학습 데이터와 분리</span></p>
        <svg className="career-model-fork" viewBox="0 0 600 58" aria-hidden="true"><path d="M300 1V22H145V51M300 22H455V51M137 43L145 51L153 43M447 43L455 51L463 43" /></svg>
        <div className="career-model-pair">
          <section><p>비교의 출발점</p><h2>기준 모델</h2></section>
          <section><p>가설을 반영</p><h2>변경 모델</h2></section>
        </div>
        <svg className="career-model-join" viewBox="0 0 600 48" aria-hidden="true"><path d="M145 1V20H300M455 1V20H300V42M292 34L300 42L308 34" /></svg>
        <p className="career-model-question">무엇이 좋아졌고,<br /><strong>어디서 틀렸나?</strong></p>
      </div>

      <section className="career-domain-foundation" style={reveal(step >= 1, instant, 'translateY(8px)')} aria-hidden={step < 1}>
        <p className="career-domain-label">더 깊게 배울 기반</p>
        <h2>머신러닝·통계<br />+ 연구·실험 역량</h2>
        <ul>
          <li>데이터 분석 · 품질 관리</li>
          <li>학습 · 평가 · 오류 분석</li>
          <li>논문 이해 · 가설 검증</li>
        </ul>
        <p className="career-model-tools"><ReferenceLink to="PyTorch">PyTorch</ReferenceLink> · <ReferenceLink to="Hugging Face Transformers">Hugging Face Transformers</ReferenceLink></p>
      </section>
    </div>

    <div className="career-domain-evidence" style={reveal(step >= 2, instant, 'translateY(6px)')} aria-hidden={step < 2}>
      <span>역량을 보여 줄 경험</span><p>기준 모델 비교 · 실패 분석 · <strong>재현 가능한 실험</strong></p>
    </div>
  </div>;
}
