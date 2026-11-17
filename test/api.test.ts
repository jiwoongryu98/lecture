import { env, exports } from 'cloudflare:workers';
import { abortAllDurableObjects, evictAllDurableObjects, runInDurableObject } from 'cloudflare:test';
import { afterEach, expect, it } from 'vitest';
import type { CommandPayloads, CommandResults, CommandType, ServerMessage } from '../shared/protocol';
import type { StrokeAnnotation, TextAnnotation } from '../shared/annotations';

const base = 'https://test/api';
const peers: Peer[] = [];
class Peer {
  private messages: ServerMessage[] = [];
  private waiting: { matches: (message: ServerMessage) => boolean; resolve: (message: ServerMessage) => void }[] = [];
  constructor(public socket: WebSocket) {
    socket.addEventListener('message', (event) => {
      if (event.data === 'pong') return;
      const message = JSON.parse(String(event.data)) as ServerMessage;
      const index = this.waiting.findIndex((waiter) => waiter.matches(message));
      if (index < 0) this.messages.push(message);
      else this.waiting.splice(index, 1)[0].resolve(message);
    });
    socket.accept(); peers.push(this);
  }
  next(matches: (message: ServerMessage) => boolean): Promise<ServerMessage> {
    const index = this.messages.findIndex(matches);
    if (index >= 0) return Promise.resolve(this.messages.splice(index, 1)[0]);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Socket response timeout')), 5000);
      this.waiting.push({ matches, resolve: (message) => { clearTimeout(timer); resolve(message); } });
    });
  }
  async request<K extends CommandType>(type: K, payload: CommandPayloads[K], requestId = crypto.randomUUID()) {
    this.socket.send(JSON.stringify({ type, requestId, payload }));
    return this.next((message) => (message.type === 'ack' || message.type === 'error') && message.requestId === requestId);
  }
  async ok<K extends CommandType>(type: K, payload: CommandPayloads[K], id?: string): Promise<CommandResults[K]> {
    const message = await this.request(type, payload, id);
    expect(message.type).toBe('ack');
    if (message.type !== 'ack') throw new Error('Command rejected');
    return message.result as CommandResults[K];
  }
  auth() { return this.ok('presenter.auth', { key: 'test-presenter-key' }); }
}
async function connect(cursor = 0) {
  const response = await exports.default.fetch(`${base}/live?cursor=${cursor}`, { headers: {
    Upgrade: 'websocket', Cookie: 'comment_password=test-comment-password',
  } });
  expect(response.status).toBe(101);
  const peer = new Peer(response.webSocket!);
  const snapshot = await peer.next((message) => message.type === 'snapshot');
  if (snapshot.type !== 'snapshot') throw new Error('Snapshot missing');
  await peer.ok('participant.join', { name: 'Learner' });
  return { peer, snapshot };
}
async function readOnlyPeer(cookie = '') {
  const response = await exports.default.fetch(`${base}/live`, { headers: { Upgrade: 'websocket', Cookie: cookie } });
  const peer = new Peer(response.webSocket!);
  expect(await peer.next((message) => message.type === 'snapshot')).toMatchObject({ name: null });
  return peer;
}
async function closePeers() {
  await Promise.all(peers.splice(0).map((peer) => new Promise<void>((resolve) => {
    if (peer.socket.readyState === 3) { resolve(); return; }
    peer.socket.addEventListener('close', () => resolve(), { once: true });
    peer.socket.close(1000);
  })));
}
afterEach(closePeers);

it('streams presenter ink, persists completed annotations, and restores them after object recreation', async () => {
  const { peer: presenter } = await connect(); await presenter.auth();
  const viewer = await readOnlyPeer();
  const stroke: StrokeAnnotation = { id: crypto.randomUUID(), index: 4, step: 2, kind: 'stroke', color: '#d13c45', points: [[10, 20], [500, 400], [1600, 900]] };
  expect(await viewer.ok('annotations.get', { index: 4 })).toEqual({ index: 4, revision: 0, items: [] });
  expect(await viewer.request('annotation.add', stroke)).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(await viewer.request('annotations.clear', { index: 4 })).toMatchObject({ code: 'UNAUTHORIZED' });
  presenter.socket.send(JSON.stringify({ type: 'annotation.preview', payload: stroke }));
  expect(await viewer.next((message) => message.type === 'annotation.preview')).toEqual({ type: 'annotation.preview', stroke });
  expect((await viewer.ok('annotations.get', { index: 4 })).items).toEqual([]);
  await evictAllDurableObjects();
  const requestId = crypto.randomUUID();
  const saved = await presenter.ok('annotation.add', stroke, requestId);
  expect(saved.items).toEqual([stroke]);
  expect(await viewer.next((message) => message.type === 'annotations.changed')).toEqual({ type: 'annotations.changed', board: saved });
  expect(await presenter.ok('annotation.add', stroke, requestId)).toEqual(saved);
  await closePeers(); await abortAllDurableObjects();
  const refreshed = await readOnlyPeer();
  expect(await refreshed.ok('annotations.get', { index: 4 })).toEqual(saved);
  expect((await refreshed.ok('annotations.get', { index: 5 })).items).toEqual([]);
});

it('supports undo and clear without resurrecting annotations when commands are retried', async () => {
  const { peer } = await connect(); await peer.auth();
  const first: TextAnnotation = { id: crypto.randomUUID(), index: 5, step: 1, kind: 'text', color: '#2563b8', x: 100, y: 100, text: '한국어 설명\n두 번째 줄' };
  const requestId = crypto.randomUUID();
  await peer.ok('annotation.add', first, requestId);
  const second = { ...first, id: crypto.randomUUID(), step: 2, text: '<script>plain text</script>' };
  await peer.ok('annotation.add', second);
  expect((await peer.ok('annotation.remove', { index: 5, id: second.id })).items).toEqual([first]);
  const clearId = crypto.randomUUID();
  const cleared = await peer.ok('annotations.clear', { index: 5 }, clearId);
  expect(cleared.items).toEqual([]);
  expect(await peer.ok('annotation.add', first, requestId)).toEqual(cleared);
  await peer.ok('annotation.add', second);
  expect((await peer.ok('annotations.clear', { index: 5 }, clearId)).items).toEqual([second]);
  expect(await peer.request('annotation.add', { ...first, text: 'changed' }, requestId)).toMatchObject({ code: 'CONFLICT' });
});

it('rejects invalid annotation coordinates and removes unfinished ink when its presenter disconnects', async () => {
  const { peer } = await connect(); await peer.auth();
  const viewer = await readOnlyPeer();
  const stroke: StrokeAnnotation = { id: crypto.randomUUID(), index: 4, step: 0, kind: 'stroke', color: '#22354a', points: [[50, 60]] };
  for (const invalid of [{ ...stroke, points: [[-1, 1]] }, { ...stroke, points: [[1601, 1]] },
    { ...stroke, points: [[1, 901]] }, { ...stroke, points: [[1.2, 1]] }, { ...stroke, step: 99 },
    { ...stroke, points: [] }] satisfies StrokeAnnotation[]) {
    expect(await peer.request('annotation.add', invalid)).toMatchObject({ code: 'BAD_REQUEST' });
  }
  viewer.socket.send(JSON.stringify({ type: 'annotation.preview', payload: stroke }));
  expect(await viewer.next((message) => message.type === 'error')).toMatchObject({ code: 'UNAUTHORIZED' });
  peer.socket.send(JSON.stringify({ type: 'annotation.preview', payload: stroke }));
  await viewer.next((message) => message.type === 'annotation.preview');
  peer.socket.close(1000);
  expect(await viewer.next((message) => message.type === 'annotation.preview')).toEqual({ type: 'annotation.preview', stroke: { ...stroke, points: [] } });
});

it('exposes health, posting participation, and WebSocket HTTP endpoints', async () => {
  expect((await exports.default.fetch('https://test/api/health')).status).toBe(200);
  expect((await exports.default.fetch('https://test/api/health', { method: 'POST' })).status).toBe(405);
  expect((await exports.default.fetch(base + '/participation')).status).toBe(405);
  for (const path of ['/state', '/presenter/session', '/questions']) {
    expect((await exports.default.fetch(base + path)).status).toBe(404);
    expect((await exports.default.fetch(base + path, { method: 'POST' })).status).toBe(404);
  }
  expect((await exports.default.fetch(base + '/live')).status).toBe(426);
  expect((await exports.default.fetch(base + '/live', { method: 'POST' })).status).toBe(405);
  expect((await exports.default.fetch(base + '/live', { headers: { Upgrade: 'websocket', Origin: 'https://other.test' } })).status).toBe(403);
  expect((await exports.default.fetch('https://test/api/lectures/other/live')).status).toBe(404);
  expect((await exports.default.fetch('https://test/api/lectures/example-presentation/live', { headers: { Upgrade: 'websocket' } })).status).toBe(404);
  expect((await exports.default.fetch(base + '/live?cursor=-1', { headers: { Upgrade: 'websocket' } })).status).toBe(400);
});

it('authorizes presenter connections and rejects anonymous or invalid slide commands', async () => {
  const { peer } = await connect();
  expect(await peer.request('slide.set', { index: 1, step: 0 })).toMatchObject({ type: 'error', code: 'UNAUTHORIZED' });
  expect(await peer.request('presenter.auth', { key: 'wrong' })).toMatchObject({ type: 'error', code: 'UNAUTHORIZED' });
  await peer.auth();
  for (const position of [{ index: 9999, step: 0 }, { index: 1, step: 1 }, { index: 4, step: 1.5 }]) {
    expect(await peer.request('slide.set', position)).toMatchObject({ type: 'error', code: 'BAD_REQUEST' });
  }
  expect(await peer.ok('slide.set', { index: 4, step: 1 })).toMatchObject({ index: 4, step: 1 });
});

it('serves the matching speaker notes only to an authenticated presenter', async () => {
  for (const cookie of ['', 'presenter_key=wrong', 'comment_password=test-comment-password']) {
    const response = await exports.default.fetch(base + '/notes/49', { headers: { Cookie: cookie } });
    expect(response.status).toBe(401);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  }
  const headers = { Cookie: 'presenter_key=test-presenter-key' };
  for (const index of [1, 49, 61]) {
    const response = await exports.default.fetch(base + '/notes/' + index, { headers });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    if (response.status === 404) {
      expect(await response.json()).toEqual({ error: 'Notes not found' });
    } else {
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
      const markdown = await response.text();
      expect(markdown).toMatch(/^# .+/);
      expect(markdown).not.toMatch(/^- .*슬라이드 ID:/m);
    }
  }
  expect((await exports.default.fetch(base + '/notes/not-a-slide', { headers })).status).toBe(404);
  expect((await exports.default.fetch(base + '/notes/49', { method: 'POST', headers })).status).toBe(405);
});

it('reports presenter presence only after authentication and clears it when authentication is revoked', async () => {
  const viewer = await connect();
  expect(viewer.snapshot.presenterConnected).toBe(false);
  const response = await exports.default.fetch(`${base}/live?role=presenter`, { headers: { Upgrade: 'websocket' } });
  const presenter = new Peer(response.webSocket!);
  expect(await presenter.next((message) => message.type === 'ready')).toMatchObject({ type: 'ready' });
  expect((await connect()).snapshot.presenterConnected).toBe(false);

  expect(await presenter.request('presenter.auth', { key: 'wrong' })).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: false });
  expect((await presenter.auth()).presenterConnected).toBe(true);
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: true });
  expect((await connect()).snapshot.presenterConnected).toBe(true);

  expect(await presenter.request('presenter.auth', { key: 'wrong' })).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: false });
  expect((await connect()).snapshot.presenterConnected).toBe(false);
});

it('keeps presence online until the last presenter closes while retaining the saved slide', async () => {
  const viewer = await connect();
  const first = await connect(); const second = await connect();
  await first.peer.auth();
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: true });
  await second.peer.auth();
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: true });
  const saved = await second.peer.ok('slide.set', { index: 25, step: 2 });

  first.peer.socket.close(1000);
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: true });
  expect((await connect()).snapshot.presenterConnected).toBe(true);
  second.peer.socket.close(1000);
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: false });
  const offline = (await connect()).snapshot;
  expect(offline.presenterConnected).toBe(false);
  expect(offline.state).toEqual(saved);
});

it('notifies viewers when a presenter socket errors', async () => {
  const viewer = await connect(); const presenter = await connect();
  await presenter.peer.auth();
  await viewer.peer.next((message) => message.type === 'presenter.presence' && message.connected);
  await runInDurableObject(env.LECTURE_SESSIONS.getByName('presentation'), async (instance, state) => {
    const socket = state.getWebSockets().find((socket) => socket.deserializeAttachment()?.role === 'presenter');
    expect(socket).toBeDefined();
    await instance.webSocketError(socket!);
  });
  expect(await viewer.peer.next((message) => message.type === 'presenter.presence'))
    .toEqual({ type: 'presenter.presence', connected: false });
  expect((await connect()).snapshot.presenterConnected).toBe(false);
});

it('opens at the welcome slide when saved state references a removed slide', async () => {
  const session = env.LECTURE_SESSIONS.getByName('presentation');
  await runInDurableObject(session, (_instance, state) => {
    state.storage.sql.exec("UPDATE presentation SET slideIndex = 9999, step = 1, revision = 74, updatedAt = 123 WHERE id = 1");
  });
  const { snapshot } = await connect();
  expect(snapshot.state).toEqual({ index: 1, step: 0, revision: 74, updatedAt: 123 });
});

it('broadcasts named questions on the same socket as slides and ignores forged author fields', async () => {
  const first = await connect(); const second = await connect();
  const forgedInput = { index: 1, step: 0, body: '<script>hello</script>', name: 'Forged name' };
  const question = await first.peer.ok('question.create', forgedInput);
  expect(question).not.toHaveProperty('lectureId');
  expect(question.name).toBe('Learner'); expect(question.body).toBe('<script>hello</script>');
  for (const peer of [first.peer, second.peer]) {
    expect(await peer.next((message) => message.type === 'question.created')).toEqual({ type: 'question.created', question });
  }
  await first.peer.auth();
  const state = await first.peer.ok('slide.set', { index: 4, step: 2 });
  for (const peer of [first.peer, second.peer]) {
    expect(await peer.next((message) => message.type === 'state' && message.state.revision === state.revision)).toEqual({ type: 'state', state });
  }
});

it('deduplicates lost-ack question retries across connections and object recreation', async () => {
  const { peer } = await connect();
  const id = crypto.randomUUID();
  const input = { index: 4, step: 2, body: 'Same submission' };
  // Simulate an application discarding the first acknowledgement.
  const saved = await peer.ok('question.create', input, id);
  expect(saved).toMatchObject(input);
  expect(await peer.ok('question.create', input, id)).toEqual(saved);
  await closePeers(); await abortAllDurableObjects();
  const next = await connect();
  expect(await next.peer.ok('question.create', input, id)).toEqual(saved);
  expect(await next.peer.request('question.create', { ...input, body: 'different' }, id)).toMatchObject({ type: 'error', code: 'CONFLICT' });
  expect(await next.peer.request('question.create', { ...input, step: 3 }, id)).toMatchObject({ type: 'error', code: 'CONFLICT' });
  expect(await next.peer.request('question.create', { ...input, index: 5 }, id)).toMatchObject({ type: 'error', code: 'CONFLICT' });
  const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM questions WHERE submissionRequestId = ?').bind(id).first<{ count: number }>();
  expect(count?.count).toBe(1);
});

it('validates JSON, command sizes, IDs, cursor bounds, and question content', async () => {
  const { peer } = await connect();
  for (const input of [{ index: 1, step: 0, body: '' }, { index: 1, step: 0, body: 'x'.repeat(1001) },
    { index: 9999, step: 0, body: 'ok' }, { index: 4, step: 99, body: 'ok' }]) {
    expect(await peer.request('question.create', input)).toMatchObject({ type: 'error', code: 'BAD_REQUEST' });
  }
  expect(await peer.request('questions.list', { cursor: -1 })).toMatchObject({ type: 'error', code: 'BAD_REQUEST' });
  for (const raw of ['{', 'x'.repeat(9000), JSON.stringify({ type: 'question.create', requestId: 'not-a-uuid', payload: {} })]) {
    peer.socket.send(raw);
    expect(await peer.next((message) => message.type === 'error' && message.requestId === null)).toMatchObject({ code: 'BAD_REQUEST' });
  }
  const requestId = crypto.randomUUID();
  peer.socket.send(JSON.stringify({ type: 'question.delete', requestId, payload: { id: 1 } }));
  expect(await peer.next((message) => message.type === 'error' && message.requestId === requestId)).toMatchObject({ code: 'BAD_REQUEST' });
});

it('pages saved questions and replays missed history from an exclusive cursor', async () => {
  const before = await env.DB.prepare('SELECT MAX(id) AS id FROM questions').first<{ id: number | null }>();
  const cursor = before?.id ?? 0;
  await env.DB.batch(Array.from({ length: 53 }, (_, i) => env.DB.prepare(
    'INSERT INTO questions (slideIndex, step, body, createdAt, submissionRequestId) VALUES (?, ?, ?, ?, ?)',
  ).bind(4, 2, `Question ${i}`, i, crypto.randomUUID())));
  const { peer, snapshot } = await connect(cursor);
  expect(snapshot.page.questions).toHaveLength(50); expect(snapshot.page.hasMore).toBe(true);
  const page = await peer.ok('questions.list', { cursor: snapshot.page.nextCursor });
  expect(page.questions).toHaveLength(3); expect(page.hasMore).toBe(false);
  expect(new Set([...snapshot.page.questions, ...page.questions].map((q) => q.id)).size).toBe(53);
  const missed = await peer.ok('question.create', { index: 1, step: 0, body: 'Arrived while away' });
  const resumed = await connect(page.nextCursor);
  expect(resumed.snapshot.page.questions.map((q) => q.id)).toContain(missed.id);
});

it('replays slide receipts without incrementing revisions or broadcasting a stale position', async () => {
  const { peer } = await connect(); await peer.auth();
  const id = crypto.randomUUID();
  const position = { index: 4, step: 0 };
  const original = await peer.ok('slide.set', position, id);
  const current = await peer.ok('slide.set', { index: 25, step: 2 });
  expect(await peer.ok('slide.set', position, id)).toEqual(original);
  expect((await connect()).snapshot.state).toEqual(current);
  expect(await peer.request('slide.set', { ...position, step: 1 }, id)).toMatchObject({ code: 'CONFLICT' });
  await closePeers(); await abortAllDurableObjects();
  const resumed = await connect(); await resumed.peer.auth();
  expect(await resumed.peer.ok('slide.set', position, id)).toEqual(original);
  expect((await connect()).snapshot.state).toEqual(current);
});

it('keeps presenter authorization and both broadcasts through hibernation', async () => {
  const host = await connect(); const viewer = await connect(); await host.peer.auth();
  await evictAllDurableObjects();
  expect((await connect()).snapshot.presenterConnected).toBe(true);
  const state = await host.peer.ok('slide.set', { index: 4, step: 3 });
  expect(await viewer.peer.next((message) => message.type === 'state' && message.state.revision === state.revision)).toEqual({ type: 'state', state });
  const question = await viewer.peer.ok('question.create', { index: 4, step: 0, body: 'Still connected' });
  expect(question.name).toBe('Learner');
  expect(await host.peer.next((message) => message.type === 'question.created')).toEqual({ type: 'question.created', question });
});

it('requires authentication again on reconnect and uses the shared presentation object', async () => {
  const host = await connect(); await host.peer.auth();
  const state = await host.peer.ok('slide.set', { index: 25, step: 1 });
  const resumed = await connect();
  expect(resumed.snapshot.state).toEqual(state);
  expect(await resumed.peer.request('slide.set', { index: 1, step: 0 })).toMatchObject({ code: 'UNAUTHORIZED' });
  expect(await env.LECTURE_SESSIONS.getByName('presentation').getState()).toEqual(state);
  expect((await connect()).snapshot.state).toEqual(state);
});

it('remembers the viewer name and password in cookies for fresh connections', async () => {
  const enter = (name: string, password: string, origin = 'https://test') => exports.default.fetch(`${origin}/api/participation`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ name, password }),
  });
  expect((await enter('Learner', '')).status).toBe(400);
  expect((await enter('Learner', 'wrong')).status).toBe(401);
  for (const blank of ['', '  ', '\t\n']) expect((await enter(blank, 'test-comment-password')).status).toBe(400);
  const name = ` 김민재 / HR 👋 ${'a'.repeat(81)} `;
  const response = await enter(name, 'test-comment-password');
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ name: name.trim(), passwordSaved: true });
  const cookies = response.headers.getSetCookie();
  expect(cookies).toHaveLength(2);
  const saved = cookies.find((value) => value.startsWith('comment_password='))!;
  expect(saved).toContain('Max-Age=2592000');
  expect(cookies.every((value) => value.includes('HttpOnly') && value.includes('SameSite=Lax') && value.includes('Secure') && value.includes('Path=/api'))).toBe(true);
  expect(cookies.find((value) => value.startsWith('comment_name='))).toContain(encodeURIComponent(name.trim()));
  expect(cookies.every((value) => value.includes('Max-Age=2592000'))).toBe(true);
  const cookie = cookies.map((value) => value.split(';')[0]).join('; ');
  const joined = await exports.default.fetch(base + '/live', { headers: { Upgrade: 'websocket', Cookie: cookie } });
  const peer = new Peer(joined.webSocket!);
  expect(joined.headers.get('Set-Cookie')).toBeNull();
  expect(await peer.next((message) => message.type === 'snapshot')).toMatchObject({ name: name.trim(), passwordSaved: true });
  const original = await peer.ok('question.create', { index: 1, step: 0, body: 'A named question' });
  expect(original.name).toBe(name.trim());
  const fresh = await exports.default.fetch(base + '/live', { headers: { Upgrade: 'websocket', Cookie: cookie } });
  const refreshed = new Peer(fresh.webSocket!);
  expect(await refreshed.next((message) => message.type === 'snapshot')).toMatchObject({ name: name.trim() });
  expect((await refreshed.ok('question.create', { index: 1, step: 0, body: 'New page' })).name).toBe(name.trim());
  expect((await env.DB.prepare('SELECT name FROM questions WHERE id = ?').bind(original.id).first<{ name: string }>())?.name).toBe(name.trim());
  const local = await enter('Learner', 'test-comment-password', 'http://test');
  expect(local.headers.getSetCookie().every((value) => !value.includes('Secure'))).toBe(true);
  const savedPasswordOnly = await exports.default.fetch(base + '/participation', { method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: saved.split(';')[0] }, body: JSON.stringify({ name: 'Remember me' }) });
  expect(savedPasswordOnly.status).toBe(200);
  expect(savedPasswordOnly.headers.getSetCookie().find((value) => value.startsWith('comment_name='))).toContain('Remember%20me');
});

it('saves a presenter key cookie and restores slide publishing after refresh', async () => {
  const enter = (key: string) => exports.default.fetch(base + '/participation', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'presenter', key }) });
  expect((await enter('wrong')).status).toBe(401);
  const response = await enter('test-presenter-key');
  expect(response.status).toBe(200);
  const cookies = response.headers.getSetCookie();
  expect(cookies).toHaveLength(1);
  expect(cookies[0]).toContain('presenter_key=');
  for (const attribute of ['HttpOnly', 'SameSite=Lax', 'Secure', 'Max-Age=2592000', 'Path=/api']) expect(cookies[0]).toContain(attribute);
  const cookie = cookies[0].split(';')[0];
  for (let page = 0; page < 2; page++) {
    const upgraded = await exports.default.fetch(base + '/live?role=presenter', { headers: { Upgrade: 'websocket', Cookie: cookie } });
    const peer = new Peer(upgraded.webSocket!);
    expect(await peer.next((message) => message.type === 'snapshot')).toMatchObject({ name: '발표자', presenterConnected: true });
    expect(await peer.ok('slide.set', { index: 4, step: page })).toMatchObject({ index: 4, step: page });
  }
  const invalid = await exports.default.fetch(base + '/live?role=presenter', { headers: { Upgrade: 'websocket', Cookie: 'presenter_key=wrong' } });
  const peer = new Peer(invalid.webSocket!);
  expect(await peer.next((message) => message.type === 'ready')).toEqual({ type: 'ready' });
  expect(await peer.request('slide.set', { index: 1, step: 0 })).toMatchObject({ code: 'UNAUTHORIZED' });
});

it('allows anonymous viewing and questions but requires a name and password to post', async () => {
  const blocked = await readOnlyPeer();
  const wrong = await readOnlyPeer('comment_name=Learner; comment_password=wrong');
  const unnamed = await readOnlyPeer('comment_name=%20%20; comment_password=test-comment-password');
  for (const peer of [blocked, wrong, unnamed]) {
    expect(await peer.ok('questions.list', { cursor: 0 })).toHaveProperty('questions');
    expect(await peer.request('question.create', { index: 1, step: 0, body: 'Blocked' })).toMatchObject({ code: 'UNAUTHORIZED' });
    expect(await peer.request('slide.set', { index: 1, step: 0 })).toMatchObject({ code: 'UNAUTHORIZED' });
  }
  for (const peer of [blocked, wrong]) {
    expect(await peer.request('participant.join', { name: 'Learner' })).toMatchObject({ code: 'UNAUTHORIZED' });
  }
  const host = await readOnlyPeer(); await host.auth();
  const state = await host.ok('slide.set', { index: 4, step: 1 });
  const question = await host.ok('question.create', { index: 1, step: 0, body: 'Presenter question' });
  expect(question.name).toBe('발표자');
  for (const peer of [blocked, wrong, unnamed]) {
    expect(await peer.next((message) => message.type === 'state' && message.state.revision === state.revision)).toEqual({ type: 'state', state });
    expect(await peer.next((message) => message.type === 'question.created' && message.question.id === question.id)).toEqual({ type: 'question.created', question });
  }
  const resumed = await readOnlyPeer();
  expect((await resumed.ok('questions.list', { cursor: question.id - 1 })).questions.some((row) => row.id === question.id)).toBe(true);
  const renewed = await connect();
  expect(renewed.snapshot).toMatchObject({ name: null, passwordSaved: true });
});
