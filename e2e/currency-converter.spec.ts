import { test, expect } from '@playwright/test';

test.describe('Currency Converter', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Currency Converter' })).toBeVisible();
  });

  test('should display currency input and selector', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /amount to convert/i });
    const selector = page.locator('#currency-selector');

    await expect(input).toBeVisible();
    await expect(selector).toBeVisible();
  });

  test('should update currency list when entering amount', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /amount to convert/i });
    await input.fill('100');

    // Wait for currency list to appear with results (debounce is 500ms)
    await page.waitForSelector('.currency-item', { timeout: 3000 });

    const listItems = page.locator('.currency-item');
    const count = await listItems.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should change currency and update results', async ({ page }) => {
    await page.goto('/');

    // Enter amount
    const input = page.getByRole('textbox', { name: /amount to convert/i });
    await input.fill('100');

    // Wait for initial results (debounce is 500ms)
    await page.waitForSelector('.currency-item', { timeout: 3000 });

    // Change currency selector
    const selector = page.locator('#currency-selector');
    await selector.focus();

    // Wait for dropdown to open
    await page.waitForSelector('.currency-selector-menu', { timeout: 2000 });

    // Select EUR
    const eurOption = page.locator('.currency-selector-option').filter({ hasText: 'EUR' });
    await eurOption.click();

    // Wait for results to update
    await page.waitForTimeout(1000);

    // Verify currency changed
    await expect(selector).toContainText('EUR');
  });

  test('should format input with thousand separators', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /amount to convert/i });
    await input.fill('1234.56');

    // Check formatted value
    await expect(input).toHaveValue('1,234.56');
  });

  test('should show decimal hint when typing', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /amount to convert/i });
    await input.focus();
    await input.fill('100');

    // Check for decimal hint
    const hint = page.getByTestId('decimal-hint');
    await expect(hint).toBeVisible();
    await expect(hint).toHaveText('.00');
  });

  test('keyboard navigation: Tab to selector and select with arrows', async ({ page }) => {
    await page.goto('/');

    const input = page.getByRole('textbox', { name: /amount to convert/i });
    await input.fill('50');

    // Tab to currency selector
    await page.keyboard.press('Tab');

    // Wait for dropdown to open automatically
    await page.waitForSelector('.currency-selector-menu', { timeout: 2000 });

    // Use arrow keys to navigate
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');

    // Focus should return to input
    await expect(input).toBeFocused();
  });
});
