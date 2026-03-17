import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n';
import { initWebVitalsReporting } from './performance/web-vitals';

async function bootstrapMocks(): Promise<void> {
  if (!import.meta.env.DEV) {
    return;
  }

  const { startMockWorker } = await import('../mocks/browser');
  await startMockWorker();
}

const container = document.getElementById('root');
const root = createRoot(container!);

void bootstrapMocks().then(() => {
  initWebVitalsReporting();
  root.render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>,
  );
});