import { useIntervalActivo } from "@/hooks/useIntervalActivo";
import { RootState } from "@/store/reducers";
import {
  iniciarTareaSeguimientoUbicacion,
  detenerTareaSeguimientoUbicacion,
} from "@/utils/services/locationService";
import React, { useCallback, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Button, Card, H4, YStack } from "tamagui";

const EntregaUbicacion = () => {
  const [seguimientoUbicacion, setSeguimientoUbicacion] = useState(true);
  const arrEntregas = useSelector(
    (state: RootState) =>
      state.entregas.entregas
        .filter((entrega) => !entrega.estado_entregado)
        .sort((a, b) => a.orden - b.orden) || [],
    shallowEqual
  );

  // Mover la lógica del intervalo aquí
  useIntervalActivo(
    seguimientoUbicacion && arrEntregas.length > 0,
    useCallback(async () => {
      if (seguimientoUbicacion) {
        await iniciarTareaSeguimientoUbicacion();
      }
    }, [seguimientoUbicacion])
  );

  const alternarSeguimientoUbicacion = async () => {
    try {
      if (seguimientoUbicacion) {
        await detenerTareaSeguimientoUbicacion();
        setSeguimientoUbicacion(false);
      } else {
        setSeguimientoUbicacion(true);
      }
    } catch (error) {
      console.error("Error al alternar el rastreo:", error);
      alert("Ocurrió un error al cambiar el estado del seguimiento");
    }
  };

  return (
    <>
      {arrEntregas.length > 0 ? (
        <Card p="$3" mx="$3">
          <YStack justify="space-between" px="$3" mb="$2">
            <H4 mb="$2">Ubicación</H4>
            <Button
              theme={seguimientoUbicacion ? "red" : "green"}
              onPress={alternarSeguimientoUbicacion}
            >
              {seguimientoUbicacion
                ? "Detener Seguimiento"
                : "Iniciar Seguimiento"}
            </Button>
          </YStack>
        </Card>
      ) : null}
    </>
  );
};

export default EntregaUbicacion;
