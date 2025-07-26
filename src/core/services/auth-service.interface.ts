import { RefreshTokenResponse } from "@/src/modules/auth/domain/interfaces/login.interface";

/**
 * Interfaz para servicios de autenticación
 * Define las operaciones relacionadas con la autenticación que pueden ser implementadas
 * por diferentes proveedores
 */
export interface IAuthService {
  /**
   * Renueva el token de acceso usando un refresh token
   * @param refreshToken Token de renovación
   * @returns Respuesta con el nuevo token
   */
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
}
