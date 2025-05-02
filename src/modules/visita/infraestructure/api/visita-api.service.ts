import { GeneralApiRepository } from "@/src/core/api/repositories/general-api.service";
import { EntregaVertical } from "../../domain/interfaces/entrega.interface";

export class VisitaApiRepository {
  constructor(private generalApiService = new GeneralApiRepository()) {}

  async getLista(
    despachoId: number,
    estadoEntregado: boolean
  ): Promise<EntregaVertical> {
    return this.generalApiService.consulta({
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
    });
  }
}
