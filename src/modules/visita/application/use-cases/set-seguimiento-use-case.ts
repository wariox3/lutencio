import { VisitaRepository } from "../../domain/interfaces/visita-repository.interface";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";

export class SetSeguiminetoVisitaUseCase {
    constructor(private repo: VisitaRepository = new VisitaApiRepository()) {}

    async setSeguimiento(
        cantidadCargadas: number,
        cantidadEntregasLocales: number,
        cantidadNovedadesLocales: number,
        cantidadNovedadesLocalesPendienteSinconizar: number
    ): Promise<any> {
        return this.repo.setSeguimiento(
            cantidadCargadas,
            cantidadEntregasLocales,
            cantidadNovedadesLocales,
            cantidadNovedadesLocalesPendienteSinconizar,
        );
    }
}