export default function useFecha() {
  const obtenerFechaActualFormateada = (): string => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`; // Formato YYYY-MM-DD
  };


  const obtenerHoraActualFormateada = (): string => {
    const fecha = new Date();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const obtenerFechaYHoraActualFormateada = (): string => {
    const fecha = obtenerFechaActualFormateada();
    const hora = obtenerHoraActualFormateada();
    return `${fecha} ${hora}`;
  };

  return {
    obtenerFechaActualFormateada,
    obtenerHoraActualFormateada,
    obtenerFechaYHoraActualFormateada
  };
}
