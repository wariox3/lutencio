import apiService from "@/src/core/api/repositories";
import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import { LoginResponse } from "../../domain/interfaces/login.interface";
import { LoginFormType } from "../../domain/types/login.types";
import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import { CrearCuentaFormType, CrearCuentaResponse } from "../../domain/interfaces/crear-cuenta.interface";

export class AuthApiRepository implements AuthRepository {
  async login(payload: LoginFormType): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(APIS.seguridad.login, payload);
  }

  async crearCuenta(payload: CrearCuentaFormType): Promise<CrearCuentaResponse> {    
    return apiService.post<CrearCuentaResponse>(APIS.seguridad.usuario, payload)
  }
}