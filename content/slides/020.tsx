import { Heading, ReferenceLink, type SlideProps } from '../components/kit';
import './020.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-model-tech",
  "title": "AI 모델의 기술과 도구",
  "section": "1부 · 산업을 읽다",
  "maxStep": 0,
  "subsection": "모델"
} satisfies SlideMetadata;

const groups = [
  {
    role: '모델 구성·학습',
    kind: '프레임워크 · 수치 계산 라이브러리',
    tools: [
      { name: 'PyTorch', note: '텐서 연산·모델 학습' },
      { name: 'JAX', note: '자동 미분·컴파일·벡터화' },
    ],
  },
  {
    role: '사전학습 모델 활용',
    kind: '소프트웨어 · 모델 라이브러리',
    tools: [
      { name: 'Hugging Face Transformers', note: '사전학습 모델의 학습·추론' },
      { name: 'Hugging Face Diffusers', note: '이미지·영상 생성 모델 활용' },
    ],
  },
  {
    role: '적응·규모 확장',
    kind: '적응 라이브러리 · 최적화 라이브러리',
    tools: [
      { name: 'Hugging Face PEFT', note: <><ReferenceLink to="LoRA">LoRA</ReferenceLink> 등 효율적인 모델 적응</> },
      { name: 'DeepSpeed', note: '분산 학습·메모리 최적화' },
    ],
  },
  {
    role: '학습 흐름·실험 관리',
    kind: '프레임워크 · 관리 도구',
    tools: [
      { name: 'PyTorch Lightning', note: '학습 코드·실행 흐름 정리' },
      { name: 'MLflow', note: '실험 기록·모델 버전 관리' },
    ],
  },
] as const;

export default function Slide020(_props: SlideProps) {
  return <div className="industry-content industry-s16">
    <Heading eyebrow="AI 모델 / 기술 찾아보기">모델 개발 도구, 역할로 살펴보기</Heading>

    <div className="industry-visual s16-index" aria-label="AI 모델 개발에 쓰이는 소프트웨어의 역할별 예시">
      {groups.map(({ role, kind, tools }) => <section className="s16-group" key={role} aria-label={role}>
        <div className="s16-role">
          <p className="s16-kind">{kind}</p>
          <h2>{role}</h2>
        </div>
        <dl className="s16-tools">
          {tools.map(({ name, note }) => <div className="s16-tool" key={name}>
            <dt><ReferenceLink to={name}>{name}</ReferenceLink></dt>
            <dd>{note}</dd>
          </div>)}
        </dl>
      </section>)}
    </div>
  </div>;
}
