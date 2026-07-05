import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'ok',
          data: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
          },
        }),
      });
    });

    await page.route('https://forum-api.dicoding.dev/v1/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'ok',
          data: {
            user: {
              id: 'user-123',
              name: 'John Doe',
              email: 'john@test.com',
              avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
            },
          },
        }),
      });
    });

    await page.goto('/login');

    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();

    await page.fill('input[id="email"]', 'john@test.com');
    await page.fill('input[id="password"]', 'secret123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'fail',
          message: 'Email atau password salah',
        }),
      });
    });

    await page.goto('/login');

    await page.fill('input[id="email"]', 'wrong@test.com');
    await page.fill('input[id="password"]', 'wrongpass');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Email atau password salah')).toBeVisible({
      timeout: 10000,
    });
  });
});
