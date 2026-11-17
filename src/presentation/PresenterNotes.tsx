import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Position } from '../../shared/deck';

export default function PresenterNotes({ position }: { position: Position }) {
  const [result, setResult] = useState<{ index: number; markdown?: string; error?: string } | null>(null);
  const [retry, setRetry] = useState(0);
  const body = useRef<HTMLDivElement>(null);
  const index = position.index;
  useEffect(() => {
    const controller = new AbortController();
    body.current?.scrollTo?.(0, 0);
    void fetch(`/api/notes/${index.toString()}`, { credentials: 'same-origin', signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) return '';
        if (!response.ok) throw new Error(response.status === 401 ? '발표자 키를 다시 확인해주세요.' : '노트를 불러오지 못했습니다.');
        return response.text();
      }).then((markdown) => {
        if (!controller.signal.aborted) setResult({ index, markdown });
      }).catch((error: unknown) => {
        if (!controller.signal.aborted) setResult({ index, error: error instanceof Error ? error.message : '노트를 불러오지 못했습니다.' });
      });
    return () => controller.abort();
  }, [index, retry]);
  const current = result?.index === index ? result : null;

  return <aside id="notes-panel" className="notes-panel" aria-label="발표 노트">
    <div className="panel-heading"><h2>발표 노트</h2></div>
    <div className="notes-body" ref={body}>
      {!current && <p role="status">노트를 불러오는 중…</p>}
      {current?.error && <div role="alert"><p>{current.error}</p><button onClick={() => { setResult(null); setRetry((value) => value + 1); }}>다시 시도</button></div>}
      {current?.markdown === '' && <p className="empty-state">이 슬라이드의 발표 노트가 없습니다.</p>}
      {current?.markdown && <div className="notes-markdown"><Markdown remarkPlugins={[remarkGfm]} skipHtml
        components={{ a: ({ href, children }) => <a href={href?.replace(/^\.\.\/public\//, '/')} target="_blank" rel="noreferrer">{children}</a> }}>
        {current.markdown}
      </Markdown></div>}
    </div>
  </aside>;
}
