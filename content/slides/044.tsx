import { Heading, reveal, type SlideProps } from '../components/kit';
import './044.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-created-tool",
  "title": "새 작업 방법도 같은 과제로 비교합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "활용의 개선"
} satisfies SlideMetadata;

export default function Slide044({ step, instant }: SlideProps) {
  const compare = step >= 1;
  const improve = step >= 2;

  return <div className="industry-content workflow-s17">
    <Heading eyebrow="공개 사례 / Anthropic skill-creator">새 작업 방법도 같은 과제로 비교합니다</Heading>

    <div className="w17-composition">
      <div className="w17-input"><span>비교할 조건</span><strong>같은 요청 · 같은 자료</strong></div>
      <svg className="w17-fork" viewBox="0 0 1000 62" preserveAspectRatio="none" aria-hidden="true">
        <path d="M500 0V14Q500 27 487 27H250Q237 27 237 40V59M500 14Q500 27 513 27H750Q763 27 763 40V59" />
      </svg>
      <div className="w17-versions">
        <section className="w17-version w17-baseline" aria-label="기존 방법으로 수행한 기준 결과">
          <header><h2>기존 방법</h2><p>Skill 없이 또는 이전 버전으로</p></header>
          <div className="w17-output">
            <svg viewBox="0 0 80 96" aria-hidden="true"><path d="M13 5H51L68 22V90H13ZM51 5V22H68M26 39H55M26 52H55M26 65H49" /></svg>
            <p>기준 결과</p>
          </div>
        </section>
        <section className="w17-version w17-candidate" aria-label="새 Skill로 수행한 비교 결과">
          <header><h2>새 Skill</h2><p>바꾼 지침과 도구로</p></header>
          <div className="w17-output">
            <svg viewBox="0 0 80 96" aria-hidden="true"><path d="M13 5H51L68 22V90H13ZM51 5V22H68M26 39H55M26 52H55M26 65H49" /></svg>
            <p>비교할 결과</p>
          </div>
        </section>
      </div>
      <div className="w17-comparison" style={reveal(compare, instant, 'translateY(6px)')} aria-hidden={!compare}>
        <p>무엇이 달라졌나요?</p>
        <span>내용 · 형식</span><i aria-hidden="true" /><span>시간 · 비용</span>
      </div>
    </div>

    <div className="w17-footer">
      <p className="w17-takeaway" style={reveal(improve, instant, 'translateY(6px)')} aria-hidden={!improve}>반복한 코드는 <strong>도구로</strong>, 수정한 기준은 <strong>지침으로</strong> 남깁니다.</p>
      <a href="https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md" target="_blank" rel="noreferrer">Anthropic skill-creator · 비교와 개선 절차 요약 ↗</a>
    </div>
  </div>;
}
