import * as Network from "expo-network";
import { Platform } from "react-native";

class NetworkService {
  private static instance: NetworkService;

  private constructor() {} // Prevents direct construction calls with the `new` operator

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  public async validarEstadoRed() {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const hayConexion =
        networkState.isConnected && networkState.isInternetReachable;

      return hayConexion;
    } catch (error) {
      console.error("Error al validar el estado de la red:", {
        error: error instanceof Error ? error.message : "Error desconocido",
        errorStack: error instanceof Error ? error.stack : null,
        timestamp: new Date().toISOString(),
        platform: Platform.OS, // Asumiendo que estás usando React Native
        networkState: Network.NetworkStateType || "No disponible", // Referencia a networkState movida aquí
      });
      throw error;
    }
  }
}

export default NetworkService.getInstance();
