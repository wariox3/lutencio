import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { GeneralRepository } from "../domain/interfaces/general.interface";

export class GeneralApiRepository implements GeneralRepository {
  async consulta(parametros: any): Promise<any> {
    return apiService.post<any>(APIS.general.funcionalidadLista, parametros);
  }
}
