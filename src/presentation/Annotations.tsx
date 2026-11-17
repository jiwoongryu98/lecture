import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { annotationColors } from '../../shared/annotations';
import type { Annotation, AnnotationColor, Point, StrokeAnnotation, TextAnnotation } from '../../shared/annotations';
import type { Position } from '../../shared/presentation';
import type { LectureClient, LiveView } from '../connection/lecture-client';
import { requestId } from '../connection/lecture-client';
import { Slides } from './Slides';
import type { SlideTransition } from './slide';
import './annotations.css';

function Mark({ item }: { item: Annotation }) {
  if (item.kind === 'stroke') return item.points.length === 1
    ? <circle cx={item.points[0][0]} cy={item.points[0][1]} r="3" fill={item.color} />
    : <polyline points={item.points.map((point) => point.join(',')).join(' ')} fill="none" stroke={item.color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
  return <foreignObject x={item.x} y={item.y} width={Math.min(640, 1600 - item.x)} height={900 - item.y}>
    <div className="annotation-text" style={{ color: item.color }}>{item.text}</div>
  </foreignObject>;
}

export function AnnotatedSlides({ position, instant, transition = 'none', presenter, client, live }: {
  position: Position; instant: boolean; transition?: SlideTransition; presenter: boolean; client: LectureClient; live: LiveView;
}) {
  const [mode, setMode] = useState<'view' | 'pen' | 'text'>('view');
  const [color, setColor] = useState<AnnotationColor>(annotationColors[0]);
  const [active, setActive] = useState<StrokeAnnotation | null>(null);
  const [pending, setPending] = useState<Annotation[]>([]);
  const [draft, setDraft] = useState<TextAnnotation | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState<number | null>(null);
  const [retry, setRetry] = useState(0);
  const stroke = useRef<StrokeAnnotation | null>(null);
  const pointer = useRef<number | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const undoButton = useRef<HTMLButtonElement>(null);
  const draftRef = useRef<TextAnnotation | null>(null);
  const enabled = presenter && live.authorized && live.connection === 'connected';
  const board = live.annotations[position.index];
  const items = board?.items ?? [];
  const visible = items.filter((item) => item.step <= position.step);
  const ready = enabled && loaded === position.index;

  useEffect(() => {
    if (live.connection !== 'connected') { setLoaded(null); return; }
    let cancelled = false;
    setLoaded(null); setError('');
    void client.request('annotations.get', { index: position.index }).then(() => {
      if (!cancelled) setLoaded(position.index);
    }).catch(() => { if (!cancelled) setError('필기를 불러오지 못했습니다.'); });
    return () => { cancelled = true; };
  }, [position.index, live.connection, client, retry]);

  useEffect(() => {
    // Navigation and lost connections cancel unfinished input, never publish it on another slide.
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
      previewTimer.current = null;
      if (stroke.current) client.preview({ ...stroke.current, points: [] });
      stroke.current = null; pointer.current = null;
    };
  }, [position.index, position.step, enabled, client]);
  useEffect(() => { setActive(null); setDraft(null); draftRef.current = null; }, [position.index, position.step, enabled]);
  useEffect(() => { if (draft) input.current?.focus(); }, [draft?.id]);

  useEffect(() => {
    const undo = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey
        || !(event.metaKey || event.ctrlKey) || (event.code !== 'KeyZ' && event.key.toLowerCase() !== 'z')) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return;
      if (!undoButton.current || undoButton.current.disabled) return;
      event.preventDefault();
      undoButton.current.click();
    };
    window.addEventListener('keydown', undo);
    return () => window.removeEventListener('keydown', undo);
  }, []);

  function point(event: PointerEvent<SVGSVGElement>): Point {
    const box = event.currentTarget.getBoundingClientRect();
    return [Math.round(Math.max(0, Math.min(1600, (event.clientX - box.left) / box.width * 1600))),
      Math.round(Math.max(0, Math.min(900, (event.clientY - box.top) / box.height * 900)))];
  }

  function queuePreview() {
    if (previewTimer.current) return;
    previewTimer.current = setTimeout(() => {
      previewTimer.current = null;
      if (stroke.current) client.preview(stroke.current);
    }, 80);
  }

  async function add(item: Annotation) {
    setError(''); setPending((old) => [...old, item]);
    try { await client.request('annotation.add', item); }
    catch {
      if (item.kind === 'stroke') client.preview({ ...item, points: [] });
      setError('필기를 저장하지 못했습니다. 다시 작성해주세요.');
    }
    finally { setPending((old) => old.filter((entry) => entry.id !== item.id)); }
  }

  function finishText(cancelled = false) {
    const item = draftRef.current;
    draftRef.current = null; setDraft(null);
    if (!cancelled && ready && item?.text.trim()) void add({ ...item, text: item.text.trim() });
  }

  function finish(event: PointerEvent<SVGSVGElement>, cancelled = false) {
    if (pointer.current !== event.pointerId || !stroke.current) return;
    const completed = stroke.current;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = null;
    stroke.current = null; pointer.current = null; setActive(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (cancelled) client.preview({ ...completed, points: [] });
    else void add(completed);
  }

  async function change(clear: boolean) {
    if (busy || !ready || pending.length) return;
    setBusy(true); setError('');
    try {
      if (clear) await client.request('annotations.clear', { index: position.index });
      else if (visible.length) await client.request('annotation.remove', { index: position.index, id: visible.at(-1)!.id });
    } catch { setError('필기를 변경하지 못했습니다. 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  const storedIds = new Set(items.map((item) => item.id));
  const temporary = [...pending.filter((item) => !storedIds.has(item.id)), ...(active ? [active] : [])];
  const localIds = new Set(temporary.map((item) => item.id));
  const previews = live.previews.filter((item) => !localIds.has(item.id) && !storedIds.has(item.id));
  const drawing = ready && mode !== 'view' && !busy;

  return <>
    <main className="stage" tabIndex={-1}><Slides position={position} instant={instant} transition={transition}>
      <svg className={`annotation-layer${drawing ? ' annotation-editing' : ''}`} viewBox="0 0 1600 900" preserveAspectRatio="none"
        aria-label={presenter ? '슬라이드 필기 영역' : '발표자 필기'} data-tool={mode}
        onPointerDown={(event) => {
          if (!drawing || event.button !== 0 || pointer.current !== null) return;
          event.preventDefault();
          const [x, y] = point(event);
          if (mode === 'text') {
            finishText();
            const text: TextAnnotation = { index: position.index, step: position.step, id: requestId(), kind: 'text', color, x: Math.min(x, 1200), y: Math.min(y, 720), text: '' };
            draftRef.current = text; setDraft(text);
            return;
          }
          const item: StrokeAnnotation = { index: position.index, step: position.step, id: requestId(), kind: 'stroke', color, points: [[x, y]] };
          stroke.current = item; pointer.current = event.pointerId; setActive(item);
          event.currentTarget.setPointerCapture(event.pointerId);
          client.preview(item);
        }}
        onPointerMove={(event) => {
          if (!drawing || pointer.current !== event.pointerId || !stroke.current) return;
          const points = [...stroke.current.points];
          const next = point(event); const last = points.at(-1)!;
          if (Math.hypot(next[0] - last[0], next[1] - last[1]) < 2) return;
          // Keep long gestures within the existing WebSocket frame limit.
          if (points.length >= 512) points.splice(0, points.length, ...points.filter((_, index) => index % 2 === 0));
          const updated = { ...stroke.current, points: [...points, next] };
          stroke.current = updated; setActive(updated); queuePreview();
        }}
        onPointerUp={(event) => finish(event)} onPointerCancel={(event) => finish(event, true)}
        onLostPointerCapture={(event) => finish(event, true)}>
        {[...visible, ...previews, ...temporary].filter((item) => item.index === position.index && item.step <= position.step)
          .map((item) => <g key={item.id} data-annotation={item.id} data-kind={item.kind}><Mark item={item} /></g>)}
        {draft && <foreignObject x={draft.x} y={draft.y} width={Math.min(640, 1600 - draft.x)} height={900 - draft.y}>
          <textarea className="annotation-editor" aria-label="슬라이드 텍스트" ref={input}
            value={draft.text} maxLength={200} rows={Math.max(2, draft.text.split('\n').length + 1)}
            style={{ color: draft.color }} onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) => { const next = { ...draft, text: event.target.value }; draftRef.current = next; setDraft(next); }}
            onBlur={() => finishText()} onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === 'Escape') { event.preventDefault(); finishText(true); }
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); finishText(); }
            }} />
        </foreignObject>}
      </svg>
    </Slides></main>
    {presenter && <div className="annotation-controls">
      <div className="annotation-toolbar" role="toolbar" aria-label="발표 필기 도구">
        {([['view', '보기'], ['pen', '펜'], ['text', '텍스트']] as const).map(([value, label]) => <button key={value}
          aria-pressed={mode === value} disabled={!ready || busy} onClick={() => { finishText(); setMode(value); }}>{label}</button>)}
        <span className="annotation-colors" aria-label="필기 색상">{annotationColors.map((value, index) => <button key={value}
          className="annotation-color" style={{ '--annotation-color': value } as CSSProperties}
          aria-label={['검정', '파랑', '빨강'][index]} aria-pressed={color === value} disabled={!ready || busy}
          onClick={() => setColor(value)} />)}</span>
        <button ref={undoButton} aria-keyshortcuts="Meta+Z Control+Z" disabled={!ready || busy || !!pending.length || !visible.length} onClick={() => { void change(false); }}>실행 취소</button>
        <button disabled={!ready || busy || !!pending.length || !items.length} onClick={() => { void change(true); }}>전체 지우기</button>
      </div>
    </div>}
    {error && <p className="annotation-error" role="alert">{error} <button onClick={() => setRetry((value) => value + 1)}>다시 불러오기</button></p>}
  </>;
}
