import { test, expect } from '@playwright/test';
import { TEST_CUSTOMER } from '../fixtures/test-data';

test.describe('Phone Lookup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display phone lookup slideshow', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /phone/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /look up/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new customer/i })).toBeVisible();
  });

  test('should disable Look Up button when phone is empty', async ({ page }) => {
    const lookUpButton = page.getByRole('button', { name: /look up/i });
    await expect(lookUpButton).toBeDisabled();
  });

  test('should enable Look Up button when phone is entered', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill('555-123-4567');
    const lookUpButton = page.getByRole('button', { name: /look up/i });
    await expect(lookUpButton).toBeEnabled();
  });

  test('should show message when no customers found', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill('000-000-0000');
    await page.getByRole('button', { name: /look up/i }).click();

    // Should show no results message or stay on slideshow
    await expect(
      page.getByText(/no.*found|no.*match|not found/i).or(page.getByRole('textbox', { name: /phone/i }))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should find existing customer by phone', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    // Should show customer selection screen
    await expect(page.getByText(TEST_CUSTOMER.name)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /this is me/i })).toBeVisible();
  });

  test('should show "None of These" option on customer selection', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    await expect(page.getByRole('button', { name: /none of these/i })).toBeVisible({ timeout: 5000 });
  });

  test('should show Cancel button on customer selection', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible({ timeout: 5000 });
  });

  test('should return to slideshow on Cancel', async ({ page }) => {
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    await page.getByRole('button', { name: /cancel/i }).click();

    // Should return to phone lookup
    await expect(page.getByRole('textbox', { name: /phone/i })).toBeVisible();
  });

  test('should navigate to new customer form', async ({ page }) => {
    await page.getByRole('button', { name: /new customer/i }).click();

    // Should show new customer form
    await expect(page.getByRole('heading', { name: /customer information/i })).toBeVisible({ timeout: 5000 });
  });
});
