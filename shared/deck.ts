/// <reference path="./catalog.d.ts" />
import slides from 'virtual:slide-catalog';
import { createDeckRules } from './presentation';

// Build-time composition adapter shared by the client and Worker.
export { slides };
export type { Position, LectureState, Question, QuestionPage, ViewerState, ViewerAction } from './presentation';
export const { initialPosition, isPosition, move, positionFromSearch, viewerReducer } = createDeckRules(slides);
