import { expect, test, type Page } from '@playwright/test';

const MAX_DOM_CONTENT_LOADED_MS = 2_500;
const MAX_LOAD_EVENT_MS = 4_000;
const MAX_TAB_SWITCH_MS = 7_000;

async function getNavigationTimingSummary(
  page: Page,
): Promise<{ domContentLoadedMs: number; loadEventMs: number }> {
  return page.evaluate(() => {
    const [navigationEntry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    if (!navigationEntry) {
      return {
        domContentLoadedMs: Number.NaN,
        loadEventMs: Number.NaN,
      };
    }

    return {
      domContentLoadedMs: navigationEntry.domContentLoadedEventEnd,
      loadEventMs: navigationEntry.loadEventEnd,
    };
  });
}

async function measureTabSwitchMs(
  page: Page,
  tabId: string,
  assertionLocator: string,
): Promise<number> {
  const startedAt = Date.now();

  await page.locator(`ion-tab-button[tab="${tabId}"]`).click();
  await expect(page.locator(assertionLocator)).toBeVisible();

  return Date.now() - startedAt;
}

test('should keep initial load and tab-switch timings within budget', async ({ page }) => {
  await page.goto('/tab3');

  const navigationTiming = await getNavigationTimingSummary(page);
  const socialSwitchMs = await measureTabSwitchMs(
    page,
    'tab1',
    'ion-list[aria-label="Social media posts"]',
  );
  const gallerySwitchMs = await measureTabSwitchMs(
    page,
    'tab2',
    'section[aria-label="Image gallery"]',
  );

  expect(navigationTiming.domContentLoadedMs).toBeLessThan(MAX_DOM_CONTENT_LOADED_MS);
  expect(navigationTiming.loadEventMs).toBeLessThan(MAX_LOAD_EVENT_MS);
  expect(socialSwitchMs).toBeLessThan(MAX_TAB_SWITCH_MS);
  expect(gallerySwitchMs).toBeLessThan(MAX_TAB_SWITCH_MS);
});
