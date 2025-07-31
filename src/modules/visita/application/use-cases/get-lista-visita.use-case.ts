import { Entrega } from "@/src/modules/visita/domain/interfaces/vista.interface";
import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class GetListaVisitaUseCase {
  constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

  async execute(
    despachoId: number,
    estadoEntregado: boolean,
    subdominio: string
  ): Promise<Entrega[]> {    
    const respuesta = await this.repo.getLista(
      despachoId,
      estadoEntregado,
      subdominio
    );

    console.log("respuesta", respuesta);
    
    const entregasConEstados = this._agregarCamposVisita(respuesta);
    return entregasConEstados;
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
