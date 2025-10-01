import COLORES from "@/src/core/constants/colores.constant";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { CircleAlert, Info, Package } from "@tamagui/lucide-icons";
import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { Entrega } from "../../../domain/interfaces/vista.interface";

const CardInformacionVisita: React.FC<{
  visita: Entrega;
}> = ({ visita }) => {
  const { obtenerColor } = useTemaVisual();

  return (
    <Card bg={obtenerColor("BLANCO", "AZUL_SUAVE")}       p="$1.5"
    marginEnd={"$2"}
    >
        <YStack mt="$1.5" gap="$1.5" flexWrap="wrap">
        <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1.5">
              <Info size="$1" color={COLORES.BLANCO} />
              <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                ID: {visita.id}
              </Text>
            </XStack>
          </Card>
          <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1.5">
              <Package size="$1" color={COLORES.BLANCO} />
              <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                #{visita.numero}
              </Text>
            </XStack>
          </Card>
          {visita.estado_novedad && (
            <Card bg={COLORES.NARANJA_FUERTE} borderRadius="$2" p="$1.5">
              <XStack items="center" gap="$1.5">
                <CircleAlert size="$1" color={COLORES.BLANCO} />
                <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                  Novedad
                </Text>
              </XStack>
            </Card>
          )}
        </YStack>
    </Card>
  );
};

export default React.memo(CardInformacionVisita);
