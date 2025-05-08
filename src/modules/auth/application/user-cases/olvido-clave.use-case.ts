import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import { OlvidoClaveFormType } from "../../domain/types/olvido-clave.type";
import { AuthApiRepository } from "../../infrastructure/api/auth-api.service";

export class OlvidoClaveUseCase {
  constructor(private repo: AuthRepository = new AuthApiRepository()) {}
  execute(payload: OlvidoClaveFormType) {
    return this.repo.olvideClave(payload);
  }
}
