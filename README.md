# Ionic React PoC (Parallel Migration)

Parallel Ionic React proof-of-concept migrated from the Angular app at ../ionic-poc.

## Scope

- Migration runs in this repository only (parallel PoC).
- Feature parity target: 3 tabs.
- Priority order: tab3 Weather first, then tab1 Social, then tab2 Gallery.

## Reused from Angular source

- MSW handlers and setup under mocks/.
- API contracts under docs/*.swagger.yaml.
- i18n dictionaries under src/i18n/locales/.
- Theme tokens in src/theme/variables.css.
- Performance setup concept: web-vitals + Playwright smoke + Lighthouse assertions.

## Quick start

1. nvm use
2. npm install
3. npm run dev

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
