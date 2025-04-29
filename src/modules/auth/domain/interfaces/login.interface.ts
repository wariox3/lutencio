import { Usuario } from "@/src/modules/user/domain/interfaces/user.interface";

export interface LoginResponse {
  "refresh-token": string;
  token: string;
  user: Usuario
}
