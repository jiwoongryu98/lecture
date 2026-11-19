import { Heading } from '../components/kit';
import type { SlideMetadata } from '../../shared/presentation';
import './004.css';

export const metadata = {
  id: 'lecture-agenda',
  title: '오늘의 세 가지 이야기',
  section: '들어가며',
  subsection: '목차',
  maxStep: 0,
} satisfies SlideMetadata;

const sessions = [
  { title: '산업을 읽다', detail: 'AI 제품·활용, 모델, 인프라의 큰 그림' },
  { title: '실무를 만나다', detail: 'AI 도구로 실행하고, 결과를 검증하는 방법' },
  { title: '커리어를 설계하다', detail: '필요한 역량부터 포트폴리오와 취업 준비까지' },
];

export default function Slide004() {
  return <div className="industry-content lecture-agenda">
    <Heading eyebrow="오늘의 흐름">오늘의 세 가지 이야기</Heading>
    <ol className="agenda-sessions" aria-label="강의 목차">
      {sessions.map(({ title, detail }, index) => <li key={title}>
        <span className="agenda-session-number">{index + 1}부</span>
        <h2>{title}</h2>
        <p>{detail}</p>
      </li>)}
    </ol>
    <p className="agenda-pacing">각 세션 <strong>45분 발표 · 15분 Q&amp;A 및 휴식</strong></p>
  </div>;
}
