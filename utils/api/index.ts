import Axios, { AxiosError, AxiosResponse } from "axios";
import { authInterceptor } from "./interceptor/authInterceptor";
import { Alert } from "react-native";
import { handleErrorResponse } from "./interceptor/errorInterceptor";

interface Configuracion {
  method?: "post" | "get" | "put" | "delete";
  requiereToken?: boolean;
  subdominio?: string;
}

const axios = Axios.create();

// Interceptor para agregar token (se ejecuta solo una vez al inicializar axios)
axios.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

axios.interceptors.request.use((config) => {
  const subdominio = config.headers["X-Schema-Name"]; // Obtener el schema_name del header

  if (config.url && subdominio) {
    config.url = config.url.replace("subdominio", subdominio); // Reemplazo en la URL
  }  
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {

    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 400) {
//       const errorData = error?.response?.data;
//       const mensajeCompleto =
//         errorData.mensaje +
//         (errorData.validaciones
//           ? " " + Object.values(errorData.validaciones).flat().join(", ")
//           : "");

//       Alert.alert(`Error ${errorData.codigo}`, mensajeCompleto);

//       //     }
//       //     if (error.response?.status === 401) {
//       //       Alert.alert("Token inválido o expirado.");
//     }
//     return Promise.reject(error);
//   }
// );

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
        "X-Schema-Name": configuracion.subdominio,  // Pasar el subdominio en los headers
      },
    });
    
    return informacionConsulta.data;
  } catch (error: any) {    
    throw error; // Lanzar el error para que el controlador de llamadas pueda manejarlo
  }
};
