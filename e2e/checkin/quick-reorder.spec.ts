import { test, expect } from '@playwright/test';
import { TEST_CUSTOMER, TEST_DEER_INFO } from '../fixtures/test-data';

test.describe('Quick Reorder Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/');
    // Look up existing customer
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();
    // Wait for and select customer
    await expect(page.getByRole('button', { name: /this is me/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /this is me/i }).click();
    // Wait for order selection or deer info
    await expect(
      page.getByText(/different orders|which preferences/i)
        .or(page.getByRole('heading', { name: /new deer information/i }))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show order selection when customer has multiple different orders', async ({ page }) => {
    // Should show order selection or go directly to deer info
    const orderSelection = page.getByText(/different orders|which preferences/i);
    const deerInfo = page.getByRole('heading', { name: /new deer information|deer information/i });

    await expect(orderSelection.or(deerInfo)).toBeVisible({ timeout: 10000 });
  });

  test('should show order preference cards with amounts', async ({ page }) => {
    // If order selection is shown, verify cards have amounts
    const orderSelection = page.getByText(/different orders|which preferences/i);

    if (await orderSelection.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Check for specialty meat amounts (e.g., "25lbs", "10lbs")
      await expect(page.getByText(/\d+lbs/)).toBeVisible();
      await expect(page.getByRole('button', { name: /use these preferences/i }).first()).toBeVisible();
    }
  });

  test('should proceed to deer info after selecting order preferences', async ({ page }) => {
    // If order selection is shown, select first option
    const orderSelectionText = page.getByText(/different orders|which preferences/i);

    if (await orderSelectionText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator('button:has-text("Use These Preferences")').first().click();
    }

    // Should show deer info form
    await expect(page.getByRole('heading', { name: /new deer information|deer information/i })).toBeVisible({ timeout: 15000 });
  });

  test('should show welcome message with customer first name', async ({ page }) => {
    // Wait for either order selection or deer info
    await page.waitForTimeout(2000);

    // Should show personalized welcome message
    await expect(page.getByText(new RegExp(`welcome.*${TEST_CUSTOMER.firstName}`, 'i'))).toBeVisible();
  });

  test('should require deer info fields', async ({ page }) => {
    // Navigate to deer info if needed
    const orderSelectionText = page.getByText(/different orders|which preferences/i);
    if (await orderSelectionText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator('button:has-text("Use These Preferences")').first().click();
    }

    // Wait for deer info form
    await expect(page.getByRole('heading', { name: /new deer information|deer information/i })).toBeVisible({ timeout: 15000 });

    // Verify required fields are present
    await expect(page.getByRole('textbox', { name: /confirmation number/i })).toBeVisible();
    await expect(page.getByText(/deer type/i)).toBeVisible();
    await expect(page.getByText(/date harvested/i)).toBeVisible();
  });

  test('should navigate to summary after filling deer info', async ({ page }) => {
    // Navigate to deer info if needed
    const orderSelectionText = page.getByText(/different orders|which preferences/i);
    if (await orderSelectionText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.locator('button:has-text("Use These Preferences")').first().click();
    }

    // Wait for confirmation input to be visible
    await expect(page.getByRole('textbox', { name: /confirmation number/i })).toBeVisible({ timeout: 15000 });

    // Fill deer info
    await page.getByRole('textbox', { name: /confirmation number/i }).fill(TEST_DEER_INFO.tagNumber);

    // Select deer type
    await page.getByRole('combobox', { name: /deer type/i }).click();
    await page.getByText('Buck', { exact: true }).click();

    // Fill dates
    await page.getByRole('textbox', { name: /date harvested/i }).fill(TEST_DEER_INFO.dateHarvested);
    await page.getByRole('textbox', { name: /date found/i }).fill(TEST_DEER_INFO.dateFound);

    // Click continue
    await page.getByRole('button', { name: /continue.*summary/i }).click();

    // Should show summary
    await expect(page.getByRole('heading', { name: /your previous order/i })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Quick Reorder Summary Page', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // Extended timeout for complex flow

    await page.goto('/');
    // Navigate through flow to summary
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_CUSTOMER.phone);
    await page.getByRole('button', { name: /look up/i }).click();

    // Wait for customer selection to appear
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
      // Use text-based locator for more reliable clicking
      await page.locator('button:has-text("Use These Preferences")').first().click();
      // Wait for deer info form to appear
      await expect(page.getByRole('heading', { name: /new deer information/i })).toBeVisible({ timeout: 15000 });
    }

    // Wait for deer info form to appear
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

  test('should display all editable sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /processing type/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: /cape.*hide.*euro/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /cutting preferences/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /ground venison/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /specialty meats/i })).toBeVisible();
  });

  test('should have Edit button for each section', async ({ page }) => {
    const editButtons = page.getByRole('button', { name: /edit/i });
    // Should have at least 5 edit buttons (one for each section)
    const count = await editButtons.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should display estimated total', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /estimated total/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have Same as Last Time button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /same as last time/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have Start Fresh button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start fresh/i })).toBeVisible({ timeout: 10000 });
  });

  test('should open section editor when clicking Edit', async ({ page }) => {
    // Click first Edit button (Processing Type)
    await page.getByRole('button', { name: /edit/i }).first().click();

    // Should show editor
    await expect(page.getByRole('heading', { name: /edit.*processing type/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /done.*back to summary/i })).toBeVisible();
  });

  test('should return to summary from section editor', async ({ page }) => {
    // Open editor
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(page.getByRole('heading', { name: /edit.*processing type/i })).toBeVisible({ timeout: 5000 });

    // Click Done
    await page.getByRole('button', { name: /done.*back to summary/i }).click();

    // Should return to summary
    await expect(page.getByRole('heading', { name: /your previous order/i })).toBeVisible({ timeout: 5000 });
  });
});
