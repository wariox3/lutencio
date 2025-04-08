import { useIntervalActivo } from "@/hooks/useIntervalActivo";
import { obtenerEntregasPendientesOrdenadas } from "@/store/selects/entrega";
import {
  comprobarRegistroTareaGeolocalizacion,
  detenerTareaSeguimientoUbicacion,
  iniciarTareaSeguimientoUbicacion,
  registrarTareaSeguimientoUbicacion,
} from "@/utils/services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, H4, YStack } from "tamagui";

const EntregaUbicacion = () => {
  const [seguimientoUbicacion, setSeguimientoUbicacion] = useState(true);
  const arrEntregas = useSelector(obtenerEntregasPendientesOrdenadas);
  
  // Mover la lógica del intervalo aquí
  useIntervalActivo(
    seguimientoUbicacion,
    useCallback(async () => {
      let tareaUbicacion = await comprobarRegistroTareaGeolocalizacion()
      if (tareaUbicacion) {
        await iniciarTareaSeguimientoUbicacion();
      }
    }, [seguimientoUbicacion])
  );

  const alternarSeguimientoUbicacion = async () => {
    try {
      let tareaUbicacion = await comprobarRegistroTareaGeolocalizacion()      
      if (tareaUbicacion) {
        await detenerTareaSeguimientoUbicacion();
        setSeguimientoUbicacion(false);
      } else {
        await iniciarTareaSeguimientoUbicacion()
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
        <H4 mb="$2">Ubicación</H4>
        <Button
          theme={seguimientoUbicacion ? "red" : "green"}
          onPress={alternarSeguimientoUbicacion}
        >
          {seguimientoUbicacion ? "Detener Seguimiento" : "Iniciar Seguimiento"}
        </Button>
      </YStack>
    </Card>
  );
};

export default EntregaUbicacion;
