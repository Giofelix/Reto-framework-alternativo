import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Reporte de pruebas - Calendario Datepicker',
  output: './allure-report',
  plugins: {
    awesome: {
      options: {
        reportName: 'Reporte de pruebas - Calendario Datepicker',
        // gherkin-lite crea los tests desde su propio archivo, así que la ruta que Allure usa por defecto
        // apunta a node_modules/gherkin-lite. Se agrupa por navegador > archivo de prueba > Feature.
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
  },
});
