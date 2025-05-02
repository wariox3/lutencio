import { ApiResponse } from "./api.interface";

export interface GeneralRepository {
  consulta(paramtetros: any, subdominio: string): Promise<ApiResponse<any>>;
}

export interface GeneralApiInterface {}
