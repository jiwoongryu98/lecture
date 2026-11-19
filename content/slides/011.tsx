import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './011.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-ax",
  "title": "왜 FDE가 주목받을까?",
  "section": "1부 · 산업을 읽다",
  "maxStep": 2,
  "subsection": "제품"
} satisfies SlideMetadata;

export default function Slide011({ step, instant }: SlideProps) {
  const building = step >= 1;
  const interpretation = step >= 2;

  return <div className="industry-content industry-s08" data-instant={instant}>
    <Heading eyebrow="제품·활용 / 산업 변화 · FDE" subtitle="Forward Deployed Engineer · 고객과 함께 문제를 풀고 시스템을 만드는 엔지니어">
      왜 FDE가 주목받을까요?
    </Heading>

    <figure className="s08-role-map">
      <svg viewBox="0 0 1000 300" role="group" aria-label="고객의 업무와 AI·소프트웨어를 연결하는 FDE의 역할 개념도. 문제와 업무 이해, 구현과 시스템 연결, 평가와 배포를 함께 다룬다.">
        <defs>
          <marker id="s08-role-arrow" viewBox="0 0 8 8" refX="6.8" refY="4" markerWidth="6" markerHeight="6" orient="auto" overflow="visible">
            <path d="M1 1L7 4L1 7" fill="none" stroke="context-stroke" strokeWidth="1.5" />
          </marker>
        </defs>

        <path className="s08-ground-link" d="M200 159H800" />
        <ellipse className="s08-context-ground" cx="120" cy="174" rx="112" ry="77" />
        <ellipse className="s08-tech-ground" cx="880" cy="174" rx="112" ry="77" />

        <g className="s08-customer-building" transform="translate(65 92)" aria-hidden="true">
          <path d="M0 118V32L55 6L110 32V118ZM41 118V86H69V118" />
          <path d="M22 47H37M73 47H88M22 67H37M73 67H88" />
          <path d="M-13 118H123" />
        </g>
        <text className="s08-end-title" x="120" y="263" textAnchor="middle">고객의 현장</text>
        <text className="s08-end-detail" x="120" y="288" textAnchor="middle">자료·업무·성공 기준</text>

        <g className="s08-running-system" transform="translate(821 112)" aria-hidden="true">
          <rect width="118" height="77" rx="7" />
          <path d="M0 17H118M12 9H16M22 9H26M48 77V92M70 77V92M33 94H85M16 34L25 42L16 50M35 50H58M17 62H98" />
        </g>
        <text className="s08-end-title" x="880" y="263" textAnchor="middle">AI·소프트웨어</text>
        <text className="s08-end-detail" x="880" y="288" textAnchor="middle">모델·도구·기존 시스템</text>

        <g style={reveal(building, instant, 'none')} aria-hidden={!building}>
          <path className="s08-connection" d="M220 159H392" markerEnd="url(#s08-role-arrow)" />
          <path className="s08-connection" d="M596 159H780" markerEnd="url(#s08-role-arrow)" />
          <path className="s08-feedback" d="M774 192C693 247 309 247 228 192" markerEnd="url(#s08-role-arrow)" />
          <text className="s08-role-label" x="296" y="64" textAnchor="middle">문제·업무 이해</text>
          <path className="s08-role-leader" d="M296 77V134" />
          <text className="s08-role-label" x="704" y="64" textAnchor="middle">평가·배포</text>
          <path className="s08-role-leader" d="M704 77V134" />
          <text className="s08-role-label" x="500" y="282" textAnchor="middle">구현·시스템 연결</text>
        </g>

        <circle className="s08-fde-halo" cx="500" cy="159" r="97" />
        <circle className="s08-fde-core" cx="500" cy="159" r="79" />
        <ReferenceLink to="OpenAI FDE"><text className="s08-fde-name" x="500" y="156" textAnchor="middle">FDE</text></ReferenceLink>
        <text className="s08-fde-action" x="500" y="188" textAnchor="middle">직접 만들고 검증</text>
      </svg>
      <figcaption>OpenAI의 공개 역할 설명을 바탕으로 정리한 개념도</figcaption>
    </figure>

    <aside className="s08-evidence" style={reveal(interpretation, instant)} aria-hidden={!interpretation}>
      <div><span>공개된 움직임</span><strong><ReferenceLink to="OpenAI FDE">OpenAI</ReferenceLink></strong></div>
      <p><strong><ReferenceLink to="OpenAI Deployment Company">2026.05.11 · Deployment Company 출범 발표</ReferenceLink></strong><span>기업 현장의 AI 시스템 구현·배포 지원</span></p>
    </aside>

    <div className="s08-viewpoint" style={reveal(interpretation, instant)} aria-hidden={!interpretation}>
      <span>발표자의 해석</span>
      <p>문제 이해와 <strong>구현·검증을 연결하는 역량</strong>이 중요해집니다.</p>
    </div>
  </div>;
}
