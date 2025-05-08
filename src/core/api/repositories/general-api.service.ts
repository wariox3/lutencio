import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { GeneralRepository } from "../domain/interfaces/general.interface";
import { ApiResponse } from "../domain/interfaces/api.interface";

export class GeneralApiRepository implements GeneralRepository {
  async consulta<T>(parametros: any, subdominio: string): Promise<ApiResponse<T>> {
    return apiService.post<ApiResponse<T>>(
      APIS.general.funcionalidadLista,
      parametros,
      {
        "X-Schema-Name": subdominio
      }
    );
  }
}
