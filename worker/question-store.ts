import type { Question, QuestionPage } from '../shared/deck';
import { ProtocolError } from '../shared/protocol';
import type { QuestionInput } from '../shared/protocol';

const columns = 'id, slideIndex AS "index", step, name, body, createdAt';
export async function listQuestions(db: D1Database, cursor: number): Promise<QuestionPage> {
  const { results } = await db.prepare(`SELECT ${columns} FROM questions
    WHERE id > ? ORDER BY id ASC LIMIT 51`).bind(cursor).all<Question>();
  const questions = results.slice(0, 50);
  return { questions, nextCursor: questions.at(-1)?.id ?? cursor, hasMore: results.length > 50 };
}

export async function createQuestion(db: D1Database, requestId: string, input: QuestionInput, name: string): Promise<Question> {
  const body = input.body.trim();
  const inserted = await db.prepare(`INSERT INTO questions
    (slideIndex, step, name, body, createdAt, submissionRequestId) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (submissionRequestId) DO NOTHING RETURNING ${columns}`)
    .bind(input.index, input.step, name, body, Date.now(), requestId).first<Question>();
  if (inserted) return inserted;
  const saved = await db.prepare(`SELECT ${columns} FROM questions WHERE submissionRequestId = ?`)
    .bind(requestId).first<Question>();
  if (!saved) throw new ProtocolError('UNAVAILABLE', 'Could not save question');
  if (saved.body !== body || saved.name !== name || saved.index !== input.index || saved.step !== input.step) throw new ProtocolError('CONFLICT', 'Request ID was used for another question');
  return saved;
}
