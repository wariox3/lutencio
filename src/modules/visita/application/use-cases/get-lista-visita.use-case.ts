import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";
import { ApiResponse } from "@/src/core/api/domain/interfaces/api.interface";

export class GetListaVisitaUseCase {
  constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

  async execute(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ): Promise<ApiResponse<Entrega[]>> {
    const respuesta = await this.repo.getLista(
      despachoId,
      estadoEntregado,
      subdominio
    );
    const entregasConEstados = this._agregarCamposVisita(respuesta.registros);
    return {
      cantidad_registros: respuesta.cantidad_registros,
      registros: entregasConEstados,
    };
  }

  private _agregarCamposVisita(lista: Entrega[]) {
    return lista.map((entrega) => ({
      ...entrega,
      datosAdicionales: {
        recibe: "",
        recibeParentesco: "",
        recibeNumeroIdentificacion: "",
        recibeCelular: "",
      },
      estado_sincronizado: false,
      entregada_sincronizada_error: false
    }));
  }
}
