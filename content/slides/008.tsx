import { Heading, ReferenceLink, reveal, Takeaway, type SlideProps } from '../components/kit';
import { ProductUsageNav } from '../components/ProductUsageNav';
import './008.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "industry-consumer",
  "title": "완성된 제품으로 사용하는 AI",
  "section": "1부 · 산업을 읽다",
  "maxStep": 1,
  "subsection": "제품"
} satisfies SlideMetadata;

export default function Slide008({ step, instant }: SlideProps) {
  const showContext = step >= 1;

  return <div className="industry-content industry-s04" data-instant={instant} data-context={showContext}>
    <Heading eyebrow="제품·활용 / 활용 방식">제품 안에서 AI를 만납니다</Heading>
    <ProductUsageNav active="product" />

    <div className="industry-visual s04-comparison">
      <figure className="s04-web-example">
        <figcaption className="s04-device-label"><ReferenceLink to="ChatGPT">ChatGPT 웹사이트</ReferenceLink> <span>제품 기능 개념도</span></figcaption>
        <ReferenceLink to="ChatGPT" className="s04-browser reference-block" aria-label="ChatGPT 공식 사이트 열기">
          <div className="s04-browser-chrome" aria-hidden="true">
            <span className="s04-browser-dots"><i /><i /><i /></span>
            <span className="s04-address">chatgpt.com</span>
          </div>
          <div className="s04-browser-page">
            <div className="s04-web-brand">ChatGPT <span aria-hidden="true">⌄</span></div>
            <div className="s04-open-topics" style={reveal(showContext, instant, 'scale(.93)')} aria-hidden={!showContext}>
              <span className="s04-topic s04-topic-idea">코딩</span>
              <span className="s04-topic s04-topic-write">글쓰기</span>
              <span className="s04-topic s04-topic-learn">학습</span>
              <svg viewBox="0 0 560 175" aria-hidden="true">
                <path d="M130 35Q211 32 264 91M458 43Q372 38 300 91M414 156Q360 126 308 115" />
                <circle cx="276" cy="105" r="54" />
              </svg>
            </div>
            <p className="s04-web-greeting">다양한 주제로 대화</p>
            <div className="s04-web-prompt">
              <p>질문·요청 입력</p>
              <div aria-hidden="true"><span className="s04-plus">+</span><span className="s04-send">↑</span></div>
            </div>
          </div>
        </ReferenceLink>
        <p className="s04-context-caption" style={reveal(showContext, instant)} aria-hidden={!showContext}>
          <span className="s04-caption-rule" />내가 <strong>주제와 맥락</strong>을 정한다
        </p>
      </figure>

      <span className="s04-comparison-seam" aria-hidden="true" />

      <figure className="s04-bank-example">
        <figcaption className="s04-device-label"><ReferenceLink to="카카오뱅크 AI 상담">카카오뱅크 AI 상담 챗봇</ReferenceLink> <span>공식 화면 일부</span></figcaption>
        <div className="s04-bank-proof">
          <ReferenceLink to="카카오뱅크 AI 상담" className="s04-bank-shot reference-block">
            <img src="/slides/008/kakaobank-ai-chatbot.png" alt="카카오뱅크가 공개한 앱의 AI 상담챗봇 화면. 예금·적금 계좌개설 문의와 상품 및 가입 안내 버튼이 표시되어 있다." />
          </ReferenceLink>
          <div className="s04-bank-scope" style={reveal(showContext, instant, 'scale(1.025)')} aria-hidden={!showContext}>
            <span>은행 서비스 문의</span>
          </div>
        </div>
        <p className="s04-context-caption" style={reveal(showContext, instant)} aria-hidden={!showContext}>
          <span className="s04-caption-rule" />제품이 <strong>업무 맥락</strong>을 좁혀 준다
        </p>
      </figure>
    </div>

    <div className="s04-takeaway" style={reveal(showContext, instant)} aria-hidden={!showContext}>
      <Takeaway>모델의 기능은 <strong>제품이 만든 접점과 맥락</strong>으로 전달됩니다.</Takeaway>
    </div>
  </div>;
}
