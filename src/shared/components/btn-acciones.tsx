import { rutasApp } from "@/src/core/constants/rutas.constant";
import { ArrowDownToLine, FileWarning } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, XStack } from "tamagui";

interface BtnAccionesProps {
  visualizarCantidadSeleccionada?: boolean;
  cantidadSeleccionada?: number;
  rutaEntregar: any;
  rutaNovedad: any;
}

const BtnAcciones = ({
  visualizarCantidadSeleccionada = false,
  cantidadSeleccionada,
  rutaEntregar,
  rutaNovedad,
}: BtnAccionesProps) => {
  const router = useRouter();

  const navegarEntregar = () => {
    router.navigate(rutaEntregar);
  };

  const navegarNovedad = () => {
    router.navigate(rutaNovedad);
  };

  const renderCantidad = () =>
    visualizarCantidadSeleccionada && <Text>({cantidadSeleccionada})</Text>;

  return (
    <XStack gap="$2" justify="space-around" mt={"$2"}>
      <Button
        onPress={navegarEntregar}
        size="$4.5"
        theme={visualizarCantidadSeleccionada ? "blue" : "accent"}
        icon={<ArrowDownToLine size={"$2"}></ArrowDownToLine>}
        disabled={!visualizarCantidadSeleccionada}
      >
        Entregar
        {renderCantidad()}
      </Button>
      <Button
        onPress={navegarNovedad}
        size="$4.5"
        theme={visualizarCantidadSeleccionada ? "yellow" : "accent"}
        icon={<FileWarning size={"$2"}></FileWarning>}
        disabled={!visualizarCantidadSeleccionada}
      >
        Novedad
        {renderCantidad()}
      </Button>
    </XStack>
  );
};

export default BtnAcciones;
