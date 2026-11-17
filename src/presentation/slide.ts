import type { CSSProperties } from 'react';

export interface SlideProps { step: number; instant: boolean }
export type SlideTransition = 'none' | 'forward' | 'backward' | 'fade';

/** Every reveal is a direct function of the current presentation state. */
export function reveal(visible: boolean, instant: boolean, hiddenTransform = 'translateY(10px)'): CSSProperties {
  return {
    visibility: visible ? 'visible' : 'hidden',
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : hiddenTransform,
    transition: instant ? 'none' : 'opacity 380ms ease, transform 480ms cubic-bezier(.2,.7,.2,1)',
  };
}
