// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('the board starts with nine empty, playable cells', async ({ page }) => {
  const squares = page.locator('.square');
  await expect(squares).toHaveCount(9);
  for (const square of await squares.all()) {
    await expect(square).toBeEmpty();
    await expect(square).toBeEnabled();
  }
  await expect(page.locator('.game-status')).toHaveText('Következő: X');
});

test('players alternate turns and occupied cells cannot be played again', async ({ page }) => {
  const squares = page.locator('.square');
  await squares.nth(0).click();
  await expect(squares.nth(0)).toHaveText('X');
  await expect(page.locator('.game-status')).toHaveText('Következő: O');
  await expect(squares.nth(0)).toBeDisabled();

  await squares.nth(1).click();
  await expect(squares.nth(1)).toHaveText('O');
  await expect(page.locator('.game-status')).toHaveText('Következő: X');
});

test('highlights the latest move and updates the highlight on the next move', async ({ page }) => {
  const squares = page.locator('.square');
  await squares.nth(0).click();
  await expect(squares.nth(0)).toHaveClass(/last-move-square/);
  await expect(squares.nth(0)).toHaveAccessibleName('Mező: X, utolsó lépés');

  await squares.nth(4).click();
  await expect(squares.nth(0)).not.toHaveClass(/last-move-square/);
  await expect(squares.nth(4)).toHaveClass(/last-move-square/);
});

test('announces an X win, highlights the winning line, and blocks further moves', async ({ page }) => {
  const squares = page.locator('.square');
  for (const index of [0, 3, 1, 4, 2]) {
    await squares.nth(index).click();
  }

  await expect(page.locator('.game-status')).toHaveText('X nyert!');
  await expect(page.locator('.score-x strong')).toHaveText('1');
  for (const index of [0, 1, 2]) {
    await expect(squares.nth(index)).toHaveClass(/winning-square/);
  }
  await expect(page.getByRole('button', { name: 'Üres mező' }).first()).toBeEnabled();
  await page.getByRole('button', { name: 'Üres mező' }).first().click();
  await expect(page.locator('.game-status')).toHaveText('X nyert!');
  await expect(page.locator('.score-x strong')).toHaveText('1');
});

test('announces an O win and increments the O score', async ({ page }) => {
  const squares = page.locator('.square');
  for (const index of [0, 3, 1, 4, 8, 5]) {
    await squares.nth(index).click();
  }

  await expect(page.locator('.game-status')).toHaveText('O nyert!');
  await expect(page.locator('.score-o strong')).toHaveText('1');
  for (const index of [3, 4, 5]) {
    await expect(squares.nth(index)).toHaveClass(/winning-square/);
  }
});

test('announces a draw and increments the draw score', async ({ page }) => {
  const squares = page.locator('.square');
  for (const index of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
    await squares.nth(index).click();
  }

  await expect(page.locator('.game-status')).toHaveText('Döntetlen!');
  await expect(page.locator('.score-draw strong')).toHaveText('1');
  await expect(page.locator('.history li').first()).toContainText('Döntetlen');
});

test('starts a new game without clearing scores or completed-match history', async ({ page }) => {
  const squares = page.locator('.square');
  for (const index of [0, 3, 1, 4, 2]) {
    await squares.nth(index).click();
  }
  await page.getByRole('button', { name: 'Új játék' }).click();

  await expect(page.locator('.game-status')).toHaveText('Következő: X');
  await expect(page.locator('.score-x strong')).toHaveText('1');
  await expect(page.locator('.history li')).toHaveCount(1);
  for (const square of await squares.all()) {
    await expect(square).toBeEmpty();
    await expect(square).not.toHaveClass(/last-move-square|winning-square/);
  }
});

test('undo restores the previous turn and latest-move highlight', async ({ page }) => {
  const squares = page.locator('.square');
  await squares.nth(0).click();
  await squares.nth(1).click();
  await page.getByRole('button', { name: 'Utolsó lépés visszavonása' }).click();

  await expect(squares.nth(0)).toHaveText('X');
  await expect(squares.nth(1)).toBeEmpty();
  await expect(squares.nth(0)).toHaveClass(/last-move-square/);
  await expect(page.locator('.game-status')).toHaveText('Következő: O');

  await page.getByRole('button', { name: 'Utolsó lépés visszavonása' }).click();
  await expect(squares.nth(0)).toBeEmpty();
  await expect(squares.nth(0)).not.toHaveClass(/last-move-square/);
  await expect(page.locator('.game-status')).toHaveText('Következő: X');
  await expect(page.locator('.game-timer')).toHaveAttribute('aria-label', 'Játékidő: 00:00');
  await expect(page.getByRole('button', { name: 'Utolsó lépés visszavonása' })).toBeDisabled();
});