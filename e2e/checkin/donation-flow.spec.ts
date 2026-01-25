import { test, expect } from '@playwright/test';
import { TEST_CUSTOMER, TEST_DEER_INFO } from '../fixtures/test-data';

test.describe('Donation Processing Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // Extended timeout for complex flow

    await page.goto('/');
    // Navigate through flow to summary
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    // Wait for customer selection
    await expect(page.getByRole('button', { name: /this is me/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /this is me/i }).click();

    // Wait for order selection or deer info
    await expect(
      page.getByText(/different orders|which preferences/i)
        .or(page.getByRole('textbox', { name: /confirmation/i }))
    ).toBeVisible({ timeout: 10000 });

    // Handle order selection if present
    const orderSelectionText = page.getByText(/different orders|which preferences/i);
    if (await orderSelectionText.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.locator('button:has-text("Use These Preferences")').first().click();
      // Wait for deer info form to appear
      await expect(page.getByRole('heading', { name: /new deer information/i })).toBeVisible({ timeout: 15000 });
    }

    // Wait for deer info form
    await expect(page.getByRole('textbox', { name: /confirmation/i })).toBeVisible({ timeout: 15000 });

    // Fill deer info
    await page.getByRole('textbox', { name: /confirmation/i }).fill(TEST_DEER_INFO.tagNumber);
    await page.getByRole('combobox', { name: /deer type/i }).click();
    await page.getByText('Buck', { exact: true }).click();
    await page.getByRole('textbox', { name: /date harvested/i }).fill(TEST_DEER_INFO.dateHarvested);
    await page.getByRole('textbox', { name: /date found/i }).fill(TEST_DEER_INFO.dateFound);
    await page.getByRole('button', { name: /continue.*summary/i }).click();

    // Wait for summary to load
    await expect(page.getByRole('heading', { name: /your previous order/i })).toBeVisible({ timeout: 10000 });
  });

  test('should show donation alert when selecting Donation processing', async ({ page }) => {
    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(page.getByRole('heading', { name: /edit.*processing type/i })).toBeVisible({ timeout: 5000 });

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Should show donation alert
    await expect(page.getByRole('heading', { name: /donation processing/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/remove all specialty meats/i)).toBeVisible();
    await expect(page.getByText(/ground venison only/i)).toBeVisible();
  });

  test('should show Go Back and Continue buttons in donation alert', async ({ page }) => {
    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Verify buttons
    await expect(page.getByRole('button', { name: /go back/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /continue with donation/i })).toBeVisible();
  });

  test('should revert selection when clicking Go Back', async ({ page }) => {
    // Note the current processing type
    const processingTypeText = await page.locator('text=Skinned or Boneless').locator('..').locator('div').last().textContent();

    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Click Go Back
    await page.getByRole('button', { name: /go back/i }).click();

    // Alert should be dismissed
    await expect(page.getByRole('heading', { name: /donation processing/i })).not.toBeVisible();

    // Should still be in editor (Donation not selected)
    await expect(page.getByRole('heading', { name: /edit.*processing type/i })).toBeVisible();
  });

  test('should clear all options when confirming Donation', async ({ page }) => {
    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Click Continue with Donation
    await page.getByRole('button', { name: /continue with donation/i }).click();

    // Return to summary
    await page.getByRole('button', { name: /done.*back to summary/i }).click();

    // Verify Processing Type is Donation
    await expect(page.getByText('Donation')).toBeVisible({ timeout: 5000 });

    // Verify specialty meats are cleared
    await expect(page.getByText(/no specialty meats/i)).toBeVisible();

    // Verify cutting preferences are all Grind
    const grindItems = page.getByText('Grind');
    await expect(grindItems).toHaveCount(4); // Back straps, Hind leg 1, Hind leg 2, Roast
  });

  test('should show $0 total for Donation processing', async ({ page }) => {
    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Click Continue with Donation
    await page.getByRole('button', { name: /continue with donation/i }).click();

    // Return to summary
    await page.getByRole('button', { name: /done.*back to summary/i }).click();

    // Verify total is $0
    await expect(page.getByText('$0.00')).toBeVisible({ timeout: 5000 });
  });

  test('should clear cape/hide options when confirming Donation', async ({ page }) => {
    // Edit Processing Type
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Click Donation option
    await page.getByRole('button', { name: /donation.*\$0/i }).click();

    // Click Continue with Donation
    await page.getByRole('button', { name: /continue with donation/i }).click();

    // Return to summary
    await page.getByRole('button', { name: /done.*back to summary/i }).click();

    // Verify cape/hide section shows no options
    await expect(page.getByText(/no mounting options/i)).toBeVisible({ timeout: 5000 });
  });
});
