import apiService from "@/src/core/api/repositories";
import { ParametrosApi } from "../domain/interfaces/api.interface";
import { GeneralRepository } from "../domain/interfaces/general.interface";

export class GeneralApiRepository implements GeneralRepository {
  async consultaApi<T>(endpoint: string, parametros: ParametrosApi, headers: Record<string, string>): Promise<T> {
    return apiService.get<T>(
      endpoint,
      parametros,
      headers
    );
  }
}

