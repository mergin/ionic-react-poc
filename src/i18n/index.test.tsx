import { fireEvent, render, screen } from '@testing-library/react';
import { I18nProvider, useI18n } from './index';

function Probe() {
  const { locale, setLocale, t } = useI18n();

  return (
    <>
      <p data-testid="locale">{locale}</p>
      <p data-testid="tab1-label">{t('tabs.tab1')}</p>
      <button onClick={() => setLocale('es')}>to-es</button>
      <button onClick={() => setLocale('en')}>to-en</button>
    </>
  );
}

describe('i18n provider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to english and resolves translation keys', () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('tab1-label')).toHaveTextContent('Social Media');
  });

  it('switches to spanish and persists locale', () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'to-es' }));

    expect(screen.getByTestId('locale')).toHaveTextContent('es');
    expect(screen.getByTestId('tab1-label')).toHaveTextContent('Red Social');
    expect(localStorage.getItem('app-locale')).toBe('es');
  });

  it('falls back to key when missing', () => {
    function MissingKeyProbe() {
      const { t } = useI18n();
      return <p data-testid="missing">{t('missing.path')}</p>;
    }

    render(
      <I18nProvider>
        <MissingKeyProbe />
      </I18nProvider>,
    );

    expect(screen.getByTestId('missing')).toHaveTextContent('missing.path');
  });
});
