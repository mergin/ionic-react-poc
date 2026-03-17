import { expect, test } from '@playwright/test';

test('should navigate between tabs and keep all 3 feature shells available', async ({ page }) => {
  await page.goto('/');

  await page.locator('ion-tab-button[tab="tab1"]').click();
  await expect(page).toHaveURL(/\/tab1/);
  await expect(page.getByText('Social Media').first()).toBeVisible();
  await expect(page.locator('ion-list[aria-label="Social media posts"]')).toBeVisible();

  await page.locator('ion-tab-button[tab="tab2"]').click();
  await expect(page).toHaveURL(/\/tab2/);
  await expect(page.getByText('Image Gallery').first()).toBeVisible();
  await expect(page.locator('section[aria-label="Image gallery"]')).toBeVisible();

  await page.locator('ion-tab-button[tab="tab3"]').click();
  await expect(page).toHaveURL(/\/tab3/);
  await expect(page.getByText('Weather').first()).toBeVisible();
  await expect(page.getByText('High/Low')).toBeVisible();
});
