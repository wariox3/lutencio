import { GeneralApiRepository } from "@/src/core/api/repositories/general-api.service";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { Entrega } from "@/interface/entrega/entrega";

export class VisitaApiRepository implements VisitaRepository {
  constructor(private generalApiService = new GeneralApiRepository()) {}

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
}
