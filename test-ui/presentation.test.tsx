import { act, fireEvent, render, renderHook, waitFor, within } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { usePresentation } from '../src/presentation/usePresentation';
import { useLectureConnection } from '../src/connection/useLectureConnection';
import { LectureClient, requestId } from '../src/connection/lecture-client';
import { isRequestId } from '../shared/protocol';
import App from '../src/App';
import { lecture } from '../content';
import type { LectureState, Question, QuestionPage } from '../shared/deck';
import type { Command, ServerMessage } from '../shared/protocol';

const initial: LectureState = { index: 1, step: 0, revision: 0, updatedAt: 0 };
const firstContentIndex = 2;
const historyIndex = 5;
const empty: QuestionPage = { questions: [], nextCursor: 0, hasMore: false };
const question: Question = { id: 1, index: 1, step: 0, body: 'A question', name: null, createdAt: 1 };
let handle: (socket: FakeSocket, command: Command) => void;
let passwordSaved = true;
let viewerName: string | null = 'Learner';
let presenterCookie = false;
let presenterConnected = true;
class FakeSocket {
  static OPEN = 1;
  static instances: FakeSocket[] = [];
  readyState = 0;
  sent: Command[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((message: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  name: string | null = null;
  session = { state: initial, presenterConnected, page: empty, name: '발표자', passwordSaved: false };
  constructor(public url: string | URL) { FakeSocket.instances.push(this); }
  open(state = initial, page = empty) {
    this.session = { state, presenterConnected, page, name: '발표자', passwordSaved: false };
    this.readyState = 1; this.onopen?.();
    this.server(new URL(this.url).searchParams.get('role') === 'presenter'
      ? presenterCookie ? { type: 'snapshot', ...this.session } : { type: 'ready' }
      : { type: 'snapshot', state, presenterConnected, page, name: passwordSaved ? viewerName : null, passwordSaved });
    this.name = passwordSaved ? viewerName : null;
  }
  server(message: ServerMessage | 'pong') { this.onmessage?.(new MessageEvent('message', { data: message === 'pong' ? message : JSON.stringify(message) })); }
  send(message: string) {
    if (message === 'ping') { this.server('pong'); return; }
    const command = JSON.parse(message) as Command; this.sent.push(command);
    queueMicrotask(() => {
      if (this.readyState !== 1) return;
      if (command.type === 'participant.join') {
        this.name = command.payload.name.trim();
        this.server({ type: 'ack', requestId: command.requestId, result: { name: this.name } });
      } else handle(this, command);
    });
  }
  close() { this.readyState = 3; this.onclose?.(); }
}
function respond(socket: FakeSocket, command: Command) {
  if (command.type === 'annotations.get') {
    socket.server({ type: 'ack', requestId: command.requestId, result: { index: command.payload.index, revision: 0, items: [] } });
  } else if (command.type === 'presenter.auth') {
    socket.server(command.payload.key === 'fixture-key'
      ? { type: 'ack', requestId: command.requestId, result: socket.session }
      : { type: 'error', requestId: command.requestId, code: 'UNAUTHORIZED', message: 'Invalid key' });
  } else if (command.type === 'question.create') socket.server({ type: 'ack', requestId: command.requestId, result: { ...question, ...command.payload, name: socket.name } });
  else if (command.type === 'questions.list') socket.server({ type: 'ack', requestId: command.requestId, result: empty });
}
function useSystem(presenter = false) {
  const live = useLectureConnection(presenter);
  return { ...live, ...usePresentation(presenter, live) };
}
beforeEach(() => {
  history.replaceState(null, '', '/'); sessionStorage.clear(); window.localStorage.clear(); FakeSocket.instances = []; passwordSaved = true; viewerName = 'Learner'; presenterCookie = false; presenterConnected = true;
  vi.stubGlobal('WebSocket', FakeSocket); vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Unexpected HTTP request'); }));
  handle = respond;
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it('generates valid secure request IDs on an HTTP LAN origin without randomUUID', () => {
  vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });
  const ids = Array.from({ length: 100 }, requestId);
  expect(ids.every(isRequestId)).toBe(true);
  expect(new Set(ids).size).toBe(100);
});

it('keeps navigation available and explains a rejected slide fullscreen request', async () => {
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open());
  const stage = view.container.querySelector<HTMLElement>('.stage')!;
  stage.requestFullscreen = vi.fn().mockRejectedValue(new Error('Fullscreen was denied'));
  const fullscreen = view.getByRole('button', { name: '슬라이드 전체 화면' });
  fireEvent.click(fullscreen);
  await view.findByText('이 브라우저에서는 전체 화면을 사용할 수 없습니다.');
  expect(fullscreen.getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(view.getByRole('button', { name: '다음 단계' }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe(String(firstContentIndex));
});

it('opens the default route at the first slide and disables following without a connected presenter', () => {
  presenterConnected = false;
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: 26, step: 2, revision: 10 }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('1');
  expect((view.getByRole('button', { name: '재생' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.keyDown(document.body, { key: ' ' });
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('1');
  fireEvent.click(view.getByRole('button', { name: '다음 단계' }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe(String(firstContentIndex));
});

it('starts playing from the default route when a presenter is connected', () => {
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: 26, step: 2, revision: 10 }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('26');
  const pause = view.getByRole('button', { name: '정지' }) as HTMLButtonElement;
  expect(pause.disabled).toBe(false);
  expect(pause.getAttribute('aria-pressed')).toBe('true');
});

it.each(['.s01-epoch-copy a', '.s01-timeline a text'])('does not toggle presenter following when Space is pressed on a reference: %s', (selector) => {
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: historyIndex }));
  const reference = view.container.querySelector(selector)!;
  expect(reference).not.toBeNull();
  fireEvent.keyDown(reference, { key: ' ' });
  expect(view.getByRole('button', { name: '정지' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.keyDown(document.body, { key: ' ' });
  expect(view.getByRole('button', { name: '재생' }).getAttribute('aria-pressed')).toBe('false');
});

it('animates navigation and normal live changes while keeping reveal steps and catch-up separate', () => {
  const { result } = renderHook(() => useSystem());
  const socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open());
  expect(result.current.slideTransition).toBe('none');
  act(() => result.current.go(1));
  expect(result.current.slideTransition).toBe('forward');
  act(() => result.current.go(-1));
  expect(result.current.slideTransition).toBe('backward');
  act(() => result.current.navigate({ index: 5, step: 1 }));
  expect(result.current.slideTransition).toBe('fade');
  act(() => result.current.go(1));
  expect(result.current.slideTransition).toBe('none');
  act(() => socket.server({ type: 'state', state: { ...initial, index: 6, revision: 1 } }));
  act(() => result.current.toggleFollowing());
  expect(result.current.state.position.index).toBe(6);
  expect(result.current.instant).toBe(true);
  expect(result.current.slideTransition).toBe('none');
  act(() => socket.server({ type: 'state', state: { ...initial, index: 7, revision: 2 } }));
  expect(result.current.slideTransition).toBe('forward');
  expect(result.current.instant).toBe(false);
  act(() => socket.server({ type: 'state', state: { ...initial, index: 7, step: 1, revision: 3 } }));
  expect(result.current.slideTransition).toBe('none');
  act(() => socket.server({ type: 'state', state: { ...initial, index: 6, revision: 4 } }));
  expect(result.current.slideTransition).toBe('backward');
});

it.each(['/?index=7&step=1', '/?index=1&step=0', '/?step=0'])(
  'starts paused at %s with a connected presenter and catches up only on 재생', (url) => {
    history.replaceState(null, '', url);
    const view = render(<App deck={lecture} />);
    const socket = FakeSocket.instances.at(-1)!;
    act(() => socket.open({ ...initial, index: 26, step: 2, revision: 10 }));
    const requested = url.includes('index=7') ? 7 : 1;
    expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe(String(requested));
    const play = view.getByRole('button', { name: '재생' }) as HTMLButtonElement;
    expect(play.disabled).toBe(false);
    expect(play.getAttribute('aria-pressed')).toBe('false');
    act(() => socket.server({ type: 'state', state: { ...initial, index: historyIndex, step: 3, revision: 11 } }));
    expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe(String(requested));
    fireEvent.click(play);
    expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe(String(historyIndex));
    expect(view.container.querySelector('.slide')?.getAttribute('data-step')).toBe('3');
    expect(view.getByRole('button', { name: '정지' }).getAttribute('aria-pressed')).toBe('true');
  },
);

it('preserves explicit slide links when no presenter is connected', () => {
  presenterConnected = false;
  history.replaceState(null, '', '/?index=7&step=1');
  const { result } = renderHook(() => useSystem());
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: 26, step: 2, revision: 10 }));
  expect(result.current.state.position).toEqual({ index: 7, step: 1 });
  expect(result.current.state.following).toBe(false);
  expect(result.current.canFollow).toBe(false);
  act(() => FakeSocket.instances.at(-1)!.server({ type: 'presenter.presence', connected: true }));
  expect(result.current.canFollow).toBe(true);
  expect(result.current.state.following).toBe(false);
  expect(result.current.state.position).toEqual({ index: 7, step: 1 });
});

it('follows presenter presence, keeps the last slide on departure, and preserves independent navigation', () => {
  presenterConnected = false;
  const { result } = renderHook(() => useSystem());
  const socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open({ ...initial, index: historyIndex, step: 2, revision: 5 }));
  expect(result.current.state.position.index).toBe(1);
  act(() => socket.server({ type: 'presenter.presence', connected: true }));
  expect(result.current.state.following).toBe(true);
  expect(result.current.state.position).toMatchObject({ index: historyIndex, step: 2 });
  expect(result.current.instant).toBe(true);
  act(() => socket.server({ type: 'state', state: { ...initial, index: historyIndex, step: 3, revision: 6 } }));
  expect(result.current.state.position.step).toBe(3);
  act(() => socket.server({ type: 'presenter.presence', connected: false }));
  expect(result.current.state.following).toBe(false);
  expect(result.current.state.position).toMatchObject({ index: historyIndex, step: 3 });
  act(() => result.current.toggleFollowing());
  expect(result.current.state.following).toBe(false);
  act(() => result.current.go(-1));
  act(() => {
    socket.server({ type: 'state', state: { ...initial, index: 26, step: 2, revision: 7 } });
    socket.server({ type: 'presenter.presence', connected: true });
  });
  expect(result.current.state.following).toBe(false);
  expect(result.current.state.position).toMatchObject({ index: historyIndex, step: 2 });
  act(() => result.current.toggleFollowing());
  expect(result.current.state.position).toMatchObject({ index: 26, step: 2 });
  expect(result.current.state.following).toBe(true);
});

it('does not follow using stale presenter presence while the viewer is reconnecting', () => {
  const { result } = renderHook(() => useSystem());
  const socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open({ ...initial, index: historyIndex, step: 2, revision: 5 }));
  expect(result.current.state.following).toBe(true);
  act(() => socket.close());
  expect(result.current.canFollow).toBe(false);
  expect(result.current.state.following).toBe(false);
  expect(result.current.view.presenterConnected).toBe(false);
  expect(result.current.state.position).toMatchObject({ index: historyIndex, step: 2 });
});

it('remembers the viewer name and password after refresh while keeping viewing public', async () => {
  passwordSaved = false;
  viewerName = null;
  const view = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.container.querySelector('.slide')).not.toBeNull();
  expect(view.getByRole('complementary', { name: '질문 게시판' })).toBeTruthy();
  expect(view.getByRole('button', { name: '정지' })).toBeTruthy();
  const name = view.getByLabelText('이름') as HTMLInputElement;
  const key = view.getByLabelText('비밀번호') as HTMLInputElement;
  fireEvent.change(name, { target: { value: '   ' } });
  fireEvent.change(key, { target: { value: 'wrong' } });
  expect((view.getByRole('button', { name: '질문 참여하기' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.change(name, { target: { value: '  김민재 / HR 👋  ' } });
  const enter = vi.fn(async (_url: string, options: RequestInit) => {
    const input = JSON.parse(String(options.body)) as { name: string; password: string };
    if (input.password !== 'comment-fixture-password') return Response.json({ error: 'Invalid password' }, { status: 401 });
    passwordSaved = true;
    viewerName = input.name;
    return Response.json({ name: input.name, passwordSaved: true });
  });
  vi.stubGlobal('fetch', enter);
  fireEvent.click(view.getByRole('button', { name: '질문 참여하기' }));
  await waitFor(() => expect(view.getByRole('alert').textContent).toBe('비밀번호를 확인해주세요.'));
  expect(view.container.querySelector('.slide')).not.toBeNull();
  act(() => FakeSocket.instances.at(-1)!.server({ type: 'question.created', question }));
  expect(view.getByText('A question')).toBeTruthy();
  fireEvent.change(key, { target: { value: 'comment-fixture-password' } });
  fireEvent.click(view.getByRole('button', { name: '질문 참여하기' }));
  await waitFor(() => expect(FakeSocket.instances).toHaveLength(2));
  await act(async () => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByRole('button', { name: '질문 참여하기' })).toBeNull();
  expect(view.getByText('작성자 · 김민재 / HR 👋')).toBeTruthy();
  expect(view.queryByLabelText('이름')).toBeNull();
  expect(enter.mock.calls[1]).toEqual(['/api/participation', expect.objectContaining({ method: 'POST', credentials: 'same-origin',
    body: JSON.stringify({ name: '김민재 / HR 👋', password: 'comment-fixture-password' }) })]);
  fireEvent.change(view.getByLabelText('질문 내용'), { target: { value: 'Named question' } });
  fireEvent.click(view.getByRole('button', { name: '질문 등록' }));
  await waitFor(() => expect(view.getByText('질문을 등록했습니다.')).toBeTruthy());
  const posted = FakeSocket.instances.at(-1)!.sent.find((command) => command.type === 'question.create')!;
  expect(posted).toMatchObject({ type: 'question.create', payload: { index: 1, step: 0, body: 'Named question' } });
  expect(posted.payload).not.toHaveProperty('name');
  expect(FakeSocket.instances.every((socket) => !String(socket.url).includes('comment-fixture-password'))).toBe(true);
  view.unmount();
  const reloaded = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  expect(reloaded.queryByLabelText('이름')).toBeNull();
  expect(reloaded.queryByLabelText('비밀번호')).toBeNull();
  expect(reloaded.getByText('작성자 · 김민재 / HR 👋')).toBeTruthy();
  expect(FakeSocket.instances.at(-1)!.sent.every((command) => command.type === 'annotations.get')).toBe(true);
  expect(enter).toHaveBeenCalledTimes(2);
  expect(reloaded.queryByRole('button', { name: /이름 변경/ })).toBeNull();
});

it('remembers the presenter key in a cookie and restores presenter access after refresh', async () => {
  history.replaceState(null, '', '/presenter#key=fixture-key');
  const enter = vi.fn(async (_url: string, options: RequestInit) => {
    const input = JSON.parse(String(options.body)) as { role: string; key: string };
    expect(input).toEqual({ role: 'presenter', key: 'fixture-key' });
    presenterCookie = true;
    return Response.json({ name: '발표자' });
  });
  vi.stubGlobal('fetch', enter);
  const view = render(<App deck={lecture} />);
  expect(view.queryByLabelText('발표자 키')).toBeNull();
  await waitFor(() => expect(FakeSocket.instances).toHaveLength(2));
  act(() => FakeSocket.instances.at(-1)!.open());
  expect(location.hash).toBe('');
  expect(sessionStorage.getItem('presenter-key')).toBeNull();
  expect(view.queryByLabelText('발표자 키')).toBeNull();
  expect((view.getByRole('button', { name: '다음 단계' }) as HTMLButtonElement).disabled).toBe(false);
  expect(enter).toHaveBeenCalledWith('/api/participation', expect.objectContaining({ credentials: 'same-origin' }));
  view.unmount();
  const reloaded = render(<App deck={lecture} />);
  expect(reloaded.queryByLabelText('발표자 키')).toBeNull();
  act(() => FakeSocket.instances.at(-1)!.open());
  expect(reloaded.queryByLabelText('발표자 키')).toBeNull();
  expect((reloaded.getByRole('button', { name: '다음 단계' }) as HTMLButtonElement).disabled).toBe(false);
  expect(enter).toHaveBeenCalledTimes(1);
});

it('hides the presenter key during URL authentication and allows correction after rejection', async () => {
  history.replaceState(null, '', '/presenter#key=wrong');
  let finish!: (response: Response) => void;
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => { finish = resolve; })));
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByLabelText('발표자 키')).toBeNull();
  await act(async () => finish(new Response('', { status: 401 })));
  expect(view.getByLabelText('발표자 키')).toBeTruthy();
  expect(view.getByRole('alert').textContent).toBe('발표자 키를 확인해주세요.');
});

it.each(['/#key=comment-fixture-password', '/?key=comment-fixture-password'])(
  'uses the viewer key from %s without showing a password field or disabling default following', async (url) => {
    history.replaceState(null, '', url); passwordSaved = false; viewerName = null;
    const enter = vi.fn(async (_url: string, options: RequestInit) => {
      expect(JSON.parse(String(options.body))).toEqual({ name: '수강생', password: 'comment-fixture-password' });
      passwordSaved = true; viewerName = '수강생';
      return Response.json({ name: viewerName, passwordSaved });
    });
    vi.stubGlobal('fetch', enter);
    const view = render(<App deck={lecture} />);
    expect(view.queryByLabelText('비밀번호')).toBeNull();
    act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: historyIndex, step: 2, revision: 1 }));
    expect(view.queryByLabelText('비밀번호')).toBeNull();
    expect(view.getByRole('button', { name: '정지' })).toBeTruthy();
    expect(location.href).not.toContain('key=');
    expect(enter).not.toHaveBeenCalled();
    fireEvent.change(view.getByLabelText('이름'), { target: { value: '수강생' } });
    fireEvent.click(view.getByRole('button', { name: '질문 참여하기' }));
    await waitFor(() => expect(enter).toHaveBeenCalledTimes(1));
    expect(FakeSocket.instances.every((socket) => !String(socket.url).includes('comment-fixture-password'))).toBe(true);
  },
);

it('prefers a saved viewer password over the URL key and preserves explicit slide links', async () => {
  history.replaceState(null, '', '/?index=10&step=1&key=ignore-this-key'); viewerName = null;
  const enter = vi.fn(async (_url: string, options: RequestInit) => {
    expect(JSON.parse(String(options.body))).toEqual({ name: '수강생' });
    return Response.json({ name: '수강생', passwordSaved: true });
  });
  vi.stubGlobal('fetch', enter);
  const view = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByLabelText('비밀번호')).toBeNull();
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('10');
  expect(view.container.querySelector('.slide')?.getAttribute('data-step')).toBe('1');
  expect(view.getByRole('button', { name: '재생' })).toBeTruthy();
  expect(location.search).not.toContain('key=');
  fireEvent.change(view.getByLabelText('이름'), { target: { value: '수강생' } });
  fireEvent.click(view.getByRole('button', { name: '질문 참여하기' }));
  await waitFor(() => expect(enter).toHaveBeenCalledTimes(1));
});

it('allows a corrected password when the URL key is rejected', async () => {
  history.replaceState(null, '', '/#key=wrong'); passwordSaved = false; viewerName = null;
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ error: 'Invalid password' }, { status: 401 })));
  const view = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByLabelText('비밀번호')).toBeNull();
  fireEvent.change(view.getByLabelText('이름'), { target: { value: '수강생' } });
  fireEvent.click(view.getByRole('button', { name: '질문 참여하기' }));
  await waitFor(() => expect(view.getByLabelText('비밀번호')).toBeTruthy());
  expect(view.getByRole('alert').textContent).toBe('비밀번호를 확인해주세요.');
});

it('jumps a viewer by section or slide, pauses following, and keeps one socket', () => {
  const view = render(<App deck={lecture} />); const socket = FakeSocket.instances.at(-1)!; act(() => socket.open());
  expect(view.queryByRole('button', { name: '발표 노트 펼치기' })).toBeNull();
  fireEvent.click(view.getByRole('button', { name: '목차 펼치기' }));
  const menu = view.getByRole('navigation', { name: '슬라이드 목차' });
  fireEvent.click(within(menu).getByRole('button', { name: '3부 · 커리어를 설계하다' }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('49');
  expect(view.getByRole('button', { name: '재생' })).toBeTruthy();
  expect(view.getByRole('navigation', { name: '슬라이드 목차' })).toBe(menu);
  fireEvent.click(within(menu).getByRole('button', { name: /Zoom의 회의 전사·AI 요약/ }));
  expect(view.container.querySelector('.slide')?.getAttribute('data-index')).toBe('13');
  expect(view.container.querySelector('.slide')?.getAttribute('data-step')).toBe('0');
  expect(view.getByRole('navigation', { name: '슬라이드 목차' })).toBe(menu);
  expect(FakeSocket.instances).toHaveLength(1);
  expect(socket.sent.some((command) => command.type === 'slide.set')).toBe(false);
});

it('keeps notes hidden until presenter authentication and removes them when access is lost', async () => {
  history.replaceState(null, '', '/presenter');
  let completeNote!: (response: Response) => void;
  const fetchNotes = vi.fn((url: string, options?: RequestInit) => {
    if (url === '/api/participation') {
      expect(JSON.parse(String(options?.body))).toEqual({ role: 'presenter', key: 'fixture-key' });
      presenterCookie = true;
      return Promise.resolve(Response.json({ name: '발표자' }));
    }
    return new Promise<Response>((resolve) => { completeNote = resolve; });
  });
  vi.stubGlobal('fetch', fetchNotes);
  const view = render(<App deck={lecture} />);
  let socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open());
  const toggle = view.getByRole('button', { name: '발표 노트 펼치기' });
  expect((toggle as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(toggle);
  expect(view.queryByRole('complementary', { name: '발표 노트' })).toBeNull();
  expect(fetchNotes).not.toHaveBeenCalled();

  fireEvent.change(view.getByLabelText('발표자 키'), { target: { value: 'fixture-key' } });
  fireEvent.click(view.getByRole('button', { name: '발표 시작' }));
  await waitFor(() => expect(FakeSocket.instances).toHaveLength(2));
  socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open());
  fireEvent.click(toggle);
  await waitFor(() => expect(fetchNotes).toHaveBeenCalledWith('/api/notes/1', expect.anything()));
  act(() => socket.close());
  expect(view.queryByRole('complementary', { name: '발표 노트' })).toBeNull();
  await act(async () => completeNote(new Response('# 비공개 발표 노트')));
  expect(view.queryByRole('heading', { name: '비공개 발표 노트' })).toBeNull();
});

it('does not offer or fetch presenter notes for a viewer with question-posting access', () => {
  const fetchNotes = vi.fn();
  vi.stubGlobal('fetch', fetchNotes);
  const view = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByRole('button', { name: /발표 노트/ })).toBeNull();
  expect(view.queryByRole('complementary', { name: '발표 노트' })).toBeNull();
  expect(fetchNotes).not.toHaveBeenCalled();
});

it('publishes presenter menu jumps and shows notes alongside a read-only question list', async () => {
  history.replaceState(null, '', '/presenter'); presenterCookie = true;
  handle = (socket, command) => {
    if (command.type === 'slide.set') socket.server({ type: 'ack', requestId: command.requestId,
      result: { ...initial, ...command.payload, revision: 1 } });
    else respond(socket, command);
  };
  const notes = vi.fn(async (url: string) => new Response(url.endsWith('/1') ? '# 첫 노트\n처음 설명' : '# 목표 노트\n목표 설명'));
  vi.stubGlobal('fetch', notes);
  const view = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  expect(view.queryByLabelText('질문 내용')).toBeNull();
  expect(view.queryByRole('button', { name: '질문 등록' })).toBeNull();
  fireEvent.click(view.getByRole('button', { name: '발표 노트 펼치기' }));
  await view.findByRole('heading', { name: '첫 노트' });
  expect(view.getByRole('complementary', { name: '질문 게시판' })).toBeTruthy();
  fireEvent.click(view.getByRole('button', { name: '목차 펼치기' }));
  fireEvent.click(within(view.getByRole('navigation', { name: '슬라이드 목차' })).getByRole('button', { name: '3부 · 커리어를 설계하다' }));
  await view.findByRole('heading', { name: '목표 노트' });
  expect(notes).toHaveBeenLastCalledWith('/api/notes/49', expect.objectContaining({ credentials: 'same-origin' }));
  expect(FakeSocket.instances.at(-1)!.sent).toContainEqual(expect.objectContaining({ type: 'slide.set', payload: { index: 49, step: 0 } }));
  fireEvent.click(view.getByRole('button', { name: '질문 접기' }));
  expect(view.getByRole('complementary', { name: '발표 노트' })).toBeTruthy();
  fireEvent.click(view.getByRole('button', { name: '질문 펼치기' }));
  expect(view.queryByLabelText('질문 내용')).toBeNull();
  fireEvent.click(view.getByRole('button', { name: '발표 노트 접기' }));
  expect(view.queryByRole('complementary', { name: '발표 노트' })).toBeNull();
  expect(view.getByRole('complementary', { name: '질문 게시판' })).toBeTruthy();
});

it('shares one socket for slides and questions, including while paused, without polling', async () => {
  vi.useFakeTimers();
  const view = render(<App deck={lecture} />); const socket = FakeSocket.instances.at(-1)!;
  expect(new URL(socket.url).pathname).toBe('/api/live');
  act(() => socket.open());
  fireEvent.click(document.querySelector('.slide')!);
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('1');
  expect(view.getByRole('button', { name: '정지' })).toBeTruthy();
  fireEvent.keyDown(document.body, { key: ' ' });
  act(() => {
    socket.server({ type: 'question.created', question });
    socket.server({ type: 'state', state: { ...initial, index: 26, step: 2, revision: 2 } });
  });
  expect(view.getByText('A question')).toBeTruthy();
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('1');
  const next = view.getByRole('button', { name: '다음 단계' });
  next.focus();
  fireEvent.keyDown(next, { key: 'ArrowRight' });
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe(String(firstContentIndex));
  fireEvent.keyDown(next, { key: 'ArrowLeft' });
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('1');
  fireEvent.keyDown(next, { key: ' ' });
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('26');
  fireEvent.keyDown(next, { key: ' ', repeat: true });
  expect(view.getByRole('button', { name: '정지' })).toBeTruthy();
  await act(() => vi.advanceTimersByTimeAsync(5000));
  expect(FakeSocket.instances).toHaveLength(1);
  expect(fetch).not.toHaveBeenCalled();
  expect(socket.sent.every((command) => command.type === 'annotations.get')).toBe(true);
});

it('recovers a suspended viewer immediately on tab return, ignoring its stuck socket and duplicate focus events', async () => {
  vi.useFakeTimers();
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  const { result, unmount } = renderHook(() => useSystem());
  const first = FakeSocket.instances.at(-1)!;
  act(() => first.open(initial, { questions: [question], nextCursor: 1, hasMore: false }));
  vi.spyOn(first, 'close').mockImplementation(() => { first.readyState = 2; });
  act(() => {
    window.dispatchEvent(new Event('blur'));
    visibility.mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  // Browser suspension advances wall time without running JavaScript timers.
  vi.setSystemTime(Date.now() + 120000);
  expect(FakeSocket.instances).toHaveLength(1);
  act(() => {
    visibility.mockReturnValue('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('focus'));
  });
  expect(FakeSocket.instances).toHaveLength(2);
  const second = FakeSocket.instances.at(-1)!;
  expect(new URL(second.url).searchParams.get('cursor')).toBe('1');
  const latest = { ...initial, index: 26, step: 2, revision: 4 };
  act(() => second.open(latest, { questions: [{ ...question, id: 2 }], nextCursor: 2, hasMore: false }));
  expect(result.current.state.position).toMatchObject({ index: 26, step: 2 });
  expect(result.current.instant).toBe(true);
  expect(result.current.view.questions.map((row) => row.id)).toEqual([1, 2]);
  act(() => {
    first.server({ type: 'state', state: { ...initial, revision: 99 } });
    first.onclose?.();
    window.dispatchEvent(new Event('focus'));
  });
  await act(() => vi.advanceTimersByTimeAsync(1000));
  expect(result.current.state.position).toMatchObject({ index: 26, step: 2 });
  expect(result.current.connection).toBe('connected');
  expect(FakeSocket.instances).toHaveLength(2);
  unmount();
  window.dispatchEvent(new Event('blur')); window.dispatchEvent(new Event('focus'));
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  expect(FakeSocket.instances).toHaveLength(2);
});

it('hides unrevealed map layers when a foreground snapshot repeats an interrupted step change', () => {
  vi.useFakeTimers();
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  const view = render(<App deck={lecture} />); const first = FakeSocket.instances.at(-1)!;
  act(() => first.open({ ...initial, index: 6, step: 2, revision: 1 }));
  const nodes = ['products', 'models', 'infrastructure'].map((sector) =>
    view.container.querySelector<SVGElement>(`.sector-map-${sector}`)!);
  expect(nodes.every((node) => getComputedStyle(node).opacity === '1')).toBe(true);
  act(() => {
    visibility.mockReturnValue('hidden'); document.dispatchEvent(new Event('visibilitychange'));
    first.server({ type: 'state', state: { ...initial, index: 6, step: 0, revision: 2 } });
  });
  // Resume without progressing any animation frames or transition timers.
  act(() => {
    visibility.mockReturnValue('visible'); document.dispatchEvent(new Event('visibilitychange'));
    FakeSocket.instances.at(-1)!.open({ ...initial, index: 6, step: 0, revision: 2 });
  });
  expect(getComputedStyle(nodes[0]).visibility).toBe('visible');
  expect(getComputedStyle(nodes[0]).opacity).toBe('1');
  for (const node of nodes.slice(1)) {
    expect(getComputedStyle(node).visibility).toBe('hidden');
    expect(getComputedStyle(node).opacity).toBe('0');
  }
  expect(nodes.every((node) => getComputedStyle(node).transition === 'none')).toBe(true);
});

it('refreshes viewers after window refocus or back/forward restoration without touching presenters', () => {
  vi.useFakeTimers();
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  const client = new LectureClient(false); client.start(); FakeSocket.instances.at(-1)!.open();
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
  expect(FakeSocket.instances).toHaveLength(1);
  window.dispatchEvent(new Event('blur')); window.dispatchEvent(new Event('focus'));
  expect(FakeSocket.instances).toHaveLength(2);
  FakeSocket.instances.at(-1)!.open();
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  expect(FakeSocket.instances).toHaveLength(3);
  FakeSocket.instances.at(-1)!.open(); client.stop();
  const presenter = new LectureClient(true); presenter.start(); FakeSocket.instances.at(-1)!.open();
  window.dispatchEvent(new Event('blur')); window.dispatchEvent(new Event('focus'));
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  expect(FakeSocket.instances).toHaveLength(4);
  presenter.stop();
});

it('keeps a paused position and pending draft on foreground recovery, cancelling the old reconnect delay', async () => {
  vi.useFakeTimers(); handle = () => {};
  const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
  const view = render(<App deck={lecture} />); const first = FakeSocket.instances.at(-1)!;
  act(() => first.open());
  const input = view.getByLabelText('질문 내용') as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: 'Pending before tab switch' } });
  fireEvent.click(view.getByRole('button', { name: '다음 단계' }));
  fireEvent.click(view.getByRole('button', { name: '질문 등록' }));
  const command = first.sent.find((item) => item.type === 'question.create')!;
  act(() => {
    visibility.mockReturnValue('hidden'); document.dispatchEvent(new Event('visibilitychange'));
    first.close();
    visibility.mockReturnValue('visible'); document.dispatchEvent(new Event('visibilitychange'));
  });
  const second = FakeSocket.instances.at(-1)!;
  expect(second).not.toBe(first);
  await act(async () => second.open({ ...initial, index: 26, step: 2, revision: 3 }));
  expect(second.sent.find((item) => item.type === 'question.create')).toEqual(command);
  expect(input.value).toBe('Pending before tab switch'); expect(input.disabled).toBe(true);
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe(String(firstContentIndex));
  expect(view.getByRole('button', { name: '재생' })).toBeTruthy();
  await act(() => vi.advanceTimersByTimeAsync(1000));
  expect(FakeSocket.instances).toHaveLength(2);
  await act(async () => second.server({ type: 'ack', requestId: command.requestId,
    result: { ...question, body: 'Pending before tab switch' } }));
  expect(input.value).toBe(''); expect(input.disabled).toBe(false);
  fireEvent.keyDown(document.body, { key: ' ' });
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('26');
});

it('automatically retries a lost-ack question with the same request ID and merges duplicate events', async () => {
  vi.useFakeTimers(); handle = () => {};
  const { result } = renderHook(() => useSystem()); const first = FakeSocket.instances.at(-1)!;
  act(() => first.open());
  let pending!: Promise<Question>;
  act(() => { pending = result.current.client.request('question.create', { index: 1, step: 0, body: 'A question' }); });
  const sent = first.sent.find((item) => item.type === 'question.create')!;
  act(() => { first.server({ type: 'question.created', question }); first.close(); });
  expect(result.current.connection).toBe('reconnecting');
  await act(() => vi.advanceTimersByTimeAsync(500));
  const second = FakeSocket.instances.at(-1)!;
  await act(async () => second.open());
  expect(second.sent.find((item) => item.type === 'question.create')).toEqual(sent);
  await act(async () => {
    second.server({ type: 'question.created', question });
    second.server({ type: 'ack', requestId: sent.requestId, result: question });
    await expect(pending).resolves.toEqual(question);
  });
  expect(result.current.view.questions).toEqual([question]);
});

it('restores history gaps even when a newer broadcast arrived before disconnection', async () => {
  vi.useFakeTimers(); handle = () => {};
  const client = new LectureClient(false); client.start();
  const first = FakeSocket.instances.at(-1)!;
  first.open(initial, { questions: [question], nextCursor: 1, hasMore: true });
  const historyRequest = first.sent[0];
  first.server({ type: 'question.created', question: { ...question, id: 3 } });
  first.close(); await vi.advanceTimersByTimeAsync(500);
  const second = FakeSocket.instances.at(-1)!;
  expect(new URL(second.url).searchParams.get('cursor')).toBe('1');
  const page = { questions: [{ ...question, id: 2 }, { ...question, id: 3 }], nextCursor: 3, hasMore: false };
  second.open(initial, page);
  expect(second.sent[0]).toEqual(historyRequest);
  second.server({ type: 'ack', requestId: historyRequest.requestId, result: page });
  await Promise.resolve(); await Promise.resolve();
  expect(client.getSnapshot().questions.map((q) => q.id)).toEqual([1, 2, 3]);
  expect(client.getSnapshot().historyLoading).toBe(false);
  client.stop();
});

it('restores presenter cookie access before replaying updates, then publishes the latest queued position', async () => {
  vi.useFakeTimers(); history.replaceState(null, '', '/presenter'); presenterCookie = true;
  handle = () => {};
  const { result } = renderHook(() => useSystem(true)); const first = FakeSocket.instances.at(-1)!;
  await act(async () => first.open());
  expect(result.current.authorized).toBe(true); expect(location.hash).toBe('');
  expect(sessionStorage.getItem('presenter-key')).toBeNull();
  act(() => { result.current.go(1); result.current.go(1); result.current.go(1); });
  const outstanding = first.sent.find((command) => command.type === 'slide.set')!;
  expect(result.current.connection).toBe('connected');
  act(() => first.close()); await act(() => vi.advanceTimersByTimeAsync(500));
  const second = FakeSocket.instances.at(-1)!;
  await act(async () => second.open());
  expect(second.sent[0]).toEqual(outstanding);
  expect(result.current.state.position).toEqual({ index: 3, step: 0 });
  await act(async () => second.server({ type: 'ack', requestId: outstanding.requestId, result: { ...initial, index: firstContentIndex, revision: 1 } }));
  const latest = second.sent.at(-1)!;
  expect(latest).toMatchObject({ type: 'slide.set', payload: { index: 3, step: 0 } });
  expect(latest.requestId).not.toBe(outstanding.requestId);
  await act(async () => second.server({ type: 'ack', requestId: latest.requestId, result: { ...initial, index: 3, step: 0, revision: 2 } }));
  expect(result.current.state.position).toEqual({ index: 3, step: 0 });
});

it('keeps a paused viewer stationary after reconnect, rejects stale revisions, and uses instant catch-up', async () => {
  vi.useFakeTimers(); const { result } = renderHook(() => useSystem());
  const first = FakeSocket.instances.at(-1)!;
  act(() => { first.open(); first.server({ type: 'state', state: { ...initial, index: 5, step: 2, revision: 2 } }); });
  expect(result.current.instant).toBe(false);
  act(() => result.current.go(-1));
  act(() => first.close()); await act(() => vi.advanceTimersByTimeAsync(500));
  const second = FakeSocket.instances.at(-1)!;
  act(() => second.open({ ...initial, index: 26, step: 2, revision: 3 }));
  expect(result.current.state.position).toMatchObject({ index: 5, step: 1 });
  act(() => second.server({ type: 'state', state: { ...initial, revision: 1 } }));
  act(() => result.current.toggleFollowing());
  expect(result.current.state.position.index).toBe(26); expect(result.current.instant).toBe(true);
});

it('keeps failed authentication visible and rejects writes from an unauthorized presenter', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ error: 'Invalid key' }, { status: 401 })));
  const { result } = renderHook(() => useSystem(true)); const socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open());
  act(() => result.current.login('wrong-key'));
  await waitFor(() => expect(result.current.authError).not.toBe(''));
  expect(result.current.authorized).toBe(false); expect(result.current.connection).toBe('locked');
  act(() => result.current.go(1));
  expect(socket.sent.every((command) => command.type !== 'slide.set')).toBe(true);
});

it('retains draft context through live slides and shows a pending submission until acknowledged', async () => {
  handle = () => {};
  const view = render(<App deck={lecture} />); const socket = FakeSocket.instances.at(-1)!;
  act(() => socket.open({ ...initial, index: 5, step: 1 }));
  const input = view.getByLabelText('질문 내용') as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: 'A question' } });
  fireEvent.keyDown(input, { key: ' ' });
  fireEvent.keyDown(input, { key: 'ArrowRight' });
  fireEvent.keyDown(input, { key: 'ArrowLeft' });
  expect(document.querySelector('.slide')?.getAttribute('data-index')).toBe('5');
  act(() => socket.server({ type: 'state', state: { ...initial, index: 5, step: 2, revision: 1 } }));
  expect(view.getByText('질문 대상 · 슬라이드 5 · 단계 1')).toBeTruthy();
  act(() => socket.server({ type: 'state', state: { ...initial, index: 6, step: 2, revision: 2 } }));
  fireEvent.click(view.getByRole('button', { name: '현재 슬라이드' }));
  expect(view.getByText('질문 대상 · 슬라이드 5 · 단계 1')).toBeTruthy();
  fireEvent.click(view.getByRole('button', { name: '질문 등록' }));
  expect(input.value).toBe('A question'); expect(input.disabled).toBe(true);
  const sent = socket.sent.at(-1)!;
  expect(sent).toMatchObject({ type: 'question.create', payload: { index: 5, step: 1 } });
  act(() => socket.server({ type: 'ack', requestId: sent.requestId, result: { ...question, index: 5, step: 1 } }));
  await waitFor(() => expect(input.value).toBe(''));
  expect(view.getByText('질문을 등록했습니다.')).toBeTruthy();
  expect(view.getByText('질문 대상 · 슬라이드 6 · 단계 2')).toBeTruthy();
});

it('preserves a rejected question draft for correction rather than automatically resending bad input', async () => {
  handle = (socket, command) => socket.server({ type: 'error', requestId: command.requestId, code: 'BAD_REQUEST', message: 'Invalid question' });
  const view = render(<App deck={lecture} />); act(() => FakeSocket.instances.at(-1)!.open());
  const input = view.getByLabelText('질문 내용') as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: 'Keep this draft' } });
  fireEvent.click(view.getByRole('button', { name: '질문 등록' }));
  await waitFor(() => expect(view.getByText(/등록하지 못했습니다/)).toBeTruthy());
  expect(input.value).toBe('Keep this draft'); expect(input.disabled).toBe(false);
});

it('restores a question draft and its original slide after refresh, then clears saved text after submission', async () => {
  const first = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: 5, step: 1 }));
  fireEvent.change(first.getByLabelText('질문 내용'), { target: { value: '작성하던 질문\n다음 줄' } });
  first.unmount();
  history.replaceState(null, '', '/?index=6&step=2');
  const refreshed = render(<App deck={lecture} />);
  act(() => FakeSocket.instances.at(-1)!.open({ ...initial, index: 6, step: 2 }));
  expect((refreshed.getByLabelText('질문 내용') as HTMLTextAreaElement).value).toBe('작성하던 질문\n다음 줄');
  expect(refreshed.getByText('질문 대상 · 슬라이드 5 · 단계 1')).toBeTruthy();
  expect(FakeSocket.instances.at(-1)!.sent.every((command) => command.type !== 'question.create')).toBe(true);
  fireEvent.click(refreshed.getByRole('button', { name: '질문 등록' }));
  await waitFor(() => expect(window.localStorage.getItem('question-draft')).toBeNull());
  expect((refreshed.getByLabelText('질문 내용') as HTMLTextAreaElement).value).toBe('');
});

it('reconnects and safely replays commands when acknowledgements time out', async () => {
  vi.useFakeTimers(); handle = () => {};
  const client = new LectureClient(false); client.start(); const first = FakeSocket.instances.at(-1)!; first.open();
  const promise = client.request('question.create', { index: 1, step: 0, body: 'A question' });
  const sent = first.sent.find((item) => item.type === 'question.create')!;
  await vi.advanceTimersByTimeAsync(10500);
  const second = FakeSocket.instances.at(-1)!; expect(second).not.toBe(first); second.open(); await Promise.resolve();
  expect(second.sent.find((item) => item.type === 'question.create')).toEqual(sent);
  second.server({ type: 'ack', requestId: sent.requestId, result: question });
  await expect(promise).resolves.toEqual(question); client.stop();
});
