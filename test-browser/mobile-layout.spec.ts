import { expect, test } from '@playwright/test';

test('phone rotation maximizes the slide and keeps navigation usable without fullscreen', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.use.isMobile, 'This layout is for touch-only mobile devices.');
  const portrait = page.viewportSize()!;
  await page.goto('/?index=4&step=0');
  const slide = page.locator('article.slide');
  await expect(page.locator('.slide-fullscreen-button')).toBeHidden();
  await expect(page.locator('.app-fullscreen-button')).toBeHidden();

  for (const viewport of [{ width: 844, height: 390 }, { width: 844, height: 270 }, { width: 667, height: 375 }]) {
    await page.setViewportSize(viewport);
    const frame = (await slide.boundingBox())!;
    const header = (await page.locator('.app-header').boundingBox())!;
    const footer = (await page.locator('.app-footer').boundingBox())!;
    expect(frame.width / frame.height).toBeCloseTo(16 / 9, 2);
    expect(frame.x).toBeGreaterThanOrEqual(header.x + header.width);
    expect(frame.x + frame.width).toBeLessThanOrEqual(footer.x);
    expect(frame.y).toBeGreaterThanOrEqual(0);
    expect(frame.y + frame.height).toBeLessThanOrEqual(viewport.height);
    // The slide should use almost all available height, or width on a shorter phone.
    expect(Math.max(frame.height / viewport.height, frame.width / (footer.x - header.width))).toBeGreaterThan(.95);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByRole('button', { name: '다음 단계', exact: true })).toBeInViewport();
    await expect(page.getByRole('button', { name: '목차 펼치기', exact: true })).toBeInViewport();
    await expect(page.locator('.slide-fullscreen-button')).toBeHidden();
    await expect(page.locator('.app-fullscreen-button')).toBeHidden();
    await page.getByRole('button', { name: '다음 단계', exact: true }).click();
    await expect(slide).toHaveAttribute('data-index', '4');
    await page.getByRole('button', { name: '이전 단계', exact: true }).click();
    await expect(slide).toHaveAttribute('data-index', '3');
    await testInfo.attach(`landscape-${viewport.width}-${viewport.height}`, { body: await page.screenshot(), contentType: 'image/png' });
  }

  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  await menu.getByRole('button', { name: '3부 · 커리어를 설계하다', exact: true }).click();
  await expect(slide).toHaveAttribute('data-index', '48');
  await menu.getByRole('button', { name: '목차 닫기', exact: true }).click();
  await page.setViewportSize(portrait);
  await expect(slide).toHaveAttribute('data-index', '48');
  const frame = (await slide.boundingBox())!;
  expect(frame.width / frame.height).toBeCloseTo(16 / 9, 2);
  await expect(page.locator('.slide-fullscreen-button')).toBeHidden();
  await expect(page.locator('.app-fullscreen-button')).toBeHidden();
});
