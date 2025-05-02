import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class GetListaVisitaUseCase {
  constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

  execute(despachoId: number, estadoEntregado: boolean, subdominio: string) {
    return this.repo.getLista(despachoId, estadoEntregado, subdominio);
  }
}
