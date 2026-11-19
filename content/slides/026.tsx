import { Heading, reveal, type SlideProps } from '../components/kit';
import { SectorMap } from './006';
import './026.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-your-place",
  "title": "내 경험은 지도 어디에 연결될까?",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "연결"
} satisfies SlideMetadata;

const questions = [
  { label: '경험에서 문제로', first: '내가 잘 아는', second: '문제는 무엇인가요?', detail: '반복해서 마주친 실제 문제 하나를 떠올려 보세요.' },
  { label: '문제에서 기여로', first: '그 문제에', second: '어떻게 기여할까요?', detail: '문제 정의 · 데이터 · 검증 · 운영에서 내가 할 일을 찾습니다.' },
  { label: '기여에서 실험으로', first: '작은 실험으로', second: '무엇을 확인할까요?', detail: '확인할 가설 하나와 결과를 판단할 기준을 정합니다.' },
];

export default function Slide026({ step, instant }: SlideProps) {
  const phase = Math.max(0, Math.min(step, 2));

  return <div className="industry-content industry-s22" data-instant={instant}>
    <Heading eyebrow="지도 복습 · 나의 연결점">내 경험은 지도 어디에 연결될까?</Heading>

    <div className="s22-composition">
      <div className="s22-map-area">
        <div className="s22-map"><SectorMap step={2} instant={instant} /></div>
        <div className="s22-contributions" style={reveal(phase >= 1, instant)} aria-hidden={phase < 1}>
          <p><span className="s22-product-dot" />문제·사용성</p>
          <p><span className="s22-model-dot" />데이터·평가</p>
          <p><span className="s22-infra-dot" />실행·효율</p>
        </div>
      </div>

      <div className="s22-hinge" aria-hidden="true"><span /><b>→</b></div>

      <div className="s22-question-area">
        <div className="s22-progress" aria-hidden="true">
          {questions.map((question, index) => <span key={question.label} className={index === phase ? 's22-current' : index < phase ? 's22-past' : ''} />)}
        </div>
        {questions.map((question, index) => <section className="s22-question" key={question.label}
          style={reveal(index === phase, instant, 'translateY(12px)')} aria-hidden={index !== phase}>
          <p className="s22-question-label">{question.label}</p>
          <h2>{question.first}<br /><strong>{question.second}</strong></h2>
          <p className="s22-question-detail">{question.detail}</p>
        </section>)}
      </div>
    </div>

    <div className="s22-next" style={reveal(phase === 2, instant)} aria-hidden={phase !== 2}>
      <p><span>2부에서 이어갈 질문</span><strong>AI와 함께, 샘플부터 만들어 본다면?</strong></p>
      <span className="s22-next-arrow" aria-hidden="true">↗</span>
    </div>
  </div>;
}
