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

test('undo is disabled after a completed game and re-enables on the next turn', async ({ page }) => {
  await page.goto('/');
  const squares = page.locator('.square');
  const undoButton = page.getByRole('button', { name: 'Utolsó lépés visszavonása' });

  await squares.nth(0).click();
  await squares.nth(3).click();
  await squares.nth(1).click();
  await squares.nth(4).click();
  await squares.nth(2).click();

  await expect(page.locator('.game-status')).toHaveText('X nyert!');
  await expect(undoButton).toBeDisabled();

  await page.getByRole('button', { name: 'Új játék' }).click();
  await expect(undoButton).toBeDisabled();

  await squares.nth(0).click();
  await expect(undoButton).not.toBeDisabled();
});
