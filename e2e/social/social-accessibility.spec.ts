import { expect, test } from '@playwright/test';

test('social tab should expose stable accessible feed structure', async ({ page }) => {
  await page.goto('/tab1');

  await expect(page.getByText('Social Media').first()).toBeVisible();
  await expect(page.locator('ion-list[aria-label="Social media posts"]')).toBeVisible();
  await expect(page.locator('img[alt*="avatar"]').first()).toBeVisible();
});
