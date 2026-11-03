import { test, expect } from '@playwright/test';

test('the game timer starts on the first move and resets for a new game', async ({ page }) => {
  await page.goto('/');
  const timer = page.locator('.game-timer');
  await expect(timer).toHaveText(/00:00/);
  await page.locator('.square').nth(0).click();
  await expect(timer).toHaveAttribute('aria-label', 'Játékidő: 00:01', {
    timeout: 3000,
  });
  await page.getByRole('button', { name: 'Új játék' }).click();
  await expect(timer).toHaveAttribute('aria-label', 'Játékidő: 00:00');
});
