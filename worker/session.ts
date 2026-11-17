import { DurableObject } from 'cloudflare:workers';
import { initialPosition, isPosition } from '../shared/deck';
import type { LectureState, Position } from '../shared/deck';
import { isCursor, isRequestId, parseCommand, ProtocolError, record } from '../shared/protocol';
import type { ServerMessage, SessionSnapshot } from '../shared/protocol';
import { createQuestion, listQuestions } from './question-store';
import { keyHash, verifyKey } from './auth';
import { participantAccess, presenterAccess } from './participant';
import { annotationBoard, changeAnnotations } from './annotations';
import { isAnnotation } from '../shared/annotations';
import type { StrokeAnnotation } from '../shared/annotations';

interface Attachment { role: 'viewer' | 'presenter' | null; name: string | null; authorizedKeyHash: ArrayBuffer | null; cursor: number; preview?: StrokeAnnotation }
type StateRow = LectureState & Record<string, SqlStorageValue>;

export class LectureSession extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.transactionSync(() => {
      const sql = ctx.storage.sql;
      sql.exec(`CREATE TABLE IF NOT EXISTS presentation (
        id INTEGER PRIMARY KEY CHECK (id = 1), slideIndex INTEGER NOT NULL CHECK (slideIndex >= 1),
        step INTEGER NOT NULL CHECK (step >= 0), revision INTEGER NOT NULL, updatedAt INTEGER NOT NULL
      )`);
      sql.exec(`CREATE TABLE IF NOT EXISTS slide_receipts (
        requestId TEXT PRIMARY KEY, slideIndex INTEGER NOT NULL CHECK (slideIndex >= 1),
        step INTEGER NOT NULL CHECK (step >= 0), result TEXT NOT NULL
      )`);
      sql.exec('INSERT OR IGNORE INTO presentation VALUES (1, ?, 0, 0, 0)', initialPosition.index);
      sql.exec(`CREATE TABLE IF NOT EXISTS annotations (
        slideIndex INTEGER PRIMARY KEY, revision INTEGER NOT NULL, items TEXT NOT NULL
      )`);
      sql.exec('CREATE TABLE IF NOT EXISTS annotation_receipts (requestId TEXT PRIMARY KEY, fingerprint TEXT NOT NULL)');
    });
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  getReadiness() {
    return { ready: this.ctx.storage.sql.exec<{ ready: number }>('SELECT 1 AS ready').one().ready === 1 };
  }

  getState(): LectureState {
    const state = this.ctx.storage.sql.exec<StateRow>(
      'SELECT slideIndex AS "index", step, revision, updatedAt FROM presentation WHERE id = 1',
    ).one();
    // A saved position can outlive a slide removed from the deck.
    return isPosition({ index: state.index, step: state.step })
      ? state : { ...state, ...initialPosition };
  }

  private setPosition(requestId: string, position: Position): LectureState {
    return this.ctx.storage.transactionSync(() => {
      const receipt = this.ctx.storage.sql.exec<{ index: number; step: number; result: string }>(
        'SELECT slideIndex AS "index", step, result FROM slide_receipts WHERE requestId = ?', requestId,
      ).toArray()[0];
      if (receipt) {
        if (receipt.index !== position.index || receipt.step !== position.step) throw new ProtocolError('CONFLICT', 'Request ID was used for another position');
        return JSON.parse(receipt.result) as LectureState;
      }
      const state = this.ctx.storage.sql.exec<StateRow>(
        `UPDATE presentation SET slideIndex = ?, step = ?, revision = revision + 1,
         updatedAt = ? WHERE id = 1 RETURNING slideIndex AS "index", step, revision, updatedAt`,
        position.index, position.step, Date.now(),
      ).one();
      this.ctx.storage.sql.exec('INSERT INTO slide_receipts VALUES (?, ?, ?, ?)',
        requestId, position.index, position.step, JSON.stringify(state));
      return state;
    });
  }

  private send(socket: WebSocket, message: ServerMessage) {
    try { socket.send(JSON.stringify(message)); }
    catch { try { socket.close(1011, 'Connection unavailable'); } catch { /* Already closed. */ } }
  }

  private async authorized(attachment: Attachment, presenterOnly = false) {
    if (!attachment?.role || !attachment.authorizedKeyHash || (presenterOnly && attachment.role !== 'presenter')) return false;
    const key = attachment.role === 'presenter' ? this.env.PRESENTER_KEY : this.env.COMMENT_PASSWORD;
    return !!key && crypto.subtle.timingSafeEqual(attachment.authorizedKeyHash, await keyHash(key));
  }

  private async broadcast(message: ServerMessage) {
    for (const socket of this.ctx.getWebSockets()) this.send(socket, message);
  }

  private presenterConnected() {
    // Authenticated roles live in socket attachments and survive hibernation.
    return this.ctx.getWebSockets().some((socket) => {
      const attachment = socket.deserializeAttachment() as Attachment | null;
      return socket.readyState === WebSocket.OPEN && attachment?.role === 'presenter' && !!attachment.authorizedKeyHash;
    });
  }

  private broadcastPresenterPresence() {
    return this.broadcast({ type: 'presenter.presence', connected: this.presenterConnected() });
  }

  private async clearPreview(socket: WebSocket) {
    const attachment = socket.deserializeAttachment() as Attachment;
    if (!attachment?.preview) return;
    const stroke = { ...attachment.preview, points: [] };
    delete attachment.preview;
    socket.serializeAttachment(attachment);
    await this.broadcast({ type: 'annotation.preview', stroke });
  }

  private async snapshot(attachment: Attachment): Promise<SessionSnapshot> {
    const page = await listQuestions(this.env.DB, attachment.cursor);
    return { state: this.getState(), presenterConnected: this.presenterConnected(), page, name: attachment.name,
      passwordSaved: attachment.role === 'viewer' && attachment.authorizedKeyHash !== null };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const rawCursor = url.searchParams.get('cursor') ?? '0';
    if (!/^\d+$/.test(rawCursor) || !isCursor(Number(rawCursor))) return new Response('Invalid cursor', { status: 400 });
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server);
    const attachment: Attachment = { role: null, name: null, authorizedKeyHash: null, cursor: Number(rawCursor) };
    server.serializeAttachment(attachment);
    try {
      if (url.searchParams.get('role') === 'presenter') {
        const presenter = await presenterAccess(request, this.env);
        if (presenter) {
          Object.assign(attachment, presenter, { role: 'presenter' });
          server.serializeAttachment(attachment);
          this.send(server, { type: 'snapshot', ...await this.snapshot(attachment) });
          await this.broadcastPresenterPresence();
        } else this.send(server, { type: 'ready' });
      } else {
        const participant = await participantAccess(request, this.env);
        if (participant) Object.assign(attachment, participant, { role: 'viewer' });
        server.serializeAttachment(attachment);
        this.send(server, { type: 'snapshot', ...await this.snapshot(attachment) });
      }
    } catch {
      this.send(server, { type: 'error', requestId: null, code: 'UNAVAILABLE', message: 'Could not load lecture' });
      server.close(1011, 'Could not load lecture');
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    let requestId: string | null = null;
    try {
      if (typeof message !== 'string' || new TextEncoder().encode(message).byteLength > 8192) throw new ProtocolError('BAD_REQUEST', 'Invalid or oversized message');
      let data: unknown;
      try { data = JSON.parse(message); } catch { throw new ProtocolError('BAD_REQUEST', 'Invalid JSON'); }
      if (record(data) && isRequestId(data.requestId)) requestId = data.requestId;
      const attachment = socket.deserializeAttachment() as Attachment;
      if (record(data) && data.type === 'annotation.preview') {
        if (!isAnnotation(data.payload, true) || data.payload.kind !== 'stroke') throw new ProtocolError('BAD_REQUEST', 'Invalid pen preview');
        const preview = data.payload;
        if (!await this.authorized(attachment, true)) throw new ProtocolError('UNAUTHORIZED', 'Presenter authentication required');
        if (annotationBoard(this.ctx.storage.sql, preview.index).items.some((item) => item.id === preview.id)) return;
        if (attachment.preview?.id !== preview.id) await this.clearPreview(socket);
        // Only the ID and position are needed to remove a preview after disconnect.
        attachment.preview = { ...preview, points: [] };
        socket.serializeAttachment(attachment);
        await this.broadcast({ type: 'annotation.preview', stroke: preview });
        return;
      }
      const command = parseCommand(data);
      switch (command.type) {
        case 'participant.join': {
          if (attachment.role !== 'viewer' || !await this.authorized(attachment)) throw new ProtocolError('UNAUTHORIZED', 'Posting password required');
          attachment.name = command.payload.name.trim();
          socket.serializeAttachment(attachment);
          this.send(socket, { type: 'ack', requestId: command.requestId, result: { name: attachment.name } });
          break;
        }
        case 'presenter.auth': {
          await this.clearPreview(socket);
          attachment.role = null; attachment.name = null;
          attachment.authorizedKeyHash = null;
          socket.serializeAttachment(attachment);
          try {
            attachment.authorizedKeyHash = await verifyKey(command.payload.key, this.env.PRESENTER_KEY);
            attachment.role = 'presenter'; attachment.name = '발표자';
            socket.serializeAttachment(attachment);
          } finally {
            await this.broadcastPresenterPresence();
          }
          this.send(socket, { type: 'ack', requestId: command.requestId, result: await this.snapshot(attachment) });
          break;
        }
        case 'slide.set': {
          if (!await this.authorized(attachment, true)) throw new ProtocolError('UNAUTHORIZED', 'Presenter authentication required');
          const state = this.setPosition(command.requestId, command.payload);
          // A replay returns its original receipt, but must never broadcast an old position.
          await this.broadcast({ type: 'state', state: this.getState() });
          this.send(socket, { type: 'ack', requestId: command.requestId, result: state });
          break;
        }
        case 'question.create': {
          if (!attachment.name || !await this.authorized(attachment)) throw new ProtocolError('UNAUTHORIZED', 'Name and password required to post');
          const question = await createQuestion(this.env.DB, command.requestId, command.payload, attachment.name!);
          await this.broadcast({ type: 'question.created', question });
          this.send(socket, { type: 'ack', requestId: command.requestId, result: question });
          break;
        }
        case 'questions.list': {
          const page = await listQuestions(this.env.DB, command.payload.cursor);
          this.send(socket, { type: 'ack', requestId: command.requestId, result: page });
          break;
        }
        case 'annotations.get': {
          this.send(socket, { type: 'ack', requestId: command.requestId, result: annotationBoard(this.ctx.storage.sql, command.payload.index) });
          break;
        }
        case 'annotation.add':
        case 'annotation.remove':
        case 'annotations.clear': {
          if (!await this.authorized(attachment, true)) throw new ProtocolError('UNAUTHORIZED', 'Presenter authentication required');
          const board = changeAnnotations(this.ctx.storage, command);
          await this.clearPreview(socket);
          await this.broadcast({ type: 'annotations.changed', board });
          this.send(socket, { type: 'ack', requestId: command.requestId, result: board });
          break;
        }
      }
    } catch (error) {
      const expected = error instanceof ProtocolError;
      if (!expected) console.error(JSON.stringify({ event: 'socket_command_failed' }));
      this.send(socket, { type: 'error', requestId, code: expected ? error.code : 'UNAVAILABLE',
        message: expected ? error.message : 'Could not complete request. Retrying is safe.' });
    }
  }

  async webSocketError(socket: WebSocket) {
    await this.clearPreview(socket);
    try { socket.close(1011, 'Connection unavailable'); } catch { /* Already closed. */ }
    await this.broadcastPresenterPresence();
  }
  async webSocketClose(socket: WebSocket, code: number) {
    await this.clearPreview(socket);
    const valid = (code >= 1000 && code <= 1014 && ![1004, 1005, 1006].includes(code)) || (code >= 3000 && code <= 4999);
    socket.close(valid ? code : 1000);
    await this.broadcastPresenterPresence();
  }
}
