import './kit.css';
import './SessionQA.css';

export default function SessionQA() {
  return <div className="industry-content session-qa">
    <div className="session-qa-conversation">
      <p className="session-qa-label">함께 이야기하는 시간</p>
      <h1 id="slide-title">Q<span>&amp;</span>A</h1>
      <p className="session-qa-invitation">궁금한 점을 함께 이야기해요.</p>
    </div>
    <div className="session-qa-footer">
      <p className="session-qa-participation">질문 패널에 남겨주셔도 좋습니다.</p>
    </div>
  </div>;
}
