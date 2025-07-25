import apiService from "@/src/core/api/repositories";
import APIS from "@/src/core/constants/endpoint.constant";
import { STORAGE_KEYS } from "../../constants";
import storageService from "../../services/storage.service";
import { RuteoRepository } from "../domain/interfaces/ruteo.interface";
import { NovedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import { RespuestaApiGet } from "../domain/interfaces/api.interface";

export class RuteoApiRepository implements RuteoRepository {
  async getNovedadTipoLista() {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;

    return apiService.get<Promise<RespuestaApiGet<NovedadTipo>>>(APIS.ruteo.novedadTipo, {
      "X-Schema-Name": subdominio,
      requiereToken: true,
    });
  }

  async postVisita(data: FormData, subdominio: string){
    return apiService.post<Promise<any>>(APIS.ruteo.visitaEntrega, data, {
      "X-Schema-Name": subdominio,
      "Content-Type": "multipart/form-data",
    });
  }

  async postNovedad(data: FormData, subdominio: string) {
  return apiService.post<Promise<any>>(APIS.ruteo.novedadNuevo, data, {
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
