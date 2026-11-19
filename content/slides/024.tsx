import { Heading, ReferenceLink, Takeaway, type SlideProps } from '../components/kit';
import './024.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-infra-tech",
  "title": "AI 인프라의 소프트웨어",
  "section": "1부 · 산업을 읽다",
  "maxStep": 0,
  "subsection": "인프라"
} satisfies SlideMetadata;

const groups = [
  {
    role: '모델 서빙',
    kind: '추론 엔진 · 추론 서버',
    tools: [
      { name: 'vLLM', note: '언어 모델 추론·요청 처리' },
      { name: 'NVIDIA Triton Inference Server', note: '여러 모델 백엔드의 실행 관리' },
    ],
  },
  {
    role: '데이터 전송·통신',
    kind: '전송 · 통신 라이브러리',
    tools: [
      { name: 'NIXL', note: '메모리·스토리지 간 데이터 전송' },
      { name: 'NCCL', note: '여러 GPU 간 통신' },
    ],
  },
  {
    role: '연산 변환·최적화',
    kind: 'ML 컴파일러 · 컴파일러 프레임워크',
    tools: [
      { name: 'XLA', note: '하드웨어에 맞게 연산 컴파일' },
      { name: 'Apache TVM', note: 'ML 컴파일러 구성·코드 생성' },
    ],
  },
  {
    role: 'GPU 개발·실행',
    kind: '소프트웨어 플랫폼',
    tools: [
      { name: 'CUDA', note: 'NVIDIA GPU용 개발·실행' },
      { name: 'ROCm', note: 'AMD GPU용 개발·실행' },
    ],
  },
] as const;

export default function Slide024(_props: SlideProps) {
  return <div className="industry-content industry-s21">
    <Heading eyebrow="AI 인프라 / 기술 찾아보기">인프라 도구, 역할로 살펴보기</Heading>

    <div className="industry-visual s21-index" aria-label="AI 인프라 소프트웨어의 역할별 예시">
      {groups.map(({ role, kind, tools }) => <section className="s21-group" key={role} aria-label={role}>
        <div className="s21-role">
          <p className="s21-kind">{kind}</p>
          <h2>{role}</h2>
        </div>
        <dl className="s21-tools">
          {tools.map(({ name, note }) => <div className="s21-tool" key={name}>
            <dt><ReferenceLink to={name}>{name}</ReferenceLink></dt>
            <dd>{note}</dd>
          </div>)}
        </dl>
      </section>)}
    </div>

    <Takeaway>병목이 어디인지에 따라, <strong>살펴볼 도구</strong>가 달라집니다.</Takeaway>
  </div>;
}
