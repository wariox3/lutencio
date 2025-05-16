import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { InternalAxiosRequestConfig } from "axios";

export const dominioInterceptor = async (
  config: InternalAxiosRequestConfig
) => {
  try {
    const modoPruebaStorage = await storageService.getItem(
      STORAGE_KEYS.modoPrueba
    );
    if (config.url && modoPruebaStorage) {
      config.url = config.url.replace(
        "https://reddocapi.co",
        "http://reddocapi.online"
      );
    }
        
    return config;
  } catch (error) {
    console.error("Error en el interceptor:", error);
    return config;
  }
};
