import { isPosition } from '../../shared/deck';
import type { LectureState, Question, QuestionPage } from '../../shared/deck';
import { ProtocolError } from '../../shared/protocol';
import type { Command, CommandPayloads, CommandResults, CommandType, ServerMessage, SessionSnapshot } from '../../shared/protocol';
import type { AnnotationBoard, StrokeAnnotation } from '../../shared/annotations';

export type Connection = 'connecting' | 'checking' | 'connected' | 'reconnecting' | 'locked';
export interface LiveView {
  connection: Connection;
  authorized: boolean;
  name: string | null;
  passwordSaved: boolean;
  authError: string;
  state: LectureState | null;
  presenterConnected: boolean;
  instant: boolean;
  questions: Question[];
  historyLoading: boolean;
  historyError: boolean;
  annotations: Record<number, AnnotationBoard>;
  previews: StrokeAnnotation[];
}
interface Pending {
  command: Command;
  sent: boolean;
  timer?: ReturnType<typeof setTimeout>;
  resolve: (result: unknown) => void;
  reject: (error: Error) => void;
}

// randomUUID requires HTTPS, but LAN development uses HTTP. getRandomValues is
// available there too, and still produces cryptographically random v4 IDs.
export function requestId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export class LectureClient {
  private view: LiveView = { connection: 'connecting', authorized: false, name: null, passwordSaved: false, authError: '', state: null, presenterConnected: false,
    instant: true, questions: [], historyLoading: true, historyError: false, annotations: {}, previews: [] };
  private listeners = new Set<() => void>();
  private pending = new Map<string, Pending>();
  private socket: WebSocket | null = null;
  private running = false;
  private ready = false;
  private cursor = 0;
  private authTimer?: ReturnType<typeof setTimeout>;
  private retry?: ReturnType<typeof setTimeout>;
  private heartbeat?: ReturnType<typeof setInterval>;
  private delay = 500;
  private historyPending = false;
  private moreHistory = false;
  private refreshNeeded = false;

  constructor(private presenter: boolean) {}
  getSnapshot = () => this.view;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private patch(update: Partial<LiveView>) {
    this.view = { ...this.view, ...update };
    this.listeners.forEach((listener) => listener());
  }

  start() {
    if (this.running) return;
    this.running = true;
    if (!this.presenter) {
      this.refreshNeeded = document.visibilityState === 'hidden';
      document.addEventListener('visibilitychange', this.visibilityChanged);
      window.addEventListener('blur', this.leftWindow);
      window.addEventListener('focus', this.returnedToWindow);
      window.addEventListener('pageshow', this.pageShown);
    }
    this.connect();
  }
  stop() {
    this.running = false;
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    window.removeEventListener('blur', this.leftWindow);
    window.removeEventListener('focus', this.returnedToWindow);
    window.removeEventListener('pageshow', this.pageShown);
    this.disconnect();
    for (const item of this.pending.values()) item.reject(new Error('Connection closed'));
    this.pending.clear();
  }

  private leftWindow = () => { this.refreshNeeded = true; };
  private visibilityChanged = () => {
    if (document.visibilityState === 'hidden') this.leftWindow();
    else this.returnedToWindow();
  };
  private pageShown = (event: PageTransitionEvent) => {
    if (event.persisted) { this.refreshNeeded = true; this.returnedToWindow(); }
  };
  private returnedToWindow = () => {
    if (!this.running || !this.refreshNeeded || document.visibilityState !== 'visible') return;
    // Visibility and focus often fire together; refresh once per return.
    this.refreshNeeded = false;
    // A suspended socket may still claim to be open, or never finish closing.
    // Replace it immediately and recover through the usual snapshot/replay path.
    this.reconnectNow();
  };
  private reconnectNow() {
    this.disconnect();
    this.patch({ connection: 'connecting', authorized: false, presenterConnected: false });
    this.connect();
  }
  private disconnect() {
    clearTimeout(this.retry); clearTimeout(this.authTimer); clearInterval(this.heartbeat);
    this.ready = false;
    for (const item of this.pending.values()) { clearTimeout(item.timer); item.sent = false; }
    const socket = this.socket; this.socket = null;
    socket?.close();
  }

  async enterParticipant(name: string, password: string) {
    if (!name.trim() || (!this.view.passwordSaved && !password.trim())) return false;
    this.patch({ authError: '' });
    try {
      const response = await fetch('/api/participation', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), ...(password.trim() ? { password: password.trim() } : {}) }) });
      if (!response.ok) {
        this.patch({ authError: response.status === 401 ? '비밀번호를 확인해주세요.' : '이름과 비밀번호를 확인하고 다시 시도해주세요.' });
        return false;
      }
      if (this.running) this.reconnectNow();
      return true;
    } catch {
      this.patch({ authError: '연결 상태를 확인하고 다시 시도해주세요.' });
      return false;
    }
  }

  async enterPresenter(key: string) {
    if (!key.trim()) return;
    this.patch({ authError: '', connection: 'checking' });
    try {
      const response = await fetch('/api/participation', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'presenter', key: key.trim() }) });
      if (!response.ok) { this.lock('발표자 키를 확인해주세요.'); return; }
      if (this.running) this.reconnectNow();
    } catch { this.lock('연결 상태를 확인하고 다시 시도해주세요.'); }
  }

  request<K extends CommandType>(type: K, payload: CommandPayloads[K]): Promise<CommandResults[K]> {
    return new Promise((resolve, reject) => {
      if (!this.running) { reject(new Error('Connection closed')); return; }
      const id = requestId();
      const command = { type, requestId: id, payload } as Command;
      this.pending.set(id, { command, sent: false, resolve: (value) => resolve(value as CommandResults[K]), reject });
      this.flush();
    });
  }

  preview(stroke: StrokeAnnotation) {
    // Transient input is never queued or replayed after reconnecting.
    if (this.presenter && this.view.authorized && this.ready && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'annotation.preview', payload: stroke }));
    }
  }

  private connect() {
    if (!this.running) return;
    this.patch({ connection: this.view.connection === 'reconnecting' ? 'reconnecting' : 'connecting', previews: [] });
    const url = new URL('/api/live', location.href);
    url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    url.searchParams.set('cursor', String(this.cursor));
    if (this.presenter) url.searchParams.set('role', 'presenter');
    const socket = new WebSocket(url);
    this.socket = socket;
    let lastMessage = Date.now();
    let receivedHandshake = false;
    // Also covers a stalled handshake before the socket opens.
    this.authTimer = setTimeout(() => { if (!receivedHandshake) socket.close(); }, 10000);
    socket.onopen = () => {
      if (socket !== this.socket) return;
      lastMessage = Date.now();
      this.heartbeat = setInterval(() => {
        if (Date.now() - lastMessage > 45000) socket.close();
        else if (socket.readyState === WebSocket.OPEN) socket.send('ping');
      }, 15000);
    };
    socket.onmessage = (event) => {
      if (socket !== this.socket || !this.running) return;
      lastMessage = Date.now();
      if (event.data === 'pong') return;
      let message: ServerMessage;
      try { message = JSON.parse(event.data) as ServerMessage; } catch { return; }
      if (message.type === 'ready') {
        if (receivedHandshake) return;
        receivedHandshake = true; this.ready = true; clearTimeout(this.authTimer); this.delay = 500;
        this.lock('');
      } else if (message.type === 'snapshot') {
        if (receivedHandshake || !this.validState(message.state)) return;
        receivedHandshake = true; this.ready = true; clearTimeout(this.authTimer); this.delay = 500;
        this.acceptSession(message);
      } else if (message.type === 'state') this.acceptState(message.state, false);
      else if (message.type === 'presenter.presence' && typeof message.connected === 'boolean') {
        this.patch({ presenterConnected: message.connected, instant: true });
      }
      else if (message.type === 'question.created') this.mergeQuestions([message.question]);
      else if (message.type === 'annotations.changed') this.acceptAnnotations(message.board);
      else if (message.type === 'annotation.preview') {
        const previews = this.view.previews.filter((item) => item.id !== message.stroke.id);
        const saved = this.view.annotations[message.stroke.index]?.items.some((item) => item.id === message.stroke.id);
        if (message.stroke.points.length && !saved) previews.push(message.stroke);
        this.patch({ previews });
      }
      else if (message.type === 'ack') {
        const item = this.pending.get(message.requestId);
        if (!item) return;
        clearTimeout(item.timer); this.pending.delete(message.requestId);
        if (item.command.type === 'question.create') this.mergeQuestions([message.result as Question]);
        if (['annotations.get', 'annotation.add', 'annotation.remove', 'annotations.clear'].includes(item.command.type)) {
          this.acceptAnnotations(message.result as AnnotationBoard);
        }
        item.resolve(message.result);
      } else if (message.type === 'error') {
        if (message.code === 'UNAVAILABLE' || message.requestId === null) { socket.close(); return; }
        const error = new ProtocolError(message.code, message.message);
        const item = this.pending.get(message.requestId);
        if (item) {
          clearTimeout(item.timer); this.pending.delete(message.requestId); item.reject(error);
          if (message.code === 'UNAUTHORIZED') this.reconnectNow();
        }
      }
    };
    socket.onclose = () => {
      if (socket !== this.socket) return;
      this.disconnect();
      if (this.running) {
        this.patch({ connection: 'reconnecting', authorized: false, presenterConnected: false, previews: [] });
        this.retry = setTimeout(() => this.connect(), this.delay);
        this.delay = Math.min(this.delay * 2, 8000);
      }
    };
    socket.onerror = () => socket.close();
  }

  private flush() {
    if (!this.ready || this.socket?.readyState !== WebSocket.OPEN) return;
    for (const item of this.pending.values()) {
      if (item.sent || (!['questions.list', 'annotations.get'].includes(item.command.type) && !this.view.authorized)) continue;
      item.sent = true;
      this.socket.send(JSON.stringify(item.command));
      const socket = this.socket;
      item.timer = setTimeout(() => socket.close(), 10000);
    }
  }

  private lock(authError: string) {
    this.patch({ authorized: false, name: null, connection: 'locked', authError, state: null, presenterConnected: false, questions: [], historyLoading: false });
    this.cursor = 0; this.moreHistory = false;
    for (const [id, item] of this.pending) {
      clearTimeout(item.timer); this.pending.delete(id); item.reject(new ProtocolError('UNAUTHORIZED', 'Lecture access required'));
    }
  }
  private acceptSession(snapshot: SessionSnapshot) {
    if (!this.validState(snapshot.state) || (snapshot.name !== null && (typeof snapshot.name !== 'string' || !snapshot.name.trim()))) return;
    this.acceptState(snapshot.state, true); this.acceptPage(snapshot.page);
    this.patch({ authorized: snapshot.name !== null, presenterConnected: snapshot.presenterConnected === true,
      name: snapshot.name,
      passwordSaved: snapshot.passwordSaved, authError: '', connection: 'connected' });
    this.flush(); this.loadHistory();
  }
  private validState(state: LectureState) {
    return isPosition(state) && Number.isSafeInteger(state.revision) && state.revision >= 0;
  }
  private acceptState(state: LectureState, instant: boolean) {
    if (!this.validState(state) || (this.view.state && state.revision < this.view.state.revision)) return;
    this.patch({ state, instant });
  }
  private acceptAnnotations(board: AnnotationBoard) {
    const previous = this.view.annotations[board.index];
    if (previous && previous.revision > board.revision) return;
    const saved = new Set(board.items.map((item) => item.id));
    this.patch({ annotations: { ...this.view.annotations, [board.index]: board },
      previews: this.view.previews.filter((item) => !saved.has(item.id)) });
  }
  private mergeQuestions(questions: Question[]) {
    const merged = new Map(this.view.questions.map((question) => [question.id, question]));
    for (const question of questions) merged.set(question.id, question);
    this.patch({ questions: [...merged.values()].sort((a, b) => a.id - b.id) });
  }
  private acceptPage(page: QuestionPage) {
    this.mergeQuestions(page.questions);
    // Broadcast IDs never advance this cursor: history must fill every gap first.
    if (page.nextCursor >= this.cursor) { this.cursor = page.nextCursor; this.moreHistory = page.hasMore; }
    this.patch({ historyLoading: this.moreHistory, historyError: false });
  }
  private loadHistory() {
    if (!this.moreHistory || this.historyPending || !this.running) return;
    this.historyPending = true;
    this.request('questions.list', { cursor: this.cursor }).then((page) => {
      if (this.running) this.acceptPage(page);
    }).catch(() => { if (this.running) this.patch({ historyLoading: false, historyError: true }); })
      .finally(() => { this.historyPending = false; if (this.running && !this.view.historyError) this.loadHistory(); });
  }
}
