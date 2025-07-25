import { LoginFormType } from "../types/login.types";
import { OlvidoClaveFormType, OlvidoClaveResponse } from "../types/olvido-clave.type";
import {
  CrearCuentaFormType,
  CrearCuentaResponse,
} from "./crear-cuenta.interface";
import { LoginResponse, RefreshTokenResponse } from "./login.interface";

export interface AuthRepository {
  login(payload: LoginFormType): Promise<LoginResponse>;
  crearCuenta(payload: CrearCuentaFormType): Promise<CrearCuentaResponse>;
  olvideClave(payload: OlvidoClaveFormType): Promise<OlvidoClaveResponse>;
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
}
