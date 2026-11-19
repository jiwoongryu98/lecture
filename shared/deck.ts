/// <reference path="./catalog.d.ts" />
import slides from 'virtual:slide-catalog';
import { createDeckRules } from './presentation';

// Build-time composition adapter for the viewer.
export { slides };
export type { Position } from './presentation';
export const { initialPosition, isPosition, move, positionFromSearch } = createDeckRules(slides);
