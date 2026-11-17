import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './035.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-skills",
  "title": "반복할 작업 방법은 Skill로 남깁니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "작업 지침"
} satisfies SlideMetadata;

const procedure = [
  '기존 서식과 수식 유지',
  '계산은 수식으로 남기기',
  '재계산하고 오류 확인',
];

export default function Slide035({ step, instant }: SlideProps) {
  const showProcedure = step >= 1;
  const showTools = step >= 2;

  return <div className="industry-content workflow-s09">
    <Heading eyebrow="작업 방법 / Skill">반복할 작업 방법은 Skill로 남깁니다</Heading>

    <div className="w09-composition">
      <div className="w09-notebook" aria-label="Anthropic의 공개 xlsx Skill을 요약한 스프레드시트 작업 지침서">
        <section className="w09-identity-page">
          <p className="w09-file-label"><ReferenceLink to="xlsx Skill">SKILL.md</ReferenceLink></p>
          <h2>스프레드시트 작업</h2>
          <p className="w09-skill-name"><ReferenceLink to="xlsx Skill">xlsx · Anthropic</ReferenceLink></p>
          <div className="w09-trigger">
            <p className="w09-small-label">언제 사용할까?</p>
            <p>Excel 파일을<br />만들거나 수정할 때</p>
          </div>
          <div className="w09-tool-reference" style={reveal(showTools, instant, 'translateY(6px)')} aria-hidden={!showTools}>
            <p className="w09-small-label">함께 쓰는 도구</p>
            <code><ReferenceLink to="xlsx 재계산 도구">scripts/recalc.py</ReferenceLink></code>
          </div>
        </section>

        <section className="w09-procedure-page">
          <p className="w09-procedure-label">어떤 순서와 기준으로 할까?</p>
          <ol style={reveal(showProcedure, instant, 'perspective(700px) rotateY(-5deg)')} aria-hidden={!showProcedure}>
            {procedure.map((item, index) => <li key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p>
            </li>)}
          </ol>
          <p className="w09-reference" style={reveal(showProcedure, instant, 'none')} aria-hidden={!showProcedure}>
            사용자의 요구와 원본의 형식에 맞추기
          </p>
        </section>
      </div>
      <p className="w09-artifact-caption"><ReferenceLink to="xlsx Skill">Anthropic 공개 xlsx Skill · 작업 기준 요약</ReferenceLink></p>
    </div>

    <p className="w09-takeaway" style={reveal(showTools, instant, 'translateY(6px)')} aria-hidden={!showTools}>
      지침과 참고 자료를 남겨, <strong>다음 작업에서도 같은 방법을 활용합니다.</strong>
    </p>
  </div>;
}
