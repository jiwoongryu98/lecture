import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './055.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-open-source-flow",
  "title": "오픈소스 기여는 리뷰를 거쳐 완성됩니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "오픈소스"
} satisfies SlideMetadata;

export default function Slide055({ step, instant }: SlideProps) {
  const showPR = step >= 1;
  const showFeedback = step >= 2;

  return <div className="industry-content career-contribution-flow">
    <Heading eyebrow="오픈소스 커뮤니티 / 기여의 전체 흐름" subtitle="PR(Pull Request): 프로젝트에 변경을 제안하는 요청">오픈소스 기여는 리뷰를 거쳐 완성됩니다</Heading>

    <div className="oss-flow-composition">
      <svg viewBox="0 0 1100 390" role="group" aria-label="기여 가이드 확인, 이슈 확인 또는 등록, 구현과 충분한 테스트 및 결과 기록, PR 공개, 커뮤니티 리뷰 요청, 코멘트 반영과 재테스트를 거쳐 승인까지 이어지는 흐름">
        <defs>
          <marker id="oss-contribution-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.8" />
          </marker>
        </defs>

        <g className="oss-flow-preparation">
          <text className="oss-flow-phase" x="42" y="35">준비</text>
          <path className="oss-flow-rail" d="M62 110V270" />
          <circle className="oss-flow-number-bg" cx="62" cy="90" r="21" />
          <text className="oss-flow-number" x="62" y="98" textAnchor="middle">1</text>
          <ReferenceLink to="vLLM 기여 안내"><text className="oss-flow-title" x="104" y="99">기여 가이드 확인</text></ReferenceLink>
          <text className="oss-flow-detail" x="104" y="132">CONTRIBUTING · 개발 규칙</text>

          <circle className="oss-flow-number-bg" cx="62" cy="190" r="21" />
          <text className="oss-flow-number" x="62" y="198" textAnchor="middle">2</text>
          <ReferenceLink to="vLLM 이슈"><text className="oss-flow-title" x="104" y="199">이슈 확인·등록</text></ReferenceLink>
          <text className="oss-flow-detail" x="104" y="232">기존 이슈 · 발견한 문제 제안</text>

          <circle className="oss-flow-number-bg" cx="62" cy="290" r="21" />
          <text className="oss-flow-number" x="62" y="298" textAnchor="middle">3</text>
          <text className="oss-flow-title" x="104" y="299">구현·충분한 테스트</text>
          <text className="oss-flow-detail" x="104" y="332">테스트 결과도 기록</text>
        </g>

        <g className="oss-flow-publish" style={reveal(showPR, instant, 'none')} aria-hidden={!showPR}>
          <path className="oss-flow-forward" d="M402 194H452" markerEnd="url(#oss-contribution-arrow)" />
          <ReferenceLink to="GitHub PR 만들기"><text className="oss-flow-title oss-flow-green" x="571" y="75" textAnchor="middle">4. PR 공개</text></ReferenceLink>
          <rect className="oss-flow-paper" x="472" y="110" width="198" height="168" rx="9" />
          <path className="oss-flow-paper-rule" d="M472 141H670" />
          <circle className="oss-flow-paper-dot" cx="489" cy="126" r="3" /><circle className="oss-flow-paper-dot" cx="501" cy="126" r="3" /><circle className="oss-flow-paper-dot" cx="513" cy="126" r="3" />
          <text className="oss-flow-pr" x="571" y="203" textAnchor="middle">PR</text>
          <path className="oss-flow-paper-ink" d="M513 230H629M513 248H603" />
          <text className="oss-flow-detail" x="571" y="317" textAnchor="middle">변경 내용 · 테스트 결과</text>

          <path className="oss-flow-forward" d="M681 194H724Q748 194 748 170V129Q748 105 772 105H779" markerEnd="url(#oss-contribution-arrow)" />
          <circle className="oss-flow-number-bg oss-flow-review-number" cx="800" cy="105" r="19" />
          <text className="oss-flow-number" x="800" y="113" textAnchor="middle">5</text>
          <text className="oss-flow-title" x="835" y="114">리뷰 요청</text>
          <ReferenceLink to="vLLM Slack"><text className="oss-flow-detail" x="835" y="148">Slack</text></ReferenceLink>
          <text className="oss-flow-detail" x="889" y="148">·</text>
          <ReferenceLink to="Discord"><text className="oss-flow-detail" x="905" y="148">Discord</text></ReferenceLink>
          <text className="oss-flow-detail" x="994" y="148">등</text>
          <text className="oss-flow-small" x="835" y="177">안내된 채널에 PR 링크 공유</text>
        </g>

        <g className="oss-flow-feedback" style={reveal(showFeedback, instant, 'none')} aria-hidden={!showFeedback}>
          <path className="oss-flow-forward" d="M800 124V252" markerEnd="url(#oss-contribution-arrow)" />
          <circle className="oss-flow-number-bg oss-flow-review-number" cx="800" cy="275" r="19" />
          <text className="oss-flow-number" x="800" y="283" textAnchor="middle">6</text>
          <ReferenceLink to="GitHub PR 리뷰"><text className="oss-flow-title" x="835" y="284">코멘트 반영</text></ReferenceLink>
          <text className="oss-flow-detail" x="835" y="318">수정 · 재테스트</text>
          <text className="oss-flow-approval" x="835" y="352">승인까지 반복</text>
          <path className="oss-flow-return" d="M800 294V359Q800 375 816 375H1059Q1075 375 1075 359V66Q1075 50 1059 50H816Q800 50 800 66V82" markerEnd="url(#oss-contribution-arrow)" />
        </g>
      </svg>
    </div>

    <footer className="oss-flow-footer">
      <p style={reveal(showFeedback, instant, 'translateY(5px)')} aria-hidden={!showFeedback}>테스트 결과와 리뷰 기록이 <strong>기여의 근거</strong>가 됩니다.</p>
      <ReferenceLink to="vLLM 기여 안내">공식 기여 안내 ↗</ReferenceLink>
    </footer>
  </div>;
}
