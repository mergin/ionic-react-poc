import { expect, test } from '@playwright/test';

test('should switch language and update labels in all 3 tabs', async ({ page }) => {
  await page.goto('/tab1');

  const tabOneLabel = page.locator('ion-tab-button[tab="tab1"] ion-label');
  const tabTwoLabel = page.locator('ion-tab-button[tab="tab2"] ion-label');
  const tabThreeLabel = page.locator('ion-tab-button[tab="tab3"] ion-label');

  await expect(tabOneLabel).toContainText('Social Media');
  await expect(tabTwoLabel).toContainText('Image Gallery');
  await expect(tabThreeLabel).toContainText('Weather');

  await page.locator('ion-button[aria-label="Language selector"]').first().click();
  const spanishOption = page.locator('ion-popover ion-item', { hasText: 'ES' }).first();
  await expect(spanishOption).toBeVisible();
  await spanishOption.click({ force: true });

  await expect(tabOneLabel).toContainText('Red Social');
  await expect(tabTwoLabel).toContainText('Galería de Imágenes');
  await expect(tabThreeLabel).toContainText('Clima');

  await page.locator('ion-button[aria-label="Selector de idioma"]').first().click();
  const englishOption = page.locator('ion-popover ion-item', { hasText: 'EN' }).first();
  await expect(englishOption).toBeVisible();
  await englishOption.click({ force: true });

  await expect(tabOneLabel).toContainText('Social Media');
  await expect(tabTwoLabel).toContainText('Image Gallery');
  await expect(tabThreeLabel).toContainText('Weather');
});
