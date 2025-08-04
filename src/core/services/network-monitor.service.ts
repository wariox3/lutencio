import * as Network from 'expo-network';
import { eventBus, NETWORK_EVENTS } from './event-bus.service';

/**
 * Servicio para monitorear cambios en la conectividad de red
 * y desencadenar acciones cuando la conectividad cambia
 */
export class NetworkMonitorService {
  private static instance: NetworkMonitorService;
  private subscription: any = null;
  private isOnline: boolean = false;
  private syncDebounceTimeout: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_TIME = 3000; // 3 segundos de debounce

  // Patrón Singleton
  public static getInstance(): NetworkMonitorService {
    if (!NetworkMonitorService.instance) {
      NetworkMonitorService.instance = new NetworkMonitorService();
    }
    return NetworkMonitorService.instance;
  }

  private constructor() {}

  /**
   * Inicia el monitoreo de la red
   */
  public async startMonitoring(): Promise<void> {
    if (this.subscription) return;

    // Verificar estado inicial antes de configurar el listener
    await this.checkNetworkStatus();
    console.log(`Estado inicial de red: ${this.isOnline ? 'conectado' : 'desconectado'}`);

    // Suscribirse a cambios de estado de red
    this.subscription = Network.addNetworkStateListener(async ({ isConnected }) => {
      const nuevoEstado = isConnected ?? false;
      console.log(`Estado de red cambió: ${nuevoEstado ? 'conectado' : 'desconectado'}`);
      
      // Guardar el estado anterior antes de actualizarlo
      const estadoAnterior = this.isOnline;
      
      // Actualizar el estado primero
      this.isOnline = nuevoEstado;
      
      // Emitir evento de cambio de conectividad
      eventBus.emit(NETWORK_EVENTS.CONNECTIVITY_CHANGED, nuevoEstado);
      
      // Si pasamos de offline a online, emitir evento específico con debounce
      if (nuevoEstado && !estadoAnterior) {
        console.log('Conexión restaurada, programando sincronización...');
        this.debounceSyncAttempt();
      } else if (!nuevoEstado && estadoAnterior) {
        // Si pasamos de online a offline, emitir evento específico
        eventBus.emit(NETWORK_EVENTS.OFFLINE);
      }
    });
  }

  /**
   * Aplica debounce a los intentos de sincronización
   * para evitar múltiples llamadas cuando la red fluctúa
   */
  private debounceSyncAttempt(): void {
    // Cancelar cualquier intento previo pendiente
    if (this.syncDebounceTimeout) {
      clearTimeout(this.syncDebounceTimeout);
    }

    // Programar nuevo intento con debounce
    this.syncDebounceTimeout = setTimeout(() => {
      console.log('Emitiendo evento de conexión online después de debounce');
      // Emitir evento para que los servicios interesados puedan reaccionar
      eventBus.emit(NETWORK_EVENTS.ONLINE);
      this.syncDebounceTimeout = null;
    }, this.DEBOUNCE_TIME);
  }

  /**
   * Detiene el monitoreo de la red
   */
  public stopMonitoring(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    // Limpiar cualquier timeout pendiente
    if (this.syncDebounceTimeout) {
      clearTimeout(this.syncDebounceTimeout);
      this.syncDebounceTimeout = null;
    }
  }

  /**
   * Verifica el estado actual de la red
   */
  private async checkNetworkStatus(): Promise<void> {
    try {
      const { isConnected } = await Network.getNetworkStateAsync();
      this.isOnline = isConnected ?? false;
    } catch (error) {
      console.error('Error al verificar estado de red:', error);
      this.isOnline = false;
    }
  }

  /**
   * Devuelve el estado actual de la conexión
   */
  public isConnected(): boolean {
    return this.isOnline;
  }
}

// Exportar instancia por defecto para facilitar su uso
export const networkMonitor = NetworkMonitorService.getInstance();