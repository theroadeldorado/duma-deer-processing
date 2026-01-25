import { test, expect } from '@playwright/test';

test.describe('Success Page', () => {
  test('should display success page after navigation', async ({ page }) => {
    // Navigate directly to success page
    await page.goto('/success');

    // Should show success message or redirect
    await expect(
      page.getByText(/success|thank you|submitted|complete/i)
        .or(page.getByRole('heading', { name: /success|thank you|complete/i }))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should have option to start new order', async ({ page }) => {
    await page.goto('/success');

    // Should have button to start a new order
    const newOrderButton = page.getByRole('button', { name: /new order|start over|another/i })
      .or(page.getByRole('link', { name: /new order|start over|another|home/i }));

    await expect(newOrderButton).toBeVisible({ timeout: 10000 });
  });

  test('should display confirmation number or order details', async ({ page }) => {
    await page.goto('/success');

    // May show confirmation number or order summary
    await expect(
      page.getByText(/confirmation|order|number/i)
        .or(page.getByText(/thank you/i))
    ).toBeVisible({ timeout: 10000 });
  });
});
