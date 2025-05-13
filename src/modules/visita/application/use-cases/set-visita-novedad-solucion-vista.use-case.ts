import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class SetNovedadSolucionVisitaUseCase {
    constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

    async setNovedadSolucion(id: number, solucion: string): Promise<any> {
        return await this.repo.setNovedadSolucion(id, solucion);
    }
}