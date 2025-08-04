/**
 * Servicio de bus de eventos para comunicación entre componentes
 * sin crear dependencias circulares
 */
export class EventBusService {
  private static instance: EventBusService;
  private listeners: Map<string, Array<(...args: any[]) => void>> = new Map();

  // Patrón Singleton
  public static getInstance(): EventBusService {
    if (!EventBusService.instance) {
      EventBusService.instance = new EventBusService();
    }
    return EventBusService.instance;
  }

  private constructor() {}

  /**
   * Registra un listener para un evento específico
   * @param eventName Nombre del evento
   * @param callback Función a ejecutar cuando ocurra el evento
   * @returns Función para eliminar el listener
   */
  public on(eventName: string, callback: (...args: any[]) => void): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    
    this.listeners.get(eventName)?.push(callback);
    
    // Devolver función para eliminar el listener
    return () => {
      const callbacks = this.listeners.get(eventName) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emite un evento con los argumentos proporcionados
   * @param eventName Nombre del evento
   * @param args Argumentos para pasar a los listeners
   */
  public emit(eventName: string, ...args: any[]): void {
    const callbacks = this.listeners.get(eventName) || [];
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error en listener de evento ${eventName}:`, error);
      }
    });
  }

  /**
   * Elimina todos los listeners para un evento específico
   * @param eventName Nombre del evento
   */
  public clearListeners(eventName: string): void {
    this.listeners.delete(eventName);
  }
}

// Exportar instancia por defecto para facilitar su uso
export const eventBus = EventBusService.getInstance();

// Definir constantes para los nombres de eventos
export const NETWORK_EVENTS = {
  CONNECTIVITY_CHANGED: 'network:connectivity_changed',
  ONLINE: 'network:online',
  OFFLINE: 'network:offline'
};

export const SYNC_EVENTS = {
  SYNC_STARTED: 'sync:started',
  SYNC_COMPLETED: 'sync:completed',
  SYNC_FAILED: 'sync:failed'
};
