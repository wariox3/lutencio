import apiService from "@/src/core/api/repositories";
import { ApiResponse } from "../domain/interfaces/api.interface";
import APIS from "@/src/core/constants/endpoint.constant";
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

  async postNovedad(
    data: FormData,
    subdominio: string
  ) {
    return apiService.post<Promise<any>>(
      APIS.ruteo.novedad,
      data,
      {
        "X-Schema-Name": subdominio,
        "Content-Type": "multipart/form-data",
      }
    );
  }

  async postNovedadSolucion(id: number, solucion: string, subdominio: string) {
    return apiService.post<any>(
      APIS.ruteo.novedadSolucionar,
      {
        id,
        solucion,
      },
      {
        "X-Schema-Name": subdominio,
      }
    );
  }
}
