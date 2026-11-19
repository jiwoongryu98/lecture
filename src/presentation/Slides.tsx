import type { Position } from '../../shared/presentation';
import { useDeck } from './Deck';
import { useLayoutEffect, useRef } from 'react';
import type { SlideTransition } from './slide';

function SlideLabel({ text, instant, className }: { text: string; instant: boolean; className?: string }) {
  const label = useRef<HTMLSpanElement>(null);
  const previous = useRef(text);
  const running = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const changed = previous.current !== text;
    previous.current = text;
    if (!changed && !instant) return;
    running.current?.cancel();
    running.current = changed && !instant && text ? label.current?.animate?.([
      { opacity: .3, filter: 'blur(2px)' },
      { opacity: 1, filter: 'blur(0px)' },
    ], { duration: 140, easing: 'ease-out' }) ?? null : null;
  }, [text, instant]);
  useLayoutEffect(() => () => running.current?.cancel(), []);
  return <span className={`slide-label ${className ?? ''}`} ref={label}>{text}</span>;
}

export function Slides({ position, instant, transition = 'none' }: {
  position: Position; instant: boolean; transition?: SlideTransition;
}) {
  const { slides, renderers, presentation } = useDeck();
  const index = position.index - 1;
  const definition = slides[index];
  const Slide = renderers[position.index];
  const page = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(position.index);
  const running = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const changed = previousIndex.current !== position.index;
    previousIndex.current = position.index;
    if (!changed && !instant && transition !== 'none') return;
    running.current?.cancel();
    running.current = null;
    if (!changed || instant || transition === 'none') return;
    const offset = transition === 'forward' ? 10 : transition === 'backward' ? -10 : 0;
    running.current = page.current?.animate?.([
      { opacity: 0, transform: `translateY(${offset}px)` },
      { opacity: 1, transform: 'translateY(0px)' },
    ], { duration: 200, easing: 'cubic-bezier(.2,.7,.2,1)' }) ?? null;
  }, [position.index, instant, transition]);
  useLayoutEffect(() => () => running.current?.cancel(), []);

  return <div className="slide-frame">
    <article className="slide" aria-labelledby="slide-title" data-index={position.index} data-step={position.step}>
      <div className="slide-topline">
        <span><SlideLabel text={definition.section} instant={instant} className="slide-section" />
          {definition.subsection && ' · '}
          <SlideLabel text={definition.subsection ?? ''} instant={instant} className="slide-subsection" /></span>
        <SlideLabel text={presentation.brand} instant={instant} className="eyebrow slide-brand" />
      </div>
      <div className="slide-page" ref={page}>
        <Slide step={position.step} instant={instant} />
      </div>
      <footer className="slide-footer">
        <div className="slide-progress" role="progressbar" aria-label="발표 진행"
          aria-valuemin={0} aria-valuemax={slides.length} aria-valuenow={position.index}
          aria-valuetext={`전체 ${slides.length}장 중 ${position.index}번째 슬라이드`}>
          <span className="slide-progress-fill" style={{ transform: `scaleX(${position.index / slides.length})`, transition: instant ? 'none' : undefined }} />
        </div>
        <SlideLabel text={String(index + 1).padStart(2, '0')} instant={instant} className="slide-number" />
      </footer>
    </article>
  </div>;
}
