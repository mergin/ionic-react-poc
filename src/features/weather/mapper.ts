export type Unit = 'metric' | 'imperial';

export interface OpenWeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
}

export interface OpenWeatherCurrent {
  weather: OpenWeatherCondition[];
  main: OpenWeatherMain;
  wind: { speed: number };
  dt: number;
  name: string;
  timezone: number;
}

export interface OpenWeatherForecastItem {
  dt: number;
  weather: OpenWeatherCondition[];
  main: OpenWeatherMain;
}

export interface OpenWeatherForecast {
  list: OpenWeatherForecastItem[];
  city: { timezone: number };
}

export interface ForecastEntry {
  label: string;
  weatherLabel: string;
  temperature: number;
  iconUrl: string;
}

const HOURLY_LIMIT = 8;
const DAILY_LIMIT = 5;

function toImperial(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

export function weatherIconUrl(iconCode: string | undefined): string {
  return `https://openweathermap.org/img/wn/${iconCode ?? '01d'}@2x.png`;
}

export function formatDateTime(
  timestampUtc: number,
  timezoneOffsetSeconds: number,
  format: Intl.DateTimeFormatOptions,
): string {
  const adjustedMs = (timestampUtc + timezoneOffsetSeconds) * 1000;
  return new Intl.DateTimeFormat('en-US', { ...format, timeZone: 'UTC' }).format(
    new Date(adjustedMs),
  );
}

export function mapHourlyForecastEntries(forecast: OpenWeatherForecast): ForecastEntry[] {
  return forecast.list.slice(0, HOURLY_LIMIT).map(item => ({
    label: formatDateTime(item.dt, forecast.city.timezone, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    weatherLabel: item.weather[0]?.main ?? 'N/A',
    temperature: item.main.temp,
    iconUrl: weatherIconUrl(item.weather[0]?.icon),
  }));
}

export function mapDailyForecastEntries(forecast: OpenWeatherForecast): ForecastEntry[] {
  const byDay = new Map<string, OpenWeatherForecastItem>();

  for (const item of forecast.list) {
    const dayKey = formatDateTime(item.dt, forecast.city.timezone, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, item);
    }
  }

  return Array.from(byDay.values())
    .slice(0, DAILY_LIMIT)
    .map(item => ({
      label: formatDateTime(item.dt, forecast.city.timezone, { weekday: 'short' }),
      weatherLabel: item.weather[0]?.main ?? 'N/A',
      temperature: item.main.temp,
      iconUrl: weatherIconUrl(item.weather[0]?.icon),
    }));
}

export function buildFallbackWeatherData(
  cityName: string,
  selectedUnit: Unit,
): {
  current: OpenWeatherCurrent;
  forecast: OpenWeatherForecast;
} {
  const useImperial = selectedUnit === 'imperial';
  const now = Math.floor(Date.now() / 1000);
  const asUnit = (value: number): number => (useImperial ? toImperial(value) : value);

  const current: OpenWeatherCurrent = {
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: {
      temp: asUnit(25.3),
      feels_like: asUnit(24.8),
      temp_min: asUnit(20.1),
      temp_max: asUnit(27.9),
    },
    wind: { speed: useImperial ? 10.5 : 4.7 },
    dt: now,
    name: cityName,
    timezone: 3600,
  };

  const forecast: OpenWeatherForecast = {
    city: { timezone: 3600 },
    list: Array.from({ length: 12 }, (_, index) => {
      const tempSeed = 24 - index * 0.8;
      return {
        dt: now + index * 10_800,
        weather: [
          {
            main: index % 3 === 0 ? 'Clear' : 'Clouds',
            description: index % 3 === 0 ? 'clear sky' : 'few clouds',
            icon: index % 3 === 0 ? '01d' : '02d',
          },
        ],
        main: {
          temp: asUnit(tempSeed),
          feels_like: asUnit(tempSeed - 0.6),
          temp_min: asUnit(tempSeed - 1.2),
          temp_max: asUnit(tempSeed + 1.1),
        },
      };
    }),
  };

  return { current, forecast };
}
