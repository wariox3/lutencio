import { LoginResponse } from "../interfaces/login.interface";

export interface AuthState {
  auth: LoginResponse | null;
  loading: boolean;
  error: { codigo: number; error: string } | null;
}
