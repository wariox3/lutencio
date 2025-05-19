import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { InternalAxiosRequestConfig } from "axios";

export const subdominioInterceptor = async (
  config: InternalAxiosRequestConfig
) => {
  const subdominio = config.headers?.["X-Schema-Name"];
  const modoPruebaStorage = await storageService.getItem(
    STORAGE_KEYS.modoPrueba
  );

  if (config.url && subdominio) {
    config.url = config.url.replace("subdominio", subdominio);
      config.url = config.url
        .replace("https", "http")
        .replace(".reddocapi.co", ".reddocapi.online");
  }

  return config;
};
