# Ionic Angular -> Ionic React PoC TODO

## Phase 1: Scaffold and baseline

- [x] Initialize Ionic React tabs scaffold in this repository.
- [x] Keep migration parallel (separate repo, no in-place conversion).
- [x] Configure base TypeScript + Vite aliases for src and mocks.
- [x] Add project config files: .nvmrc, Prettier, Copilot instructions.

## Phase 2: Reuse assets from Angular PoC

- [x] Copy MSW setup and handlers into mocks/.
- [x] Copy API contracts into docs/.
- [x] Copy i18n dictionaries (en/es) with React adapter.
- [x] Port visual theme tokens from variables.scss to variables.css.
- [x] Copy performance baseline files (.lighthouserc, web-vitals concept).

## Phase 3: Feature parity by tab (weather first)

- [x] Implement tab3 weather search + unit toggle + hourly/daily forecast.
- [x] Implement tab1 social feed baseline using MSW posts endpoint.
- [x] Implement tab2 image gallery baseline using MSW picsum endpoint.
- [x] Set weather tab as default route while preserving all 3 tabs.

## Phase 4: Test and quality setup

- [x] Switch E2E setup to Playwright and add core config.
- [x] Add weather-flow and tabs-performance smoke specs.
- [x] Add Lighthouse scripts and assertion configs.
- [x] Add unit tests for i18n provider and weather mapping utilities.
- [x] Add accessibility specs for social, gallery, and weather pages.

## Phase 5: Documentation and hardening

- [ ] Expand README with architecture, runbook, and migration notes.
- [ ] Document API mocking strategy and real API toggle strategy.
- [ ] Document known gaps vs Angular PoC and next migration increments.
- [x] Add CI workflow for lint, test, build, and perf smoke.
- [x] Replicate original app pre-commit behavior with Husky + lint-staged + commitlint.
