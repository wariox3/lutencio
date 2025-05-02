import React from 'react'
import { Card, H6, Text, View } from 'tamagui'

const EntregasSinElementos = () => {
  return (
    <Card flex={0.1} my={"$2"} theme={"blue"} padding={16} mx={'$4'}>
      <H6 mb="$2">Información</H6>
      <Text mb="$4">Vincular una orden de entrega</Text>
    </Card>
  )
}

export default EntregasSinElementos