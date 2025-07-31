import COLORES from "@/src/core/constants/colores.constant";
import { Check, X } from "@tamagui/lucide-icons";
import React from "react";
import { Card, Separator, Text, View, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista-log";

const NovedadLogItem: React.FC<ItemListaProps> = ({ novedad }) => {
  return (
    <Card p="$3" mx="$2" mt={"$2"} borderStyle={"dashed"} bordered>
      <YStack gap={"$1"}>
        <XStack justify={"space-between"}>
          <Text>ID: {novedad.visita_id}</Text>
        </XStack>
        <XStack justify={"space-between"}>
          <YStack items={"center"} gap={"$1.5"} flex={1}>
            <Text>Sincronizado</Text>
            <>
              {novedad.estado_sincronizado ? (
                <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
              ) : null}
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />
          <YStack items={"center"} gap={"$1.5"} flex={1}>
            <Text>Error</Text>
            {novedad.estado_sincronizada_error ? (
              <>
                <X size={"$1"} color={COLORES.ROJO_FUERTE} />
              </>
            ) : null}
          </YStack>
        </XStack>
        <View mt={8}>
          {novedad.estado_sincronizada_error_mensaje ? (
            <Text color={COLORES.ROJO_FUERTE}>
              Mensaje: {novedad.estado_sincronizada_error_mensaje}
            </Text>
          ) : null}
        </View>
      </YStack>
    </Card>
  );
};

export default NovedadLogItem;
