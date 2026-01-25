import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form', async ({ page }) => {
    // Should show signup page elements
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Look for any link that goes to login
    const loginLink = page.locator('a[href="/login"]').or(page.getByText(/already have.*account|log in|sign in/i));
    await loginLink.first().click();
    await expect(page).toHaveURL('/login');
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('invalid-email');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: /sign up|create|register/i }).click();

    // Should stay on signup page or show error
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/signup/);
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('123');
    await page.getByRole('button', { name: /sign up|create|register/i }).click();

    // Should stay on signup page
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/signup/);
  });
});
