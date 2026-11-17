import { createContext, useContext } from 'react';
import type { ComponentType } from 'react';
import type { SlideDefinition } from '../../shared/presentation';
import type { SlideProps } from './slide';

export interface PresentationConfig {
  title: string;
  brand: string;
  date?: string;
  format: string;
}
export interface PresentationDeck {
  slides: readonly SlideDefinition[];
  renderers: Record<number, ComponentType<SlideProps>>;
  presentation: PresentationConfig;
}
export const DeckContext = createContext<PresentationDeck | null>(null);
export function useDeck() {
  const deck = useContext(DeckContext);
  if (!deck) throw new Error('Presentation content must be injected through DeckContext');
  return deck;
}
