// src/modules/visita/application/services/sincronizacion.service.ts

import { STORAGE_KEYS } from "@/src/core/constants";
import {
  eventBus,
  NETWORK_EVENTS,
} from "@/src/core/services/event-bus.service";
import storageService from "@/src/core/services/storage.service";
import { selectNovedadesSinSincronizar } from "@/src/modules/novedad/application/store/novedad.selector";
import {
  changeEstadoSincronizado,
  changeEstadoSincronizadoError,
  changeSincronizandoNovedades,
} from "@/src/modules/novedad/application/store/novedad.slice";
import { VisitaApiRepository } from "../../infraestructure/api/visita-api.service";
import { PenditesService } from "../../infraestructure/services/penditente.service";
import { obtenerEntregasPendientes } from "../slice/entrega.selector";
import {
  cambiarEstadoSincronizado,
  cambiarEstadoSincronizadoError,
  setSincronizandoEntregas,
} from "../slice/entrega.slice";

// Definir tipos de errores para clasificación
enum TipoError {
  TEMPORAL = "temporal", // Errores que pueden resolverse con reintentos (500, timeout, etc)
  PERMANENTE = "permanente", // Errores que no se resolverán con reintentos (400, 403, etc)
  DESCONOCIDO = "desconocido", // Errores que no podemos clasificar
}

// Interfaz para respuestas de error enriquecidas
interface ErrorRespuesta {
  codigo?: number;
  mensaje?: string;
  tipo: TipoError;
  original?: any;
}

export class SincronizacionService {
  private static instance: SincronizacionService;
  private sincronizandoVisita = false;
  private sincronizandoNovedad = false;
  private storeRef: any = null;
  private cancelarSync = false;
  private lastSyncAttemptEntrega: number = 0;
  private lastSyncAttemptNovedad: number = 0;
  private readonly MIN_SYNC_INTERVAL = 500; // Mínimo 0.5 segundos entre intentos
  private readonly visitaService = new VisitaApiRepository();
  private networkEventUnsubscribe: (() => void) | null = null;

  // Mapa para seguir los intentos de sincronización por ID
  private intentosSincronizacion: Map<string, number> = new Map();
  private readonly MAX_INTENTOS = 5; // Máximo número de intentos para errores temporales

  // Patrón Singleton para asegurar una única instancia
  public static getInstance(): SincronizacionService {
    if (!SincronizacionService.instance) {
      SincronizacionService.instance = new SincronizacionService();
    }
    return SincronizacionService.instance;
  }

  private constructor() {
    // Suscribirse al evento de conexión restaurada
    this.networkEventUnsubscribe = eventBus.on(
      NETWORK_EVENTS.ONLINE,
      async () => {
        console.log(
          "SincronizacionService: Evento de conexión online recibido"
        );
        try {
          const resultadoSincronizacionEntregas =
            await this.sincronizarEntregas();
          const resultadoSincronizacionNovedades =
            await this.sincronizarNovedades();
          console.log(
            `Resultado de sincronización de entregas: ${
              resultadoSincronizacionEntregas ? "exitoso" : "fallido"
            }`
          );
          console.log(
            `Resultado de sincronización de novedades: ${
              resultadoSincronizacionNovedades ? "exitoso" : "fallido"
            }`
          );
        } catch (error) {
          console.error("Error al ejecutar sincronización:", error);
        }
      }
    );
  }

  // Método para inyectar la store después de su inicialización
  public setStore(store: any): void {
    this.storeRef = store;
  }

  /**
   * Clasifica un error según su tipo para determinar si se debe reintentar
   * @param error Error recibido de la API
   * @returns Objeto con información del error clasificado
   */
  private clasificarError(error: any): ErrorRespuesta {
    // Si no hay error, retornamos un error desconocido
    if (!error) {
      return {
        mensaje: "Error desconocido",
        tipo: TipoError.DESCONOCIDO,
      };
    }

    // Si el error tiene un código HTTP
    if (error.status || error.statusCode || error.codigo) {
      const codigo = error.status || error.statusCode || error.codigo;

      // Errores 5xx son temporales (problemas del servidor)
      if (codigo >= 500 && codigo < 600) {
        return {
          codigo,
          mensaje:
            error.mensaje || error.message || `Error del servidor (${codigo})`,
          tipo: TipoError.TEMPORAL,
          original: error,
        };
      }

      // Errores 4xx son permanentes (problemas con la solicitud)
      if (codigo >= 400 && codigo < 500) {
        return {
          codigo,
          mensaje:
            error.mensaje ||
            error.message ||
            `Error en la solicitud (${codigo})`,
          tipo: TipoError.PERMANENTE,
          original: error,
        };
      }
    }

    // Errores de red o timeout son temporales
    if (
      error.name === "TimeoutError" ||
      error.message?.includes("timeout") ||
      error.message?.includes("network") ||
      error.message?.includes("Network") ||
      error.message?.includes("connection")
    ) {
      return {
        mensaje: "Error de conexión",
        tipo: TipoError.TEMPORAL,
        original: error,
      };
    }

    // Por defecto, clasificamos como desconocido
    return {
      mensaje: error.mensaje || error.message || "Error desconocido",
      tipo: TipoError.DESCONOCIDO,
      original: error,
    };
  }

  /**
   * Gestiona el resultado de una sincronización según el tipo de error
   * @param id ID único del elemento (entrega o novedad)
   * @param error Error recibido
   * @returns true si se debe marcar como error permanente, false si se reintentará
   */
  private gestionarResultadoSincronizacion(
    id: string,
    error: any
  ): {
    marcarComoError: boolean;
    maximoIntentosAlcanzado: boolean;
    reintentoProgramado: boolean;
  } {
    // Clasificar el error
    const errorClasificado = this.clasificarError(error);

    // Si es un error permanente, no reintentamos
    if (errorClasificado.tipo === TipoError.PERMANENTE) {
      console.log(
        `Error permanente para ID ${id}: ${errorClasificado.mensaje}`
      );
      return {
        marcarComoError: true,
        maximoIntentosAlcanzado: false,
        reintentoProgramado: false,
      }; // Marcar como error permanente
    }

    // Para errores temporales o desconocidos, verificamos los intentos
    const intentosActuales = this.intentosSincronizacion.get(id) || 0;
    const nuevosIntentos = intentosActuales + 1;

    // Actualizar contador de intentos
    this.intentosSincronizacion.set(id, nuevosIntentos);

    // Si superamos el máximo de intentos, marcamos como error permanente
    if (nuevosIntentos >= this.MAX_INTENTOS) {
      console.log(
        `Máximo de intentos (${this.MAX_INTENTOS}) alcanzado para ID ${id}`
      );
      return {
        marcarComoError: false,
        maximoIntentosAlcanzado: true,
        reintentoProgramado: false,
      }; // Marcar como error permanente
    }

    // Si aún no alcanzamos el máximo, programamos un reintento
    console.log(
      `Programando reintento ${nuevosIntentos}/${this.MAX_INTENTOS} para ID ${id}`
    );
    return {
      marcarComoError: false,
      maximoIntentosAlcanzado: false,
      reintentoProgramado: true,
    }; // No marcar como error permanente, se reintentará
  }

  /**
   * Sincroniza todas las entregas pendientes
   * @returns {Promise<boolean>} Éxito de la sincronización
   */
  public async sincronizarEntregas(): Promise<boolean> {
    this.prepararNuevaSync();
    const now = Date.now();
    const syncId = Math.random().toString(36).substring(2, 9); // ID único para rastrear esta sincronización

    // Evitar sincronizaciones muy frecuentes
    if (now - this.lastSyncAttemptEntrega < this.MIN_SYNC_INTERVAL) {
      console.log(
        `[Sync ${syncId}] Sincronización rechazada: demasiado pronto desde último intento (${
          now - this.lastSyncAttemptEntrega
        }ms)`
      );
      return false;
    }

    // Evitar sincronizaciones simultáneas
    if (this.sincronizandoVisita) {
      console.log(
        `[Sync ${syncId}] Sincronización rechazada: ya hay una sincronización en curso`
      );
      return false;
    }

    // Actualizar timestamp del último intento
    this.lastSyncAttemptEntrega = now;
    console.log(`[Sync ${syncId}] Iniciando proceso de sincronización`);

    try {
      if (!this.storeRef) {
        console.error(
          `[Sync ${syncId}] Store no inicializada en sincronizacionService`
        );
        return false;
      }

      // Obtener estado actual
      const state = this.storeRef.getState();
      const entregasPendientes = obtenerEntregasPendientes(state);

      // Validaciones iniciales
      if (entregasPendientes.length === 0) {
        console.log(
          `[Sync ${syncId}] No hay entregas pendientes para sincronizar`
        );
        return false;
      }

      console.log(
        `[Sync ${syncId}] Encontradas ${entregasPendientes.length} entregas pendientes`
      );

      // Obtener subdominio
      const subdominio = (await storageService.getItem(
        STORAGE_KEYS.subdominio
      )) as string;
      if (!subdominio) {
        console.error(
          `[Sync ${syncId}] No se encontró subdominio para sincronizar`
        );
        return false;
      }

      // Iniciar sincronización - usar un bloque atómico para evitar condiciones de carrera
      this.sincronizandoVisita = true;
      this.storeRef.dispatch(setSincronizandoEntregas(true));

      // Procesar todas las entregas en paralelo
      const resultados = await Promise.allSettled(
        entregasPendientes.map(async (entrega) => {
          const entregaId = entrega.id;
          console.log(`[Sync ${syncId}] Procesando entrega ID: ${entregaId}`);

          return PenditesService.sincronizarPenditentes(entrega, subdominio)
            .then((respuesta) => {
              console.log(
                `[Sync ${syncId}] Entrega ${entregaId} sincronizada con éxito`
              );
              return { entrega, respuesta, exito: true };
            })
            .catch((error) => {
              console.error(
                `[Sync ${syncId}] Error al sincronizar entrega ${entregaId}:`,
                error
              );
              return { entrega, respuesta: error, exito: false };
            });
        })
      );

      // Actualizar estado según resultados
      let exitoTotal = true;
      let exitosos = 0;
      let fallidos = 0;
      let pendientesReintento = 0;

      resultados.forEach((resultado) => {
        if (resultado.status === "fulfilled") {
          const { entrega, exito, respuesta } = resultado.value;

          if (exito && respuesta) {
            this.storeRef.dispatch(
              cambiarEstadoSincronizado({
                visitaId: entrega.id,
                nuevoEstado: true,
              })
            );
            this.storeRef.dispatch(
              cambiarEstadoSincronizadoError({
                visitaId: entrega.id,
                codigo: 0,
                nuevoEstado: false,
                mensaje: "",
              })
            );
            exitosos++;
            // Limpiar contador de intentos si fue exitoso
            this.intentosSincronizacion.delete(entrega.id.toString());
          } else {
            console.log(
              `[Sync ${syncId}] Error al sincronizar entrega:`,
              resultado.value.respuesta
            );

            // Determinar si se debe marcar como error o programar reintento
            const {
              marcarComoError,
              maximoIntentosAlcanzado,
              reintentoProgramado,
            } = this.gestionarResultadoSincronizacion(
              entrega.id.toString(),
              resultado.value.respuesta
            );

            if (marcarComoError) {
              // Marcar como error permanente
              this.storeRef.dispatch(
                cambiarEstadoSincronizadoError({
                  visitaId: entrega.id,
                  codigo: 400,
                  nuevoEstado: true,
                  mensaje: resultado.value.respuesta?.mensaje,
                })
              );

              fallidos++;
            } else if (reintentoProgramado) {
              // No marcar como error, se reintentará en próxima sincronización
              pendientesReintento++;
            } else if (maximoIntentosAlcanzado) {
              this.storeRef.dispatch(
                cambiarEstadoSincronizadoError({
                  visitaId: entrega.id,
                  codigo: 500,
                  nuevoEstado: true,
                  mensaje:
                    "Conexión inestable. Intenta más tarde o conéctate a una red Wi-Fi.",
                })
              );
            }

            exitoTotal = false;
          }
        } else {
          // Error en la promesa
          fallidos++;
          exitoTotal = false;
        }
      });

      console.log(
        `[Sync ${syncId}] Sincronización completada - Exitosos: ${exitosos}, Fallidos: ${fallidos}, Pendientes de reintento: ${pendientesReintento}`
      );

      // Si hay pendientes de reintento, programar próxima sincronización
      if (pendientesReintento > 0) {
        console.log(
          `[Sync ${syncId}] Programando reintento para ${pendientesReintento} entregas en 5 segundos`
        );
        setTimeout(() => {
          this.sincronizarEntregas();
        }, 10000); // Reintento en 10 segundos
      }

      return exitoTotal;
    } catch (error) {
      console.error(`[Sync ${syncId}] Error en sincronización:`, error);
      return false;
    } finally {
      console.log(`[Sync ${syncId}] Finalizando proceso de sincronización`);
      this.sincronizandoVisita = false;
      this.storeRef.dispatch(setSincronizandoEntregas(false));
    }
  }

  /**
   * Sincroniza todas las novedades pendientes
   * @returns {Promise<boolean>} Éxito de la sincronización
   */
  public async sincronizarNovedades(): Promise<boolean> {
    this.prepararNuevaSync();
    const now = Date.now();
    const syncId = Math.random().toString(36).substring(2, 9); // ID único para rastrear esta sincronización

    // Evitar sincronizaciones muy frecuentes
    if (now - this.lastSyncAttemptNovedad < this.MIN_SYNC_INTERVAL) {
      console.log(
        `[Sync ${syncId}] Sincronización rechazada: demasiado pronto desde último intento (${
          now - this.lastSyncAttemptNovedad
        }ms)`
      );
      return false;
    }

    // Evitar sincronizaciones simultáneas
    if (this.sincronizandoNovedad) {
      console.log(
        `[Sync ${syncId}] Sincronización rechazada: ya hay una sincronización en curso`
      );
      return false;
    }

    // Actualizar timestamp del último intento
    this.lastSyncAttemptNovedad = now;
    console.log(`[Sync ${syncId}] Iniciando proceso de sincronización`);

    try {
      if (!this.storeRef) {
        console.error(
          `[Sync ${syncId}] Store no inicializada en sincronizacionService`
        );
        return false;
      }

      // Obtener estado actual
      const state = this.storeRef.getState();
      const novedadesPendientes = selectNovedadesSinSincronizar(state);

      // Validaciones iniciales
      if (novedadesPendientes.length === 0) {
        console.log(
          `[Sync ${syncId}] No hay novedades pendientes para sincronizar`
        );
        return false;
      }

      console.log(
        `[Sync ${syncId}] Encontradas ${novedadesPendientes.length} novedades pendientes`
      );

      // Obtener subdominio
      const subdominio = (await storageService.getItem(
        STORAGE_KEYS.subdominio
      )) as string;
      if (!subdominio) {
        console.error(
          `[Sync ${syncId}] No se encontró subdominio para sincronizar`
        );
        return false;
      }

      // Iniciar sincronización - usar un bloque atómico para evitar condiciones de carrera
      this.sincronizandoNovedad = true;
      this.storeRef.dispatch(changeSincronizandoNovedades(true));

      // Procesar todas las entregas en paralelo
      const resultados = await Promise.allSettled(
        novedadesPendientes.map(async (novedad) => {
          const novedadId = novedad.visita_id;
          console.log(`[Sync ${syncId}] Procesando novedad ID: ${novedadId}`);

          return this.visitaService
            .setNovedad(
              novedad.visita_id,
              novedad.descripcion,
              novedad.novedad_tipo_id.toString(),
              novedad.arrImagenes,
              novedad.fecha
            )
            .then((respuesta) => {
              console.log(
                `[Sync ${syncId}] Novedad ${novedadId} sincronizada con éxito`
              );
              return { novedad, respuesta, exito: true };
            })
            .catch((error) => {
              console.error(
                `[Sync ${syncId}] Error al sincronizar novedad ${novedadId}:`,
                error
              );
              return { novedad, respuesta: error, exito: false };
            });
        })
      );

      // Actualizar estado según resultados
      let exitoTotal = true;
      let exitosos = 0;
      let fallidos = 0;
      let pendientesReintento = 0;

      resultados.forEach((resultado) => {
        if (resultado.status === "fulfilled") {
          const { novedad, exito, respuesta } = resultado.value;

          if (exito && respuesta) {
            this.storeRef.dispatch(
              changeEstadoSincronizado({
                id: novedad.id,
                nuevoEstado: true,
              })
            );
            this.storeRef.dispatch(
              changeEstadoSincronizadoError({
                id: novedad.id,
                codigo: 0,
                nuevoEstado: false,
                mensaje: "",
              })
            );
            exitosos++;
            // Limpiar contador de intentos si fue exitoso
            this.intentosSincronizacion.delete(novedad.id);
          } else {
            console.log(
              `[Sync ${syncId}] Error al sincronizar novedad:`,
              resultado.value.respuesta
            );

            // Determinar si se debe marcar como error o programar reintento
            const {
              marcarComoError,
              maximoIntentosAlcanzado,
              reintentoProgramado,
            } = this.gestionarResultadoSincronizacion(
              novedad.id,
              resultado.value.respuesta
            );

            if (marcarComoError) {
              // Marcar como error permanente
              this.storeRef.dispatch(
                changeEstadoSincronizadoError({
                  id: novedad.id,
                  codigo: 400,
                  nuevoEstado: true,
                  mensaje: resultado.value.respuesta?.mensaje,
                })
              );
              fallidos++;
            } else if (reintentoProgramado) {
              // No marcar como error, se reintentará en próxima sincronización
              pendientesReintento++;
            } else if (maximoIntentosAlcanzado) {
              this.storeRef.dispatch(
                changeEstadoSincronizadoError({
                  id: novedad.id,
                  codigo: 500,
                  nuevoEstado: true,
                  mensaje:
                    "máximo de intentos alcanzado. No se pudo sincronizar.",
                })
              );
            }

            exitoTotal = false;
          }
        } else {
          // Error en la promesa
          fallidos++;
          exitoTotal = false;
        }
      });

      console.log(
        `[Sync ${syncId}] Sincronización completada - Exitosos: ${exitosos}, Fallidos: ${fallidos}, Pendientes de reintento: ${pendientesReintento}`
      );

      // Si hay pendientes de reintento, programar próxima sincronización
      if (pendientesReintento > 0) {
        console.log(
          `[Sync ${syncId}] Programando reintento para ${pendientesReintento} novedades en 5 segundos`
        );
        setTimeout(() => {
          this.sincronizarNovedades();
        }, 10000); // Reintento en 10 segundos
      }

      return exitoTotal;
    } catch (error) {
      console.error(`[Sync ${syncId}] Error en sincronización:`, error);
      return false;
    } finally {
      console.log(`[Sync ${syncId}] Finalizando proceso de sincronización`);
      this.sincronizandoNovedad = false;
      this.storeRef.dispatch(changeSincronizandoNovedades(false));
    }
  }

  public detenerSincronizacion(): void {
    console.log("🛑 Deteniendo sincronización en curso...");
    this.cancelarSync = true;
    this.sincronizandoVisita = false;
    this.sincronizandoNovedad = false;

    if (this.storeRef) {
      this.storeRef.dispatch(setSincronizandoEntregas(false));
      this.storeRef.dispatch(changeSincronizandoNovedades(false));
    }
  }

  /**
   * Resetear la bandera antes de iniciar un nuevo proceso
   */
  private prepararNuevaSync(): void {
    this.cancelarSync = false;
  }

  /**
   * Limpia los recursos al destruir la instancia
   */
  public dispose(): void {
    if (this.networkEventUnsubscribe) {
      this.networkEventUnsubscribe();
      this.networkEventUnsubscribe = null;
    }
  }
}

// Exportar instancia por defecto para facilitar su uso
export const sincronizacionService = SincronizacionService.getInstance();
