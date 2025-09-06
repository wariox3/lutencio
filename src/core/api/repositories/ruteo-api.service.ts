import apiService from "@/src/core/api/repositories";
import { STORAGE_KEYS } from "../../constants";
import storageService from "../../services/storage.service";
import { RuteoRepository } from "../domain/interfaces/ruteo.interface";
import { NovedadTipo } from "@/src/modules/visita/domain/interfaces/novedad-tipo.interface";
import { RespuestaApi } from "../domain/interfaces/api.interface";
import { GeneralApiRepository } from "./general-api.service";
import APIS from "../domain/constants/endpoint.constant";

export class RuteoApiRepository implements RuteoRepository {
  constructor(private generalApiService = new GeneralApiRepository()) {}

  async getNovedades() {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;

    return this.generalApiService.consultaApi<RespuestaApi<any>>(
      APIS.ruteo.novedad,
      {},
      {
        "X-Schema-Name": subdominio,
      }
    );
  }

  async getNovedadTipoLista() {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;

    return this.generalApiService.consultaApi<RespuestaApi<NovedadTipo>>(
      APIS.ruteo.novedadTipo,
      {},
      {
        "X-Schema-Name": subdominio,
      }
    );
  }

  async postVisita(data: FormData, subdominio: string) {
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

  async postUbicacionVisita(
    usuario_id: string,
    despacho: string,
    latitud: any,
    longitud: any,
    subdominio: string
  ) {
    return apiService.post<any>(
      APIS.ruteo.ubicacion,
      {
        usuario_id,
        despacho,
        latitud,
        longitud,
      },
      {
        "X-Schema-Name": subdominio,
      }
    );
  }

  async postSeguimiento(
    despacho: string,
    usuario_id: string,
    comentario: string,
    subdominio: string
  ) {
    console.log({
      despacho, usuario_id, comentario, subdominio
    });
    
    return apiService.post<any>(
      APIS.ruteo.seguimiento,
      { despacho, usuario_id, comentario },
      {
        "X-Schema-Name": subdominio,
      }
    );
  }
}
