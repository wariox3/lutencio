export default function useFecha() {
  const obtenerFechaActualFormateada = (): string => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11, por eso sumamos 1
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  };

  return {
    obtenerFechaActualFormateada,
  };
}
