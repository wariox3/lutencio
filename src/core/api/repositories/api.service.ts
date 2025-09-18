import { dominioInterceptor } from "@/utils/api/interceptor/dominioInterceptor";
import { handleErrorResponse } from "@/utils/api/interceptor/errorInterceptor";
import { subdominioInterceptor } from "@/utils/api/interceptor/subdominioInterceptor";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { STORAGE_KEYS } from "../../constants";
import storageService from "../../services/storage.service";
import tokenService from "../../services/token.service";
import {
  DEFAULT_HEADERS,
  DEFAULT_TIMEOUT,
} from "../domain/constants/api.constant";
import {
  ApiConfig,
  ApiErrorResponse,
  ParametrosApi,
  RequestOptions,
} from "../domain/interfaces/api.interface";

class ApiService {
  private instance: AxiosInstance;
  private config: ApiConfig;
  private isRefreshingToken = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor(config: ApiConfig) {
    this.config = config;

    // Configuración inicial de headers compatible
    const initialHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...config.headers,
    };

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      headers: initialHeaders,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor de solicitud
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await storageService.getItem(STORAGE_KEYS.jwtToken);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.request.use(dominioInterceptor, (error) =>
      Promise.reject(error)
    );

    this.instance.interceptors.request.use(subdominioInterceptor, (error) =>
      Promise.reject(error)
    );

    // Interceptor para manejar errores de respuesta y renovar token si es necesario
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Si es un error 401 (Unauthorized) y no es un reintento
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Si ya estamos renovando el token, ponemos la solicitud en cola
          if (this.isRefreshingToken) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          // Marcar que estamos renovando el token
          this.isRefreshingToken = true;
          originalRequest._retry = true;

          try {
            // Intentar renovar el token
            const newToken = await tokenService.refreshAccessToken();

            // Procesar la cola de solicitudes fallidas
            this.processQueue(null, newToken);

            // Actualizar el token en la solicitud original y reintentar
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return this.instance(originalRequest);
          } catch (refreshError) {
            // Si falla la renovación del token, procesar la cola con el error
            this.processQueue(refreshError, null);

            // Redirigir al login (el tokenService ya se encarga de limpiar los tokens)
            await tokenService.handleAuthFailure();

            // Transformar el error para mantener consistencia
            const errorResponse = handleErrorResponse(error);
            return Promise.reject(errorResponse);
          } finally {
            this.isRefreshingToken = false;
          }
        }

        // Para otros errores, usar el manejador de errores existente
        const errorResponse = handleErrorResponse(error);
        return Promise.reject(errorResponse);
      }
    );
  }

  // Procesa la cola de solicitudes fallidas después de renovar el token
  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else if (token) {
        // Actualizar el token en la configuración de la solicitud
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(this.instance(config));
      }
    });

    // Limpiar la cola
    this.failedQueue = [];
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      params = {},
      data = {},
      timeout = this.config.timeout || DEFAULT_TIMEOUT,
    } = options;

    // Solución: Crear un objeto de headers compatible
    const requestHeaders: Record<string, string> = {
      ...(this.instance.defaults.headers?.common as Record<string, string>),
      ...headers,
    };

    // Eliminar 'common' si existe ya que no es un header válido para la solicitud
    if ("common" in requestHeaders) {
      delete requestHeaders.common;
    }

    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      headers: requestHeaders,
      params,
      data,
      timeout,
    };

    try {
      const response: AxiosResponse<T> = await this.instance.request(config);
      return response.data;
    } catch (error) {
      // El error ya ha sido transformado por el interceptor
      throw error as ApiErrorResponse;
    }
  }

  public async get<T = any>(
    endpoint: string,
    params?: ParametrosApi,
    headers?: Record<string, any>
  ): Promise<T> {
    console.log(endpoint);
    
    try {
      const response: AxiosResponse<T> = await this.instance.get(endpoint, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      // El error ya ha sido transformado por el interceptor
      throw error as ApiErrorResponse;
    }
  }

  public async post<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      data,
      headers,
    });
  }

  public async put<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      data,
      headers,
    });
  }

  public async patch<T = any>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      data,
      headers,
    });
  }

  public async delete<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }

  // Método para actualizar la configuración en tiempo de ejecución
  public updateConfig(config: Partial<ApiConfig>) {
    this.config = { ...this.config, ...config };
    this.instance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout || DEFAULT_TIMEOUT,
      headers: { ...DEFAULT_HEADERS, ...this.config.headers },
    });
    this.setupInterceptors();
  }
}

export default ApiService;
