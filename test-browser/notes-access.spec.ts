import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

test('private source documents and Worker bundles cannot be read through preview file URLs', async ({ request }) => {
  const paths = [
    '/notes/001.md',
    '/notes/001.md?raw',
    '/notes/001.md?import&raw',
    '/%6eotes/001.md?raw',
    `/@fs${resolve('notes/001.md')}?raw`,
    '/content/private/resume.tex',
    '/content/private/resume.tex?raw',
    '/content/private/resume.pdf',
    `/@fs${resolve('content/private/resume.tex')}?raw`,
    '/dist/worker/index.js',
    '/dist/worker/index.js.map',
    `/@fs${resolve('dist/worker/index.js')}?raw`,
  ];
  for (const path of paths) {
    const response = await request.get(path);
    expect([403, 404], path).toContain(response.status());
  }
  const response = await request.get('/api/notes/1');
  expect(response.status()).toBe(401);
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(await response.json()).toEqual({ error: 'Presenter access required' });
});

test('an unauthenticated presenter cannot open or request notes', async ({ page }) => {
  const noteRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/notes/')) noteRequests.push(request.url());
  });
  await page.goto('/presenter');
  await expect(page.getByLabel('발표자 키', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '발표 노트 펼치기', exact: true })).toBeDisabled();
  await expect(page.getByRole('complementary', { name: '발표 노트' })).toHaveCount(0);
  expect(noteRequests).toEqual([]);
});
