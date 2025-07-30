// src/modules/visita/application/services/sincronizacion.service.ts

import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { PenditesService } from "../../infraestructure/services/penditente.service";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";
import {
  cambiarEstadoSincronizado,
  cambiarEstadoSincronizadoError,
  setSincronizandoEntregas,
} from "../slice/entrega.slice";

export class SincronizacionService {
  private static instance: SincronizacionService;
  private sincronizando = false;
  private storeRef: any = null;
  private lastSyncAttempt: number = 0;
  private readonly MIN_SYNC_INTERVAL = 2000; // Mínimo 2 segundos entre intentos

  // Patrón Singleton para asegurar una única instancia
  public static getInstance(): SincronizacionService {
    if (!SincronizacionService.instance) {
      SincronizacionService.instance = new SincronizacionService();
    }
    return SincronizacionService.instance;
  }

  private constructor() {}

  // Método para inyectar la store después de su inicialización
  public setStore(store: any): void {
    this.storeRef = store;
  }

  /**
   * Sincroniza todas las entregas pendientes
   * @returns {Promise<boolean>} Éxito de la sincronización
   */
  public async sincronizarEntregas(): Promise<boolean> {
    const now = Date.now();
    const syncId = Math.random().toString(36).substring(2, 9); // ID único para rastrear esta sincronización
    
    // Evitar sincronizaciones muy frecuentes
    if (now - this.lastSyncAttempt < this.MIN_SYNC_INTERVAL) {
      console.log(`[Sync ${syncId}] Sincronización rechazada: demasiado pronto desde último intento (${now - this.lastSyncAttempt}ms)`);
      return false;
    }
    
    // Evitar sincronizaciones simultáneas
    if (this.sincronizando) {
      console.log(`[Sync ${syncId}] Sincronización rechazada: ya hay una sincronización en curso`);
      return false;
    }

    // Actualizar timestamp del último intento
    this.lastSyncAttempt = now;
    console.log(`[Sync ${syncId}] Iniciando proceso de sincronización`);

    try {
      if (!this.storeRef) {
        console.error(`[Sync ${syncId}] Store no inicializada en sincronizacionService`);
        return false;
      }

      // Obtener estado actual
      const state = this.storeRef.getState();
      const entregasPendientes = obtenerEntregasPendientes(state);

      // Validaciones iniciales
      if (entregasPendientes.length === 0) {
        console.log(`[Sync ${syncId}] No hay entregas pendientes para sincronizar`);
        return false;
      }

      console.log(`[Sync ${syncId}] Encontradas ${entregasPendientes.length} entregas pendientes`);

      // Obtener subdominio
      const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
      if (!subdominio) {
        console.error(`[Sync ${syncId}] No se encontró subdominio para sincronizar`);
        return false;
      }
      
      // Iniciar sincronización - usar un bloque atómico para evitar condiciones de carrera
      this.sincronizando = true;
      this.storeRef.dispatch(setSincronizandoEntregas(true));

      // Procesar todas las entregas en paralelo
      const resultados = await Promise.allSettled(
        entregasPendientes.map(async (entrega) => {
          const entregaId = entrega.id;
          console.log(`[Sync ${syncId}] Procesando entrega ID: ${entregaId}`);
          
          return PenditesService.sincronizarPenditentes(entrega, subdominio)
            .then(respuesta => {
              console.log(`[Sync ${syncId}] Entrega ${entregaId} sincronizada con éxito`);
              return { entrega, respuesta, exito: true };
            })
            .catch(error => {
              console.error(`[Sync ${syncId}] Error al sincronizar entrega ${entregaId}:`, error);
              return { entrega, respuesta: error, exito: false };
            });
        })
      );

      // Actualizar estado según resultados
      let exitoTotal = true;
      let exitosos = 0;
      let fallidos = 0;
      
      resultados.forEach(resultado => {
        if (resultado.status === 'fulfilled') {
          const { entrega, exito, respuesta } = resultado.value;
          
          if (exito && respuesta) {
            this.storeRef.dispatch(cambiarEstadoSincronizado({ 
              visitaId: entrega.id, 
              nuevoEstado: true 
            }));
            exitosos++;
          } else {
            console.log(`[Sync ${syncId}] Error al sincronizar entrega:`, resultado.value.respuesta);
            this.storeRef.dispatch(cambiarEstadoSincronizadoError({ 
              visitaId: entrega.id, 
              nuevoEstado: true 
            }));
            fallidos++;
            exitoTotal = false;
          }
        } else {
          fallidos++;
          exitoTotal = false;
        }
      });

      console.log(`[Sync ${syncId}] Sincronización completada - Exitosos: ${exitosos}, Fallidos: ${fallidos}`);
      
      // Registrar hora de última sincronización
      // store.dispatch(setUltimaSincronizacion(new Date().toISOString()));
      
      return exitoTotal;
    } catch (error) {
      console.error(`[Sync ${syncId}] Error en sincronización:`, error);
      return false;
    } finally {
      console.log(`[Sync ${syncId}] Finalizando proceso de sincronización`);
      this.sincronizando = false;
      this.storeRef.dispatch(setSincronizandoEntregas(false));
    }
  }
}

// Exportar instancia por defecto para facilitar su uso
export const sincronizacionService = SincronizacionService.getInstance();