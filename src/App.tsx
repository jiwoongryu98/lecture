import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { move } from '../shared/deck';
import { DeckContext, useDeck } from './presentation/Deck';
import type { PresentationDeck } from './presentation/Deck';
import { Questions } from './presentation/Questions';
import { AnnotatedSlides } from './presentation/Annotations';
import { usePresentation } from './presentation/usePresentation';
import { useLectureConnection } from './connection/useLectureConnection';
import { SlideMenu } from './presentation/SlideMenu';

const PresenterNotes = lazy(() => import('./presentation/PresenterNotes'));

const statuses: Record<string, { label: string; tone: string }> = {
  connecting: { label: '연결 중', tone: 'loading' },
  checking: { label: '발표자 키 확인 중', tone: 'loading' },
  locked: { label: '발표자 인증 필요', tone: 'offline' },
  connected: { label: '연결됨', tone: 'online' },
  reconnecting: { label: '연결 없음 · 자동 재연결 중', tone: 'offline' },
};

export default function App({ deck }: { deck: PresentationDeck }) {
  return <DeckContext value={deck}><Presentation /></DeckContext>;
}

function Presentation() {
  const { slides, presentation } = useDeck();
  const presenter = location.pathname === '/presenter';
  const [viewerKey] = useState(() => presenter ? '' : (new URLSearchParams(location.hash.slice(1)).get('key')
    ?? new URLSearchParams(location.search).get('key') ?? '').trim());
  const live = useLectureConnection(presenter);
  const { state, canFollow, connection, authorized, authError, autoLogin, instant, slideTransition, syncError, go, navigate, login, toggleFollowing } = usePresentation(presenter, live);
  const [keyInput, setKeyInput] = useState('');
  const [questionsExpanded, setQuestionsExpanded] = useState(() => {
    try { return window.localStorage.getItem('questions-expanded') !== 'false'; }
    catch { return true; }
  });
  const [notesExpanded, setNotesExpanded] = useState(false);
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
  const index = state.position.index - 1;
  const enabled = !presenter || authorized;
  const status = statuses[connection];

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
    try { window.localStorage.setItem('questions-expanded', String(questionsExpanded)); }
    catch { /* Keep the in-memory preference if browser storage is unavailable. */ }
  }, [questionsExpanded]);

  useEffect(() => {
    try { window.localStorage.setItem('slide-menu-expanded', String(menuExpanded)); }
    catch { /* Keep the in-memory preference if browser storage is unavailable. */ }
  }, [menuExpanded]);

  useEffect(() => {
    if (presenter) return;
    const url = new URL(location.href);
    const fragment = new URLSearchParams(url.hash.slice(1));
    if (!url.searchParams.has('key') && !fragment.has('key')) return;
    url.searchParams.delete('key');
    if (fragment.has('key')) { fragment.delete('key'); url.hash = fragment.toString(); }
    history.replaceState(null, '', url);
  }, [presenter]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' && document.fullscreenElement === shell.current?.querySelector('.stage')) {
        event.preventDefault(); void fullscreen(true); return;
      }
      if (event.key === 'Escape' && menuExpanded) {
        setMenuExpanded(false); menuButton.current?.focus(); return;
      }
      if (!enabled || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey
        || (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]'))) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === ' ') {
        // Preserve native activation for controls outside slide navigation.
        if (event.target instanceof Element && event.target.closest('button, a') && !event.target.closest('.navigation')) return;
        event.preventDefault();
        if (!presenter && !event.repeat && canFollow) toggleFollowing();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [go, enabled, presenter, canFollow, toggleFollowing, menuExpanded]);

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
        {presenter && <button aria-controls="notes-panel" aria-expanded={notesExpanded} disabled={!authorized}
          aria-label={notesExpanded ? '발표 노트 접기' : '발표 노트 펼치기'}
          onClick={() => setNotesExpanded((expanded) => !expanded)}>발표 노트</button>}
        <a className="wordmark" href="/" aria-label="발표 첫 화면"><span className="brand-mark" aria-hidden="true" />{presentation.title}</a></div>
      <div className="header-actions">{presenter && <span className="presenter-badge">발표자</span>}
        <span className={`connection-status ${status.tone}`} role="status" aria-label={status.label} title={status.label}>
          <span className="connection-dot" aria-hidden="true" />
        </span>
        <button className="questions-toggle" aria-controls="question-panel" aria-expanded={questionsExpanded}
          aria-label={questionsExpanded ? '질문 접기' : '질문 펼치기'} title={questionsExpanded ? '질문 접기' : '질문 펼치기'}
          onClick={() => setQuestionsExpanded((expanded) => !expanded)}>질문
          <svg className="question-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m9 6 6 6-6 6" />
          </svg></button>

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
    {presenter && !authorized && !autoLogin && connection === 'locked' && <form className="presenter-login" onSubmit={(event) => { event.preventDefault(); login(keyInput); setKeyInput(''); }}>
      <label htmlFor="presenter-key">발표자 키</label><input id="presenter-key" type="password" autoComplete="off" value={keyInput} onChange={(event) => setKeyInput(event.target.value)} required />
      <button className="primary">발표 시작</button>
      {authError && <p role="alert">{authError}</p>}
    </form>}
    <div className={`workspace${presenter ? ' presenter-workspace' : ''}`}>
      <SlideMenu expanded={menuExpanded} index={state.position.index} disabled={!enabled} onClose={closeMenu}
        onSelect={(index) => navigate({ index, step: 0 })} />
      {presenter && authorized && notesExpanded && <Suspense fallback={<aside id="notes-panel" className="notes-panel" aria-label="발표 노트"><p role="status">노트를 불러오는 중…</p></aside>}>
        <PresenterNotes position={state.position} />
      </Suspense>}
      <section className="deck-area" aria-label="프레젠테이션">
        <AnnotatedSlides position={state.position} instant={instant} transition={slideTransition} presenter={presenter} client={live.client} live={live.view} />
        <footer className="app-footer"><div className="slide-count"><strong>{String(index + 1).padStart(2, '0')}</strong><span>/ {String(slides.length).padStart(2, '0')}</span><span className="step-count">단계 {state.position.step} / {slides[index].maxStep}</span></div>
          <div className="navigation">
            {!presenter && <button className="follow-button" aria-label={state.following ? '정지' : '재생'} aria-pressed={state.following}
              disabled={!canFollow} title={canFollow ? undefined : '발표자가 연결되면 사용할 수 있습니다.'}
              onClick={toggleFollowing}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
                {state.following ? <><rect x="3" y="2" width="3" height="12" rx=".5" /><rect x="10" y="2" width="3" height="12" rx=".5" /></> : <path d="M4 2L14 8L4 14Z" />}
              </svg><span>{state.following ? '정지' : '재생'}</span>
            </button>}
            <button aria-label="이전 단계" disabled={!enabled || move(state.position, -1) === state.position} onClick={() => go(-1)}>←</button>
            <button aria-label="다음 단계" disabled={!enabled || move(state.position, 1) === state.position} onClick={() => go(1)}>→</button>
          </div>
        </footer>
      </section>
      <Questions expanded={questionsExpanded} position={state.position} client={live.client} live={live.view} presenter={presenter} urlPassword={viewerKey} />
    </div>
    {uiError && <p className="ui-error" role="status">{uiError}</p>}
    {syncError && <p className="ui-error" role="alert">{syncError}</p>}
  </div></MotionConfig>;
}
