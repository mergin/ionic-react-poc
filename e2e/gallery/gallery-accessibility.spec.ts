import { expect, test } from '@playwright/test';

test('gallery tab should expose accessible image grid', async ({ page }) => {
  await page.goto('/tab2');

  await expect(page.getByText('Image Gallery').first()).toBeVisible();
  await expect(page.locator('section[aria-label="Image gallery"]')).toBeVisible();
  await expect(page.locator('img[alt^="Photo by"]').first()).toBeVisible();
});
