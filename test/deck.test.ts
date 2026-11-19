import { expect, it } from 'vitest';
import { initialPosition, isPosition, move, positionFromSearch, slides, viewerReducer } from '../shared/deck';
import type { ViewerState } from '../shared/deck';

it('moves through the whole deck and reverses each slide boundary', () => {
  expect(move(initialPosition, -1)).toBe(initialPosition);
  for (let index = 0; index < slides.length; index++) {
    const slide = slides[index];
    for (let step = 0; step < slide.maxStep; step++) {
      expect(move({ index: index + 1, step }, 1)).toEqual({ index: index + 1, step: step + 1 });
      expect(move({ index: index + 1, step: step + 1 }, -1)).toEqual({ index: index + 1, step });
    }
    const end = { index: index + 1, step: slide.maxStep };
    if (index < slides.length - 1) {
      const next = { index: index + 2, step: 0 };
      expect(move(end, 1)).toEqual(next);
      expect(move(next, -1)).toEqual(end);
    } else expect(move(end, 1)).toBe(end);
  }
});

it('validates positions and safely handles malformed links', () => {
  expect(isPosition({ index: 1, step: 1 })).toBe(false);
  expect(isPosition({ index: 5, step: 1.5 })).toBe(false);
  expect(positionFromSearch('?slide=missing&step=2')).toEqual(initialPosition);
  expect(positionFromSearch('?index=26&step=1')).toEqual({ index: 26, step: 1 });
  expect(positionFromSearch('?index=005&step=2')).toEqual({ index: 5, step: 2 });
  for (const index of ['0', '-1', '1.5', '9999', 'NaN']) {
    expect(positionFromSearch(`?index=${index}&step=0`)).toEqual(initialPosition);
  }
});

it('follows by default, pauses for navigation, catches up on Play, and ignores stale snapshots', () => {
  let state: ViewerState = { position: initialPosition, following: true, latest: null };
  const snapshot = { index: 5, step: 1, revision: 1, updatedAt: 1 };
  state = viewerReducer(state, { type: 'snapshot', state: snapshot });
  expect(state.position).toEqual(snapshot);
  state = viewerReducer(state, { type: 'navigate', position: initialPosition });
  expect(state.following).toBe(false);
  state = viewerReducer(state, { type: 'snapshot', state: { ...snapshot, step: 3, revision: 2 } });
  expect(state.position).toEqual(initialPosition);
  state = viewerReducer(state, { type: 'play' });
  expect(state.position.step).toBe(3);
  expect(state.following).toBe(true);
  expect(viewerReducer(state, { type: 'snapshot', state: snapshot })).toBe(state);
  state = viewerReducer(state, { type: 'pause' });
  const position = state.position;
  state = viewerReducer(state, { type: 'snapshot', state: { ...snapshot, step: 0, revision: 3 } });
  expect(state.position).toBe(position);
});
