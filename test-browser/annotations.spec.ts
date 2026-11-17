import { expect, test } from '@playwright/test';
import type { Page, WebSocketRoute } from '@playwright/test';
import type { AnnotationBoard, StrokeAnnotation } from '../shared/annotations';
import type { Command, ServerMessage } from '../shared/protocol';

test('presenter ink and inline text stay inside the slide and sync across screen sizes and reconnects', async ({ context }, testInfo) => {
  // The browser exercises the full UI and wire protocol without local credentials or rehearsal data.
  // Storage, authorization, and replay are exercised separately in the Workers runtime.
  const boards = new Map<number, AnnotationBoard>();
  const sockets = new Set<WebSocketRoute>();
  const board = (index: number) => boards.get(index) ?? { index, revision: 0, items: [] };
  let state = { index: 4, step: 1, revision: 0, updatedAt: 0 };
  function broadcast(message: ServerMessage) { for (const socket of sockets) socket.send(JSON.stringify(message)); }
  async function connect(page: Page, presenter: boolean) {
    await page.route('**/api/notes/*', (route) => route.fulfill({ body: '# 발표 노트\n\n슬라이드를 보며 설명합니다.', contentType: 'text/markdown' }));
    await page.routeWebSocket('**/api/live*', (socket) => {
      sockets.add(socket); socket.onClose(() => sockets.delete(socket));
      socket.send(JSON.stringify({ type: 'snapshot', state, presenterConnected: true,
        name: presenter ? '발표자' : null, passwordSaved: false,
        page: { questions: [], nextCursor: 0, hasMore: false } }));
      socket.onMessage((raw) => {
        if (raw === 'ping') { socket.send('pong'); return; }
        const command = JSON.parse(String(raw)) as Command | { type: 'annotation.preview'; payload: StrokeAnnotation };
        if (command.type === 'annotation.preview') { broadcast({ type: 'annotation.preview', stroke: command.payload }); return; }
        let result: unknown;
        if (command.type === 'slide.set') {
          state = { ...command.payload, revision: state.revision + 1, updatedAt: 0 };
          broadcast({ type: 'state', state }); result = state;
        } else if (command.type === 'annotations.get') result = board(command.payload.index);
        else if (command.type === 'annotation.add' || command.type === 'annotation.remove' || command.type === 'annotations.clear') {
          const previous = board(command.payload.index);
          const items = command.type === 'annotation.add' ? [...previous.items, command.payload]
            : command.type === 'annotation.remove' ? previous.items.filter((item) => item.id !== command.payload.id) : [];
          const updated = { ...previous, revision: previous.revision + 1, items };
          boards.set(updated.index, updated); broadcast({ type: 'annotations.changed', board: updated }); result = updated;
        }
        socket.send(JSON.stringify({ type: 'ack', requestId: command.requestId, result }));
      });
    });
    await page.goto(presenter ? '/presenter' : '/?index=4&step=1');
    await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  }
  const presenter = await context.newPage();
  const viewer = await context.newPage();
  await connect(presenter, true); await connect(viewer, false);
  const layer = presenter.getByLabel('슬라이드 필기 영역');
  const marks = viewer.locator('[data-annotation]');
  await expect(presenter.getByRole('button', { name: '펜', exact: true })).toBeEnabled();
  await expect(viewer.getByRole('toolbar', { name: '발표 필기 도구' })).toHaveCount(0);
  await presenter.getByRole('button', { name: '펜', exact: true }).click();
  const bounds = (await layer.boundingBox())!;
  const slideBounds = (await presenter.locator('article.slide').boundingBox())!;
  expect(Math.abs(bounds.x - slideBounds.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(bounds.width - slideBounds.width)).toBeLessThanOrEqual(2);
  await presenter.mouse.move(bounds.x + bounds.width * .2, bounds.y + bounds.height * .4);
  await presenter.mouse.down();
  await presenter.mouse.move(bounds.x + bounds.width * .6, bounds.y + bounds.height * .5, { steps: 5 });
  await expect(marks).toHaveCount(1); // Ink is visible before releasing the pointer.
  await presenter.mouse.move(bounds.x + bounds.width + 25, bounds.y + bounds.height + 25);
  await presenter.mouse.up();
  await expect.poll(() => board(4).items.length).toBe(1);
  const ink = board(4).items[0];
  if (ink.kind !== 'stroke') throw new Error('Expected a stroke');
  expect(ink.points[0][0]).toBeCloseTo(320, -1);
  expect(ink.points.at(-1)).toEqual([1600, 900]);
  const coordinates = await marks.locator('polyline').getAttribute('points');

  await presenter.getByRole('button', { name: '텍스트', exact: true }).click();
  const blue = presenter.getByRole('button', { name: '파랑', exact: true });
  await blue.hover();
  await expect(blue).toHaveCSS('background-color', 'rgb(37, 99, 184)');
  await blue.click();
  await layer.click({ position: { x: bounds.width * .3, y: bounds.height * .6 } });
  const editor = presenter.getByRole('textbox', { name: '슬라이드 텍스트' });
  await expect(editor).toBeFocused();
  expect(await editor.evaluate((node) => !!node.closest('article.slide'))).toBe(true);
  await editor.fill('목표를 먼저 확인\n다음 단계');
  await editor.press('Meta+z');
  await editor.press('Control+z');
  expect(board(4).items).toHaveLength(1); // Text-field undo must not remove the existing stroke.
  await editor.fill('목표를 먼저 확인\n다음 단계');
  await editor.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
  await expect(editor).toBeVisible();
  expect(board(4).items).toHaveLength(1); // Korean composition must not submit prematurely.
  await editor.press('Enter');
  await expect(marks).toHaveCount(2);
  await expect(marks.locator('.annotation-text')).toHaveText('목표를 먼저 확인\n다음 단계');
  await viewer.keyboard.press('Control+z');
  expect(board(4).items).toHaveLength(2); // Viewers cannot undo presenter annotations.
  await expect(presenter.getByText('필기 저장 중…')).toHaveCount(0);

  // Resizing the board by opening notes does not rewrite stored coordinates.
  await presenter.getByRole('button', { name: '발표 노트 펼치기', exact: true }).click();
  await expect(presenter.getByRole('complementary', { name: '발표 노트' })).toBeVisible();
  await expect(presenter.locator('[data-annotation] polyline')).toHaveAttribute('points', coordinates!);

  // Fullscreen uses the same board coordinates and continues to synchronize ink.
  await presenter.getByRole('button', { name: '펜', exact: true }).click();
  await presenter.getByRole('button', { name: '슬라이드 전체 화면', exact: true }).click();
  await expect.poll(() => presenter.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
  await expect(presenter.locator('[data-annotation] polyline')).toHaveAttribute('points', coordinates!);
  const fullscreenBounds = (await layer.boundingBox())!;
  await presenter.mouse.move(fullscreenBounds.x + fullscreenBounds.width * .25, fullscreenBounds.y + fullscreenBounds.height * .25);
  await presenter.mouse.down();
  await presenter.mouse.move(fullscreenBounds.x + fullscreenBounds.width * .75, fullscreenBounds.y + fullscreenBounds.height * .75, { steps: 4 });
  await presenter.mouse.up();
  await expect(marks).toHaveCount(3);
  await expect.poll(() => board(4).items.length).toBe(3);
  const fullscreenInk = board(4).items.at(-1)!;
  if (fullscreenInk.kind !== 'stroke') throw new Error('Expected a fullscreen stroke');
  expect(fullscreenInk.points[0][0]).toBeCloseTo(400, -1);
  expect(fullscreenInk.points[0][1]).toBeCloseTo(225, -1);
  expect(fullscreenInk.points.at(-1)![0]).toBeCloseTo(1200, -1);
  expect(fullscreenInk.points.at(-1)![1]).toBeCloseTo(675, -1);
  await expect(presenter.getByRole('button', { name: '실행 취소', exact: true, includeHidden: true })).toBeEnabled();
  await presenter.keyboard.press('Control+z');
  await expect(marks).toHaveCount(2);
  await presenter.keyboard.press('Escape');
  await expect.poll(() => presenter.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await expect(presenter.getByRole('complementary', { name: '발표 노트' })).toBeVisible();
  await viewer.getByRole('button', { name: '이전 단계', exact: true }).click();
  await expect(marks).toHaveCount(0);
  await viewer.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect(marks).toHaveCount(2);
  await viewer.reload();
  await expect(marks).toHaveCount(2);
  await expect(marks.locator('polyline')).toHaveAttribute('points', coordinates!);
  await testInfo.attach('presenter-annotations', { body: await presenter.screenshot(), contentType: 'image/png' });

  await presenter.keyboard.press('Meta+z');
  await expect(marks).toHaveCount(1);
  await presenter.keyboard.press('Control+z');
  await expect(marks).toHaveCount(0);
  await presenter.getByRole('button', { name: '펜', exact: true }).click();
  await layer.click();
  await expect(marks).toHaveCount(1);
  await presenter.getByRole('button', { name: '전체 지우기', exact: true }).click();
  await expect(marks).toHaveCount(0);

  // Text entered and cancelled on the slide never reaches the viewer.
  await presenter.getByRole('button', { name: '발표 노트 접기', exact: true }).click();
  await presenter.getByRole('button', { name: '텍스트', exact: true }).click();
  await presenter.getByRole('button', { name: '슬라이드 전체 화면', exact: true }).click();
  await expect.poll(() => presenter.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
  const textBounds = (await layer.boundingBox())!;
  await layer.click({ position: { x: textBounds.width * .3, y: textBounds.height * .6 } });
  await editor.fill('취소할 텍스트'); await editor.press('Escape');
  await expect(editor).toHaveCount(0);
  await expect(marks).toHaveCount(0);
  expect(await presenter.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
  await presenter.keyboard.press('Escape');
  await expect.poll(() => presenter.evaluate(() => !!document.fullscreenElement)).toBe(false);
  if (testInfo.project.name === 'chromium-narrow') {
    await presenter.getByRole('button', { name: '펜', exact: true }).click();
    const box = (await layer.boundingBox())!;
    await presenter.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(marks.locator('circle')).toHaveCount(1);
    await presenter.getByRole('button', { name: '전체 지우기', exact: true }).click();
  }
  expect(await presenter.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
