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
  selectEntregasSincronizadas,
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
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      // deterner servicio de la ubicación
      await detenerTareaSeguimientoUbicacion();

      // post de seguimiento
      await dispatch(
        visitaSeguimientoThunk({
          cantidadCargadas: entregas.length,
          cantidadEntregasLocales: entregadasEntregadas.length,
          cantidadNovedadesLocales: cantidadNovedades,
          cantidadNovedadesLocalesPendienteSinconizar: entregasPendientesTodas.length,
        })
      ).unwrap();

      // Limpiar el despacho almacenado
      await storageService.removeItem(STORAGE_KEYS.despacho);
      // Limpiar el subdominio almacenado
      await storageService.removeItem(STORAGE_KEYS.subdominio);
      // Limpiar orden de entrega
      await storageService.removeItem(STORAGE_KEYS.ordenEntrega);

      for (const entrega of entregas) {
        if (entrega.arrImagenes && entrega.arrImagenes.length > 0) {
          for (const img of entrega.arrImagenes) {
            const fileInfo = await FileSystem.getInfoAsync(img.uri);
            if (fileInfo.exists) {
              await eliminarArchivo(img.uri);
            }
          }
        }

        //     //eliminar firma
        if (entrega.firmarBase64) {
          const fileInfo = await FileSystem.getInfoAsync(entrega.firmarBase64);
          if (fileInfo.exists) {
            await eliminarArchivo(entrega.firmarBase64);
          }
        }
      }

      // retirar las entregas
      dispatch(quitarEntregas());

      // retirar novedades
      dispatch(cleanNovedades());

      // retirar entregas seleccionadas
      retirarSeleccionadas();

      // retirar filtros
      retirarFiltros();
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
