import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import {
  DEFAULT_HEADERS,
  DEFAULT_TIMEOUT,
} from "../domain/constants/api.constant";
import {
  ApiConfig,
  ApiError,
  RequestOptions,
} from "../domain/interfaces/api.interface";
import { dominioInterceptor } from "@/utils/api/interceptor/dominioInterceptor";
import { handleErrorResponse } from "@/utils/api/interceptor/errorInterceptor";
import { subdominioInterceptor } from "@/utils/api/interceptor/subdominioInterceptor";
import storageService from "../../services/storage.service";
import { STORAGE_KEYS } from "../../constants";

class ApiService {
  private instance: AxiosInstance;
  private config: ApiConfig;

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

    //Interceptor para manejar errores de respuesta
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        handleErrorResponse(error);
        return Promise.reject(error);
      }
    );
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
      throw error as ApiError;
    }
  }

  public async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      params,
      headers,
    });
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
