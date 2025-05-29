import { AxiosResponse } from "axios";
import { ApiResponse } from "./api.interface";

export interface RuteoRepository {
  getNovedadTipoLista(subdominio: string): Promise<AxiosResponse<any, any>>;
  postNovedad(data: FormData, subdominio: string): Promise<any>;
}