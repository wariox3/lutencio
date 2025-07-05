import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class SetNovedadVisitaUseCase {
    constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

    async setNovedad(visita: number, descripcion: string, novedad_tipo: string, imagenes: any, fecha_entrega: any): Promise<any> {
        return await this.repo.setNovedad(visita, descripcion, novedad_tipo, imagenes, fecha_entrega);
    }
}