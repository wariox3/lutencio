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

  async postNovedadTipo(visita: number, descripcion: string, novedad_tipo: string, subdominio: string) {
    return apiService.post<any>(
      APIS.ruteo.novedad, {
        visita,
        descripcion,
        novedad_tipo,
      }, {
        "X-Schema-Name": subdominio,
      }
    )
  }

  async postNovedadSolucion(id: number, solucion: string, subdominio: string) {
    return apiService.post<any>(
      APIS.ruteo.novedadSolucionar, {
        id,
        solucion,
      }, {
        "X-Schema-Name": subdominio,
      }
    )
  }
}
