import { useCallback, useEffect, useState } from 'react';
import { move, positionFromSearch } from '../../shared/deck';
import type { Position } from '../../shared/deck';
import { toLinkIndex } from '../../shared/presentation';
import type { SlideTransition } from './slide';

interface PresentationState {
  position: Position;
  instant: boolean;
  slideTransition: SlideTransition;
}

function readLocation(): PresentationState {
  return { position: positionFromSearch(location.search), instant: true, slideTransition: 'none' };
}

export function usePresentation() {
  const [state, setState] = useState(readLocation);

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.delete('slide');
    url.searchParams.delete('key');
    const fragment = new URLSearchParams(url.hash.slice(1));
    if (fragment.has('key')) {
      fragment.delete('key');
      url.hash = fragment.toString();
    }
    url.searchParams.set('index', String(toLinkIndex(state.position.index)));
    url.searchParams.set('step', String(state.position.step));
    if (url.href !== location.href) history.replaceState(null, '', url);
  }, [state.position]);

  useEffect(() => {
    const restore = () => setState(readLocation());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  const navigate = useCallback((position: Position) => {
    setState((current) => ({
      position,
      instant: false,
      slideTransition: current.position.index === position.index ? 'none' : 'fade',
    }));
  }, []);

  const go = useCallback((direction: 1 | -1) => {
    setState((current) => {
      const position = move(current.position, direction);
      if (position === current.position) return current;
      const slideTransition = position.index === current.position.index ? 'none'
        : direction === 1 ? 'forward' : 'backward';
      return { position, instant: false, slideTransition };
    });
  }, []);

  return { ...state, navigate, go };
}
