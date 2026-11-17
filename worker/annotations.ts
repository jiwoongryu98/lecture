import type { Annotation, AnnotationBoard } from '../shared/annotations';
import type { Command } from '../shared/protocol';
import { ProtocolError } from '../shared/protocol';

type AnnotationCommand = Extract<Command, { type: 'annotation.add' | 'annotation.remove' | 'annotations.clear' }>;

export function annotationBoard(sql: SqlStorage, index: number): AnnotationBoard {
  const row = sql.exec<{ revision: number; items: string }>(
    'SELECT revision, items FROM annotations WHERE slideIndex = ?', index,
  ).toArray()[0];
  return { index, revision: row?.revision ?? 0, items: row ? JSON.parse(row.items) as Annotation[] : [] };
}

export function changeAnnotations(storage: DurableObjectStorage, command: AnnotationCommand): AnnotationBoard {
  return storage.transactionSync(() => {
    const sql = storage.sql;
    const fingerprint = JSON.stringify({ type: command.type, payload: command.payload });
    const receipt = sql.exec<{ fingerprint: string }>('SELECT fingerprint FROM annotation_receipts WHERE requestId = ?', command.requestId).toArray()[0];
    if (receipt) {
      if (receipt.fingerprint !== fingerprint) throw new ProtocolError('CONFLICT', 'Request ID was used for another annotation command');
      return annotationBoard(sql, command.payload.index);
    }
    const board = annotationBoard(sql, command.payload.index);
    if (command.type === 'annotation.add') {
      const previous = board.items.find((item) => item.id === command.payload.id);
      if (previous && JSON.stringify(previous) !== JSON.stringify(command.payload)) throw new ProtocolError('CONFLICT', 'Annotation ID already exists');
      if (!previous) {
        if (board.items.length >= 100) throw new ProtocolError('BAD_REQUEST', 'Clear annotations before adding more');
        board.items.push(command.payload);
      }
    } else if (command.type === 'annotation.remove') board.items = board.items.filter((item) => item.id !== command.payload.id);
    else board.items = [];
    board.revision++;
    sql.exec(`INSERT INTO annotations (slideIndex, revision, items) VALUES (?, ?, ?)
      ON CONFLICT(slideIndex) DO UPDATE SET revision = excluded.revision, items = excluded.items`,
    board.index, board.revision, JSON.stringify(board.items));
    sql.exec('INSERT INTO annotation_receipts (requestId, fingerprint) VALUES (?, ?)', command.requestId, fingerprint);
    return board;
  });
}
