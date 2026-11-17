import { expect, test } from '@playwright/test';

test('slide changes animate inside a stationary board, while reveals and rapid jumps stay responsive', async ({ page }) => {
  await page.goto('/?index=1&step=0');
  await expect(page.getByRole('status', { name: '연결됨', exact: true })).toBeVisible();
  expect(await page.locator('.slide-page').evaluate((node) => node.getAnimations().length)).toBe(0);

  async function navigate(label: string, menu = false) {
    return page.evaluate(async ({ label, menu }) => {
      const frame = document.querySelector('article.slide')!;
      const before = frame.getBoundingClientRect().toJSON();
      const chrome = () => ['.slide-topline', '.slide-footer'].map((selector) => {
        const node = frame.querySelector(selector)!;
        return { bounds: node.getBoundingClientRect().toJSON(), opacity: getComputedStyle(node).opacity };
      });
      const chromeBefore = chrome();
      const button = menu
        ? [...document.querySelectorAll<HTMLButtonElement>('#slide-menu button')].find((button) => button.textContent?.trim() === label)!
        : document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
      button.click();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const animations = frame.querySelector('.slide-page')!.getAnimations();
      const animation = animations[0];
      const frames = animation?.effect instanceof KeyframeEffect ? animation.effect.getKeyframes() : [];
      const duration = animation?.effect?.getTiming().duration;
      const chromeDuring = chrome();
      const labels = [...frame.querySelectorAll('.slide-label')].flatMap((label) => label.getAnimations().map((animation) => ({
        text: label.textContent, duration: animation.effect?.getTiming().duration,
        frames: animation.effect instanceof KeyframeEffect ? animation.effect.getKeyframes() : [],
      })));
      for (const active of frame.getAnimations({ subtree: true })) active.finish();
      return { before, after: frame.getBoundingClientRect().toJSON(), chromeBefore, chromeDuring, frames, duration, labels,
        count: animations.length, index: frame.getAttribute('data-index') };
    }, { label, menu });
  }

  const forward = await navigate('다음 단계');
  expect(forward.index).toBe('2');
  expect(forward.count).toBe(1);
  expect(forward.duration).toBe(200);
  expect(forward.frames[0]).toMatchObject({ opacity: '0', transform: 'translateY(10px)' });
  expect(forward.before).toEqual(forward.after);
  expect(forward.chromeBefore).toEqual(forward.chromeDuring);
  expect(forward.labels.map((label) => label.text)).toEqual(['발표자', '02']);
  expect(forward.labels.every((label) => label.duration === 140)).toBe(true);
  expect(forward.labels[0].frames[0]).toMatchObject({ filter: 'blur(2px)' });
  const reveal = await navigate('다음 단계');
  expect(reveal.index).toBe('2');
  expect(reveal.count).toBe(0);
  expect(reveal.labels).toEqual([]);
  await navigate('이전 단계');
  const backward = await navigate('이전 단계');
  expect(backward.index).toBe('1');
  expect(backward.frames[0]).toMatchObject({ transform: 'translateY(-10px)' });
  expect(backward.before).toEqual(backward.after);
  expect(backward.chromeBefore).toEqual(backward.chromeDuring);

  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  const jump = await navigate('1부 · 산업을 읽다', true);
  expect(jump.index).toBe('4');
  expect(jump.frames[0]).toMatchObject({ transform: 'translateY(0px)' });
  expect(jump.before).toEqual(jump.after);
  expect(jump.chromeBefore).toEqual(jump.chromeDuring);

  const rapid = await page.evaluate(async () => {
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('#slide-menu button')];
    buttons.find((button) => button.textContent?.trim() === '3부 · 경험을 연결하다')!.click();
    buttons.find((button) => button.textContent?.trim() === '2부 · 실무를 만나다')!.click();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const frame = document.querySelector('article.slide')!;
    const animations = frame.querySelector('.slide-page')!.getAnimations();
    const result = { index: frame.getAttribute('data-index'), count: animations.length };
    for (const animation of animations) animation.finish();
    return result;
  });
  expect(rapid).toEqual({ index: '27', count: 1 });
});
