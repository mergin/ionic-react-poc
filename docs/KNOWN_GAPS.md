# Known Gaps vs Angular PoC

## Functional gaps

- Tab1 Social currently renders feed cards and metadata but does not yet expose full interaction parity (e.g., like/repost mutations).
- Tab2 Gallery currently uses a static image grid; advanced list semantics used in Angular are not fully replicated.
- Tab3 Weather includes search, unit toggle, loading/error, hourly and daily forecast, but fallback behavior is React-specific for test resilience.

## Testing gaps

- No dedicated render-test suite equivalent to Angular `*.render.spec.ts` yet.
- E2E coverage is strong for navigation, i18n, accessibility, weather flows, and performance smoke, but social interaction flows can be expanded.

## Tooling/process gaps

- CI workflow exists but may need provider-specific tuning (cache strategy, Lighthouse runtime budgets, flaky-test retries).
- No production environment matrix yet (only desktop Chromium baseline in Playwright).

## Next recommended increments

1. Add social interaction API mutations and matching E2E tests.
2. Align gallery semantics with list/listitem parity where needed.
3. Add API mode switcher (mock vs real) in UI/dev config for all three features.
4. Add visual regression snapshots for the 3 tabs.
