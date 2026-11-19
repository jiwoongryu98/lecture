import { Heading, ReferenceLink, Takeaway, type SlideProps } from '../components/kit';
import './014.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-product-tech",
  "title": "AI 제품의 기술과 도구",
  "section": "1부 · 산업을 읽다",
  "maxStep": 0,
  "subsection": "제품"
} satisfies SlideMetadata;

const groups = [
  {
    role: '자료를 생성에 활용',
    kind: '방법',
    tools: [{ name: 'RAG', note: '검색한 자료를 답변 생성에 활용' }],
  },
  {
    role: '앱·에이전트 구성',
    kind: '프레임워크',
    tools: [
      { name: 'LangChain', note: '모델·도구·프롬프트 조합' },
      { name: 'LangGraph', note: '상태를 갖는 작업 흐름 구성' },
      { name: 'LlamaIndex', note: '문서·데이터를 AI 작업에 연결' },
    ],
  },
  {
    role: '관련 자료 검색',
    kind: '검색 소프트웨어',
    tools: [
      { name: 'pgvector', note: 'PostgreSQL에 벡터 검색 추가' },
      { name: 'Qdrant', note: '벡터 유사도 검색·조건 필터링' },
    ],
  },
  {
    role: '구조 검증·관찰',
    kind: '검증 라이브러리 · 관찰 도구',
    tools: [
      { name: 'Pydantic', note: '데이터의 형식·타입 검증' },
      { name: 'Langfuse', note: '실행 기록·비용·평가 관찰' },
    ],
  },
] as const;

export default function Slide014(_props: SlideProps) {
  return <div className="industry-content industry-s10">
    <Heading eyebrow="제품·활용 / 기술 찾아보기">제품을 구현하는 기술들</Heading>

    <div className="industry-visual s10-index" aria-label="AI 제품 개발에 쓰이는 방법과 소프트웨어의 역할별 예시">
      {groups.map(({ role, kind, tools }) => <section className="s10-group" key={role} aria-label={role}>
        <div className="s10-role">
          <p className="s10-kind">{kind}</p>
          <h2>{role}</h2>
        </div>
        <dl className="s10-tools">
          {tools.map(({ name, note }) => <div className="s10-tool" key={name}>
            <dt><ReferenceLink to={name}>{name}</ReferenceLink></dt>
            <dd>{note}</dd>
          </div>)}
        </dl>
      </section>)}
    </div>

    <Takeaway>제품에 필요한 <strong>자료 연결·작업 흐름·검색·검증</strong>의 역할에 맞춰 선택합니다.</Takeaway>
  </div>;
}
