import { store } from "@/src/application/store";
import { obtenerConfiguracionModoPrueba } from "@/store/selects/configuracion";
import { InternalAxiosRequestConfig } from "axios";

export const dominioInterceptor = (config: InternalAxiosRequestConfig) => {
  const modoPrueba = obtenerConfiguracionModoPrueba(store.getState());
  if (config.url && modoPrueba) {
    config.url = config.url.replace("reddocapi.online", "reddocapi.online");
  }
  return config;
};
