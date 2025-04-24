import { store } from '@/store';
import { obtenerConfiguracionModoPrueba } from '@/store/selects/configuracion';
import { InternalAxiosRequestConfig } from 'axios';

export const dominioInterceptor = (config: InternalAxiosRequestConfig) => {
  const modoPrueba = obtenerConfiguracionModoPrueba(store.getState());
  if (config.url && modoPrueba) {
    config.url = config.url.replace("reddocapi.co", 'reddocapi.online');
  }  
  return config;
};


