import { obtenerConfiguracionModoPrueba } from "@/src/application/selectors/configuracion.selector";
import { store } from "@/src/application/store";
import { InternalAxiosRequestConfig } from "axios";

export const dominioInterceptor = (config: InternalAxiosRequestConfig) => {
  const modoPrueba = obtenerConfiguracionModoPrueba(store.getState());
  if (config.url && modoPrueba) {
    config.url = config.url.replace("reddocapi.online", "reddocapi.online");
  }
  return config;
};
