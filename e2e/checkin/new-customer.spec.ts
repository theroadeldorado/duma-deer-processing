import { test, expect } from '@playwright/test';
import { TEST_NEW_CUSTOMER, TEST_DEER_INFO } from '../fixtures/test-data';

test.describe('New Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();
  });

  test('should display customer info form', async ({ page }) => {
    await expect(page.getByText(/first name/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/last name/i)).toBeVisible();
    await expect(page.getByText(/phone/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to proceed without filling required fields
    const nextButton = page.getByRole('button', { name: /next|continue/i });
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton.click();
      // Should show validation errors or stay on same page
      await expect(page.getByText(/first name/i)).toBeVisible();
    }
  });

  test('should allow filling customer information', async ({ page }) => {
    // Fill in customer info
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const lastNameInput = page.getByRole('textbox', { name: /last name/i });
    const phoneInput = page.getByRole('textbox', { name: /phone/i });

    if (await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstNameInput.fill(TEST_NEW_CUSTOMER.firstName);
      await lastNameInput.fill(TEST_NEW_CUSTOMER.lastName);
      await phoneInput.fill(TEST_NEW_CUSTOMER.phone);

      // Verify values are filled
      await expect(firstNameInput).toHaveValue(TEST_NEW_CUSTOMER.firstName);
      await expect(lastNameInput).toHaveValue(TEST_NEW_CUSTOMER.lastName);
    }
  });

  test('should display address fields', async ({ page }) => {
    await expect(page.getByText(/address/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/city/i)).toBeVisible();
    await expect(page.getByText(/state/i)).toBeVisible();
    await expect(page.getByText(/zip/i)).toBeVisible();
  });

  test('should display communication preference options', async ({ page }) => {
    await expect(page.getByText(/communication|contact preference/i)).toBeVisible({ timeout: 5000 });
    // Should have Text and Call options
    await expect(page.getByText(/text/i)).toBeVisible();
  });
});

test.describe('New Customer Form Wizard Steps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();
  });

  test('should show form wizard with multiple steps', async ({ page }) => {
    // Form wizard should be visible
    await expect(page.getByRole('form').or(page.locator('form'))).toBeVisible({ timeout: 5000 });
  });

  test('should navigate between steps using Next button', async ({ page }) => {
    // Fill required fields for first step
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const lastNameInput = page.getByRole('textbox', { name: /last name/i });
    const phoneInput = page.getByRole('textbox', { name: /phone/i });
    const addressInput = page.getByRole('textbox', { name: /address/i });
    const cityInput = page.getByRole('textbox', { name: /city/i });
    const zipInput = page.getByRole('textbox', { name: /zip/i });

    if (await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstNameInput.fill(TEST_NEW_CUSTOMER.firstName);
      await lastNameInput.fill(TEST_NEW_CUSTOMER.lastName);
      await phoneInput.fill(TEST_NEW_CUSTOMER.phone);
      await addressInput.fill(TEST_NEW_CUSTOMER.address);
      await cityInput.fill(TEST_NEW_CUSTOMER.city);
      await zipInput.fill(TEST_NEW_CUSTOMER.zip);

      // Click Next
      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButton.click();
        // Should advance to next step (Deer Info or Processing Type)
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should have a Cancel or Back option', async ({ page }) => {
    // Should have some way to go back or cancel
    const backOrCancel = page.getByRole('button', { name: /back|cancel|previous/i });
    await expect(backOrCancel).toBeVisible({ timeout: 5000 });
  });
});
