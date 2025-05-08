import apiService from "@/src/core/api/repositories";
import { ApiResponse } from "../domain/interfaces/api.interface";
import APIS from "@/constants/endpoint";
import { RuteoRepository } from "../domain/interfaces/ruteo.interface";


export class RuteoApiRepository implements RuteoRepository {
  async getNovedadTipoLista(subdominio: string) {
    return apiService.get<ApiResponse<any>>(
      APIS.ruteo.novedadTipo,
      {},
      {
        "X-Schema-Name": subdominio,
      }
    );
  }
}
