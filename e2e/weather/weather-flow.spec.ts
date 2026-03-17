import { expect, test } from '@playwright/test';

test('should update current city when searching weather by city name', async ({ page }) => {
  await page.goto('/tab3');

  const searchInput = page.locator('ion-searchbar input');
  const cityLabel = page.locator('.current-weather__city');

  await searchInput.fill('Barcelona');
  await searchInput.press('Enter');

  await expect(cityLabel).toHaveText('Barcelona');
});

test('should switch weather values and units when toggling fahrenheit', async ({ page }) => {
  await page.goto('/tab3');

  const unitToggle = page.locator('ion-toggle[aria-label="Switch between Celsius and Fahrenheit"]');
  const currentTemperature = page.locator('.current-weather__temp');
  const windMeta = page.locator('.current-weather__meta').first();

  await expect(currentTemperature).toContainText('C');
  await expect(windMeta).toContainText('m/s');

  await unitToggle.click();

  await expect(currentTemperature).toContainText('F');
  await expect(windMeta).toContainText('mph');
});
