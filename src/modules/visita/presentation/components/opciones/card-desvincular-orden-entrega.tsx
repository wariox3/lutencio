import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useEliminarEnGaleria } from "@/src/shared/hooks/useMediaLibrary";
import { detenerTareaSeguimientoUbicacion } from "@/utils/services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClipboardX } from "@tamagui/lucide-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { obtenerEntregasSeleccionadas } from "../../../application/slice/entrega.selector";
import {
  cambiarEstadoSeleccionado,
  limpiarEntregaSeleccionada,
  quitarEntregas,
  quitarFiltros,
} from "../../../application/slice/entrega.slice";

const CardDesvincularOrdenEntrega = ({ close }: { close: () => void }) => {
  const entregas = useAppSelector(({ entregas }) => entregas.entregas || []);
  const entregasSeleccionadas = useAppSelector(obtenerEntregasSeleccionadas);
  const dispatch = useAppDispatch();
  const { eliminarArchivo } = useEliminarEnGaleria();

  const confirmarRetirarDespacho = async () => {
    close();
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

      // Limpiar el despacho almacenado
      await AsyncStorage.removeItem("despacho");

      // Limpiar el subdominio almacenado
      await AsyncStorage.removeItem("subdominio");

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

      //   //retirar las entregas
      dispatch(quitarEntregas());

      //   //retirar entregas seleccionadas
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
      backgroundColor={COLORES.ROJO_SUAVE}
      borderRadius="$4"
      padding="$3.5"
      onPress={() => confirmarRetirarDespacho()}
    >
      <XStack gap={"$2"} items={"center"}>
        <ClipboardX size="$2" color={COLORES.ROJO_FUERTE} />

        <YStack justify="space-between" gap={"$2"}>
          <Text color={COLORES.ROJO_FUERTE} fontWeight={"bold"}>
            Desvincular
          </Text>
          <Text color={COLORES.ROJO_FUERTE}>
            Se eliminará la vinculación con la orden de entrega actual.
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
};

export default CardDesvincularOrdenEntrega;
