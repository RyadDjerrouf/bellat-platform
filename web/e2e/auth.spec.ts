import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Authentication', () => {
  test('home page redirects to /fr', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page).toHaveURL(/\/fr/);
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto(`${BASE}/fr/login`);
    await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
  });

  test('register toggle switches to registration form', async ({ page }) => {
    await page.goto(`${BASE}/fr/login`);
    await page.getByText(/créer un compte/i).click();
    await expect(page.getByLabel(/prénom/i)).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE}/fr/login`);
    await page.getByLabel(/email/i).fill('nobody@example.com');
    await page.getByLabel(/mot de passe/i).fill('wrongpassword');
    await page.getByRole('button', { name: /se connecter/i }).click();
    // Expect an error toast or inline message
    await expect(page.getByText(/invalide|incorrect|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('forgot password page renders form', async ({ page }) => {
    await page.goto(`${BASE}/fr/forgot-password`);
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });
});
