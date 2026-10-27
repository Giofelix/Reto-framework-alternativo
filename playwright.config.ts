import { defineConfig, devices } from '@playwright/test';
import * as os from 'os';

/**
 * Ver https://playwright.dev/docs/test-configuration.
 *
 * Multinavegador: chromium ejecuta la suite completa; firefox y edge ejecutan solo @multinavegador.
 */
export default defineConfig({
  testDir: './ui-automation/tests',
  /* Ejecuta los tests de cada archivo en paralelo */
  fullyParallel: true,
  /* En CI falla la ejecución si quedó un test.only en el código */
  forbidOnly: !!process.env.CI,
  /* Reintentos solo en CI */
  retries: process.env.CI ? 2 : 0,
  /* En CI se ejecuta con un solo worker */
  workers: process.env.CI ? 1 : undefined,
  /* Reportes: consola, HTML nativo de Playwright y Allure. Ver https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        node_version: process.version,
      },
    }],
  ],

  /* Configuración común a todos los proyectos. Ver https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* Guarda la traza al reintentar un test fallido. Ver https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    /* El encabezado del calendario y el formato de la fecha se esperan en inglés */
    locale: 'en-US',
  },

  /* Navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@multinavegador/,
    },

    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      grep: /@multinavegador/,
    },
  ],
});
