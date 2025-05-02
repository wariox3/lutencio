import { useIntervalActivo } from "@/hooks/useIntervalActivo";
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

const EntregaUbicacion = () => {
  const [seguimientoUbicacion, setSeguimientoUbicacion] = useState(true);
  const arrEntregas = useAppSelector(obtenerEntregasPendientesOrdenadas);

  useFocusEffect(
    useCallback(() => {
      obtenerInformacion();
    }, [])
  );

  const obtenerInformacion = async () => {
    const valorComprobarRegistroTareaGeolocalizacion =
      await comprobarRegistroTareaGeolocalizacion();
    setSeguimientoUbicacion(valorComprobarRegistroTareaGeolocalizacion);
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

  if (arrEntregas.length === 0) return null;

  return (
    <Card p="$3" mx="$3">
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

export default EntregaUbicacion;
