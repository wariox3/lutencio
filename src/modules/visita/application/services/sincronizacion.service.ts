// src/modules/visita/application/services/sincronizacion.service.ts

import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { PenditesService } from "../../infraestructure/services/penditente.service";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";
import {
  cambiarEstadoSincronizado,
  cambiarEstadoSincronizadoError,
} from "../slice/entrega.slice";

export class SincronizacionService {
  private static instance: SincronizacionService;
  private sincronizando = false;
  private storeRef: any = null;

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
    // Evitar sincronizaciones simultáneas
    if (this.sincronizando) {
      return false;
    }

    try {
      if (!this.storeRef) {
        console.error("Store no inicializada en sincronizacionService");
        return false;
      }

      // Obtener estado actual
      const state = this.storeRef.getState();
      const entregasPendientes = obtenerEntregasPendientes(state);

      // Validaciones iniciales
      if (entregasPendientes.length === 0) {
        return false;
      }

      // Obtener subdominio
      const subdominio = await storageService.getItem(STORAGE_KEYS.subdominio) as string;
      if (!subdominio) {
        return false;
      }
      
      // Iniciar sincronización
      this.sincronizando = true;
      //   store.dispatch(setSincronizandoEntregas(true));

      // Procesar todas las entregas en paralelo
      const resultados = await Promise.allSettled(
        entregasPendientes.map(entrega => 
          PenditesService.sincronizarPenditentes(entrega, subdominio)
            .then(respuesta => ({ entrega, respuesta, exito: true }))
            .catch(error => ({ entrega, respuesta: error, exito: false }))
        )
      );

      // Actualizar estado según resultados
      let exitoTotal = true;
      resultados.forEach(resultado => {
        if (resultado.status === 'fulfilled') {
          const { entrega, exito, respuesta } = resultado.value;
          
          if (exito && respuesta) {
            this.storeRef.dispatch(cambiarEstadoSincronizado({ 
              visitaId: entrega.id, 
              nuevoEstado: true 
            }));
          } else {
            console.log("Error al sincronizar entrega:", resultado);
            this.storeRef.dispatch(cambiarEstadoSincronizadoError({ 
              visitaId: entrega.id, 
              nuevoEstado: true 
            }));
            exitoTotal = false;
          }
        } else {
          exitoTotal = false;
        }
      });

      // Registrar hora de última sincronización
    //   store.dispatch(setUltimaSincronizacion(new Date().toISOString()));
      
      return exitoTotal;
    } catch (error) {
      console.error("Error en sincronización:", error);
      return false;
    } finally {
      this.sincronizando = false;
    //   store.dispatch(setSincronizandoEntregas(false));
    }
  }
}

// Exportar instancia por defecto para facilitar su uso
export const sincronizacionService = SincronizacionService.getInstance();