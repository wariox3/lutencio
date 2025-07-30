import { ApiResponse } from "./api.interface";

export interface GeneralRepository {
  consultaApi<T>(endpoint: string, paramtetros: any, headers: Record<string, string>): Promise<T>;
}

export interface GeneralApiInterface {}
