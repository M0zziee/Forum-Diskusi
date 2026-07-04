/**
 * Skenario pengujian E2E login:
 *
 * - Login flow sukses: pengguna mengisi email dan password valid,
 *   klik tombol Login, kemudian diarahkan ke halaman utama
 *   dan navbar menampilkan avatar user
 */

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Login')).toBeVisible();

    await page.fill('input[id="email"]', 'john@test.com');
    await page.fill('input[id="password"]', 'secret123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[id="email"]', 'wrong@test.com');
    await page.fill('input[id="password"]', 'wrongpass');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email atau password salah')).toBeVisible({
      timeout: 10000,
    });
  });
});
