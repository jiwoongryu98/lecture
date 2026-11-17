import { isPosition } from './deck';
import type { LectureState, Position, Question, QuestionPage } from './deck';
import { isAnnotation } from './annotations';
import type { Annotation, AnnotationBoard, StrokeAnnotation } from './annotations';

export interface QuestionInput extends Position { body: string }
export interface SessionSnapshot { state: LectureState; presenterConnected: boolean; page: QuestionPage; name: string | null; passwordSaved: boolean }
export interface CommandPayloads {
  'presenter.auth': { key: string };
  'participant.join': { name: string };
  'slide.set': Position;
  'question.create': QuestionInput;
  'questions.list': { cursor: number };
  'annotations.get': { index: number };
  'annotation.add': Annotation;
  'annotation.remove': { index: number; id: string };
  'annotations.clear': { index: number };
}
export interface CommandResults {
  'presenter.auth': SessionSnapshot;
  'participant.join': { name: string };
  'slide.set': LectureState;
  'question.create': Question;
  'questions.list': QuestionPage;
  'annotations.get': AnnotationBoard;
  'annotation.add': AnnotationBoard;
  'annotation.remove': AnnotationBoard;
  'annotations.clear': AnnotationBoard;
}
export type CommandType = keyof CommandPayloads;
export type Command = { [K in CommandType]: { type: K; requestId: string; payload: CommandPayloads[K] } }[CommandType];
export type ErrorCode = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'UNAVAILABLE' | 'CONFLICT';
export type ServerMessage =
  | { type: 'ready' }
  | ({ type: 'snapshot' } & SessionSnapshot)
  | { type: 'presenter.presence'; connected: boolean }
  | { type: 'state'; state: LectureState }
  | { type: 'question.created'; question: Question }
  | { type: 'annotations.changed'; board: AnnotationBoard }
  | { type: 'annotation.preview'; stroke: StrokeAnnotation }
  | { type: 'ack'; requestId: string; result: CommandResults[CommandType] }
  | { type: 'error'; requestId: string | null; code: ErrorCode; message: string };

export class ProtocolError extends Error {
  constructor(public code: ErrorCode, message: string) { super(message); }
}
export function isRequestId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function isCursor(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
export function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
export function parseCommand(value: unknown): Command {
  if (!record(value) || !isRequestId(value.requestId) || !record(value.payload)) throw new ProtocolError('BAD_REQUEST', 'Invalid command');
  const p = value.payload;
  switch (value.type) {
    case 'presenter.auth':
      if (typeof p.key === 'string' && p.key.length > 0 && p.key.length <= 512) return value as Command;
      break;
    case 'participant.join':
      if (typeof p.name === 'string' && p.name.trim()) return value as Command;
      break;
    case 'slide.set':
      if (isPosition(p)) return value as Command;
      break;
    case 'questions.list':
      if (isCursor(p.cursor)) return value as Command;
      break;
    case 'annotations.get':
    case 'annotations.clear':
      if (isPosition({ index: p.index, step: 0 })) return value as Command;
      break;
    case 'annotation.add':
      if (isAnnotation(p)) return value as Command;
      break;
    case 'annotation.remove':
      if (isPosition({ index: p.index, step: 0 }) && isRequestId(p.id)) return value as Command;
      break;
    case 'question.create':
      if (isPosition(p) && typeof p.body === 'string' && p.body.trim().length > 0
        && p.body.trim().length <= 1000) return value as Command;
      break;
  }
  throw new ProtocolError('BAD_REQUEST', 'Invalid command payload');
}
