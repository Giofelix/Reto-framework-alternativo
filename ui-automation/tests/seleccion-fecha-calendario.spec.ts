import { expect } from '@playwright/test';
import { and, feature, given, scenario, then, when } from 'gherkin-lite';
import { CalendarioSelectorFechaPage } from '../pages/calendario-selector-fecha.page';
import { fechasLimite } from '../data/fechas-limite.datos';
import { diaDelMesActual, esFechaValida, formatearFecha, formatearMesAnio } from '../utils/fechas.utils';

feature('Selección de fecha con el Datepicker de jQuery UI @datepicker', () => {
  // Antecedentes
  const abrirDemo = async (calendario: CalendarioSelectorFechaPage) => {
    await given('que el usuario abre el demo del Datepicker', async () => {
      await calendario.abrir();
    });
  };

  scenario('[CP-01] Mostrar el calendario al hacer clic en el campo', async ({ page }) => {
    const calendario = new CalendarioSelectorFechaPage(page);
    await abrirDemo(calendario);

    await when('hace clic en el campo Date', async () => {
      await calendario.desplegarCalendario();
    });

    await then('debería ver el calendario desplegado con el mes y año actuales', async () => {
      await expect(calendario.calendario).toBeVisible();
      expect(await calendario.obtenerMesAnio()).toBe(formatearMesAnio(new Date()));
    });
  }, { tags: ['@smoke', '@regresion', '@multinavegador', '@CP-01'] });

  scenario('[CP-02] Seleccionar una fecha del mes actual', async ({ page }) => {
    const calendario = new CalendarioSelectorFechaPage(page);
    await abrirDemo(calendario);

    await when('selecciona el día 15 del mes actual', async () => {
      await calendario.seleccionarDia(15);
    });

    await then('el campo Date debería mostrar el día 15 del mes actual', async () => {
      await expect(calendario.campoFecha).toHaveValue(formatearFecha(diaDelMesActual(15)));
    });

    await and('el calendario debería cerrarse', async () => {
      await expect(calendario.calendario).toBeHidden();
    });
  }, { tags: ['@smoke', '@regresion', '@multinavegador', '@CP-02'] });

  // Día de un solo dígito para comprobar el cero a la izquierda (05, no 5)
  scenario('[CP-03] La fecha seleccionada se muestra en formato mm/dd/yyyy', async ({ page }) => {
    const calendario = new CalendarioSelectorFechaPage(page);
    await abrirDemo(calendario);

    await when('selecciona el día 5 del mes actual', async () => {
      await calendario.seleccionarDia(5);
    });

    await then('la fecha del campo Date debería tener el formato mm/dd/yyyy', async () => {
      const valor = await calendario.obtenerFechaSeleccionada();
      expect(valor).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(esFechaValida(valor), `"${valor}" no es una fecha válida`).toBe(true);
    });

    await and('el campo Date debería mostrar el día 5 del mes actual', async () => {
      await expect(calendario.campoFecha).toHaveValue(formatearFecha(diaDelMesActual(5)));
    });
  }, { tags: ['@smoke', '@regresion', '@multinavegador', '@CP-03'] });

  scenario('[CP-04] Navegar al mes siguiente y seleccionar una fecha', async ({ page }) => {
    const calendario = new CalendarioSelectorFechaPage(page);
    await abrirDemo(calendario);

    await when('navega al mes siguiente en el calendario', async () => {
      await calendario.irAlMesSiguiente();
    });

    await and('selecciona el día 10', async () => {
      await calendario.seleccionarDia(10);
    });

    await then('el campo Date debería mostrar el día 10 del mes siguiente', async () => {
      await expect(calendario.campoFecha).toHaveValue(formatearFecha(diaDelMesActual(10, 1)));
    });
  }, { tags: ['@regresion', '@multinavegador', '@CP-04'] });

  scenario('[CP-05] Navegar al mes anterior y seleccionar una fecha', async ({ page }) => {
    const calendario = new CalendarioSelectorFechaPage(page);
    await abrirDemo(calendario);

    await when('navega al mes anterior en el calendario', async () => {
      await calendario.irAlMesAnterior();
    });

    await and('selecciona el día 20', async () => {
      await calendario.seleccionarDia(20);
    });

    await then('el campo Date debería mostrar el día 20 del mes anterior', async () => {
      await expect(calendario.campoFecha).toHaveValue(formatearFecha(diaDelMesActual(20, -1)));
    });
  }, { tags: ['@regresion', '@CP-05'] });

  // Esquema del escenario
  for (const { caso, mes, anio, dias, fechaEsperada } of fechasLimite) {
    scenario(`[CP-06] Fechas límite del calendario (bisiesto, fin de mes) - ${caso}`, async ({ page }) => {
      const calendario = new CalendarioSelectorFechaPage(page);
      let cantidadDias = 0;
      await abrirDemo(calendario);

      await when(`navega en el calendario hasta el mes ${mes} del año ${anio}`, async () => {
        await calendario.irAlMes(mes, anio);
        expect(await calendario.obtenerMesAnio()).toBe(formatearMesAnio(new Date(anio, mes - 1, 1)));
      });

      await and('selecciona el último día disponible', async () => {
        // Se cuenta antes del clic porque el calendario se cierra al seleccionar
        cantidadDias = await calendario.contarDias();
        await calendario.seleccionarUltimoDia();
      });

      await then(`el mes debería tener ${dias} días`, async () => {
        expect(cantidadDias).toBe(dias);
      });

      await and(`el campo Date debería mostrar la fecha "${fechaEsperada}"`, async () => {
        await expect(calendario.campoFecha).toHaveValue(fechaEsperada);
      });
    }, { tags: ['@regresion', '@CP-06'] });
  }
});
