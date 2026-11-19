import './001.css';
import type { SlideMetadata } from '../../shared/presentation';

export const metadata = {
  "id": "welcome",
  "title": "AI 시대, 어떻게 일하고 성장할 것인가",
  "section": "들어가며",
  "maxStep": 0,
  "subsection": ""
} satisfies SlideMetadata;

export default function Slide001() {
  return <div className="slide-body welcome-title">
    <h1 id="slide-title">AI 시대,<br />어떻게 일하고<br /><span>성장할 것인가</span></h1>
  </div>;
}
