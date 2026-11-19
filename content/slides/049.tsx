import { CareerDomainNav } from '../components/CareerDomainNav';
import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import type { SlideMetadata } from '../../shared/presentation';
import './049.css';

export const metadata = {
  id: 'career-product-experience',
  title: '제품은 사용자의 문제를 끝까지 해결합니다',
  section: '3부 · 커리어를 설계하다',
  subsection: '영역별 역량',
  maxStep: 2,
} satisfies SlideMetadata;

export default function Slide049({ step, instant }: SlideProps) {
  return <div className="industry-content career-domain-slide career-product-experience">
    <Heading eyebrow="영역별 역량 / 하고 싶은 일에 따라, 준비할 경험도 다릅니다">제품은 사용자의 문제를 끝까지 해결합니다</Heading>
    <CareerDomainNav active="product" />

    <div className="career-product-layout">
      <div className="career-product-loop" aria-label="사용자의 업무에 AI 기능을 연결하고, 피드백으로 개선하는 과정">
        <div className="career-product-user">
          <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" /><circle className="person" cx="50" cy="36" r="12" /><path className="person" d="M25 73C25 48 75 48 75 73" /></svg>
          <h2>사용자</h2>
          <p>어떤 일이 불편한가?</p>
        </div>
        <svg className="career-product-connect" viewBox="0 0 70 36" aria-hidden="true"><path d="M3 18H62M51 7L62 18L51 29" /></svg>
        <div className="career-product-service">
          <div className="career-product-window" aria-hidden="true"><i /><i /><i /></div>
          <p className="career-product-service-label">실제로 쓰는 서비스</p>
          <h2>AI 기능 + 기존 시스템</h2>
          <div className="career-product-workflow"><span>입력</span><span aria-hidden="true">→</span><span>처리</span><span aria-hidden="true">→</span><span>확인</span></div>
          <p className="career-product-underneath">데이터 · 권한 · 오류 처리</p>
        </div>
        <div className="career-product-feedback" style={reveal(step >= 1, instant, 'none')} aria-hidden={step < 1}>
          <svg viewBox="0 0 600 78" aria-hidden="true"><path d="M408 3V40Q408 60 388 60H88Q68 60 68 40V5M58 15L68 5L78 15" /></svg>
          <p>사용 피드백 → 개선</p>
        </div>
      </div>

      <section className="career-domain-foundation" style={reveal(step >= 1, instant, 'translateY(8px)')} aria-hidden={step < 1}>
        <p className="career-domain-label">더 깊게 배울 기반</p>
        <h2>제품 감각<br />+ 소프트웨어 기본기</h2>
        <ul>
          <li>사용자 · 업무 흐름</li>
          <li>API · 데이터 · 권한</li>
          <li>테스트 · 배포 · 운영</li>
        </ul>
        <p className="career-product-example">1부의 사례 <ReferenceLink to="Zoom AI Companion">Zoom AI Companion ↗</ReferenceLink></p>
      </section>
    </div>

    <div className="career-domain-evidence" style={reveal(step >= 2, instant, 'translateY(6px)')} aria-hidden={step < 2}>
      <span>역량을 보여 줄 경험</span><p><strong>배포한 서비스</strong> · 사용자 피드백 · 개선 기록</p>
    </div>
  </div>;
}
