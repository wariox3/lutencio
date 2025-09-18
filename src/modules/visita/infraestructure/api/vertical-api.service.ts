import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { VerticalRepository } from "../../domain/interfaces/vertical-repository.interface";
import { EntregaVertical } from "../../domain/interfaces/entrega.interface";
import { AxiosResponse } from "axios";
import { VerticalVersionRuteo } from "../../domain/interfaces/version-ruteo";

export class VerticalApiRepository implements VerticalRepository {
  async getEntregaPorCodigo(codigo: string) {
    return apiService.get<EntregaVertical>(`${APIS.entrega.verticalEntrega}${codigo}/`);
  }

  async getVersionRuteo(){
    return apiService.get<VerticalVersionRuteo>(`${APIS.vertical.versionRuteo}`);
  }
}
