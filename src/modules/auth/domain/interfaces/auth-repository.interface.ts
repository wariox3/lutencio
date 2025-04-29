import { LoginFormType } from "../types/login.types";
import { LoginResponse } from "./login.interface";

export interface AuthRepository {
  login(payload: LoginFormType): Promise<LoginResponse>;
}
