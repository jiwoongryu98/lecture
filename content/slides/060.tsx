import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './060.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-latex",
  "title": "AI와 문서를 만들고, 출력까지 확인합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "이력서"
} satisfies SlideMetadata;

const introduction = `\\section*{소개}
사용자 문제를 정리하고,
샘플로 아이디어를 확인합니다.`;
const project = `\\section*{프로젝트}
\\textbf{도서 검색 화면 개선}\\par
검색 흐름을 정리하고
화면 샘플을 제작했습니다.`;

export default function Slide060({ step, instant }: SlideProps) {
  const focusProject = step >= 1;
  const verify = step >= 2;
  const transition = instant ? 'none' : 'background-color 320ms ease, border-color 320ms ease';

  return <div className="industry-content career-s13">
    <Heading eyebrow="이력서 작성 / LaTeX 원본과 PDF">AI와 문서를 만들고, 출력까지 확인합니다</Heading>
    <div className="c13-workbench">
      <section className="c13-source">
        <p className="c13-section-label">AI와 수정하는 원본</p>
        <div className="c13-source-page">
          <p className="c13-file-label">sample-resume.tex · 본문 발췌</p>
          <pre><code>{introduction}</code></pre>
          <pre className="c13-project-code" style={{ transition, backgroundColor: focusProject ? '#e4f0e8' : 'transparent', borderColor: focusProject ? '#8bb19a' : 'transparent' }}><code>{project}</code></pre>
        </div>
        <p className="c13-source-explanation"><ReferenceLink to="LaTeX">LaTeX</ReferenceLink>: 글과 서식을 코드로 작성</p>
        <p className="c13-instruction" style={reveal(focusProject, instant, 'translateY(5px)')} aria-hidden={!focusProject}>“프로젝트 설명과 서식을 다듬어 주세요.”</p>
      </section>
      <figure className="c13-output">
        <figcaption className="c13-section-label">직접 확인하는 출력</figcaption>
        <div className="c13-pdf-crop">
          <img src="/slides/060/sample-resume.png" width="1012" height="1432" alt="예시용 가상 이력서. 김민수라는 가상 인물의 서비스 기획 소개, 도서 검색 화면 개선 프로젝트, 활용 도구와 학습 항목을 LaTeX로 실제 출력한 PDF." />
          <div className="c13-project-highlight" style={reveal(focusProject, instant, 'none')} aria-hidden="true" />
        </div>
        <p className="c13-output-caption">예시용 가상 이력서 · 실제 PDF의 위쪽 부분</p>
      </figure>
    </div>
    <footer className="c13-footer">
      <p style={reveal(verify, instant, 'translateY(5px)')} aria-hidden={!verify}><strong>사실 · 줄바꿈 · 텍스트 복사</strong>까지 확인합니다.</p>
      <nav aria-label="가상 이력서 예제 파일">
        <a href="/slides/060/sample-resume.tex" target="_blank" rel="noreferrer">LaTeX 원본 ↗</a>
        <a href="/slides/060/sample-resume.pdf" target="_blank" rel="noreferrer">PDF ↗</a>
      </nav>
    </footer>
  </div>;
}
