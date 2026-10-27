import { FrameLocator, Locator, Page } from '@playwright/test';
import { NOMBRES_MESES } from '../utils/fechas.utils';

/**
 * Página del demo del selector de fecha (Datepicker) de jQuery UI:
 * un campo "Date" que despliega un calendario emergente.
 * El campo y el calendario viven dentro de `iframe.demo-frame`.
 */
export class CalendarioSelectorFechaPage {
  static readonly URL = 'https://jqueryui.com/datepicker/';

  private readonly marco: FrameLocator;
  readonly campoFecha: Locator;
  readonly calendario: Locator;
  readonly etiquetaMes: Locator;
  readonly etiquetaAnio: Locator;
  readonly botonSiguiente: Locator;
  readonly botonAnterior: Locator;
  readonly dias: Locator;

  constructor(private readonly page: Page) {
    this.marco = page.frameLocator('iframe.demo-frame');
    this.campoFecha = this.marco.locator('#datepicker');
    this.calendario = this.marco.locator('#ui-datepicker-div');
    this.etiquetaMes = this.calendario.locator('.ui-datepicker-month');
    this.etiquetaAnio = this.calendario.locator('.ui-datepicker-year');
    this.botonSiguiente = this.calendario.locator('.ui-datepicker-next');
    this.botonAnterior = this.calendario.locator('.ui-datepicker-prev');
    // Solo días reales del mes, sin celdas vacías
    this.dias = this.calendario.locator("td[data-handler='selectDay']");
  }

  async abrir(): Promise<void> {
    await this.page.goto(CalendarioSelectorFechaPage.URL);
    await this.campoFecha.waitFor({ state: 'visible' });
  }

  async desplegarCalendario(): Promise<void> {
    if (await this.calendario.isVisible()) return;
    await this.campoFecha.click();
    await this.calendario.waitFor({ state: 'visible' });
  }

  async obtenerMesAnio(): Promise<string> {
    const mes = (await this.etiquetaMes.innerText()).trim();
    const anio = (await this.etiquetaAnio.innerText()).trim();
    return `${mes} ${anio}`;
  }

  async irAlMesSiguiente(): Promise<void> {
    await this.desplegarCalendario();
    await this.botonSiguiente.click();
  }

  async irAlMesAnterior(): Promise<void> {
    await this.desplegarCalendario();
    await this.botonAnterior.click();
  }

  /** Navega hasta el mes (1-12) y año indicados, partiendo del mes que muestra el calendario. */
  async irAlMes(mes: number, anio: number): Promise<void> {
    await this.desplegarCalendario();
    const [nombreMesActual, anioActual] = (await this.obtenerMesAnio()).split(' ');
    const mesActual = NOMBRES_MESES.indexOf(nombreMesActual) + 1;
    const diferencia = (anio - Number(anioActual)) * 12 + (mes - mesActual);

    const boton = diferencia > 0 ? this.botonSiguiente : this.botonAnterior;
    for (let i = 0; i < Math.abs(diferencia); i++) {
      await boton.click();
    }
  }

  async seleccionarDia(dia: number): Promise<void> {
    await this.desplegarCalendario();
    await this.dias.locator('a', { hasText: new RegExp(`^${dia}$`) }).click();
  }

  async contarDias(): Promise<number> {
    await this.desplegarCalendario();
    return this.dias.count();
  }

  async seleccionarUltimoDia(): Promise<void> {
    await this.desplegarCalendario();
    await this.dias.last().locator('a').click();
  }

  async obtenerFechaSeleccionada(): Promise<string> {
    return this.campoFecha.inputValue();
  }
}
