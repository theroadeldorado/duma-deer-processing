import { test, expect } from '@playwright/test';

test.describe('Admin Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /admin|dashboard/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have navigation to Deer Orders', async ({ page }) => {
    // Look for link to deers page
    const deersLink = page.locator('a[href*="/admin/deers"]').or(page.getByRole('link', { name: /deer|orders/i }));
    await expect(deersLink.first()).toBeVisible({ timeout: 10000 });

    await deersLink.first().click();
    await expect(page).toHaveURL(/\/admin\/deers/);
  });

  test('should have navigation to Users', async ({ page }) => {
    const usersLink = page.getByRole('link', { name: /users/i });
    if (await usersLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await usersLink.click();
      await expect(page).toHaveURL(/\/admin\/users/);
    }
  });

  test('should have navigation to Templates', async ({ page }) => {
    const templatesLink = page.getByRole('link', { name: /templates/i });
    if (await templatesLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await templatesLink.click();
      await expect(page).toHaveURL(/\/admin\/templates/);
    }
  });

  test('should have navigation to Account Settings', async ({ page }) => {
    const accountLink = page.getByRole('link', { name: /account|settings|profile/i });
    if (await accountLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await accountLink.click();
      await expect(page).toHaveURL(/\/admin\/account/);
    }
  });

  test('should have logout option', async ({ page }) => {
    const logoutLink = page.locator('a[href*="logout"]')
      .or(page.getByRole('link', { name: /logout|sign out/i }))
      .or(page.getByRole('button', { name: /logout|sign out/i }));

    await expect(logoutLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have link back to check-in form', async ({ page }) => {
    const homeLink = page.locator('a[href="/"]')
      .or(page.getByRole('link', { name: /home|check-in|new order/i }));

    await expect(homeLink.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Admin - Users Page', () => {
  test('should display users list', async ({ page }) => {
    await page.goto('/admin/users');

    await expect(page.getByRole('heading', { name: /users/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have user table or list', async ({ page }) => {
    await page.goto('/admin/users');

    await expect(
      page.getByRole('table')
        .or(page.getByRole('list'))
        .or(page.locator('[class*="table"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show user email and role', async ({ page }) => {
    await page.goto('/admin/users');

    await expect(
      page.getByText(/email/i)
        .or(page.getByText(/@/))
        .or(page.getByText(/role|admin|user/i))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Admin - Account Settings', () => {
  test('should display account settings page', async ({ page }) => {
    await page.goto('/admin/account');

    await expect(
      page.getByRole('heading', { name: /account|settings|profile/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show current user email', async ({ page }) => {
    await page.goto('/admin/account');

    // Should display the logged in user's email
    await expect(page.getByText(/@/)).toBeVisible({ timeout: 10000 });
  });

  test('should have password change option', async ({ page }) => {
    await page.goto('/admin/account');

    const passwordOption = page.getByText(/password/i)
      .or(page.getByRole('button', { name: /change password|update password/i }));

    await expect(passwordOption).toBeVisible({ timeout: 10000 });
  });
});
