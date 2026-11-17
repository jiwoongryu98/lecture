import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { lecture } from '../content';
import { Slides } from '../src/presentation/Slides';
import { DeckContext } from '../src/presentation/Deck';

it.each(lecture.slides)('$id restores its initial state after an instant rewind', (definition) => {
  expect(typeof lecture.renderers[Number(definition.number)]).toBe('function');
  const position = { index: Number(definition.number), step: 0 };
  const slide = (step: number, instant: boolean) => <DeckContext value={lecture}><Slides position={{ ...position, step }} instant={instant} /></DeckContext>;
  const view = render(slide(0, true));
  expect(view.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  const initial = view.container.innerHTML;
  view.rerender(slide(definition.maxStep, false));
  view.rerender(slide(0, true));
  expect(view.container.innerHTML).toBe(initial);
});
