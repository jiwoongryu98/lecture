import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { move } from '../shared/deck';
import { DeckContext, useDeck } from './presentation/Deck';
import type { PresentationDeck } from './presentation/Deck';
import { Slides } from './presentation/Slides';
import { usePresentation } from './presentation/usePresentation';
import { SlideMenu } from './presentation/SlideMenu';

export default function App({ deck }: { deck: PresentationDeck }) {
  return <DeckContext value={deck}><Presentation /></DeckContext>;
}

function Presentation() {
  const { slides, presentation } = useDeck();
  const { position, instant, slideTransition, go, navigate } = usePresentation();
  const [menuExpanded, setMenuExpanded] = useState(() => {
    try { return window.localStorage.getItem('slide-menu-expanded') === 'true'; }
    catch { return false; }
  });
  const [uiError, setUiError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSlideFullscreen, setIsSlideFullscreen] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const slideFullscreenButton = useRef<HTMLButtonElement>(null);
  const index = position.index - 1;

  useEffect(() => {
    const update = () => {
      setIsFullscreen(document.fullscreenElement === shell.current);
      setIsSlideFullscreen(document.fullscreenElement === shell.current?.querySelector('.stage'));
    };
    update();
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem('slide-menu-expanded', String(menuExpanded)); }
    catch { /* Keep the in-memory preference if browser storage is unavailable. */ }
  }, [menuExpanded]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' && document.fullscreenElement === shell.current?.querySelector('.stage')) {
        event.preventDefault(); void fullscreen(true); return;
      }
      if (event.key === 'Escape' && menuExpanded) {
        setMenuExpanded(false); menuButton.current?.focus(); return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey
        || (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]'))) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [go, menuExpanded]);

  function closeMenu() { setMenuExpanded(false); menuButton.current?.focus(); }

  async function fullscreen(slideOnly = false) {
    const target = slideOnly ? shell.current?.querySelector<HTMLElement>('.stage') : shell.current;
    if (!target) return;
    try {
      setUiError('');
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
        if (slideOnly) slideFullscreenButton.current?.focus({ preventScroll: true });
      } else {
        await target.requestFullscreen({ navigationUI: 'hide' });
        if (slideOnly) target.focus({ preventScroll: true });
      }
    } catch { setUiError('이 브라우저에서는 전체 화면을 사용할 수 없습니다.'); }
  }

  return <MotionConfig reducedMotion="user"><div className="presentation" ref={shell}>
    <header className="app-header">
      <div className="header-start"><button ref={menuButton} aria-controls="slide-menu" aria-expanded={menuExpanded}
        aria-label={menuExpanded ? '목차 접기' : '목차 펼치기'} onClick={() => setMenuExpanded((expanded) => !expanded)}>☰ 목차</button>
        <a className="wordmark" href="/" aria-label="발표 첫 화면"><span className="brand-mark" aria-hidden="true" />{presentation.title}</a></div>
      <div className="header-actions">
        <button className="slide-fullscreen-button" ref={slideFullscreenButton} onClick={() => { void fullscreen(true); }} aria-label="슬라이드 전체 화면"
          title="슬라이드만 전체 화면으로 보기 · Esc로 돌아가기" aria-pressed={isSlideFullscreen}>
          {/* Lucide Presentation: https://lucide.dev/icons/presentation · ISC: /shared/lucide-LICENSE.txt */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M2 3h20" />
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
            <path d="m7 21 5-5 5 5" />
          </svg>
        </button>
        <button className="app-fullscreen-button" onClick={() => { void fullscreen(); }} aria-label="전체 화면 전환" title="전체 화면 전환" aria-pressed={isFullscreen}>⛶</button></div>
    </header>
    <div className="workspace">
      <SlideMenu expanded={menuExpanded} index={position.index} onClose={closeMenu}
        onSelect={(index) => navigate({ index, step: 0 })} />
      <section className="deck-area" aria-label="프레젠테이션">
        <main className="stage" tabIndex={-1}>
          <Slides position={position} instant={instant} transition={slideTransition} />
        </main>
        <footer className="app-footer"><div className="slide-count"><strong>{String(index + 1).padStart(2, '0')}</strong><span>/ {String(slides.length).padStart(2, '0')}</span><span className="step-count">단계 {position.step} / {slides[index].maxStep}</span></div>
          <div className="navigation">
            <button aria-label="이전 단계" disabled={move(position, -1) === position} onClick={() => go(-1)}>←</button>
            <button aria-label="다음 단계" disabled={move(position, 1) === position} onClick={() => go(1)}>→</button>
          </div>
        </footer>
      </section>
    </div>
    {uiError && <p className="ui-error" role="status">{uiError}</p>}
  </div></MotionConfig>;
}
