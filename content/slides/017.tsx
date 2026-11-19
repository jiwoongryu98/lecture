import { Heading, ReferenceLink, reveal, type SlideProps } from '../components/kit';
import './017.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-specialized",
  "title": "특정 문제에 집중하는 모델",
  "section": "1부 · 산업을 읽다",
  "maxStep": 1,
  "subsection": "모델"
} satisfies SlideMetadata;

export default function Slide017({ step, instant }: SlideProps) {
  const showRequirements = step >= 1;

  return <div className="industry-content industry-s13" data-instant={instant} data-focused={showRequirements}>
    <Heading
      eyebrow="모델 / 특화 개발"
      subtitle="특화의 기준은 작업·자료의 형태·업무 분야입니다."
    >어떤 문제를 잘 풀 것인가?</Heading>

    <div className="industry-visual s13-perspectives">
      <article className="s13-example s13-speech">
        <div className="s13-example-heading">
          <span className="s13-task">음성 인식</span>
          <h2><ReferenceLink to="Whisper">OpenAI <strong>Whisper</strong></ReferenceLink></h2>
        </div>
        <figure>
          <div className="s13-image-stage s13-speech-diagram">
            <svg viewBox="0 0 500 170" role="group" aria-label="Whisper의 음성 파일을 텍스트로 옮기는 역할을 보여주는 개념도">
              <rect x="54" y="29" width="32" height="58" rx="16" fill="#dce7f5" stroke="#4269a5" strokeWidth="2" />
              <path d="M42 69V75A28 28 0 0 0 98 75V69M70 103V118M53 118H87" fill="none" stroke="#4269a5" strokeWidth="2.5" />
              <path d="M121 74H177M167 67L177 74L167 81M320 74H375M365 67L375 74L365 81" fill="none" stroke="#8fa7c7" strokeWidth="2" />
              <circle cx="249" cy="74" r="54" fill="#e6edf8" />
              <ReferenceLink to="Whisper"><text x="249" y="82" textAnchor="middle" fill="#31598f" fontSize="25" fontWeight="700">Whisper</text></ReferenceLink>
              <path d="M398 27H444L460 43V119H398ZM444 27V43H460M411 62H446M411 77H446M411 92H436" fill="#fffefa" stroke="#8fa7c7" strokeWidth="2" />
              <text x="70" y="152" textAnchor="middle" fill="#667789" fontSize="17">음성 파일</text>
              <text x="429" y="152" textAnchor="middle" fill="#667789" fontSize="17">텍스트</text>
            </svg>
          </div>
          <figcaption>OpenAI 공개 음성 모델 · 역할 개념도</figcaption>
        </figure>
        <p className="s13-transformation"><span>음성 파일</span><span className="s13-arrow" aria-hidden="true">→</span><strong>텍스트</strong></p>
        <div className="s13-requirement" style={reveal(showRequirements, instant)} aria-hidden={!showRequirements}>
          <span className="s13-requirement-label">확인할 것</span>
          <p>말한 내용을 <strong>글로 옮기는가?</strong></p>
        </div>
      </article>

      <div className="s13-divider" aria-hidden="true" />

      <article className="s13-example s13-generation">
        <div className="s13-example-heading">
          <span className="s13-task">이미지 생성</span>
          <h2><ReferenceLink to="Stable Diffusion">Stability AI <strong>Stable Diffusion</strong></ReferenceLink></h2>
        </div>
        <figure>
          <ReferenceLink to="Stable Diffusion" className="s13-image-stage s13-generation-image">
            <img
              src="/shared/stable-diffusion-2022.jpg"
              alt="2022년 Stable Diffusion 공개 자료에 실린 생성 이미지 두 장: 터번을 쓴 인물과 갑옷을 입은 인물"
              width="698"
              height="515"
            />
          </ReferenceLink>
          <figcaption>Stability AI 공식 공개 자료 · 2022</figcaption>
        </figure>
        <p className="s13-transformation"><span>텍스트 설명</span><span className="s13-arrow" aria-hidden="true">→</span><strong>이미지</strong></p>
        <div className="s13-requirement" style={reveal(showRequirements, instant)} aria-hidden={!showRequirements}>
          <span className="s13-requirement-label">확인할 것</span>
          <p>설명한 <strong>시각 요소</strong>를 표현하는가?</p>
        </div>
      </article>
    </div>

    <p className="s13-principle" style={reveal(showRequirements, instant)} aria-hidden={!showRequirements}>
      평가의 기준도, <strong>선택한 문제의 요구사항</strong>에 맞춥니다.
    </p>
  </div>;
}
