import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import {
  CrearCuentaFormType,
  CrearCuentaResponse,
} from "../../domain/interfaces/crear-cuenta.interface";
import { LoginResponse } from "../../domain/interfaces/login.interface";
import { LoginFormType } from "../../domain/types/login.types";
import {
  OlvidoClaveFormType,
  OlvidoClaveResponse,
} from "../../domain/types/olvido-clave.type";

export class AuthApiRepository implements AuthRepository {
  async login(payload: LoginFormType): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(APIS.seguridad.login, {...payload, proyecto:"RUTEOAPP"});
  }

  async crearCuenta(
    payload: CrearCuentaFormType
  ): Promise<CrearCuentaResponse> {
    return apiService.post<CrearCuentaResponse>(
      APIS.seguridad.usuario,
      payload
    );
  }

  async olvideClave(
    payload: OlvidoClaveFormType
  ): Promise<OlvidoClaveResponse> {
    return apiService.post<OlvidoClaveResponse>(
      APIS.seguridad.cambioClaveSolicitar,
      payload
    );
  }
}
