import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { VerticalRepository } from "../../domain/interfaces/vertical-repository.interface";
import { EntregaVertical } from "../../domain/interfaces/entrega.interface";

export class VerticalApiRepository implements VerticalRepository {
  async getEntregaPorCodigo(codigo: string): Promise<EntregaVertical> {
    return apiService.get<EntregaVertical>(`${APIS.entrega.verticalEntrega}${codigo}/`);
  }
}
