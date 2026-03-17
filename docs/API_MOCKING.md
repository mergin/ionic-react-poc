# API Mocking Strategy

## Overview

This PoC uses MSW to keep frontend development deterministic and fast while preserving backend API contracts from the Angular source project.

## Reused assets

- Handlers and mock data reused from Angular PoC under [mocks](../mocks).
- OpenAPI contracts reused under [docs](../docs):
  - `open-weather-api.swagger.yaml`
  - `picsum-api.swagger.yaml`
  - `social-media-api.swagger.yaml`

## Runtime behavior

- In development, the app starts the browser worker from [mocks/browser.ts](../mocks/browser.ts).
- All handlers are composed via [mocks/handlers/index.ts](../mocks/handlers/index.ts).
- Unhandled requests are bypassed by default.

## Endpoint routing by feature

- Tab1 Social: `https://api-gateway.example.com/v1/social/posts`
- Tab2 Gallery: `/picsum/*`
- Tab3 Weather: `/openweather/weather` and `/openweather/forecast`

## Real API toggle strategy

- Gallery supports passthrough using query parameter `__msw=real` in Picsum requests.
- Weather currently targets local mocked endpoints by design for deterministic flow tests.
- To enable real weather API, switch tab3 base URL to OpenWeather host and provide `VITE_OPEN_WEATHER_API_KEY`.

## Test strategy

- Unit tests validate mapping logic and localization behavior.
- Playwright validates end-to-end user flows across all tabs.
- Performance smoke uses Playwright timing thresholds and Lighthouse assertions.
