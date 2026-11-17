import { useEffect, useRef, useState } from 'react';
import type { Position } from '../../shared/deck';
import { isPosition } from '../../shared/deck';
import type { LectureClient, LiveView } from '../connection/lecture-client';

export function Questions({ expanded, position, client, live, presenter, urlPassword = '' }: { expanded: boolean; position: Position; client: LectureClient; live: LiveView; presenter: boolean; urlPassword?: string }) {

  const [filter, setFilter] = useState<'all' | 'slide'>('all');
  const [draft, setDraft] = useState(() => {
    if (!presenter) {
      try {
        const saved: unknown = JSON.parse(window.localStorage.getItem('question-draft') ?? 'null');
        if (isPosition(saved) && 'body' in saved && typeof saved.body === 'string' && saved.body.length <= 1000) {
          return { body: saved.body, index: saved.index, step: saved.step };
        }
      } catch { /* Start a new draft if saved data or browser storage is unavailable. */ }
    }
    return { body: '', index: position.index, step: position.step };
  });
  const activeDraft = useRef(!!draft.body);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [joining, setJoining] = useState(false);
  const [urlKeyRejected, setUrlKeyRejected] = useState(false);
  const hasUrlKey = !!urlPassword && !urlKeyRejected;
  const passwordRequired = !live.passwordSaved && !hasUrlKey;
  const selectedSlide = filter === 'slide' ? position.index : null;
  const rows = live.questions.filter((question) => selectedSlide === null || question.index === selectedSlide);
  const currentSlide = useRef(position);
  currentSlide.current = position;

  useEffect(() => {
    if (!activeDraft.current) setDraft((value) => ({ ...value, ...position }));
  }, [position.index, position.step]);

  useEffect(() => {
    if (presenter) return;
    try {
      if (draft.body) window.localStorage.setItem('question-draft', JSON.stringify({ body: draft.body, index: draft.index, step: draft.step }));
      else window.localStorage.removeItem('question-draft');
    } catch { /* Keep the in-memory draft if browser storage is unavailable. */ }
  }, [draft.body, draft.index, draft.step, presenter]);

  function edit(value: string) {
    setMessage('');
    const associated = activeDraft.current ? { index: draft.index, step: draft.step } : position;
    activeDraft.current = true;
    setDraft((old) => ({ ...old, body: value, ...associated }));
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !draft.body.trim()) return;
    setBusy(true); setMessage('');
    try {
      await client.request('question.create', { ...draft });
      activeDraft.current = false;
      setDraft((old) => ({ ...old, body: '', ...currentSlide.current }));
      setMessage('질문을 등록했습니다.');
    } catch { setMessage('등록하지 못했습니다. 입력 내용을 확인하고 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }

  return <aside id="question-panel" className="question-panel" aria-label="질문 게시판" hidden={!expanded}>
    <div className="panel-heading"><h2>질문</h2></div>
    <div className="filter-tabs" aria-label="질문 필터">
      <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>전체</button>
      <button aria-pressed={filter === 'slide'} onClick={() => setFilter('slide')}>현재 슬라이드</button>
    </div>
    <div className="question-list" aria-live="polite" aria-relevant="additions">
      {live.historyLoading && <p className="empty-state">질문을 불러오는 중…</p>}
      {live.historyError && <p role="status">질문을 불러오지 못했습니다. 다시 연결되면 재시도합니다.</p>}
      {!live.historyLoading && !live.historyError && rows.length === 0 && <p className="empty-state">{presenter ? '아직 등록된 질문이 없습니다.' : <>궁금한 점을 남겨주세요.<br />첫 질문을 기다리고 있어요.</>}</p>}
      {rows.map((question) => <article className="question-card" key={question.id}>
        <header><strong>{question.name || '익명'}</strong><span>슬라이드 {question.index} · 단계 {question.step}</span></header>
        <p>{question.body}</p>
        <time dateTime={new Date(question.createdAt).toISOString()}>{new Date(question.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</time>
      </article>)}
    </div>
    {!presenter && (!live.name ? <form className="question-form participation-form" onSubmit={(event) => {
      event.preventDefault();
      if (joining || live.connection !== 'connected') return;
      setJoining(true);
      // A valid saved cookie takes precedence over a key supplied in the link.
      const password = live.passwordSaved ? '' : hasUrlKey ? urlPassword : passwordInput;
      void client.enterParticipant(nameInput, password).then((joined) => {
        if (joined) setPasswordInput('');
        else if (hasUrlKey && !live.passwordSaved && client.getSnapshot().authError === '비밀번호를 확인해주세요.') setUrlKeyRejected(true);
      }).finally(() => setJoining(false));
    }}>
      <p className="participation-description">{live.connection !== 'connected' ? '질문 참여 정보를 확인하는 중…' : !passwordRequired ? '이름을 입력하면 질문을 남길 수 있어요.' : '이름과 비밀번호를 입력하면 질문을 남길 수 있어요.'}</p>
      <label htmlFor="comment-name">이름</label>
      <input id="comment-name" autoComplete="off" value={nameInput} required disabled={joining} onChange={(event) => setNameInput(event.target.value)} />
      {passwordRequired && live.connection === 'connected' && <><label htmlFor="comment-password">비밀번호</label>
      <input id="comment-password" type="password" autoComplete="current-password" value={passwordInput} required disabled={joining} onChange={(event) => setPasswordInput(event.target.value)} /></>}
      <button className="primary participation-submit" disabled={joining || live.connection !== 'connected' || !nameInput.trim() || (passwordRequired && !passwordInput.trim())}>{joining ? '확인 중…' : '질문 참여하기'}</button>
      {live.authError && <p className="form-message" role="alert">{live.authError}</p>}
    </form> : <form className="question-form" onSubmit={submit}>
      <p className="draft-context">질문 대상 · 슬라이드 {draft.index} · 단계 {draft.step}</p>
      <p className="question-author">작성자 · {live.name}</p>
      <label htmlFor="question-body">질문 내용</label>
      <textarea id="question-body" value={draft.body} maxLength={1000} required disabled={busy} onChange={(event) => edit(event.target.value)} placeholder="어떤 점이 궁금하신가요?" rows={3} />
      <div className="form-bottom"><span>{draft.body.length} / 1000</span><button className="primary" disabled={busy || !draft.body.trim()}>{busy ? (live.connection === 'reconnecting' || live.connection === 'connecting' ? '연결 대기 중…' : '등록 중…') : '질문 등록'}</button></div>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>)}
  </aside>;
}
