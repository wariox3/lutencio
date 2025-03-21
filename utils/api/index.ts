import Axios, { AxiosError, AxiosResponse } from "axios";
import { authInterceptor } from "./interceptor/authInterceptor";
import { Alert } from "react-native";
import { handleErrorResponse } from "./interceptor/errorInterceptor";

interface Configuracion {
  method?: "post" | "get" | "put" | "delete";
  requiereToken?: boolean;
}

const axios = Axios.create();

// Interceptor para agregar token (se ejecuta solo una vez al inicializar axios)
axios.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 400) {
      const errorData = error?.response?.data;
      const mensajeCompleto =
        errorData.mensaje +
        (errorData.validaciones
          ? " " + Object.values(errorData.validaciones).flat().join(", ")
          : "");

      Alert.alert(`Error ${errorData.codigo}`, mensajeCompleto);

      //     }
      //     if (error.response?.status === 401) {
      //       Alert.alert("Token inválido o expirado.");
    }
    return Promise.reject(error);
  }
);

export const consultarApi = async <T>(
  urlConsulta: string,
  data?: T,
  configuracion: Configuracion = {
    requiereToken: true,
  }
): Promise<T> => {
  try {
    const informacionConsulta: AxiosResponse<T> = await axios({
      method: configuracion.method ?? "post",
      url: urlConsulta,
      data,
      headers: {
        requiereToken: configuracion.requiereToken, // Pasar `requiereToken` en headers para ser usado por el interceptor
      },
    });

    return informacionConsulta.data;
  } catch (error: any) {
    //console.error("Error en la consulta API:", error);
    throw error; // Lanzar el error para que el controlador de llamadas pueda manejarlo
  }
};
