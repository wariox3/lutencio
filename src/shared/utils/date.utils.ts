/**
 * Utilidades para el manejo y formateo de fechas y horas
 */

/**
 * Obtiene la fecha actual formateada como YYYY-MM-DD
 * @returns {string} Fecha actual en formato YYYY-MM-DD
 * @example '2025-07-22'
 */
export const obtenerFechaActualFormateada = (): string => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
};

/**
 * Obtiene la hora actual formateada como HH:MM
 * @returns {string} Hora actual en formato HH:MM
 * @example '14:47'
 */
export const obtenerHoraActualFormateada = (): string => {
  const fecha = new Date();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
};

/**
 * Combina la fecha y hora actual en un único string formateado
 * @returns {string} Fecha y hora actual en formato YYYY-MM-DD HH:MM
 * @example '2025-07-22 14:47'
 */
export const obtenerFechaYHoraActualFormateada = (): string => {
  return `${obtenerFechaActualFormateada()} ${obtenerHoraActualFormateada()}`;
};
