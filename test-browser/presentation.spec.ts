import { expect, test } from '@playwright/test';

test('offline viewers start on the first slide and can open direct links without following', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  await expect(page.locator('article.slide')).toHaveAttribute('data-index', '1');
  await expect(page.getByRole('button', { name: '재생', exact: true })).toBeDisabled();

  await page.goto('/?index=6&step=1');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  await expect(page.locator('article.slide')).toHaveAttribute('data-index', '6');
  await expect(page.locator('article.slide')).toHaveAttribute('data-step', '1');
  await expect(page.getByRole('button', { name: '재생', exact: true })).toBeDisabled();
  await page.keyboard.press('Space');
  await expect(page.locator('article.slide')).toHaveAttribute('data-step', '1');
  await page.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect(page.locator('article.slide')).toHaveAttribute('data-step', '2');
});

test('public viewer connects and navigates independently', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  await expect(page.getByRole('complementary', { name: '질문 게시판' })).toBeVisible();

  const slide = page.locator('article.slide');
  await expect(slide.getByRole('heading', { level: 1 })).toBeVisible();
  const before = await slide.evaluate((element) => ({
    id: element.getAttribute('data-index'),
    step: element.getAttribute('data-step'),
  }));
  const next = page.getByRole('button', { name: '다음 단계', exact: true });
  const previous = page.getByRole('button', { name: '이전 단계', exact: true });
  const forward = await next.isEnabled();
  await (forward ? next : previous).click();
  await expect(page.getByRole('button', { name: '재생', exact: true })).toBeVisible();
  await expect.poll(async () => slide.evaluate((element) => ({
    id: element.getAttribute('data-index'),
    step: element.getAttribute('data-step'),
  }))).not.toEqual(before);

  // Return through the reverse control without relying on a particular deck order.
  await (forward ? previous : next).click();
  await expect(slide).toHaveAttribute('data-index', before.id!);
  await expect(slide).toHaveAttribute('data-step', before.step!);
  expect(errors).toEqual([]);
});

test('slide keeps its frame with questions expanded and collapsed', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  const pause = page.getByRole('button', { name: '정지', exact: true });
  if (await pause.isVisible()) await pause.click();
  const slide = page.locator('article.slide');

  for (const expanded of [true, false]) {
    if (!expanded) await page.getByRole('button', { name: '질문 접기', exact: true }).click();
    await expect(page.getByRole('button', { name: expanded ? '질문 접기' : '질문 펼치기', exact: true }))
      .toHaveAttribute('aria-expanded', String(expanded));
    const frame = await slide.boundingBox();
    expect(frame).not.toBeNull();
    expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    await testInfo.attach(`slide-questions-${expanded ? 'expanded' : 'collapsed'}`, {
      body: await slide.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
  }
  await page.reload();
  await expect(page.getByRole('button', { name: '질문 펼치기', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#question-panel')).toBeHidden();
  await page.getByRole('button', { name: '질문 펼치기', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: '질문 접기', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('complementary', { name: '질문 게시판' })).toBeVisible();
});
