import { expect, test } from '@playwright/test';

test('weather tab should expose accessible controls and region labels', async ({ page }) => {
  await page.goto('/tab3');

  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(
    page.locator('[role="group"][aria-label="Switch between Celsius and Fahrenheit"]'),
  ).toBeVisible();
  await expect(page.getByText('Hourly Forecast').first()).toBeVisible();
  await expect(page.getByText('Daily Forecast').first()).toBeVisible();
});
