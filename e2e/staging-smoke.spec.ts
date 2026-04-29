import { expect, test } from '@playwright/test';

test('staging smoke path loads the dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Assignment Deadline Tracker Dashboard/i);
  await expect(page.getByRole('heading', { name: /Assignment Tracker/i })).toBeVisible();
  await expect(page.getByText(/Stay on top of your deadlines/i)).toBeVisible();
});
