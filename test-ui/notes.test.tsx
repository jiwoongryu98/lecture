import { act, render, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import PresenterNotes from '../src/presentation/PresenterNotes';

afterEach(() => vi.unstubAllGlobals());

it('ignores a late response for a previous slide, renders Markdown, and retains notes across reveal steps', async () => {
  const pending: ((response: Response) => void)[] = [];
  const fetchNotes = vi.fn(() => new Promise<Response>((resolve) => pending.push(resolve)));
  vi.stubGlobal('fetch', fetchNotes);
  const view = render(<PresenterNotes position={{ index: 1, step: 0 }} />);
  view.rerender(<PresenterNotes position={{ index: 4, step: 1 }} />);
  await act(async () => pending[1](new Response('# 현재 노트\n\n[PDF](../public/shared/example-document.pdf)\n\n| 내용 | 확인 |\n| --- | --- |\n| 현재 | 예 |')));
  expect(view.getByRole('heading', { name: '현재 노트' })).toBeTruthy();
  expect(view.getByRole('table')).toBeTruthy();
  expect(view.getByRole('link', { name: 'PDF' }).getAttribute('href')).toBe('/shared/example-document.pdf');
  await act(async () => pending[0](new Response('# 지난 노트')));
  expect(view.queryByRole('heading', { name: '지난 노트' })).toBeNull();
  view.rerender(<PresenterNotes position={{ index: 4, step: 2 }} />);
  expect(view.getByRole('heading', { name: '현재 노트' })).toBeTruthy();
  expect(fetchNotes).toHaveBeenCalledTimes(2);
});

it('shows an actionable error and can retry loading the notes', async () => {
  const fetchNotes = vi.fn().mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValueOnce(new Response('# 다시 읽은 노트'));
  vi.stubGlobal('fetch', fetchNotes);
  const view = render(<PresenterNotes position={{ index: 1, step: 0 }} />);
  await waitFor(() => expect(view.getByRole('alert').textContent).toContain('노트를 불러오지 못했습니다.'));
  await act(async () => view.getByRole('button', { name: '다시 시도' }).click());
  expect(view.getByRole('heading', { name: '다시 읽은 노트' })).toBeTruthy();
});

it('shows an empty state when private notes are not included', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
  const view = render(<PresenterNotes position={{ index: 1, step: 0 }} />);
  await view.findByText('이 슬라이드의 발표 노트가 없습니다.');
  expect(view.queryByRole('alert')).toBeNull();
  expect(view.queryByRole('button', { name: '다시 시도' })).toBeNull();
});
