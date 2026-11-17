import { Heading, reveal, type SlideProps } from '../components/kit';
import './053.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-portfolio",
  "title": "포트폴리오에 문제·실행·검증을 담습니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "포트폴리오"
} satisfies SlideMetadata;

export default function Slide053({ step, instant }: SlideProps) {
  return <div className="industry-content career-s03">
    <Heading eyebrow="포트폴리오 / 앞에서 배운 역량을 한눈에">포트폴리오에 문제·실행·검증을 담습니다</Heading>
    <div className="c03-composition">
      <svg viewBox="0 0 1100 390" role="img" aria-label="포트폴리오에 문제 정의, 실행 설계, 검증 근거를 연결하고, 자신이 맡은 일과 결과를 보여 준다.">
        <rect className="c03-paper-back" x="403" y="32" width="294" height="153" rx="9" transform="rotate(4 550 110)" />
        <rect className="c03-paper" x="400" y="24" width="300" height="153" rx="9" />
        <path className="c03-paper-line" d="M400 58H700" />
        <circle className="c03-dot" cx="421" cy="41" r="3" /><circle className="c03-dot" cx="434" cy="41" r="3" /><circle className="c03-dot" cx="447" cy="41" r="3" />
        <text className="c03-output" x="550" y="109" textAnchor="middle">포트폴리오</text>
        <text className="c03-output-detail" x="550" y="145" textAnchor="middle">내가 맡은 일과 결과</text>
        <g style={reveal(step >= 1, instant, 'none')} aria-hidden={step < 1}>
          <path className="c03-branch" d="M550 188V216M190 251V229Q190 216 203 216H550M550 216V251M550 216H897Q910 216 910 229V251" />
          <circle className="c03-blue-dot" cx="190" cy="256" r="5" />
          <circle className="c03-green-dot" cx="550" cy="256" r="5" />
          <text className="c03-label c03-blue" x="190" y="304" textAnchor="middle">문제 정의</text>
          <text className="c03-detail" x="190" y="342" textAnchor="middle">왜 이 문제를 골랐나?</text>
          <text className="c03-label c03-green" x="550" y="304" textAnchor="middle">실행 설계</text>
          <text className="c03-detail" x="550" y="342" textAnchor="middle">어떤 도구·방법을 썼나?</text>
          <circle className="c03-amber-dot" cx="910" cy="256" r="5" />
          <text className="c03-label c03-amber" x="910" y="304" textAnchor="middle">검증 근거</text>
          <text className="c03-detail" x="910" y="342" textAnchor="middle">무엇으로 확인했나?</text>
        </g>
      </svg>
    </div>
    <p className="c03-takeaway" style={reveal(step >= 2, instant, 'translateY(5px)')} aria-hidden={step < 2}>작업 중 남긴 <strong>선택 이유 · 내 역할 · 확인 자료</strong>를 결과물과 함께 보여줍니다.</p>
  </div>;
}
