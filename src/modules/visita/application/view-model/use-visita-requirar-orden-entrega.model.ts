import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { cleanNovedades } from "@/src/modules/novedad/application/store/novedad.slice";
import {
  obtenerEntregasPendientesTodas,
  obtenerEntregasSeleccionadas,
  selectEntregadas,
} from "../../application/slice/entrega.selector";
import {
  quitarEntregas,
  quitarFiltros,
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
} from "../../application/slice/entrega.slice";
import { visitaSeguimientoThunk } from "../../application/slice/visita.thunk";
import { selectCantidadNovedades } from "@/src/modules/novedad/application/store/novedad.selector";

export const useRetirarDespachoViewModel = (close: () => void) => {
  const dispatch = useAppDispatch();
  const { eliminarArchivo } = useEliminarEnGaleria();

  //                                                                                                                                                                                                                                                                                              ✅ Selectores
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const entregadas = useAppSelector(selectEntregadas);
  const cantidadNovedades = useAppSelector(selectCantidadNovedades);
  const entregasPendientes = useAppSelector(obtenerEntregasPendientesTodas);

  /**
   *  Limpieza segura de archivos (firma e imágenes)
   */
  const limpiarArchivosLocales = async () => {
    for (const entrega of entregas) {
      try {
        // Imágenes
        if (Array.isArray(entrega.arrImagenes)) {
          for (const img of entrega.arrImagenes) {
            if (img?.uri) {
              const fileInfo = await FileSystem.getInfoAsync(img.uri);
              if (fileInfo.exists) await eliminarArchivo(img.uri);
            }
          }
        }

        // Firmas
        if (entrega?.firmarBase64) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
          if (fileInfo.exists) await eliminarArchivo(entrega.firmarBase64);
        }
      } catch (err) {
        console.warn("⚠️ Error al eliminar archivo local:", err);
      }
    }
  };

  /**
   *  Limpieza de estado local (Redux + Storage)
   */
  const limpiarEstadoLocal = async () => {
    try {
      await Promise.all([
        storageService.removeItem(STORAGE_KEYS.despacho),
        storageService.removeItem(STORAGE_KEYS.subdominio),
        storageService.removeItem(STORAGE_KEYS.ordenEntrega),
      ]);

      dispatch(quitarEntregas());
      dispatch(cleanNovedades());
      entregasSeleccionadas.forEach((id: number) =>
        dispatch(cambiarEstadoSeleccionado(id))
      );
      dispatch(limpiarEntregaSeleccionada());
      dispatch(quitarFiltros());
    } catch (err) {
      console.error("⚠️ Error limpiando almacenamiento local:", err);
    }
  };

  /**
   *  Función principal de retiro de despacho
   */
  const retirarDespacho = async () => {
    console.log("🟡 [RETIRAR] Inicio del proceso de retiro...");
    try {
      // 1️⃣ Permisos MediaLibrary
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permiso denegado para acceder a la galería.");
      }

      // 2️⃣ Detener seguimiento
      await detenerTareaSeguimientoUbicacion();

      // 3️⃣ Enviar seguimiento (con timeout de seguridad)
      await Promise.race([
        dispatch(
          visitaSeguimientoThunk({
            cantidadCargadas: entregas.length,
            cantidadEntregasLocales: entregadas.length,
            cantidadNovedadesLocales: cantidadNovedades,
            cantidadNovedadesLocalesPendienteSinconizar:
              entregasPendientes.length,
          })
        ).unwrap(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout al enviar seguimiento")), 15000)
        ),
      ]);

      // 4️⃣ Limpieza de archivos e información local
      await limpiarArchivosLocales();
      await limpiarEstadoLocal();

      // 5️⃣ Notificación de éxito
      mostrarAlertHook({
        titulo: "Éxito",
        mensaje: "La orden fue desvinculada correctamente.",
      });

      setTimeout(() => close(), 300);
      console.log("✅ [RETIRAR] Proceso completado correctamente.");
    } catch (error: any) {
      console.error("❌ [RETIRAR] Error detectado:", error);
      mostrarAlertHook({
        titulo: "Error durante el retiro",
        mensaje:
          error?.message || "Ocurrió un problema al desvincular el despacho.",
      });
    }
  };

  /**
   * Confirmación previa del retiro
   */
  const confirmarRetirarDespacho = (validarPendientes: boolean) => {
    // Cierra modal actual
    close?.();

    // Evita desvincular si hay pendientes sin sincronizar
    if (validarPendientes && entregasPendientes.length > 0) {
      mostrarAlertHook({
        titulo: "Acción no permitida",
        mensaje:
          "Tiene entregas locales pendientes por sincronizar. Sincronícelas antes de desvincular.",
      });
      return;
    }

    mostrarAlertHook({
      titulo: "Confirmar acción",
      mensaje:
        "Esta acción eliminará todos los datos locales del despacho. ¿Desea continuar?",
      onAceptar: retirarDespacho,
    });
  };

  return {
    confirmarRetirarDespacho,
  };
};
