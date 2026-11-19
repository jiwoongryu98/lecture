import { expect, test } from '@playwright/test';
import { readCatalog } from '../build/catalog';
const slides = readCatalog();

test('all authored slides render every step and fit their frame', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const slide = page.locator('article.slide');

  for (const definition of slides) {
    // Exercise the production URL and browser history handling.
    for (let step = 0; step <= definition.maxStep; step++) {
      await page.evaluate(({ index, step }) => {
        history.replaceState(null, '', `?index=${index}&step=${step}`);
        dispatchEvent(new PopStateEvent('popstate'));
      }, { index: Number(definition.number), step });
      await expect(slide).toHaveAttribute('data-index', String(Number(definition.number)));
      await expect(slide).toHaveAttribute('data-step', String(step));
      // The title slide also uses the injected renderer.
      await expect(slide.locator('.industry-content, .slide-body')).toBeVisible();
      await expect(slide.getByRole('heading', { level: 1 })).toBeVisible();
      if (step === 0) await expect.poll(() => slide.locator('img').evaluateAll((images) => images.filter((img) => img instanceof HTMLImageElement && (!img.complete || img.naturalWidth === 0)).map((img) => img.getAttribute('src')))).toEqual([]);
      // A screenshot waits for finite transitions to settle without arbitrary sleeps.
      const screenshot = await slide.screenshot({ animations: 'disabled',
        path: testInfo.outputPath(`${definition.id}-step-${step}.png`),
      });
      if (step === 0 || step === definition.maxStep) {
        await testInfo.attach(`${definition.id}-step-${step}`, { body: screenshot, contentType: 'image/png' });
      }
      const overflow = await slide.evaluate((frame) => {
        const bounds = frame.getBoundingClientRect();
        const footerTop = frame.querySelector('.slide-footer')!.getBoundingClientRect().top;
        return [...frame.querySelectorAll('h1,h2,h3,p,svg text')].filter((element) => {
          const style = getComputedStyle(element);
          if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
          const box = element.getBoundingClientRect();
          const insideContent = !!element.closest('.industry-content');
          return box.width > 0 && box.height > 0 && (box.left < bounds.left - 2 || box.right > bounds.right + 2
            || box.top < bounds.top - 2 || box.bottom > bounds.bottom + 2
            || (insideContent && box.bottom > footerTop + 0.5));
        }).map((element) => element.textContent?.slice(0, 100));
      });
      expect(overflow, `${definition.id} step ${step}: text outside frame`).toEqual([]);
    }
    // Catch reverse-state issues after all elements have previously been revealed.
    await page.keyboard.press('ArrowLeft');
    if (definition.maxStep > 0) await expect(slide).toHaveAttribute('data-step', String(definition.maxStep - 1));
  }
  expect(errors).toEqual([]);
});
