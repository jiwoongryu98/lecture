import { Heading, reveal, type SlideProps } from '../components/kit';
import './043.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "workflow-improve-usage",
  "title": "AI 활용 방법도 AI와 함께 개선합니다",
  "section": "2부 · 실무를 만나다",
  "maxStep": 2,
  "subsection": "활용의 개선"
} satisfies SlideMetadata;

const captions = [
  '“이 대화에서 반복한 일을 찾고, 더 나은 작업 방법을 제안해 줘.”',
  '반복한 작업은 도구로, 판단 기준은 Skill로 남길 수 있습니다.',
  '써본 결과를 다시 제공하고, 다음 작업 방법을 개선합니다.',
];

export default function Slide043({ step, instant }: SlideProps) {
  const propose = step >= 1;
  const improve = step >= 2;
  const phase = Math.max(0, Math.min(step, 2));

  return <div className="industry-content workflow-s16">
    <Heading eyebrow="활용 방법의 개선 / 대화에서 다음 도구로">AI 활용 방법도 AI와 함께 개선합니다</Heading>

    <div className="w16-visual">
      <svg viewBox="0 0 1100 380" role="img" aria-label={improve
        ? '내가 제공한 대화에서 반복을 찾고, 도구와 작업 지침을 제안해 사용한 뒤, 결과를 다음 작업에 반영하는 순환.'
        : propose
          ? '선택한 대화에서 반복되는 일을 찾아 도구나 Skill을 제안하고 써보는 흐름.'
          : '내가 제공한 대화의 요청과 수정, 작업 결과를 돌아보며 반복되는 작업과 판단 기준을 찾는다.'}>
        <defs>
          <marker id="workflow-s16-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto" overflow="visible">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.7" />
          </marker>
        </defs>

        <rect className="w16-conversation" x="45" y="61" width="310" height="258" rx="12" />
        <text className="w16-source-title" x="70" y="96">내가 제공한 대화</text>
        <text className="w16-source-detail" x="70" y="124">요청 · 수정 · 작업 결과</text>
        <path className="w16-rule" d="M70 143H330" />
        <text className="w16-request" x="70" y="184">반복해서 맡긴 일</text>
        <text className="w16-request-detail" x="70" y="213">어떤 도구를 썼나?</text>
        <text className="w16-request" x="70" y="260">되풀이한 수정</text>
        <text className="w16-request-detail" x="70" y="289">어떤 기준을 원했나?</text>

        <path className="w16-input" d="M355 118C463 118 511 78 724 78" markerEnd="url(#workflow-s16-arrow)" />
        <circle className="w16-find" cx="760" cy="78" r="25" />
        <path className="w16-find-icon" d="M763 80L773 90" />
        <circle className="w16-find-icon" cx="755" cy="74" r="9" />
        <text className="w16-node-title w16-blue" x="760" y="36" textAnchor="middle">반복 찾기</text>

        <text className="w16-center-title" x="760" y="183" textAnchor="middle">나의 AI 사용법</text>
        <text className="w16-center-detail" x="760" y="220" textAnchor="middle">{improve ? '다음 작업에 다시 반영' : propose ? '도구와 지침으로 개선' : '어떤 일을 반복하고 있나?'}</text>

        <g style={reveal(propose, instant, 'none')} aria-hidden={!propose}>
          <path className="w16-forward" d="M796 78C866 78 911 113 918 159" markerEnd="url(#workflow-s16-arrow)" />
          <circle className="w16-propose" cx="920" cy="195" r="25" />
          <path className="w16-propose-icon" d="M911 181H925L930 186V207H911ZM925 181V187H930M916 193H925M916 200H924" />
          <text className="w16-node-title w16-amber" x="960" y="188">
            <tspan x="960">도구·Skill</tspan>
            <tspan x="960" dy="32">제안</tspan>
          </text>

          <path className="w16-forward" d="M914 231C894 293 856 318 796 318" markerEnd="url(#workflow-s16-arrow)" />
          <circle className="w16-use" cx="760" cy="318" r="25" />
          <path className="w16-use-icon" d="M747 318L756 327L774 307" />
          <text className="w16-node-title w16-green" x="760" y="380" textAnchor="middle">써보고 확인</text>
        </g>

        <g style={reveal(improve, instant, 'none')} aria-hidden={!improve}>
          <path className="w16-return" d="M724 318C600 318 547 263 565 197C580 145 690 151 734 105" markerEnd="url(#workflow-s16-arrow)" />
        </g>
      </svg>
    </div>

    <div className="w16-footer">
      <p className="w16-caption">{captions[phase]}</p>
      <a className="w16-reference" href="https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md" target="_blank" rel="noreferrer">공개 사례 · Anthropic skill-creator ↗</a>
    </div>
  </div>;
}
