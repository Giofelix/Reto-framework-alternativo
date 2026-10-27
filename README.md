# Reto técnico – Automatización del Datepicker de jQuery UI

Pruebas automatizadas del calendario (selector de fecha) del demo https://jqueryui.com/datepicker/ con **Playwright + TypeScript**, bajo el patrón **Page Object Model (POM)** y con sintaxis BDD usando **gherkin-lite**.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Microsoft Edge instalado (lo usa el proyecto `edge` de la suite multinavegador)

## Instalación

Desde la raíz del proyecto:

```bash
npm install
npx playwright install
```

- `npm install` instala las dependencias del `package.json`.
- `npx playwright install` descarga los navegadores que usa Playwright (Chromium y Firefox). Edge no se descarga: se usa el que está instalado en Windows. Si no lo tienes, ejecuta `npx playwright install msedge`.

## Estructura del proyecto

```
ui-automation/
├── pages/calendario-selector-fecha.page.ts     # Page Object del calendario
├── data/fechas-limite.datos.ts                 # Datos de prueba del CP-06
├── utils/fechas.utils.ts                       # Cálculo y formato de fechas
└── tests/seleccion-fecha-calendario.spec.ts    # Escenarios CP-01 a CP-06
playwright.config.ts                            # Navegadores y reportes
allurerc.mjs                                    # Configuración del reporte de Allure (nombre y agrupación)
```

## Casos automatizados

| Caso | Escenario | Tags |
|---|---|---|
| CP-01 | Mostrar el calendario al hacer clic en el campo | `@smoke @regresion @multinavegador` |
| CP-02 | Seleccionar una fecha del mes actual | `@smoke @regresion @multinavegador` |
| CP-03 | La fecha seleccionada se muestra en formato mm/dd/yyyy | `@smoke @regresion @multinavegador` |
| CP-04 | Navegar al mes siguiente y seleccionar una fecha | `@regresion @multinavegador` |
| CP-05 | Navegar al mes anterior y seleccionar una fecha | `@regresion` |
| CP-06 | Fechas límite del calendario (bisiesto, fin de mes) – 4 ejemplos | `@regresion` |
| CP-07 | Compatibilidad multinavegador | Se cubre ejecutando `@multinavegador` en Chromium, Firefox y Edge |

### Navegadores (`playwright.config.ts`)

| Proyecto | Qué ejecuta |
|---|---|
| `chromium` | Toda la suite (CP-01 a CP-06) |
| `firefox` | Solo `@multinavegador` (CP-01 a CP-04) |
| `edge` | Solo `@multinavegador` (CP-01 a CP-04) |

## Cómo ejecutar los scripts del `package.json`

Los scripts se ejecutan con **`npm run <nombre>`** desde la raíz del proyecto. La única excepción es `test`, que también puede ejecutarse solo con `npm test`.

```bash
npm test                      # equivale a: npm run test
npm run test:smoke
npm run reporte
```

Para pasarle opciones extra de Playwright a un script, agrégalas **después de `--`**:

```bash
npm test -- --headed                     # ver el navegador mientras corre
npm test -- --project=firefox            # un solo navegador
npm test -- --grep @CP-06                # un solo caso por su tag
npm run test:smoke -- --headed --workers=1
```

> Para ver la lista de scripts disponibles en cualquier momento: `npm run`

### Pruebas

| Comando | Qué hace |
|---|---|
| `npm test` | Ejecuta la suite completa en los tres navegadores (según la tabla de proyectos) |
| `npm run test:smoke` | Ejecuta `@smoke` (CP-01 a CP-03) en Chromium |
| `npm run test:regresion` | Ejecuta `@regresion` (CP-01 a CP-06) en Chromium |
| `npm run test:multinavegador` | Ejecuta `@multinavegador` (CP-01 a CP-04) en Chromium, Firefox y Edge (CP-07) |

### Reporte nativo de Playwright

Se genera solo en la carpeta `playwright-report/` cada vez que corren las pruebas.

| Comando | Qué hace |
|---|---|
| `npm run reporte` | Abre el reporte HTML de la última ejecución en el navegador |

### Reporte de Allure

Los resultados se guardan en `allure-results/` en cada ejecución y el reporte se genera en `allure-report/`.

| Comando | Qué hace |
|---|---|
| `npm run allure:limpiar` | Borra los resultados de ejecuciones anteriores |
| `npm run allure:generar` | Genera el reporte en `allure-report/` |
| `npm run allure:abrir` | Abre el reporte ya generado |
| `npm run allure:reporte` | Genera y abre el reporte en un solo paso |

> **Importante:** Allure no borra los resultados viejos, los va acumulando. Ejecuta `npm run allure:limpiar` antes de correr las pruebas para que el reporte muestre solo la última ejecución.

## Flujo recomendado

```bash
npm run allure:limpiar        # 1. limpiar resultados anteriores de Allure
npm test                      # 2. ejecutar las pruebas
npm run reporte               # 3a. ver el reporte de Playwright
npm run allure:reporte        # 3b. o ver el reporte de Allure
```

Para cerrar el servidor de cualquiera de los reportes, presiona `Ctrl + C` en la terminal.

## Notas

- Las fechas de CP-01 a CP-05 (mes actual, siguiente y anterior) se calculan en el momento de la ejecución.
- Las fechas del CP-06 son fijas a propósito. Si con el tiempo quedan muy lejos de la fecha actual, la navegación necesitará más clics; se pueden actualizar en `ui-automation/data/fechas-limite.datos.ts`.
- El calendario y el formato de la fecha se validan en inglés (`locale: 'en-US'` en la configuración).
