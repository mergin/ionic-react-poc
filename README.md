# Ionic React PoC (Parallel Migration)

Parallel Ionic React proof-of-concept migrated from the Angular app at ../ionic-poc.

## Scope

- Migration runs in this repository only (parallel PoC).
- Feature parity target: 3 tabs.
- Priority order: tab3 Weather first, then tab1 Social, then tab2 Gallery.

## Architecture

- App shell: Ionic tabs router in `src/App.tsx` with all three tabs available.
- Feature tabs:
  - Tab1 Social feed in `src/pages/Tab1.tsx`
  - Tab2 Image gallery in `src/pages/Tab2.tsx`
  - Tab3 Weather in `src/pages/Tab3.tsx`
- Shared i18n provider: `src/i18n/index.tsx` with `en` / `es` dictionaries.
- Mock API layer: `mocks/*` via MSW browser worker.
- Performance hooks: `src/performance/web-vitals.ts` plus Playwright and Lighthouse checks.

## Reused from Angular source

- MSW handlers and setup under mocks/.
- API contracts under docs/\*.swagger.yaml.
- i18n dictionaries under src/i18n/locales/.
- Theme tokens in src/theme/variables.css.
- Performance setup concept: web-vitals + Playwright smoke + Lighthouse assertions.

## Quick start

1. nvm use
2. npm install
3. npm run dev

## Runbook

1. Start app: `npm run dev`
2. Run lint: `npm run lint`
3. Run unit tests: `npm run test`
4. Run full e2e: `npm run test.e2e`
5. Run performance smoke: `npm run test:perf`
6. Run Lighthouse assertions: `npm run lighthouse`

For one-command local validation, use `npm run test:all`.

## Scripts

- npm run lint
- npm test
- npm run test:render
- npm run test.unit
- npm run test.e2e:install
- npm run test.e2e
- npm run test:perf
- npm run lighthouse
- npm run lighthouse:ci

## Pre-commit behavior (parity with original app)

- Husky pre-commit runs `npm test`.
- Husky pre-commit runs `npm run test:render`.
- Husky pre-commit runs `npx lint-staged`.
- Husky commit-msg runs `npx --no -- commitlint --edit $1`.

## API mocking and real API strategy

See [docs/API_MOCKING.md](docs/API_MOCKING.md) for endpoint mapping, MSW behavior, and real API toggle notes.

## Migration notes and gaps

See [docs/KNOWN_GAPS.md](docs/KNOWN_GAPS.md) for parity status and next increments.

## Project structure

- src/pages/Tab3.tsx: weather-first feature implementation.
- src/pages/Tab1.tsx: social feed baseline.
- src/pages/Tab2.tsx: gallery baseline.
- src/i18n/: translation provider + locales.
- mocks/: shared API mocking handlers.
- e2e/: Playwright user-flow and performance smoke tests.
- docs/: OpenAPI contracts and migration checklist.

## Migration checklist

See docs/MIGRATION_TODO.md.
