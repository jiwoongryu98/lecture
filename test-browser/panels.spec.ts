import { expect, test } from '@playwright/test';
import { readCatalog } from '../build/catalog';
import type { Position } from '../shared/deck';

test('chapter scrolling stays where the user left it during navigation and reopening', async ({ page }) => {
  await page.goto('/?index=1&step=0');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  const scroll = await menu.evaluate((node) => { node.scrollTop = 400; return node.scrollTop; });
  expect(scroll).toBeGreaterThan(0);
  await page.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect(page.locator('article.slide')).toHaveAttribute('data-index', '2');
  expect(await menu.evaluate((node) => node.scrollTop)).toBe(scroll);
  await page.getByRole('button', { name: '목차 접기', exact: true }).click();
  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  expect(await menu.evaluate((node) => node.scrollTop)).toBe(scroll);
});

test('fullscreen selection follows the browser fullscreen state', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: '전체 화면 전환', exact: true });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => document.exitFullscreen());
  await expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('slide fullscreen fills the available screen, keeps navigation, and restores open panels', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem('questions-expanded', 'true');
    localStorage.setItem('slide-menu-expanded', 'true');
  });
  await page.goto('/?index=62&step=2');
  const button = page.getByRole('button', { name: '슬라이드 전체 화면', exact: true, includeHidden: true });
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  const questions = page.getByRole('complementary', { name: '질문 게시판' });
  await expect(menu).toBeVisible();
  await expect(questions).toBeVisible();
  const originalViewport = page.viewportSize()!;
  for (const viewport of [originalViewport, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }]) {
    // Chromium only allows resizing the browser window outside fullscreen.
    await page.setViewportSize(viewport);
    await button.click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.app-header')).toBeHidden();
    await expect(page.locator('.app-footer')).toBeHidden();
    await expect(menu).toBeHidden();
    await expect(questions).toBeHidden();
    const available = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    const slide = (await page.locator('article.slide').boundingBox())!;
    const expectedWidth = Math.min(available.width, available.height * 16 / 9);
    expect(Math.abs(slide.width - expectedWidth)).toBeLessThanOrEqual(1);
    expect(slide.width / slide.height).toBeCloseTo(16 / 9, 2);
    expect(Math.abs(slide.x - (available.width - slide.width) / 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(slide.y - (available.height - slide.height) / 2)).toBeLessThanOrEqual(1);
    await expect(page.locator('.stage')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    if (viewport === originalViewport) await testInfo.attach('slide-fullscreen', { body: await page.screenshot(), contentType: 'image/png' });
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('article.slide')).toHaveAttribute('data-index', '63');
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('article.slide')).toHaveAttribute('data-index', '62');
    await page.keyboard.press('Escape');
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(button).toBeFocused();
    await expect(menu).toBeVisible();
    await expect(questions).toBeVisible();
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.app-footer')).toBeVisible();
  }
  await page.setViewportSize(originalViewport);

  // Browser-owned exits restore the same layout and selection state.
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => document.exitFullscreen());
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(menu).toBeVisible();
  await expect(questions).toBeVisible();
});

test('viewer links skip the password field and the section menu jumps without overflowing', async ({ page }, testInfo) => {
  await page.goto('/?key=browser-fixture');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  await expect(page.getByLabel('이름', { exact: true })).toBeVisible();
  await expect(page.getByLabel('비밀번호', { exact: true })).toHaveCount(0);
  expect(new URL(page.url()).searchParams.has('key')).toBe(false);
  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  await expect(menu).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await testInfo.attach('viewer-menu', { body: await page.screenshot(), contentType: 'image/png' });
  await menu.getByRole('button', { name: '3부 · 경험을 연결하다', exact: true }).click();
  await expect(page.locator('article.slide')).toHaveAttribute('data-index', '48');
  await expect(page.locator('article.slide')).toHaveAttribute('data-step', '0');
  await expect(menu).toBeVisible();
  await expect(menu.locator('[aria-current=page]')).toContainText('기획·조율·구현의 경계가 겹칩니다');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await page.reload();
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  await page.reload();
  await expect(menu).toBeVisible();
});

test('presenter notes follow menu selections and stay open alongside questions', async ({ page }, testInfo) => {
  // Exercise presenter layout without reading local secrets or moving the real session.
  let revision = 0;
  const published: Position[] = [];
  let authenticate: (() => void) | undefined;
  await page.routeWebSocket('**/api/live*', (socket) => {
    authenticate = () => socket.send(JSON.stringify({ type: 'snapshot', state: { index: 48, step: 0, revision, updatedAt: 0 },
      presenterConnected: true, page: { questions: [], nextCursor: 0, hasMore: false }, name: '발표자', passwordSaved: false }));
    socket.onMessage((message) => {
      if (message === 'ping') { socket.send('pong'); return; }
      const command = JSON.parse(String(message));
      if (command.type === 'slide.set') {
        published.push(command.payload);
        socket.send(JSON.stringify({ type: 'ack', requestId: command.requestId,
          result: { ...command.payload, revision: ++revision, updatedAt: 0 } }));
      } else if (command.type === 'annotations.get') {
        socket.send(JSON.stringify({ type: 'ack', requestId: command.requestId,
          result: { index: command.payload.index, revision: 0, items: [] } }));
      }
    });
  });
  await page.route('**/api/notes/*', async (route) => {
    const id = new URL(route.request().url()).pathname.split('/').at(-1);
    const index = Number(id) - 1;
    const markdown = `# ${readCatalog()[index].title}\n\n발표 내용을 확인합니다.`;
    await route.fulfill({ contentType: 'text/markdown; charset=utf-8', body: markdown });
  });
  await page.goto('/presenter');
  await expect(presenterPen()).toBeDisabled();
  const beforeAuthentication = (await page.locator('article.slide').boundingBox())!;
  await expect.poll(() => !!authenticate).toBe(true);
  authenticate!();
  await expect(presenterPen()).toBeEnabled();
  const afterAuthentication = (await page.locator('article.slide').boundingBox())!;
  for (const dimension of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(beforeAuthentication[dimension] - afterAuthentication[dimension])).toBeLessThanOrEqual(1);
  }
  await expect(page.locator('.header-start').getByRole('button', { name: '발표 노트 펼치기', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '발표 노트 펼치기', exact: true }).click();
  const notes = page.getByRole('complementary', { name: '발표 노트' });
  await expect(notes.getByRole('heading', { name: '기획·조율·구현의 경계가 겹칩니다', exact: true })).toBeVisible();
  const questions = page.getByRole('complementary', { name: '질문 게시판' });
  await expect(questions).toBeVisible();
  await expect(questions.locator('form')).toHaveCount(0);
  await expect(questions.getByText('아직 등록된 질문이 없습니다.', { exact: true })).toBeVisible();
  const notesBox = await notes.boundingBox();
  const slideBox = await page.locator('article.slide').boundingBox();
  const questionsBox = await questions.boundingBox();
  if (testInfo.project.name === 'chromium-desktop') {
    expect(notesBox!.x + notesBox!.width).toBeLessThanOrEqual(slideBox!.x);
    expect(slideBox!.x + slideBox!.width).toBeLessThanOrEqual(questionsBox!.x);
  } else {
    expect(slideBox!.y + slideBox!.height).toBeLessThanOrEqual(notesBox!.y);
    expect(notesBox!.y + notesBox!.height).toBeLessThanOrEqual(questionsBox!.y);
  }
  await page.getByRole('button', { name: '슬라이드 전체 화면', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
  await expect(notes).toBeHidden();
  await expect(questions).toBeHidden();
  await expect(page.getByRole('toolbar', { name: '발표 필기 도구' })).toBeHidden();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('article.slide')).toHaveAttribute('data-step', '1');
  await expect.poll(() => published.at(-1)).toMatchObject({ index: 48, step: 1 });
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await expect(notes).toBeVisible();
  await expect(questions).toBeVisible();
  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  await testInfo.attach('presenter-menu-notes', { body: await page.screenshot(), contentType: 'image/png' });
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  await menu.getByRole('button', { name: '1부 · 산업을 읽다', exact: true }).click();
  await expect(notes.getByRole('heading', { name: 'AI는 어떻게 여기까지 왔을까?', exact: true })).toBeVisible();
  await expect.poll(() => published.at(-1)).toEqual({ index: 4, step: 0 });
  const frame = await page.locator('article.slide').boundingBox();
  expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: '질문 접기', exact: true }).click();
  await expect(questions).toBeHidden();
  await expect(notes).toBeVisible();
  await page.getByRole('button', { name: '질문 펼치기', exact: true }).click();
  await page.getByRole('button', { name: '발표 노트 접기', exact: true }).click();
  await expect(notes).toHaveCount(0);
  await expect(questions).toBeVisible();

  function presenterPen() { return page.getByRole('button', { name: '펜', exact: true }); }
});
