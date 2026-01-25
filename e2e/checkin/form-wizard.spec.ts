import { test, expect } from '@playwright/test';
import { TEST_NEW_CUSTOMER, TEST_DEER_INFO, PROCESSING_OPTIONS } from '../fixtures/test-data';

/**
 * Helper to fill customer info step
 */
async function fillCustomerInfo(page: any) {
  const firstNameInput = page.getByRole('textbox', { name: /first name/i });
  if (await firstNameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await firstNameInput.fill(TEST_NEW_CUSTOMER.firstName);
    await page.getByRole('textbox', { name: /last name/i }).fill(TEST_NEW_CUSTOMER.lastName);
    await page.getByRole('textbox', { name: /phone/i }).fill(TEST_NEW_CUSTOMER.phone);
    await page.getByRole('textbox', { name: /address/i }).fill(TEST_NEW_CUSTOMER.address);
    await page.getByRole('textbox', { name: /city/i }).fill(TEST_NEW_CUSTOMER.city);
    await page.getByRole('textbox', { name: /zip/i }).fill(TEST_NEW_CUSTOMER.zip);
  }
}

/**
 * Helper to fill deer info step
 */
async function fillDeerInfo(page: any) {
  const tagInput = page.getByRole('textbox', { name: /confirmation|tag/i });
  if (await tagInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await tagInput.fill(TEST_DEER_INFO.tagNumber);
    await page.getByRole('combobox', { name: /deer type/i }).click();
    await page.getByText('Buck', { exact: true }).click();
    await page.getByRole('textbox', { name: /date harvested/i }).fill(TEST_DEER_INFO.dateHarvested);
    await page.getByRole('textbox', { name: /date found/i }).fill(TEST_DEER_INFO.dateFound);
  }
}

test.describe('Form Wizard - Processing Type Step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();
  });

  test('should display processing type options', async ({ page }) => {
    // Navigate to processing type step (may need to fill previous steps first)
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Should show processing type options
    await expect(page.getByText(/skinned.*cut.*ground/i).or(page.getByText(/processing type/i))).toBeVisible({ timeout: 10000 });
  });

  test('should have Skinned, Boneless, and Donation options', async ({ page }) => {
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Wait for processing type step
    await page.waitForTimeout(1000);

    // Should have all three options
    await expect(page.getByText(/skinned.*cut.*ground|full processing/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/boneless/i)).toBeVisible();
    await expect(page.getByText(/donation/i)).toBeVisible();
  });
});

test.describe('Form Wizard - Cape/Hide Step', () => {
  test('should display cape and hide options', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();

    // Navigate through steps
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Select processing type
    await page.getByRole('button', { name: /skinned.*cut.*ground|full processing/i }).click();
    await page.getByRole('button', { name: /next/i }).click();

    // Should show cape/hide options (may be on this step or next)
    await expect(
      page.getByText(/cape/i).or(page.getByText(/hide/i)).or(page.getByText(/euro mount/i))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Form Wizard - Cutting Preferences', () => {
  test('should display back strap options', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();

    // Navigate through initial steps
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Select processing type
    await page.getByRole('button', { name: /skinned.*cut.*ground|full processing/i }).click();
    await page.getByRole('button', { name: /next/i }).click();

    // Continue through cape/hide if present
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton.click();
    }

    // Should eventually show back straps or cutting options
    await expect(
      page.getByText(/back strap/i).or(page.getByText(/cutting/i)).or(page.getByText(/hind leg/i))
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Form Wizard - Specialty Meats', () => {
  test('should display specialty meat options', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();

    // Navigate through steps quickly
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Keep clicking next to get to specialty meats
    for (let i = 0; i < 10; i++) {
      const specialtyMeatsVisible = await page.getByText(/specialty meat/i).isVisible().catch(() => false);
      if (specialtyMeatsVisible) break;

      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }

    // Should show specialty meats (Trail Bologna, Snack Sticks, etc.)
    await expect(
      page.getByText(/trail bologna/i)
        .or(page.getByText(/snack sticks/i))
        .or(page.getByText(/summer sausage/i))
        .or(page.getByText(/specialty meat/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should allow selecting specialty meat quantities', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();

    // Navigate to specialty meats
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Navigate through to specialty meats
    for (let i = 0; i < 10; i++) {
      const trailBologna = await page.getByText(/trail bologna/i).isVisible().catch(() => false);
      if (trailBologna) break;

      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(500);
      } else {
        break;
      }
    }

    // Should have quantity selectors or increment buttons
    const quantityButtons = page.getByRole('button', { name: /\+|add|increase/i });
    const quantityInputs = page.getByRole('spinbutton');

    await expect(quantityButtons.or(quantityInputs).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Form Wizard - Summary/Review', () => {
  test('should show order summary before submission', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new customer/i }).click();

    // Fill all required steps and navigate to end
    await fillCustomerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();
    await fillDeerInfo(page);
    await page.getByRole('button', { name: /next/i }).click();

    // Navigate through all steps
    for (let i = 0; i < 15; i++) {
      const submitButton = page.getByRole('button', { name: /submit|place order|confirm/i });
      if (await submitButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Found submit button, we're at the summary
        break;
      }

      const nextButton = page.getByRole('button', { name: /next/i });
      if (await nextButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(300);
      } else {
        break;
      }
    }

    // Should show some form of summary or submit option
    const summaryOrSubmit = page.getByText(/total|summary|review/i)
      .or(page.getByRole('button', { name: /submit|place order|confirm/i }));
    await expect(summaryOrSubmit).toBeVisible({ timeout: 10000 });
  });
});
