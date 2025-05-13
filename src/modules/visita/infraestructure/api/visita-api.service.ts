import { GeneralApiRepository } from "@/src/core/api/repositories/general-api.service";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { Entrega } from "@/interface/entrega/entrega";
import { RuteoApiRepository } from "@/src/core/api/repositories/ruteo-api.service";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";

export class VisitaApiRepository implements VisitaRepository {
  constructor(
    private generalApiService = new GeneralApiRepository(),
    private ruteoApiRepository = new RuteoApiRepository()
  ) {}

  async getLista(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ) {
    return this.generalApiService.consulta<Entrega[]>(
      {
        modelo: "RutVisita",
        filtros: [
          {
            propiedad: "despacho_id",
            valor1: despachoId,
            operador: "exact",
          },
          {
            propiedad: "estado_entregado",
            operador: "exact",
            valor1: estadoEntregado,
          },
        ],
      },
      subdominio
    );
  }

  async setNovedad(
    visita: number,
    descripcion: string,
    novedad_tipo: string
  ): Promise<any> {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    return this.ruteoApiRepository.postNovedadTipo(
      visita,
      descripcion,
      novedad_tipo,
      subdominio
    );
  }

  async setNovedadSolucion(
    id: number,
    solucion: string,
  ): Promise<any> {
    const subdominio = (await storageService.getItem(
      STORAGE_KEYS.subdominio
    )) as string;
    return this.ruteoApiRepository.postNovedadSolucion(
      id,
      solucion,
      subdominio
    );
  }

}
