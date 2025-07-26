import { router } from "expo-router";
import { rutasApp, STORAGE_KEYS } from "../constants";
import { IAuthService } from "./auth-service.interface";
import storageService from "./storage.service";

/**
 * Servicio para gestionar tokens de autenticación
 * Maneja la obtención, renovación y almacenamiento de tokens
 */
class TokenService {
  private static instance: TokenService;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private authService: IAuthService | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  /**
   * Establece el servicio de autenticación a utilizar
   * @param authService Implementación del servicio de autenticación
   */
  public setAuthService(authService: IAuthService): void {
    this.authService = authService;
  }

  /**
   * Obtiene el token JWT actual
   * @returns Token JWT o null si no existe
   */
  public async getToken(): Promise<string | null> {
    return storageService.getItem(STORAGE_KEYS.jwtToken);
  }

  /**
   * Obtiene el refresh token actual
   * @returns Refresh token o null si no existe
   */
  public async getRefreshToken(): Promise<string | null> {
    return storageService.getItem(STORAGE_KEYS["refresh-token"]);
  }

  /**
   * Guarda los tokens de autenticación
   * @param jwtToken Token JWT
   * @param refreshToken Refresh token
   */
  public async saveTokens(jwtToken: string): Promise<void> {
    await Promise.all([
      storageService.setItem(STORAGE_KEYS.jwtToken, jwtToken),
    ]);
  }

  /**
   * Elimina los tokens almacenados
   */
  public async clearTokens(): Promise<void> {
    await Promise.all([
      storageService.removeItem(STORAGE_KEYS.jwtToken),
      storageService.removeItem(STORAGE_KEYS["refresh-token"]),
    ]);
  }

  /**
   * Renueva el token utilizando el refresh token
   * @returns Nuevo token JWT
   * @throws Error si no se puede renovar el token
   */
  public async refreshAccessToken(): Promise<string> {
    try {
      // Si ya estamos en proceso de renovación, devolvemos una promesa que se resolverá cuando termine
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push(resolve);
        });
      }

      this.isRefreshing = true;

      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      if (!this.authService) {
        throw new Error("Servicio de autenticación no configurado");
      }

      const response = await this.authService.refreshToken(refreshToken);

      if (response && response.access) {
        // Guardar los nuevos tokens
        await this.saveTokens(response.access);

        // Notificar a todos los suscriptores que el token ha sido renovado
        this.onRefreshed(response.access);

        return response.access;
      } else {
        throw new Error("Error al renovar el token");
      }
    } catch (error) {
      await this.handleAuthFailure();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Maneja el fallo de autenticación: limpia tokens y redirige al login
   */
  public async handleAuthFailure(): Promise<void> {
    // Limpiar tokens
    await this.clearTokens();
    
   // Redirigir al login usando expo-router
   try {
    router.replace(rutasApp.login);
  } catch (error) {
    console.error("Error al redirigir al login:", error);
  }
  }

  /**
   * Notifica a todos los suscriptores que el token ha sido renovado
   * @param token Nuevo token JWT
   */
  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Añade un suscriptor para ser notificado cuando el token se renueve
   * @param callback Función a llamar cuando el token se renueve
   */
  public subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }
}

export default TokenService.getInstance();
