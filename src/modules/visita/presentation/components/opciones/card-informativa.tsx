import { View, OpaqueColorValue } from 'react-native'
import React, { ReactElement } from 'react'
import { Card, XStack, YStack, Text } from 'tamagui'
import { Bell } from '@tamagui/lucide-icons'


interface cardInterfomativa {
    backgroundColor: any,
    titulo: string,
    icono: ReactElement,
    cantidad: number
}

const CardInformativa = ({
    backgroundColor,
    titulo,
    icono,
    cantidad
}: cardInterfomativa) => {
  return (
    <Card
    flex={1}
    backgroundColor={backgroundColor}
    borderRadius="$4"
    padding="$3.5"
  >
    <XStack items="center" justify="space-between" gap={"$1"}>
      <YStack>
        <Text fontSize="$3" opacity={0.7}>
          {titulo}
        </Text>
        <Text fontSize="$8" fontWeight="bold">
          {cantidad}
        </Text>
      </YStack>
      {icono}
    </XStack>
  </Card>
  )
}

export default CardInformativa