import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Admin Dashboard', () => {
  test('admin login page renders', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });

  test('admin routes redirect to login when unauthenticated', async ({ page }) => {
    // Clear any admin token first
    await page.goto(`${BASE}/admin/login`);
    await page.evaluate(() => localStorage.removeItem('bellat_admin_token'));

    await page.goto(`${BASE}/admin/dashboard`);
    await expect(page).toHaveURL(/admin\/login/, { timeout: 5000 });
  });

  test('admin login with wrong credentials shows error', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.getByLabel(/email/i).fill('wrong@bellat.net');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');
    await page.getByRole('button', { name: /connexion/i }).click();
    await expect(page.getByText(/invalide|incorrect|erreur/i)).toBeVisible({ timeout: 5000 });
  });

  test('admin login with valid credentials accesses dashboard', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.getByLabel(/email/i).fill('admin@bellat.net');
    await page.getByLabel(/mot de passe/i).fill('demo123');
    await page.getByRole('button', { name: /connexion/i }).click();
    await expect(page).toHaveURL(/admin\/dashboard/, { timeout: 8000 });
    // KPI cards should be visible
    await expect(page.getByText(/commandes/i).first()).toBeVisible();
  });
});
