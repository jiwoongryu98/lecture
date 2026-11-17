import { isPosition } from './deck';
import type { Position } from './presentation';

export const annotationColors = ['#22354a', '#2563b8', '#d13c45'] as const;
export type AnnotationColor = typeof annotationColors[number];
export type Point = [number, number];
interface BaseAnnotation extends Position { id: string; color: AnnotationColor }
export interface StrokeAnnotation extends BaseAnnotation { kind: 'stroke'; points: Point[] }
export interface TextAnnotation extends BaseAnnotation { kind: 'text'; x: number; y: number; text: string }
export type Annotation = StrokeAnnotation | TextAnnotation;
export interface AnnotationBoard { index: number; revision: number; items: Annotation[] }

export function isAnnotation(value: unknown, preview = false): value is Annotation {
  if (!isPosition(value)) return false;
  const item = value as Position & Record<string, unknown>;
  if (typeof item.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id)
    || !annotationColors.some((color) => color === item.color)) return false;
  const coordinate = (n: unknown, limit: number) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= limit;
  if (item.kind === 'stroke') return Array.isArray(item.points) && item.points.length >= (preview ? 0 : 1)
    && item.points.length <= 512 && item.points.every((p: unknown) => Array.isArray(p) && p.length === 2
      && coordinate(p[0], 1600) && coordinate(p[1], 900));
  return !preview && item.kind === 'text' && coordinate(item.x, 1600) && coordinate(item.y, 900)
    && typeof item.text === 'string' && item.text.trim().length > 0 && item.text.length <= 200;
}
