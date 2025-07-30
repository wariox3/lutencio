import { Middleware } from "@reduxjs/toolkit";
import { sincronizacionService } from "../services/sincronizacion.service";
import { networkMonitor } from "@/src/core/services/network-monitor.service";

export const sincronizacionMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Primero procesamos la acción normalmente
    const result = next(action);

    // Verificamos si es una acción que debería desencadenar sincronización
    // @ts-ignore
    if (action.type === "entregas/entregasProcesadas") {
      // No sincronizamos cuando se marca como sincronizado
      if (networkMonitor.isConnected()) {
        setTimeout(() => {
          sincronizacionService.sincronizarEntregas();
        }, 300);
      }
      return result;
    }

    // Verificamos si es una acción que debería desencadenar sincronización
    // @ts-ignore
    if (action.type === "entregas/novedadesProcesadas") {
      // No sincronizamos cuando se marca como sincronizado
      if (networkMonitor.isConnected()) {
        setTimeout(() => {
          sincronizacionService.sincronizarNovedades();
        }, 300);
      }
      return result;
    }

    return result;
  };
