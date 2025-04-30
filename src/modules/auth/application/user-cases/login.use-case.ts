import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import { LoginFormType } from "../../domain/types/login.types";
import { AuthApiRepository } from "../../infrastructure/api/auth-api.service";

export class LoginUserUseCase {
  constructor(private repo: AuthRepository = new AuthApiRepository()) {}
  execute(payload: LoginFormType) {
    return this.repo.login(payload);
  }
}
