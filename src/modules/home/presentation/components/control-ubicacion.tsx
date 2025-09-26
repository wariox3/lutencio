import { useIntervalActivo } from "@/src/shared/hooks/useIntervalActivo";
import { useAppSelector } from "@/src/application/store/hooks";
import { obtenerEntregasPendientesOrdenadas } from "@/src/modules/visita/application/slice/entrega.selector";
import {
  comprobarRegistroTareaGeolocalizacion,
  detenerTareaSeguimientoUbicacion,
  iniciarTareaSeguimientoUbicacion,
} from "@/utils/services/locationService";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Button, Card, YStack } from "tamagui";
import storageService from "@/src/core/services/storage.service";
import { STORAGE_KEYS } from "@/src/core/constants";

const ControlUbicacion = () => {
  const [seguimientoUbicacion, setSeguimientoUbicacion] = useState(true);
  const [ordenEntrega, setOrdenEntrega] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      obtenerInformacion();
      obtenerOrdenEntrega();
    }, [])
  );

  const obtenerInformacion = async () => {
    const valorComprobarRegistroTareaGeolocalizacion =
      await comprobarRegistroTareaGeolocalizacion();
    setSeguimientoUbicacion(valorComprobarRegistroTareaGeolocalizacion);
  };

  const obtenerOrdenEntrega = async () => {
    const valorOrdenEntrega = (await storageService.getItem(
      STORAGE_KEYS.ordenEntrega
    )) as string;
    setOrdenEntrega(valorOrdenEntrega);
  };

  // Mover la lógica del intervalo aquí
  useIntervalActivo(
    seguimientoUbicacion,
    useCallback(async () => {
      let tareaUbicacion = await comprobarRegistroTareaGeolocalizacion();
      if (tareaUbicacion) {
        await iniciarTareaSeguimientoUbicacion();
      }
    }, [seguimientoUbicacion])
  );

  const alternarSeguimientoUbicacion = async () => {
    try {
      let tareaUbicacion = await comprobarRegistroTareaGeolocalizacion();
      if (tareaUbicacion) {
        await detenerTareaSeguimientoUbicacion();
        setSeguimientoUbicacion(false);
      } else {
        await iniciarTareaSeguimientoUbicacion();
        setSeguimientoUbicacion(true);
      }
    } catch (error) {
      alert("Ocurrió un error al cambiar el estado del seguimiento");
    }
  };

  if (ordenEntrega === null) return null;

  return (
    <Card
      p="$3"
      mx="$3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.30)",
      }}
    >
      <YStack justify="space-between" px="$3" mb="$2">
        <Button
          theme={seguimientoUbicacion ? "red" : "green"}
          onPress={alternarSeguimientoUbicacion}
        >
          {seguimientoUbicacion
            ? "Detener envio ubicación"
            : "Iniciar envio ubicación"}
        </Button>
      </YStack>
    </Card>
  );
};

export default ControlUbicacion;
