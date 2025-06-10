import COLORES from "@/src/core/constants/colores.constant";
import { FileQuestion } from "@tamagui/lucide-icons";
import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";

const MensajeFiltroSinResultados = () => {
  return (
    <Card
      backgroundColor={COLORES.AZUL_SUAVE}
      borderRadius="$4"
      marginTop={"$2"}
      p={"$2"}
      mx={"$2"}
    >
      <XStack items="center" justify="space-between" gap={"$1"}>
        <YStack>
          <Text fontSize="$3" opacity={0.7}>
            Sin resultados en busqueda por filtros
          </Text>
        </YStack>
        <FileQuestion></FileQuestion>
      </XStack>
    </Card>
  );
};

export default MensajeFiltroSinResultados;
