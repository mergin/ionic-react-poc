import {
  buildFallbackWeatherData,
  mapDailyForecastEntries,
  mapHourlyForecastEntries,
  type OpenWeatherForecast,
} from './mapper';

function makeForecast(): OpenWeatherForecast {
  return {
    city: { timezone: 3600 },
    list: [
      {
        dt: 1_763_653_200,
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 25, feels_like: 24, temp_min: 24, temp_max: 26 },
      },
      {
        dt: 1_763_664_000,
        weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: { temp: 23, feels_like: 22, temp_min: 22, temp_max: 24 },
      },
      {
        dt: 1_763_739_600,
        weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
        main: { temp: 21, feels_like: 21, temp_min: 20, temp_max: 22 },
      },
      {
        dt: 1_763_826_000,
        weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: { temp: 22, feels_like: 22, temp_min: 21, temp_max: 23 },
      },
    ],
  };
}

describe('weather mapper', () => {
  it('maps hourly entries with icon urls', () => {
    const hourly = mapHourlyForecastEntries(makeForecast());

    expect(hourly).toHaveLength(4);
    expect(hourly[0]?.weatherLabel).toBe('Clear');
    expect(hourly[0]?.iconUrl).toContain('openweathermap.org/img/wn/01d@2x.png');
  });

  it('maps daily entries as first record per day', () => {
    const daily = mapDailyForecastEntries(makeForecast());

    expect(daily.length).toBeGreaterThanOrEqual(2);
    expect(daily[0]?.temperature).toBe(25);
  });

  it('builds fallback weather in imperial units', () => {
    const fallback = buildFallbackWeatherData('Barcelona', 'imperial');

    expect(fallback.current.name).toBe('Barcelona');
    expect(fallback.current.main.temp).toBeGreaterThan(70);
    expect(fallback.forecast.list).toHaveLength(12);
  });
});
