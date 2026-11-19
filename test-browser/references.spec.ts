import { expect, test } from '@playwright/test';

test('logos, cards, and SVG research links open a new tab without moving the slide', async ({ page, context }) => {
  await page.addInitScript(() => {
    localStorage.setItem('slide-menu-expanded', 'false');
  });
  // Exercise native browser links without depending on third-party page availability.
  await context.route('https://**/*', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Reference</title>' }));

  const cases = [
    { index: 57, step: 0, selector: '.c08-project-area img[alt="LangChain 공식 로고"]', url: 'https://github.com/langchain-ai/langchain' },
    { index: 49, step: 0, selector: '.c04-posting', url: 'https://www.amazon.jobs/en/jobs/10470031/builder-mobile-platform-ring' },
    { index: 5, step: 1, selector: '.s01-timeline a[href="https://arxiv.org/abs/1706.03762"]', url: 'https://arxiv.org/abs/1706.03762', keyboard: true },
    { index: 38, step: 0, selector: '.w11-image-stage', url: 'https://github.com/stablyai/orca' },
    { index: 38, step: 1, selector: '.w11-image-stage', url: 'https://kiro.dev/crew/' },
  ];
  for (const { index, step, selector, url, keyboard } of cases) {
    await page.goto(`/?index=${index}&step=${step}`);
    const slide = page.locator('article.slide');
    await expect(slide).toHaveAttribute('data-index', String(index - 1));
    await expect(slide).toHaveAttribute('data-step', String(step));
    const reference = slide.locator(selector);
    const popupPromise = page.waitForEvent('popup');
    if (keyboard) {
      await reference.focus();
      await page.keyboard.press('Enter');
    } else {
      await reference.click();
    }
    const popup = await popupPromise;
    await expect(popup).toHaveURL(url);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    await popup.close();
    await expect(slide).toHaveAttribute('data-index', String(index - 1));
    await expect(slide).toHaveAttribute('data-step', String(step));
    await expect(page).toHaveURL(new RegExp(`\\?index=${index}&step=${step}$`));
  }

  await page.goto('/?index=5&step=0');
  const transformer = page.locator('.s01-timeline a[href="https://arxiv.org/abs/1706.03762"]');
  await expect(transformer).toBeHidden();
  await page.keyboard.press('ArrowRight');
  await expect(transformer).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(transformer).toBeHidden();
});
