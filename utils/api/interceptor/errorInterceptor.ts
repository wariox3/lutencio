import { alertas } from "@/src/core/constants/alertas.const";
import APIS from "@/src/core/constants/endpoint.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { AxiosError } from "axios";
import { Alert } from "react-native";

// TODO: url exentas de visualizar error http
const urlExentas = [
  APIS.ruteo.visitaEntrega,
  APIS.ruteo.ubicacion,
  APIS.ruteo.novedad,
];

const obtenerRuta = (url: string): string | null => {
  const match = url.match(/(?:reddocapi\.online|reddocapi\.co)\/(.+)/); // Busca lo que hay después de "reddocapi.online/" o "reddocapi.co/
  return match ? match[1] : null; // Devuelve solo la parte de la ruta
};

export const handleErrorResponse = (error: AxiosError): void => {
  let _errores = new Map<number, () => void>();
  _errores.set(400, () => error400(error));
  _errores.set(401, () => error401(error));
  _errores.set(404, () => error404(error));
  _errores.set(405, () => error405(error));
  _errores.set(500, () => error500(error));

  // Obtener el código de error de la respuesta
  const statusCode = error.response?.status || 500;

  // Obtener la función del Map usando el código de error
  const handler = _errores.get(statusCode);
  // Si la función existe, ejecutarla
  if (handler) {
    handler(); // Llama a la función
  } else {
    // Manejar el caso en que no haya una función para el código de error
    mostrarAlertHook({
      titulo: `${alertas.titulo.error}`,
      mensaje: alertas.mensaje.defecto
    });
  
  }
};

const error400 = (error: AxiosError): AxiosError => {
  const urlFallida = error.config?.url || "URL desconocida";

  // Obtener la parte relevante de la URL (después de "online/")
  const rutaFallida = obtenerRuta(urlFallida);

  // Verificar si la URL fallida coincide con alguna en urlExentas
  const esExenta = urlExentas.some(
    (exenta) => obtenerRuta(exenta) === rutaFallida
  );

  if (esExenta) {
    return error;
  }

  // Obtener código de error y mensaje
  const codigo = error.response?.data?.codigo || "Desconocido";

  let mensaje =
    error.response?.data?.mensaje ||
    error.response?.data?.error ||
    "Ha ocurrido un error inesperado.";
  if (error.response?.data?.hasOwnProperty("validaciones")) {
    for (const key in error.response?.data?.validaciones) {
      if (error.response?.data?.validaciones.hasOwnProperty(key)) {
        const value = error.response?.data?.validaciones[key];
        mensaje += `${key}: ${value}`;
      }
    }
  }  
  mostrarAlertHook({
    titulo: `${alertas.titulo.error} ${codigo}`,
    mensaje,
  });
  return error;
};

const error401 = (error: AxiosError): AxiosError => {
  mostrarAlertHook({
    titulo: `${alertas.titulo.error} 401`,
    mensaje: alertas.mensaje.error401
  });
  return error;
};

const error404 = (error: AxiosError): AxiosError => {
  mostrarAlertHook({
    titulo: `${alertas.titulo.error} 404`,
    mensaje: alertas.mensaje.error404
  });
  return error;
};

const error405 = (error: AxiosError): AxiosError => {
  mostrarAlertHook({
    titulo: `${alertas.titulo.error} 405`,
    mensaje: alertas.mensaje.error405
  });
  return error;
};

const error500 = (error: AxiosError): AxiosError => {
  mostrarAlertHook({
    titulo: `${alertas.titulo.error} 500`,
    mensaje: alertas.mensaje.error500
  });
  return error;
};
