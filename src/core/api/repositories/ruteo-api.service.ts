import apiService from "@/src/core/api/repositories";
import { ApiResponse } from "../domain/interfaces/api.interface";
import APIS from "@/src/core/constants/endpoint.constant";
import { RuteoRepository } from "../domain/interfaces/ruteo.interface";
import storageService from "../../services/storage.service";
import { STORAGE_KEYS } from "../../constants";
import { novedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";

export class RuteoApiRepository implements RuteoRepository {
  async getNovedadTipoLista() {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;

    return apiService.get<ApiResponse<novedadTipo[]>>(APIS.ruteo.novedadTipo, {
      "X-Schema-Name": subdominio,
      requiereToken: true,
    });
  }

  async postNovedad(data: FormData, subdominio: string) {
    return apiService.post<Promise<any>>(APIS.ruteo.novedad, data, {
      "X-Schema-Name": subdominio,
      "Content-Type": "multipart/form-data",
    });
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
