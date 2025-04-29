import { CrearCuentaResponse } from "../interfaces/crear-cuenta.interface";

export interface CrearCuentaState {
  crearCuenta: CrearCuentaResponse | null;
  loading: boolean;
  error: { codigo: number; error: string } | null;
}
