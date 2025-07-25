import { ApiErrorResponse } from "@/src/core/api/domain/interfaces/api.interface";
import { alertas } from "@/src/core/constants/alertas.const";
import { AxiosError } from "axios";

/**
 * Maneja los errores de respuesta HTTP y devuelve un objeto de error estandarizado
 */
export const handleErrorResponse = (
  error: AxiosError<ApiErrorResponse>
): ApiErrorResponse => {
  let _errores = new Map<
    number,
    (error: AxiosError<ApiErrorResponse>) => ApiErrorResponse
  >();
  _errores.set(400, (error) => error400(error));
  _errores.set(401, (error) => error401(error));
  _errores.set(404, (error) => error404(error));
  _errores.set(405, (error) => error405(error));
  _errores.set(500, (error) => error500(error));

  // Obtener el código de error de la respuesta
  const statusCode = error.response?.status || 500;

  // Obtener la función del Map usando el código de error
  const handler = _errores.get(statusCode);

  // Si la función existe, ejecutarla, sino manejar como error por defecto
  if (handler) {
    return handler(error);
  } else {
    return {
      titulo: alertas.titulo.error,
      mensaje: alertas.mensaje.defecto,
      codigo: statusCode,
    };
  }
};

const error400 = (error: AxiosError<ApiErrorResponse>): ApiErrorResponse => {
  const mensaje = procesarErroresValidacion(error);

  return {
    titulo: `${alertas.titulo.error}`,
    mensaje,
    codigo: 400,
  };
};

const error401 = (error: AxiosError): ApiErrorResponse => {
  return {
    titulo: `${alertas.titulo.error}`,
    mensaje: alertas.mensaje.error401,
    codigo: 401,
  };
};

const error404 = (error: AxiosError): ApiErrorResponse => {
  return {
    titulo: `${alertas.titulo.error}`,
    mensaje: alertas.mensaje.error404,
    codigo: 404,
  };
};

const error405 = (error: AxiosError): ApiErrorResponse => {
  return {
    titulo: `${alertas.titulo.error}`,
    mensaje: alertas.mensaje.error405,
    codigo: 405,
  };
};

const error500 = (error: AxiosError): ApiErrorResponse => {
  return {
    titulo: `${alertas.titulo.error}`,
    mensaje: alertas.mensaje.error500,
    codigo: 500,
  };
};

/**
 * Procesa los errores de validación y construye un mensaje de error
 * @param error Error de Axios que contiene validaciones
 * @returns Mensaje de error formateado
 */
const procesarErroresValidacion = (
  error: AxiosError<ApiErrorResponse>
): string => {
  let mensaje = error.response?.data?.error || error.response?.data?.mensaje || "";

  if (error.response?.data?.hasOwnProperty("validaciones")) {
    for (const key in error.response?.data?.validaciones) {
      if (error.response?.data?.validaciones.hasOwnProperty(key)) {
        const value = error.response?.data?.validaciones[key];
        mensaje += `${key}: ${value}`;
      }
    }
  }

  return mensaje;
};
