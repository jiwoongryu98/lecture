import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './033.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-tool-definition",
  "title": "도구의 설명도 설계입니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 1,
  "subsection": "도구"
} satisfies SlideMetadata;

const definition = [
  ['목적', 'GitHub에서 관련 이슈 찾기'],
  ['입력', '검색어 · 저장소 · 페이지'],
  ['돌려주는 결과', '검색된 이슈 목록'],
  ['작업 범위', '조회만 수행 · 이슈 수정 없음'],
];

export default function Slide033({ step, instant }: SlideProps) {
  const defined = step >= 1;

  return <div className="industry-content workflow-s07">
    <Heading eyebrow="도구 / 사용할 수 있게 설명하기">도구의 설명도 설계입니다</Heading>

    <div className="w07-composition">
      <div className="w07-question">
        <p className="w07-question-label">AI가 알아야 할 것</p>
        <h2>언제 쓰고,<br />무엇을<br /><strong>받을까요?</strong></h2>
        <p className="w07-artifact-label"><ReferenceLink to="GitHub MCP">GitHub 공식 MCP 서버</ReferenceLink>의<br />이슈 검색 도구로 살펴봅니다.</p>
      </div>

      <ReferenceLink to="GitHub MCP" className="w07-manual" aria-label="GitHub 공식 MCP 서버의 이슈 검색 도구를 요약한 사용 설명">
        <header className="w07-manual-heading">
          <span className="w07-manual-mark" aria-hidden="true">&gt;_</span>
          <div><p>도구 사용 설명</p><h2>GitHub 이슈 검색</h2></div>
        </header>
        <code className="w07-command">search_issues</code>

        <div className="w07-definition-area">
          <div className="w07-undefined" style={reveal(!defined, instant, 'none')} aria-hidden={defined}>
            <p>이슈를 찾습니다.</p>
            <span /><span /><span />
          </div>

          <dl className="w07-definition" style={reveal(defined, instant, 'translateY(6px)')} aria-hidden={!defined}>
            {definition.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}
          </dl>
        </div>
      </ReferenceLink>
    </div>

    <p className="w07-takeaway" style={reveal(defined, instant, 'translateY(5px)')} aria-hidden={!defined}>
      명확한 설명이 <strong>도구를 고르고 사용하는 기준</strong>이 됩니다.
    </p>
  </div>;
}
