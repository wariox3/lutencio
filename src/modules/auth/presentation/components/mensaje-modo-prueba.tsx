import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { AlertTriangle } from "@tamagui/lucide-icons";

const MensajeModoPrueba = () => {
  return (
    <Card
      mt="$3"
      p="$3"
      bordered
      borderRadius="$6"
      bg="$red2"
    >
      <XStack items="flex-start" gap="$3">
        <AlertTriangle size={22} color="$red10" />

        <YStack flex={1}>
          <Text fontWeight="bold" fontSize="$5" color="$red10">
            Modo de prueba activo
          </Text>
          <Text fontSize="$3" color="grey">
            Estás utilizando la aplicación en entorno de prueba. 
            Tus acciones no afectarán los datos reales.
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
};

export default MensajeModoPrueba;
