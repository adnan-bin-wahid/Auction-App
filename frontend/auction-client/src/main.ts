import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err: unknown) => {
  console.error(err);

  const root = document.querySelector('app-root');
  if (root instanceof HTMLElement) {
    root.innerHTML = `
      <section style="padding: 24px; font-family: Arial, sans-serif; color: #7f1d1d; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin: 24px;">
        <h1 style="margin: 0 0 12px; font-size: 24px;">Angular bootstrap failed</h1>
        <pre style="white-space: pre-wrap; margin: 0; font-size: 14px;">${String(err)}</pre>
      </section>
    `;
  }
});
