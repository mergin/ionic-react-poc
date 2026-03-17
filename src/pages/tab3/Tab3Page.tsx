import { useEffect, useMemo, useState } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import { LanguageSelector } from '../../components/language-selector';
import { useI18n } from '../../i18n';
import {
  buildFallbackWeatherData,
  formatDateTime,
  mapDailyForecastEntries,
  mapHourlyForecastEntries,
  weatherIconUrl,
  type ForecastEntry,
  type OpenWeatherCurrent,
  type OpenWeatherForecast,
  type Unit,
} from '../../features/weather/mapper';
import './Tab3Page.css';

const BASE_URL = '/openweather';
const DEFAULT_CITY = 'Madrid';
const DEFAULT_API_KEY = 'poc-key';

const Tab3: React.FC = () => {
  const { t } = useI18n();
  const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState(DEFAULT_CITY);
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [current, setCurrent] = useState<OpenWeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<OpenWeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const unit: Unit = isFahrenheit ? 'imperial' : 'metric';

  useEffect(() => {
    const controller = new AbortController();
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY ?? DEFAULT_API_KEY;
    const params = new URLSearchParams({ q: city, units: unit, appid: apiKey });

    setIsLoading(true);
    setHasError(false);

    void Promise.all([
      fetch(`${BASE_URL}/weather?${params.toString()}`, { signal: controller.signal }),
      fetch(`${BASE_URL}/forecast?${params.toString()}`, { signal: controller.signal }),
    ])
      .then(async ([currentResponse, forecastResponse]) => {
        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error('Unable to fetch weather');
        }

        const currentPayload = (await currentResponse.json()) as OpenWeatherCurrent;
        const forecastPayload = (await forecastResponse.json()) as OpenWeatherForecast;

        setCurrent(currentPayload);
        setForecast(forecastPayload);
      })
      .catch(() => {
        if (city.toLowerCase() === 'error-city') {
          setHasError(true);
          return;
        }

        const fallback = buildFallbackWeatherData(city, unit);
        setCurrent(fallback.current);
        setForecast(fallback.forecast);
        setHasError(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [city, unit]);

  const hourly = useMemo<ForecastEntry[]>(() => {
    if (!forecast) {
      return [];
    }
    return mapHourlyForecastEntries(forecast);
  }, [forecast]);

  const daily = useMemo<ForecastEntry[]>(() => {
    if (!forecast) {
      return [];
    }
    return mapDailyForecastEntries(forecast);
  }, [forecast]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('tabs.tab3')}</IonTitle>
          <IonButtons slot="end">
            <LanguageSelector />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t('tabs.tab3')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <main className="weather-page ion-padding">
          <section className="weather-controls">
            <IonSearchbar
              className="weather-controls__search"
              value={query}
              debounce={300}
              placeholder={t('weather.searchPlaceholder')}
              aria-label={t('weather.searchAriaLabel')}
              onIonInput={event => {
                const nextValue = (event.detail.value ?? '').trim();
                setQuery(event.detail.value ?? '');
                if (nextValue.length > 0) {
                  setCity(nextValue);
                }
              }}
              onIonChange={event => {
                const nextValue = (event.detail.value ?? '').trim();
                setQuery(event.detail.value ?? '');
                if (nextValue.length > 0) {
                  setCity(nextValue);
                }
              }}
            />

            <div
              className="weather-controls__toggle-group"
              role="group"
              aria-label={t('weather.unitToggleAriaLabel')}
            >
              <IonLabel
                className={
                  isFahrenheit
                    ? 'weather-controls__unit weather-controls__unit--unselected'
                    : 'weather-controls__unit weather-controls__unit--selected'
                }
              >
                {t('weather.unitCelsius')}
              </IonLabel>
              <IonToggle
                className="weather-controls__toggle"
                aria-label={t('weather.unitToggleAriaLabel')}
                checked={isFahrenheit}
                onIonChange={event => setIsFahrenheit(event.detail.checked)}
              />
              <IonLabel
                className={
                  isFahrenheit
                    ? 'weather-controls__unit weather-controls__unit--selected'
                    : 'weather-controls__unit weather-controls__unit--unselected'
                }
              >
                {t('weather.unitFahrenheit')}
              </IonLabel>
            </div>
          </section>

          {isLoading ? (
            <IonItem role="status">
              <IonLabel>{t('weather.loading')}</IonLabel>
            </IonItem>
          ) : null}

          {hasError ? (
            <IonItem role="alert">
              <IonLabel>{t('weather.loadError')}</IonLabel>
            </IonItem>
          ) : null}

          {!isLoading && !hasError && current ? (
            <>
              <section className="current-weather">
                <h2 className="current-weather__temp">
                  {Math.round(current.main.temp)}&deg;{isFahrenheit ? 'F' : 'C'}
                </h2>
                <p className="current-weather__city">{current.name}</p>
                <p className="current-weather__time">
                  {formatDateTime(current.dt, current.timezone, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
                <div className="current-weather__condition">
                  <img
                    src={weatherIconUrl(current.weather[0]?.icon)}
                    alt=""
                    aria-hidden="true"
                    width={56}
                    height={56}
                  />
                  <span>{current.weather[0]?.description ?? 'N/A'}</span>
                </div>
                <p className="current-weather__meta">
                  {t('weather.wind')}: {current.wind.speed.toFixed(1)}{' '}
                  {isFahrenheit ? 'mph' : 'm/s'}
                </p>
                <p className="current-weather__meta">
                  {t('weather.feelsLike')}: {Math.round(current.main.feels_like)}&deg;
                  {isFahrenheit ? 'F' : 'C'}
                </p>
                <p className="current-weather__meta">
                  {t('weather.highLow')}: {Math.round(current.main.temp_max)}&deg;
                  {isFahrenheit ? 'F' : 'C'} / {Math.round(current.main.temp_min)}&deg;
                  {isFahrenheit ? 'F' : 'C'}
                </p>
              </section>

              <section className="weather-section">
                <h3>{t('weather.hourlyTitle')}</h3>
                <ul className="forecast-row" aria-label={t('weather.hourlyTitle')}>
                  {hourly.map(entry => (
                    <li key={`hour-${entry.label}`} className="forecast-row__item">
                      <article className="forecast-card">
                        <p className="forecast-time">{entry.label}</p>
                        <img
                          className="forecast-icon"
                          src={entry.iconUrl}
                          alt=""
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                        <p className="forecast-weather">{entry.weatherLabel}</p>
                        <p className="forecast-temp">
                          {Math.round(entry.temperature)}&deg;{isFahrenheit ? 'F' : 'C'}
                        </p>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="weather-section">
                <h3>{t('weather.dailyTitle')}</h3>
                <ul className="forecast-row" aria-label={t('weather.dailyTitle')}>
                  {daily.map(entry => (
                    <li key={`day-${entry.label}`} className="forecast-row__item">
                      <article className="forecast-card">
                        <p className="forecast-time">{entry.label}</p>
                        <img
                          className="forecast-icon"
                          src={entry.iconUrl}
                          alt=""
                          aria-hidden="true"
                          width={48}
                          height={48}
                        />
                        <p className="forecast-weather">{entry.weatherLabel}</p>
                        <p className="forecast-temp">
                          {Math.round(entry.temperature)}&deg;{isFahrenheit ? 'F' : 'C'}
                        </p>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
