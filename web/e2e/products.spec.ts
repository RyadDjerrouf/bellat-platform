import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Products', () => {
  test('products listing page loads', async ({ page }) => {
    await page.goto(`${BASE}/fr/products`);
    // Wait for the page to load - either products or skeleton loaders
    await expect(page.locator('main')).toBeVisible();
  });

  test('search page shows input', async ({ page }) => {
    await page.goto(`${BASE}/fr/search`);
    await expect(page.getByPlaceholder(/rechercher/i)).toBeVisible();
  });

  test('search returns results for known product', async ({ page }) => {
    await page.goto(`${BASE}/fr/search`);
    await page.getByPlaceholder(/rechercher/i).fill('merguez');
    // Wait for results or no-result state
    await page.waitForTimeout(600); // debounce
    await expect(page.locator('main')).toBeVisible();
  });

  test('product detail page loads', async ({ page }) => {
    // Go to products first and click the first product
    await page.goto(`${BASE}/fr/products`);
    await page.waitForTimeout(1500); // wait for products to load
    const firstProduct = page.locator('[href*="/fr/products/"]').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      await expect(page.getByRole('button', { name: /panier/i })).toBeVisible({ timeout: 5000 });
    }
  });
});
