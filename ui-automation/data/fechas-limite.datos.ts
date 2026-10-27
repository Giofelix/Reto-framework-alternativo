export interface FechaLimite {
  caso: string;
  mes: number;
  anio: number;
  dias: number;
  fechaEsperada: string;
}

export const fechasLimite: FechaLimite[] = [
  { caso: 'febrero bisiesto', mes: 2, anio: 2028, dias: 29, fechaEsperada: '02/29/2028' },
  { caso: 'febrero no bisiesto', mes: 2, anio: 2027, dias: 28, fechaEsperada: '02/28/2027' },
  { caso: 'mes de 30 días', mes: 4, anio: 2027, dias: 30, fechaEsperada: '04/30/2027' },
  { caso: 'fin de año', mes: 12, anio: 2026, dias: 31, fechaEsperada: '12/31/2026' },
];
