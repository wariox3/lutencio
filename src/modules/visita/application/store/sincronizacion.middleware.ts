import { Middleware } from "@reduxjs/toolkit";
import * as Network from 'expo-network';
import { SincronizacionService } from "../services/sincronizacion.service";

// Tiempo de espera antes de intentar sincronizar para permitir que la red se estabilice
const SYNC_DELAY = 1000; // 1 segundo

// Función para verificar la conexión de manera más robusta
const verificarConexionRobusta = async (): Promise<boolean> => {
  try {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected) {
        console.log('Sincronización cancelada: sin conexión según verificación activa');
        return false;
      }
      
      console.log('Sincronización autorizada: conexión verificada');
      return true;
    } catch (networkError) {
      console.error('Error al verificar estado de red:', networkError);
      return false;
    }
  } catch (error) {
    console.error('Error al verificar conexión:', error);
    return false;
  }
};

// Función para programar sincronización con verificación de conexión
const programarSincronizacion = (tipoSincronizacion: 'entregas' | 'novedades') => {
  // Programamos la sincronización con un retraso para permitir que la red se estabilice
  setTimeout(async () => {
    try {
      // Verificamos nuevamente la conexión antes de sincronizar
      const hayConexion = await verificarConexionRobusta();
      
      if (!hayConexion) {
        console.log(`Sincronización de ${tipoSincronizacion} cancelada: sin conexión estable`);
        return;
      }
      
      console.log(`Iniciando sincronización de ${tipoSincronizacion}...`);
      
      // Ejecutamos la sincronización según el tipo
      if (tipoSincronizacion === 'entregas') {
        await SincronizacionService.getInstance().sincronizarEntregas();
      } else {
        await SincronizacionService.getInstance().sincronizarNovedades();
      }
    } catch (error) {
      console.error(`Error al sincronizar ${tipoSincronizacion}:`, error);
    }
  }, SYNC_DELAY);
};

export const sincronizacionMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Primero procesamos la acción normalmente
    const result = next(action);

    try {
      // Verificamos si es una acción que debería desencadenar sincronización
      // @ts-ignore
      if (action.type === "entregas/entregasProcesadas") {
        // Programamos sincronización con verificación robusta
        programarSincronizacion('entregas');
        return result;
      }

      // Verificamos si es una acción que debería desencadenar sincronización
      // @ts-ignore
      if (action.type === "novedades/finishedSavingProcessNovedades") {
        // Programamos sincronización con verificación robusta
        programarSincronizacion('novedades');
        return result;
      }
    } catch (error) {
      console.error('Error en middleware de sincronización:', error);
    }

    return result;
  };
