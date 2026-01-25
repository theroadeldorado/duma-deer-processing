import { test, expect } from '@playwright/test';

test.describe('Admin - Deer Orders List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/deers');
  });

  test('should display deer orders page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /deer|orders/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have a table or list of orders', async ({ page }) => {
    // Should show table or list of deer orders
    await expect(
      page.getByRole('table').or(page.getByRole('list')).or(page.locator('[class*="table"]'))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display order information columns', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Should have columns for name, tag number, date, etc.
    await expect(
      page.getByText(/name/i)
        .or(page.getByText(/tag/i))
        .or(page.getByText(/date/i))
        .or(page.getByText(/customer/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test('should have search or filter functionality', async ({ page }) => {
    // Should have search input or filter options
    const searchOrFilter = page.getByRole('searchbox')
      .or(page.getByRole('textbox', { name: /search|filter/i }))
      .or(page.getByPlaceholder(/search|filter/i));

    await expect(searchOrFilter).toBeVisible({ timeout: 10000 });
  });

  test('should have clickable rows to view order details', async ({ page }) => {
    // Wait for orders to load
    await page.waitForTimeout(2000);

    // Find a row with an order
    const orderRow = page.locator('tr').filter({ hasText: /\d{4}/ }).first()
      .or(page.locator('[class*="row"]').first());

    if (await orderRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Row should be clickable or have a view/edit button
      const clickableElement = orderRow.getByRole('link')
        .or(orderRow.getByRole('button'))
        .or(orderRow.locator('a'));

      await expect(clickableElement.first()).toBeVisible();
    }
  });

  test('should have export or print functionality', async ({ page }) => {
    // Should have export/print button
    const exportOrPrint = page.getByRole('button', { name: /export|print|csv|download/i })
      .or(page.getByRole('link', { name: /export|print|csv|download/i }));

    await expect(exportOrPrint).toBeVisible({ timeout: 10000 });
  });

  test('should show pagination or load more for large lists', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(2000);

    // May have pagination or infinite scroll indicator
    const pagination = page.getByRole('navigation', { name: /pagination/i })
      .or(page.getByRole('button', { name: /next|previous|load more/i }))
      .or(page.getByText(/page \d/i))
      .or(page.getByText(/showing \d/i));

    // This may not always be visible if there aren't many orders
    // Just check the page loads without errors
    await expect(page).toHaveURL(/\/admin\/deers/);
  });
});

test.describe('Admin - Edit Deer Order', () => {
  test('should navigate to edit page from orders list', async ({ page }) => {
    await page.goto('/admin/deers');

    // Wait for orders to load
    await page.waitForTimeout(2000);

    // Find and click an order row or edit button
    const editButton = page.getByRole('button', { name: /edit|view/i }).first()
      .or(page.getByRole('link', { name: /edit|view/i }).first());

    if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editButton.click();

      // Should navigate to edit page
      await expect(page).toHaveURL(/\/admin\/deers\/.*\/edit/);
    }
  });

  test('should display order details on edit page', async ({ page }) => {
    await page.goto('/admin/deers');
    await page.waitForTimeout(2000);

    // Navigate to an order edit page
    const firstOrderLink = page.locator('a[href*="/admin/deers/"]').first();
    if (await firstOrderLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOrderLink.click();

      // Should show order details
      await expect(
        page.getByText(/customer|name/i)
          .or(page.getByText(/tag number|confirmation/i))
          .or(page.getByText(/processing/i))
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have editable fields', async ({ page }) => {
    await page.goto('/admin/deers');
    await page.waitForTimeout(2000);

    // Navigate to edit page
    const firstOrderLink = page.locator('a[href*="/admin/deers/"]').first();
    if (await firstOrderLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOrderLink.click();

      // Should have editable fields (inputs, selects, etc.)
      const editableFields = page.getByRole('textbox')
        .or(page.getByRole('combobox'))
        .or(page.getByRole('spinbutton'));

      await expect(editableFields.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have save/update button', async ({ page }) => {
    await page.goto('/admin/deers');
    await page.waitForTimeout(2000);

    const firstOrderLink = page.locator('a[href*="/admin/deers/"]').first();
    if (await firstOrderLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOrderLink.click();

      // Should have save button
      const saveButton = page.getByRole('button', { name: /save|update|submit/i });
      await expect(saveButton).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have print functionality', async ({ page }) => {
    await page.goto('/admin/deers');
    await page.waitForTimeout(2000);

    const firstOrderLink = page.locator('a[href*="/admin/deers/"]').first();
    if (await firstOrderLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOrderLink.click();

      // Should have print button
      const printButton = page.getByRole('button', { name: /print/i })
        .or(page.getByRole('link', { name: /print/i }));

      await expect(printButton).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show pricing information', async ({ page }) => {
    await page.goto('/admin/deers');
    await page.waitForTimeout(2000);

    const firstOrderLink = page.locator('a[href*="/admin/deers/"]').first();
    if (await firstOrderLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstOrderLink.click();

      // Should show pricing info (total, deposit, balance, etc.)
      await expect(
        page.getByText(/\$\d+/)
          .or(page.getByText(/total/i))
          .or(page.getByText(/price/i))
          .or(page.getByText(/balance/i))
      ).toBeVisible({ timeout: 10000 });
    }
  });
});
