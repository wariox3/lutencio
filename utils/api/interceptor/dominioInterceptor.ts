import { store } from "@/store";
import { obtenerConfiguracionModoPrueba } from "@/store/selects/configuracion";
import { InternalAxiosRequestConfig } from "axios";

export const dominioInterceptor = (config: InternalAxiosRequestConfig) => {
  // const modoPrueba = obtenerConfiguracionModoPrueba(store.getState());
  const modoPrueba = true;
  if (config.url && modoPrueba) {
    config.url = config.url.replace("reddocapi.online", "reddocapi.online");
  }
  return config;
};
