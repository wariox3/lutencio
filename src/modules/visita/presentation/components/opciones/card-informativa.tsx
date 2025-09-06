import React, { ReactElement } from "react";
import { Card, Text, XStack, YStack } from "tamagui";

interface cardInterfomativa {
  backgroundColor: any;
  titulo: string;
  icono: ReactElement;
  cantidad: number | string;
}

const CardInformativa = ({
  backgroundColor,
  titulo,
  icono,
  cantidad,
}: cardInterfomativa) => {
  return (
    <Card
      flex={1}
      backgroundColor={backgroundColor}
      borderRadius="$4"
      padding="$3.5"
    >
      <YStack gap={"$2"}>
        <Text fontSize="$3" opacity={0.7}>
          {titulo}
        </Text>
        <XStack items="center" justify="space-between" gap={"$2"}>
          <Text fontSize="$4" fontWeight="bold">
            {cantidad}
          </Text>
          <>{icono}</>
        </XStack>
      </YStack>
    </Card>
  );
};

export default CardInformativa;
