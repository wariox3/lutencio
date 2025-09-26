import React, { ReactElement } from "react";
import { Card, Text, XStack, YStack } from "tamagui";

interface CardInformativaProps {
  backgroundColor: any;
  titulo: string;
  icono: ReactElement;
  cantidad: number | string;
  style?: any;
}

const CardInformativa = ({
  backgroundColor,
  titulo,
  icono,
  cantidad,
  style,
}: CardInformativaProps) => {
  return (
    <Card
      style={[
        {
          flex: 1,
          flexBasis: 0, // *crítico* para repartir equitativamente
          minWidth: 0, // permite que flexShrink funcione
          overflow: "hidden",
        },
        style,
      ]}
      backgroundColor={backgroundColor}
      borderRadius="$4"
      padding="$3"
    >
      <XStack items="center" justify="space-between" gap={"$1"}>
        <Text fontSize="$3" opacity={0.7}>
          {titulo}
        </Text>
        <XStack items="center" gap={"$1"}>
          <Text
            fontSize="$2"
            fontWeight="bold"
          >
            {cantidad}
          </Text>

          {/* icono no debe encoger demasiado */}
          <XStack style={{ flexShrink: 0 }}>{icono}</XStack>
        </XStack>
      </XStack>
    </Card>
  );
};

export default CardInformativa;
