import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class SetEntregaVisitaUseCase {
    constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

    async setVisita(formData: any): Promise<any> {
        return this.repo.postVisita(formData);
    }
}