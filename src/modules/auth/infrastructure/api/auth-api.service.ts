import APIS from "@/src/core/api/domain/constants/endpoint.constant";
import apiService from "@/src/core/api/repositories";
import { IAuthService } from "@/src/core/services/auth-service.interface";
import axios from "axios";
import { AuthRepository } from "../../domain/interfaces/auth-repository.interface";
import {
  CrearCuentaFormType,
  CrearCuentaResponse,
} from "../../domain/interfaces/crear-cuenta.interface";
import { LoginResponse, RefreshTokenResponse } from "../../domain/interfaces/login.interface";
import { LoginFormType } from "../../domain/types/login.types";
import {
  OlvidoClaveFormType,
  OlvidoClaveResponse,
} from "../../domain/types/olvido-clave.type";

export class AuthApiRepository implements AuthRepository, IAuthService {
  async login(payload: LoginFormType): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(APIS.seguridad.login, {
      ...payload,
      proyecto: "RUTEOAPP",
    });
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

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Crear una instancia de axios independiente para evitar ciclos
      const directAxios = axios.create({
        baseURL: 'https://reddocapi.co',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Hacer la petición directamente sin pasar por apiService
      const response = await directAxios.post<RefreshTokenResponse>(
        '/seguridad/token/refresh/',
        { refresh: refreshToken }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
