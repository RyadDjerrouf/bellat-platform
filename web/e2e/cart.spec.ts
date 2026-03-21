import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Cart', () => {
  test('cart page is accessible', async ({ page }) => {
    await page.goto(`${BASE}/fr/cart`);
    await expect(page.locator('main')).toBeVisible();
    // Either shows empty cart or items
    await expect(
      page.getByText(/panier/i).or(page.getByText(/vide/i))
    ).toBeVisible();
  });

  test('empty cart shows empty state', async ({ page }) => {
    // Clear any existing cart
    await page.goto(`${BASE}/fr/cart`);
    await page.evaluate(() => localStorage.removeItem('bellat_cart'));
    await page.reload();
    await expect(page.getByText(/vide|empty/i)).toBeVisible({ timeout: 3000 });
  });
});
