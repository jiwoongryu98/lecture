import { expect, test } from '@playwright/test';

test('chapter scrolling stays where the user left it during navigation and reopening', async ({ page }) => {
  await page.goto('/?index=1&step=0');
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

test('fullscreen selection follows the browser fullscreen state', async ({ page }, testInfo) => {
  test.skip(!!testInfo.project.use.isMobile, 'Fullscreen controls are hidden on mobile.');
  await page.goto('/');
  const button = page.getByRole('button', { name: '전체 화면 전환', exact: true });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => document.exitFullscreen());
  await expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('slide fullscreen fills the available screen, keeps navigation, and restores the chapter menu', async ({ page }, testInfo) => {
  test.skip(!!testInfo.project.use.isMobile, 'Fullscreen controls are hidden on mobile.');
  await page.addInitScript(() => {
    localStorage.setItem('slide-menu-expanded', 'true');
  });
  await page.goto('/?index=63&step=2');
  const button = page.getByRole('button', { name: '슬라이드 전체 화면', exact: true, includeHidden: true });
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  await expect(menu).toBeVisible();
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
    await expect(page.locator('article.slide')).toHaveAttribute('data-index', '64');
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className)).toBe('stage');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('article.slide')).toHaveAttribute('data-index', '63');
    await page.keyboard.press('Escape');
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(button).toBeFocused();
    await expect(menu).toBeVisible();
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
});
