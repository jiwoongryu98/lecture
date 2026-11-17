import './001.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "welcome",
  "title": "AI 에이전트 시대의 커리어",
  "section": "들어가며",
  "maxStep": 0,
  "subsection": ""
} satisfies SlideMetadata;

const topics = [
  ['산업을 읽다', 'AI 산업은 어디로 향하고 있을까'],
  ['실무를 만나다', '현장에서 문제를 해결하는 과정'],
  ['경험을 연결하다', '나의 전문성에서 시작하는 커리어'],
];

export default function Slide001() { return <div className="slide-body">
        <div className="introduction"><p className="section-label">AI INDUSTRY · PRACTICE · CAREERS</p>
          <h1 id="slide-title">AI 에이전트 시대,<br />나의 경험을<br /><span>어디에 연결할까?</span></h1>
          <p className="slide-description">산업과 실무의 변화 속에서<br />나만의 다음 커리어를 찾는 시간</p></div>
        <ol className="topics" aria-label="오늘의 세 가지 이야기">{topics.map(([title, description], i) => <li className="topic" key={title}>
          <span className="topic-number">0{i + 1}</span><div><h2>{title}</h2><p>{description}</p></div>
        </li>)}</ol>
      </div>; }
