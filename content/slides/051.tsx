import { CareerDomainNav } from '../components/CareerDomainNav';
import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import type { SlideMetadata } from '../../shared/presentation';
import './051.css';

// Performance measurement background: https://docs.vllm.ai/en/latest/benchmarking/
// https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/
export const metadata = {
  id: 'career-infrastructure-experience',
  title: '인프라는 시스템을 이해하고 병목을 줄입니다',
  section: '3부 · 커리어를 설계하다',
  subsection: '영역별 역량',
  maxStep: 2,
} satisfies SlideMetadata;

export default function Slide051({ step, instant }: SlideProps) {
  return <div className="industry-content career-domain-slide career-infra-experience">
    <Heading eyebrow="영역별 역량 / AI 컴퓨팅·인프라">인프라는 시스템을 이해하고 병목을 줄입니다</Heading>
    <CareerDomainNav active="infra" />

    <div className="career-infra-layout">
      <section className="career-infra-question">
        <p className="career-domain-label">시스템을 보는 질문</p>
        <h2>시간은 어디에 쓰이고,<br />자원은 어떻게 움직일까?</h2>
        <div className="career-infra-observe">
          <svg viewBox="0 0 96 96" aria-hidden="true">
            <rect x="24" y="24" width="48" height="48" rx="5" />
            <path d="M36 24V12M48 24V12M60 24V12M36 72V84M48 72V84M60 72V84M24 36H12M24 48H12M24 60H12M72 36H84M72 48H84M72 60H84" />
            <path className="career-infra-chip-code" d="M42 39L33 48L42 57M54 39L63 48L54 57" />
          </svg>
          <p><strong>실행을 측정하고</strong><br />병목의 원인을 찾습니다.</p>
        </div>
        <p className="career-infra-condition" style={reveal(step >= 2, instant, 'none')} aria-hidden={step < 2}>측정 조건 명시 · 정확성 유지</p>
      </section>

      <section className="career-domain-foundation career-infra-skills" style={reveal(step >= 1, instant, 'translateY(8px)')} aria-hidden={step < 1}>
        <p className="career-domain-label">더 깊게 배울 기반</p>
        <h2>로우레벨·시스템 지식</h2>
        <ul>
          <li>C/C++ · <ReferenceLink to="CUDA">CUDA</ReferenceLink> · 컴파일러</li>
          <li>메모리 · 병렬 처리</li>
          <li>운영체제 · 네트워크 · 분산 시스템</li>
          <li>컴퓨터 구조 · 반도체 설계</li>
        </ul>
      </section>
    </div>

    <div className="career-domain-evidence" style={reveal(step >= 2, instant, 'translateY(6px)')} aria-hidden={step < 2}>
      <span>역량을 보여 줄 경험</span><p>병목 분석 · <strong>개선 전후 측정</strong> · 테스트 기록</p>
    </div>
  </div>;
}
