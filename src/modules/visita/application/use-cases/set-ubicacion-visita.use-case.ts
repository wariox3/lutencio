import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class SetUbicacionVisitaUseCase {
    constructor(private repo: VisitaRepository = new VisitaApiRepository()) { }

    async setUbucacion(latitud: string, longitud: string): Promise<any> {
        return await this.repo.setUbiciacion(latitud, longitud);
    }
}