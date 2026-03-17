# Copilot Instructions

## Goal

Parallel Ionic React migration PoC from the Angular app at ../ionic-poc.

## Engineering guardrails

- Keep this repository as a parallel PoC. Do not backport changes into the Angular app.
- Prioritize feature parity by tabs, with weather (tab3) first.
- Reuse API contracts, MSW handlers, i18n keys, and theme tokens from the Angular source when practical.
- Keep code accessible and testable (ARIA labels, deterministic selectors, stable loading/error states).
- Prefer small, typed utility functions instead of deeply nested render logic.
- Keep pages in dedicated folders under `src/pages/<page-name>/`.
- Keep reusable components in dedicated folders under `src/components/<component-name>/`.
- Every page/component folder must include an `index.ts` barrel export.
- Add JSDoc/TSDoc (or equivalent) for exported types, functions, and components in `.ts` and `.tsx` files, and for non-trivial internal helpers.

## Testing expectations

- Unit tests: vitest.
- E2E tests: Playwright (primary).
- Performance smoke: Playwright timing budget + Lighthouse assertions.

## File reuse map

- MSW: mocks/\*
- API contracts: docs/\*.swagger.yaml
- i18n: src/i18n/locales/\*
- Theme tokens: src/theme/variables.css
- Perf setup: src/performance/web-vitals.ts, e2e/performance/_, .lighthouserc_.json
