import { ApiResponse } from "./api.interface";

export interface RuteoRepository {
  getNovedadTipoLista(subdominio: string): Promise<ApiResponse<any>>;
  postNovedad(data: FormData, subdominio: string): Promise<any>;
}