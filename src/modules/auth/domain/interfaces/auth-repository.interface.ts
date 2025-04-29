import { LoginFormType } from "../types/login.types";
import { CrearCuentaFormType, CrearCuentaResponse } from "./crear-cuenta.interface";
import { LoginResponse } from "./login.interface";

export interface AuthRepository {
  login(payload: LoginFormType): Promise<LoginResponse>;
  crearCuenta(payload: CrearCuentaFormType): Promise<CrearCuentaResponse>;
  
}
