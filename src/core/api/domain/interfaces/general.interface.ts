import { ApiResponse } from "./api.interface";

export interface GeneralRepository {
  consulta(paramtetros: any, headers: Record<string, string>): Promise<ApiResponse<any>>;
}

export interface GeneralApiInterface {}
