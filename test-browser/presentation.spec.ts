import { expect, test } from '@playwright/test';

test('the built viewer opens direct links and navigates without a backend', async ({ page }) => {
  const backendRequests: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) backendRequests.push(request.url());
  });
  page.on('websocket', (socket) => backendRequests.push(socket.url()));
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  const slide = page.locator('article.slide');
  const previous = page.getByRole('button', { name: '이전 단계', exact: true });
  const next = page.getByRole('button', { name: '다음 단계', exact: true });
  await expect(slide).toHaveAttribute('data-index', '1');
  await expect(previous).toBeDisabled();

  await page.goto('/?index=2&step=1');
  await expect(slide).toHaveAttribute('data-index', '2');
  await expect(slide).toHaveAttribute('data-step', '0');
  await expect(slide.getByRole('heading', { level: 1 })).toHaveText('이 웹사이트도 AI와 함께 만들었습니다');
  await expect(page).toHaveURL(/\?index=3&step=0$/);

  await page.goto('/?index=7&step=1&key=legacy#key=legacy');
  await expect(slide).toHaveAttribute('data-index', '6');
  await expect(slide).toHaveAttribute('data-step', '1');
  await expect(page).toHaveURL(/\/?\?index=7&step=1$/);
  await next.click();
  await expect(slide).toHaveAttribute('data-step', '2');
  await page.reload();
  await expect(slide).toHaveAttribute('data-step', '2');
  await previous.click();
  await expect(slide).toHaveAttribute('data-step', '1');

  await page.getByRole('button', { name: '목차 펼치기', exact: true }).click();
  const menu = page.getByRole('navigation', { name: '슬라이드 목차' });
  await menu.getByRole('button', { name: '3부 · 커리어를 설계하다', exact: true }).click();
  await expect(slide).toHaveAttribute('data-index', '48');
  await expect(slide).toHaveAttribute('data-step', '0');
  await expect(menu.locator('[aria-current=page]')).toContainText('기획·조율·구현의 경계가 겹칩니다');
  await page.reload();
  await expect(menu).toBeVisible();
  await expect(slide).toHaveAttribute('data-index', '48');
  expect(backendRequests).toEqual([]);
  expect(errors).toEqual([]);
});
