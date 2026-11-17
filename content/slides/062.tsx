import { Heading, reveal, type SlideProps } from '../components/kit';
import './062.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "career-learning",
  "title": "빠르게 배우고, 유연하게 적응합니다",
  "section": "3부 · 경험을 연결하다",
  "maxStep": 2,
  "subsection": "학습"
} satisfies SlideMetadata;

export default function Slide062({ step, instant }: SlideProps) {
  const learn = step >= 1;
  const adapt = step >= 2;

  return <div className="industry-content career-s17">
    <Heading eyebrow="계속 배우기 / 변화에 맞춰 생각과 행동 바꾸기" subtitle="기술과 세상이 빠르게 바뀌는 만큼, 배우고 일하는 방식도 계속 바꿉니다.">빠르게 배우고, 유연하게 적응합니다</Heading>

    <div className="c17-landscape">
      <figure className="c17-meme">
        <a href="https://image.fmkorea.com/files/attach/new/20201116/486616/1159261946/3203600963/40d09f18af1d4f14297acb994d63f0b6.jpeg"
          target="_blank" rel="noopener noreferrer" title="이미지 원본 · 새 탭에서 열기">
          <img src="/slides/062/excel-functions-meme.jpeg" width="780" height="700"
            alt="엑셀 함수를 쓰지 말고 익숙한 수작업과 아날로그 방식을 사용하라고 권하는 메시지를 담은 인터넷 밈" />
        </a>
      </figure>

      <div className="c17-learning">
        <h2>익숙한 방식도<br />다시 살펴봅니다</h2>
        <ol className="c17-actions">
          <li><span aria-hidden="true">01</span><div><h3>변화를 살피고</h3><p>기술 · 일 · 사회가 어떻게 바뀌는지</p></div></li>
          <li className="c17-learn" style={reveal(learn, instant, 'translateY(6px)')} aria-hidden={!learn}>
            <span aria-hidden="true">02</span><div><h3>빠르게 배우고</h3><p>AI로 이해하고, 직접 연습하기</p></div>
          </li>
          <li className="c17-adapt" style={reveal(adapt, instant, 'translateY(6px)')} aria-hidden={!adapt}>
            <span aria-hidden="true">03</span><div><h3>써 보고 조정합니다</h3><p>새 근거에 맞춰 생각과 방식 바꾸기</p></div>
          </li>
        </ol>
      </div>
    </div>

    <p className="c17-takeaway" style={reveal(adapt, instant, 'translateY(5px)')} aria-hidden={!adapt}>
      빠르게 배우고 꾸준히 시도하며, <strong>변화에 맞춰 생각과 행동을 조정합니다.</strong>
    </p>
  </div>;
}
