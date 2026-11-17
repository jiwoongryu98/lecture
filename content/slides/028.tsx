import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './028.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-work-cycle",
  "title": "요청하고, 확인하고, 다시 다듬기",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "작업 환경"
} satisfies SlideMetadata;

const stages = ['요청하기', '확인하기', '다듬기'];
const observations = [
  '원하는 결과와 작업 범위를 전달합니다.',
  '완성됐다는 설명보다, 실제 동작을 봅니다.',
  '구체적인 피드백이 다음 요청이 됩니다.',
];

export default function Slide028({ step, instant }: SlideProps) {
  const phase = Math.max(0, Math.min(step, 2));

  return <div className="industry-content workflow-s02" data-phase={phase} data-instant={instant}>
    <Heading eyebrow="AI와 함께 일하기 / Google 공식 튜토리얼 사례">요청하고, 확인하고, 다시 다듬습니다</Heading>

    <div className="s02-composition">
      <figure className="s02-artifact">
        <figcaption><ReferenceLink to="Antigravity 튜토리얼">
          <img src="/slides/028/antigravity-icon.png" alt="Google Antigravity 공식 아이콘" width="48" height="48" />
          Google Antigravity
        </ReferenceLink><span>할 일 앱 · 화면 도식</span></figcaption>
        <div className="s02-app" role="img" aria-label={`공식 튜토리얼의 할 일 앱 흐름을 재구성한 도식. ${phase === 2 ? '피드백에 따라 파란 테마가 주황 테마로 바뀝니다.' : '할 일의 추가, 수정, 삭제를 확인합니다.'}`}>
          <div className="s02-window-bar"><i /><i /><i /><span>TODO APP</span></div>
          <div className="s02-app-banner"><h2>할 일</h2><span>해야 할 일을 한곳에</span></div>
          <div className="s02-app-body">
            <div className="s02-add-row"><span>새 할 일</span><b>＋ 추가</b></div>
            {['할 일 1', '할 일 2'].map((task) => <div className="s02-task" key={task}>
              <span className="s02-task-name"><i />{task}</span>
              <span className="s02-task-actions"><span>수정</span><span>삭제</span></span>
            </div>)}
          </div>
        </div>
        <p className="s02-diagram-credit">공식 튜토리얼의 요청·확인·피드백 흐름을 재구성</p>
      </figure>

      <div className="s02-explanation">
        <ol className="s02-progress" aria-label="현재 작업 단계">
          {stages.map((stage, index) => <li key={stage} aria-current={phase === index ? 'step' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>{stage}
          </li>)}
        </ol>
        <div className="s02-stage-stack">
          <section className="s02-stage" style={reveal(phase === 0, instant, 'translateY(6px)')} aria-hidden={phase !== 0}>
            <p className="s02-stage-label">원하는 결과를 설명합니다</p>
            <blockquote>추가·수정·삭제할 수 있는<br />간단한 할 일 앱을 만들어 주세요.</blockquote>
            <p className="s02-stage-detail">목표와 범위를 먼저 전달합니다.</p>
          </section>
          <section className="s02-stage" style={reveal(phase === 1, instant, 'translateY(6px)')} aria-hidden={phase !== 1}>
            <p className="s02-stage-label">실행한 결과를 확인합니다</p>
            <h2>화면과 동작을<br />함께 확인</h2>
            <p className="s02-stage-detail">할 일 추가 · 내용 수정 · 삭제<br />브라우저에서 직접 실행해 봅니다.</p>
            <ReferenceLink to="Antigravity 튜토리얼" className="s02-record-link">공식 예제의 작업 기록 보기 ↗</ReferenceLink>
          </section>
          <section className="s02-stage" style={reveal(phase === 2, instant, 'translateY(6px)')} aria-hidden={phase !== 2}>
            <p className="s02-stage-label">화면에 의견을 남깁니다</p>
            <blockquote>파란색 테마를<br />주황색으로 바꿔 주세요.</blockquote>
            <div className="s02-theme-change" aria-label="파란색에서 주황색으로 테마 변경">
              <span className="s02-theme-blue" /><svg viewBox="0 0 42 16" aria-hidden="true"><path d="M1 8H39M32 1L39 8L32 15" /></svg><span className="s02-theme-orange" />
              <p>수정 후 다시 확인</p>
            </div>
          </section>
        </div>
      </div>
    </div>
    <div className="s02-observation">
      <svg viewBox="0 0 28 28" aria-hidden="true" style={reveal(phase === 2, instant, 'none')}><path d="M23 11A10 10 0 1 0 22 21M23 4V11H16" /></svg>
      {observations.map((observation, index) => <p key={observation}
        style={reveal(phase === index, instant, 'translateY(5px)')} aria-hidden={phase !== index}>{observation}</p>)}
    </div>
  </div>;
}
