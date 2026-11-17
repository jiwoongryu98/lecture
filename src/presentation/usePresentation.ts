import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { move, positionFromSearch, viewerReducer } from '../../shared/deck';
import type { Position } from '../../shared/deck';
import type { useLectureConnection } from '../connection/useLectureConnection';
import type { SlideTransition } from './slide';

function liveTransition(from: Position, to: Position): SlideTransition {
  const distance = to.index - from.index;
  if (!distance) return 'none';
  if (Math.abs(distance) > 1) return 'fade';
  return distance > 0 ? 'forward' : 'backward';
}

export function usePresentation(presenter: boolean, { client, view }: ReturnType<typeof useLectureConnection>) {
  const [viewer, dispatch] = useReducer(viewerReducer, null, () => {
    const search = new URLSearchParams(location.search);
    search.delete('key');
    return { following: !presenter && location.pathname === '/' && !search.size,
      position: positionFromSearch(location.search), latest: null };
  });
  const canFollow = !presenter && view.connection === 'connected' && view.presenterConnected;
  // Retain follow intent through a presenter disconnect, while navigation opts out.
  const state = { ...viewer, following: viewer.following && canFollow };
  const [instant, setInstant] = useState(true);
  const [slideTransition, setSlideTransition] = useState<SlideTransition>('none');
  const [syncError, setSyncError] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const position = useRef(state.position);
  position.current = state.position;
  const queued = useRef<Position | null>(null);
  const writing = useRef(false);

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.delete('slide');
    url.searchParams.set('index', String(state.position.index));
    url.searchParams.set('step', String(state.position.step));
    history.replaceState(null, '', url);
  }, [state.position]);

  useEffect(() => {
    if (!presenter) return;
    const fragmentKey = new URLSearchParams(location.hash.slice(1)).get('key');
    const oldKey = sessionStorage.getItem('presenter-key');
    sessionStorage.removeItem('presenter-key');
    if (fragmentKey) history.replaceState(null, '', location.pathname + location.search);
    const key = fragmentKey || oldKey;
    if (key) {
      setAutoLogin(true);
      void client.enterPresenter(key).finally(() => setAutoLogin(false));
    }
  }, [presenter, client]);

  useEffect(() => {
    if (!view.state) return;
    if (!presenter) {
      if (!canFollow) return;
      setInstant(view.instant);
      setSlideTransition(!view.instant && state.following ? liveTransition(position.current, view.state) : 'none');
      dispatch({ type: 'snapshot', state: view.state });
    } else if (view.authorized && !writing.current && !queued.current) {
      if (position.current.index !== view.state.index || position.current.step !== view.state.step) {
        setInstant(view.instant);
        setSlideTransition(view.instant ? 'none' : liveTransition(position.current, view.state));
      }
      position.current = view.state;
      dispatch({ type: 'navigate', position: view.state });
    }
  }, [view.state, view.instant, view.authorized, presenter, canFollow]);

  const publish = useCallback(async () => {
    if (writing.current || !client.getSnapshot().authorized) return;
    writing.current = true;
    try {
      while (queued.current) {
        const target = queued.current; queued.current = null;
        await client.request('slide.set', target);
      }
    } catch {
      queued.current = null;
      setSyncError('슬라이드 위치를 전송하지 못했습니다. 연결 상태와 발표자 키를 확인해주세요.');
    } finally { writing.current = false; }
  }, [client]);

  const navigate = useCallback((target: Position, transition: SlideTransition = 'fade') => {
    if (presenter && !client.getSnapshot().authorized) return;
    setSlideTransition(position.current.index === target.index ? 'none' : transition);
    position.current = target; setInstant(false); setSyncError('');
    dispatch({ type: 'navigate', position: target });
    if (presenter) { queued.current = target; void publish(); }
  }, [presenter, client, publish]);
  const go = useCallback((direction: 1 | -1) => navigate(move(position.current, direction), direction === 1 ? 'forward' : 'backward'), [navigate]);
  useEffect(() => {
    const listener = () => navigate(positionFromSearch(location.search));
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [navigate]);

  return { state, canFollow, connection: view.connection, authorized: view.authorized, authError: view.authError, autoLogin, instant, slideTransition, syncError, go, navigate,
    login: (key: string) => { void client.enterPresenter(key); },
    toggleFollowing: () => {
      if (!canFollow) return;
      if (!state.following) { setInstant(true); setSlideTransition('none'); }
      dispatch({ type: state.following ? 'pause' : 'play' });
    },
  };
}
