import { AxiosError } from "axios";
import { Alert } from "react-native";

export const handleErrorResponse = (error: AxiosError): void => {
  let _errores = new Map<number, () => void>();

  _errores.set(400, () => error400(error));
  _errores.set(401, () => error401());
  _errores.set(404, () => error404());
  _errores.set(405, () => error405());
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
    Alert.alert("Error", "Ha ocurrido un error inesperado.");
  }
};

const error400 = (error: AxiosError): void => {
  const codigo = error.response?.data?.codigo || "Desconocido";
  const mensaje =
    error.response?.data?.mensaje || "Ha ocurrido un error inesperado.";
  Alert.alert(`Error ${codigo}`, mensaje);
};

const error401 = (): void => {
  Alert.alert("Token inválido o expirado.");
};

const error404 = (): void => {
  Alert.alert(`Error 404`, "El recurso solicitado no se encontró.");
};

const error405 = (): void => {
  Alert.alert(`Error 405`, "Servidor fuera de línea, intente más tarde.");
};

const error500 = (error: AxiosError): void => {  
  Alert.alert(
    `Error 500`,
    "Error interno del servidor. Por favor, intente más tarde."
  );
};
