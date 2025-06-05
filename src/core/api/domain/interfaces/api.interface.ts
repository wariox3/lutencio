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

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isCanceled?: boolean;
  isTimeout?: boolean;
}


export interface RespuestaApiGet<T> {
  count: number;
  next: any;
  previous: any;
  results: T[];
}
