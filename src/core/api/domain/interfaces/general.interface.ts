import { ApiResponse } from "./api.interface";

export interface GeneralRepository {
  consulta(paramtetros: any): Promise<ApiResponse<any>>;
}

export interface GeneralApiInterface {}
