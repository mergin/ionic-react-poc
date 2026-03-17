import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { I18nProvider } from './i18n';

test('renders without crashing', () => {
  const { baseElement } = render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
  expect(baseElement).toBeDefined();
});
