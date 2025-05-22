import Axios, { AxiosError, AxiosResponse } from "axios";
import { authInterceptor } from "./interceptor/authInterceptor";
import { Alert } from "react-native";
import { handleErrorResponse } from "./interceptor/errorInterceptor";
import { subdominioInterceptor } from "./interceptor/subdominioInterceptor";
import { dominioInterceptor } from "./interceptor/dominioInterceptor";

interface Configuracion {
  method?: "post" | "get" | "put" | "delete";
  requiereToken?: boolean;
  subdominio?: string;
  modoPrueba?: boolean;
}

const axios = Axios.create();

// Interceptor para agregar token (se ejecuta solo una vez al inicializar axios)
axios.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

axios.interceptors.request.use(dominioInterceptor, (error) => Promise.reject(error));

axios.interceptors.request.use(subdominioInterceptor, (error) => Promise.reject(error));


// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {    
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

export const consultarApi = async <T>(
  url: string,
  data?: T | null,
  configuracion: Configuracion = {
    requiereToken: true,
  }
): Promise<T> => {
  try {    
    const informacionConsulta: AxiosResponse<T> = await axios({
      method: configuracion.method ?? "post",
      url,
      data,
      headers: {
        requiereToken: configuracion.requiereToken, // Pasar `requiereToken` en headers para ser usado por el interceptor
        "X-Schema-Name": configuracion.subdominio, // Pasar el subdominio en los headers
        //'Content-Type': 'multipart/form-data',
      },
    });
    return informacionConsulta.data;
  } catch (error: any) {
    throw error; // Lanzar el error para que el controlador de llamadas pueda manejarlo
  }
};
