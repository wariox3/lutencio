import APIS from "@/constants/endpoint";
import { AxiosError } from "axios";
import { Alert } from "react-native";


// TODO: url exentas de visualizar error http
const urlExentas = [
  APIS.ruteo.visitaEntrega,
  APIS.ruteo.ubicacion
]

const obtenerRuta = (url: string): string | null => {
  const match = url.match(/online\/(.+)/); // Busca lo que hay después de "online/"
  return match ? match[1] : null; // Devuelve solo la parte de la ruta
};

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
  const urlFallida = error.config?.url || "URL desconocida";

  console.log(error.response);
  

  // Obtener la parte relevante de la URL (después de "online/")
  const rutaFallida = obtenerRuta(urlFallida);

  // Verificar si la URL fallida coincide con alguna en urlExentas
  const esExenta = urlExentas.some((exenta) => obtenerRuta(exenta) === rutaFallida);

  if (esExenta) {
    return; // No muestra la alerta si la URL está en la lista de exentas
  }
  

  // Obtener código de error y mensaje
  const codigo = error.response?.data?.codigo || "Desconocido";
  let mensaje = error.response?.data?.mensaje || "Ha ocurrido un error inesperado.";
  if (error.response?.data?.hasOwnProperty('validaciones')) {
    for (const key in error.response?.data?.validaciones) {      
       if (error.response?.data?.validaciones.hasOwnProperty(key)) {
         const value = error.response?.data?.validaciones[key]; 
          mensaje += `${key}: ${value}`;
      }
    }
  }
  // Mostrar alerta
  Alert.alert(`❌ Error ${codigo}`, `${mensaje}`);
};

const error401 = (): void => {
  Alert.alert(`❌ Error`, "Token inválido o expirado, por favor intente ");
};

const error404 = (): void => {
  Alert.alert(`❌ Error 404`, "El recurso solicitado no se encontró.");
};

const error405 = (): void => {
  Alert.alert(`❌ Error 405`, "Servidor fuera de línea, intente más tarde.");
};

const error500 = (error: AxiosError): void => {

  Alert.alert(
    `❌ Error 500`,
    "Error interno del servidor. Por favor, intente más tarde."
  );
};
