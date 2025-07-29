import { Middleware } from "@reduxjs/toolkit";
import { sincronizacionService } from "../services/sincronizacion.service";
import { networkMonitor } from "@/src/core/services/network-monitor.service";

// Tipos de acciones que deberían desencadenar una sincronización
const TRIGGER_ACTIONS = [
  // Cuando se cambia el estado de sincronización a false (nueva entrega local)
  'entregas/cambiarEstadoSincronizado',
  // Cuando se cambia el estado de entrega
  'entregas/cambiarEstadoEntrega',
  // Cuando se agregan imágenes a una entrega
  'entregas/agregarImagenEntrega',
];

// Iniciar el monitoreo de red al cargar el middleware
// networkMonitor.startMonitoring();

export const sincronizacionMiddleware: Middleware = store => next => action => {
  // Primero procesamos la acción normalmente
  const result = next(action);
  
  // Verificamos si es una acción que debería desencadenar sincronización
  // @ts-ignore
  if (TRIGGER_ACTIONS.includes(action.type)) {
    // Si es cambiarEstadoSincronizado, solo sincronizamos si se está marcando como no sincronizado
    // @ts-ignore
    if (action.type === 'entregas/cambiarEstadoSincronizado' && action.payload?.nuevoEstado === false) {
      // No sincronizamos cuando se marca como sincronizado
      if (networkMonitor.isConnected()) {
        setTimeout(() => {
          sincronizacionService.sincronizarEntregas();
        }, 300);
      }
      return result;
    }
  }
  
  return result;
};