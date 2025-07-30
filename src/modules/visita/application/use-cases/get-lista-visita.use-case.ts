import { RespuestaApi } from "@/src/core/api/domain/interfaces/api.interface";
import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class GetListaVisitaUseCase {
  constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

  async execute(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ): Promise<RespuestaApi<Entrega>> {    
    const respuesta = await this.repo.getLista(
      despachoId,
      estadoEntregado,
      subdominio
    );
    
    const entregasConEstados = this._agregarCamposVisita(respuesta.results);
    return {
      count: respuesta.count,
      results: entregasConEstados,
      next: respuesta.next,
      previous: respuesta.previous
    };
  }

  private _agregarCamposVisita(lista: Entrega[]): Entrega[] {
    return lista.map((entrega) => ({
      ...entrega,
      datosAdicionales: {
        recibe: "",
        recibeParentesco: "",
        recibeNumeroIdentificacion: "",
        recibeCelular: "",
      },
      estado_sincronizado: false,
      entregada_sincronizada_error: false,
      entregada_sincronizada_error_mensaje: "",
      novedad_sincronizada_error: false,
      novedad_sincronizada_error_mensaje: "",
    }));
  }
}
