import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { STORAGE_KEYS } from "@/src/core/constants";
import { alertas } from "@/src/core/constants/alertas.const";
import COLORES, { ColorKey } from "@/src/core/constants/colores.constant";
import storageService from "@/src/core/services/storage.service";
import { cleanNovedades } from "@/src/modules/novedad/application/store/novedad.slice";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import { ClipboardX } from "@tamagui/lucide-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Card, Text, XStack, YStack } from "tamagui";
import {
  obtenerEntregasPendientesTodas,
  obtenerEntregasSeleccionadas,
  selectEntregadas,
} from "../../../application/slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  quitarEntregas,
  quitarFiltros,
} from "../../../application/slice/entrega.slice";
import { visitaSeguimientoThunk } from "../../../application/slice/visita.thunk";
import { selectCantidadNovedades } from "@/src/modules/novedad/application/store/novedad.selector";

const CardDesvincularOrdenEntrega = ({
  close,
  titulo,
  mensaje,
  textoColor,
  bgColor,
  validaEntregasPendentesSincronizar,
}: {
  close: () => void;
  titulo: string;
  mensaje: string;
  textoColor: ColorKey;
  bgColor: ColorKey;
  validaEntregasPendentesSincronizar: boolean;
}) => {
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const entregadasEntregadas = useAppSelector(selectEntregadas);
  const cantidadNovedades = useAppSelector(selectCantidadNovedades);  
  
  const entregasPendientesTodas = useAppSelector(
    obtenerEntregasPendientesTodas
  );
  const dispatch = useAppDispatch();
  const { eliminarArchivo } = useEliminarEnGaleria();

  const confirmarRetirarDespacho = async () => {
    close();

    if (validaEntregasPendentesSincronizar) {
      if (entregasPendientesTodas.length > 0) {
        mostrarAlertHook({
          titulo: "No puede desvincular la orden",
          mensaje:
            "Tiene visitas entregadas localmente pendientes por sinconizar",
        });
        return true;
      }
    }

    mostrarAlertHook({
      titulo: alertas.titulo.advertencia,
      mensaje: alertas.mensaje.accionIrreversible,
      onAceptar: () => retirarDespacho(),
    });
  };

  const retirarDespacho = async () => {
    console.log("🟡 [RETIRAR] Inicio del proceso de retiro...");
  
    try {
      // 1️⃣ Permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("🟢 [RETIRAR] Permisos MediaLibrary:", status);
      if (status !== "granted") {
        throw new Error("Permiso denegado para MediaLibrary");
      }
  
      // 2️⃣ Detener seguimiento ubicación
      console.log("🟢 [RETIRAR] Deteniendo tarea de seguimiento...");
      await detenerTareaSeguimientoUbicacion();
  
      // 3️⃣ Seguimiento (POST)
      console.log("🟢 [RETIRAR] Enviando seguimiento...");
      await dispatch(
        visitaSeguimientoThunk({
          cantidadCargadas: entregas.length,
          cantidadEntregasLocales: entregadasEntregadas.length,
          cantidadNovedadesLocales: cantidadNovedades,
          cantidadNovedadesLocalesPendienteSinconizar:
            entregasPendientesTodas.length,
        })
      ).unwrap();
      console.log("🟢 [RETIRAR] Seguimiento enviado correctamente.");
  
      // 4️⃣ Limpiar almacenamiento
      console.log("🟢 [RETIRAR] Limpiando almacenamiento local...");
      await storageService.removeItem(STORAGE_KEYS.despacho);
      await storageService.removeItem(STORAGE_KEYS.subdominio);
      await storageService.removeItem(STORAGE_KEYS.ordenEntrega);
  
      // 5️⃣ Eliminar imágenes y firmas
      console.log("🟢 [RETIRAR] Eliminando imágenes y firmas...");
      for (const entrega of entregas) {
        if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
          for (const img of entrega.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(img.uri);
            if (fileInfo.exists) {
              console.log("   📸 Eliminando imagen:", img.uri);
              await eliminarArchivo(img.uri);
            }
          }
        }
  
        if (entrega.firmarBase64) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
          if (fileInfo.exists) {
            console.log("   🖋️ Eliminando firma:", entrega.firmarBase64);
            await eliminarArchivo(entrega.firmarBase64);
          }
        }
      }
  
      // 6️⃣ Limpiar Redux
      console.log("🟢 [RETIRAR] Limpiando estados en Redux...");
      dispatch(quitarEntregas());
      dispatch(cleanNovedades());
      retirarSeleccionadas();
      retirarFiltros();
  
      console.log("✅ [RETIRAR] Proceso completado correctamente.");
      setTimeout(() => {
        close(); // cerrar después de 200ms
      }, 200);
    } catch (error) {
      console.error("❌ [RETIRAR] Error detectado:", error);
      mostrarAlertHook({
        titulo: "Error durante el retiro",
        mensaje:
          error instanceof Error
            ? error.message
            : "Ocurrió un problema desconocido durante el retiro.",
      });
    }
  };
  

  const retirarSeleccionadas = () => {
    entregasSeleccionadas.map((entrega: number) => {
      dispatch(cambiarEstadoSeleccionado(entrega));
    });
    dispatch(limpiarEntregaSeleccionada());
  };

  const retirarFiltros = () => {
    dispatch(quitarFiltros());
  };

  return (
    <Card
      backgroundColor={COLORES[bgColor]}
      borderRadius="$4"
      padding="$3.5"
      width="100%"
      maxWidth="100%"
      onPress={() => confirmarRetirarDespacho()}
    >
      <XStack gap="$2" items="center" flexWrap="wrap">
        <ClipboardX size="$2" color={COLORES[textoColor]} />
        <YStack flex={1} gap="$2">
          <Text color={COLORES[textoColor]} fontWeight="bold">
            {titulo}
          </Text>
          <Text
            color={COLORES[textoColor]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {mensaje}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
};

export default CardDesvincularOrdenEntrega;
