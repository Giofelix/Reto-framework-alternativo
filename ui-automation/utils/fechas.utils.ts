/** Nombres de los meses tal como los muestra el encabezado del calendario. */
export const NOMBRES_MESES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const completarConCero = (valor: number): string => String(valor).padStart(2, '0');

/** Devuelve el día indicado del mes actual, desplazado `desplazamientoMeses` meses. */
export function diaDelMesActual(dia: number, desplazamientoMeses = 0): Date {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth() + desplazamientoMeses, dia);
}

/** Formatea una fecha como MM/dd/yyyy (con cero a la izquierda). */
export function formatearFecha(fecha: Date): string {
  return `${completarConCero(fecha.getMonth() + 1)}/${completarConCero(fecha.getDate())}/${fecha.getFullYear()}`;
}

/** Formatea una fecha como "Mes aaaa", igual que el encabezado del calendario. */
export function formatearMesAnio(fecha: Date): string {
  return `${NOMBRES_MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

/** Valida una fecha MM/dd/yyyy en modo estricto: rechaza fechas imposibles como 02/30/2027. */
export function esFechaValida(valor: string): boolean {
  const coincidencia = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!coincidencia) return false;

  const [mes, dia, anio] = coincidencia.slice(1).map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}
