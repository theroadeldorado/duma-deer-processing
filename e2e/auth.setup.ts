import { test as setup, expect } from '@playwright/test';
import { TEST_USER } from './fixtures/test-data';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Go to login page
  await page.goto('/login');

  // Fill in credentials
  await page.getByRole('textbox', { name: /email/i }).fill(TEST_USER.email);
  await page.getByRole('textbox', { name: /password/i }).fill(TEST_USER.password);

  // Click login button
  await page.getByRole('button', { name: /login/i }).click();

  // Wait for redirect to home page
  await page.waitForURL('/');

  // Verify we're logged in by checking for the phone lookup form
  await expect(page.getByRole('textbox', { name: /phone/i })).toBeVisible({ timeout: 10000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
