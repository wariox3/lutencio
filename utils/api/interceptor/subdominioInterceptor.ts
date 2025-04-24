import { InternalAxiosRequestConfig } from 'axios';

export const subdominioInterceptor = (config: InternalAxiosRequestConfig) => {
  const subdominio = config.headers?.["X-Schema-Name"];

  if (config.url && subdominio) {
    config.url = config.url.replace("subdominio", subdominio);
  }
  return config;
};
