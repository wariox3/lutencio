import { AxiosError } from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  registros: T;
  cantidad_registros: number;
}

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export interface ApiErrorResponse {
  titulo: string;
  mensaje: string;
  codigo: number;
  validaciones?: any;
  error?: string;
  status?: number;
}


export interface RespuestaApi<T> {
  count: number;
  next: any;
  previous: any;
  results: T[];
}

export interface ParametrosApi {
  [key: string]: string | number;
}