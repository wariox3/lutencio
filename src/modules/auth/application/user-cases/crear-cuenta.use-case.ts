import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import { CrearCuentaFormType } from "../../domain/interfaces/crear-cuenta.interface";
import { AuthApiRepository } from "../../infrastructure/api/auth-api.service";

export class CrearCuentaUseCase {
  constructor(private repo: AuthRepository = new AuthApiRepository()) {}

      execute(payload: CrearCuentaFormType) {
        return this.repo.crearCuenta(payload);
      }
}