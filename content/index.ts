import type { ComponentType } from 'react';
import { slides } from '../shared/deck';
import type { SlideProps } from '../src/presentation/slide';
import type { PresentationDeck } from '../src/presentation/Deck';
import { presentation } from './presentation';
import './theme.css';

const components = import.meta.glob<ComponentType<SlideProps>>('./slides/[0-9][0-9][0-9].tsx', { eager: true, import: 'default' });
const renderers = Object.fromEntries(slides.map((slide) => {
  const component = components[`./slides/${slide.number}.tsx`];
  if (!component) throw new Error(`Missing renderer for slide ${slide.number} (${slide.id})`);
  return [Number(slide.number), component];
}));
export const lecture: PresentationDeck = { slides, renderers, presentation };
