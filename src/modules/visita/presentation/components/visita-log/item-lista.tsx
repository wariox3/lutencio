import COLORES from "@/src/core/constants/colores.constant";
import {
  Check,
  X
} from "@tamagui/lucide-icons";
import React from "react";
import { Card, Separator, Text, View, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista-log";

const ItemListaLog: React.FC<ItemListaProps> = ({ visita }) => {


  return (
    <Card
      p="$3"
      mx="$2"
      mt={"$2"}
      borderStyle={"dashed"}
      bordered
    >
      <YStack gap={"$1"}>
        <XStack justify={'space-between'}>
          <Text>ID: {visita.id}</Text>
          <Text>#{visita.numero}</Text>
        </XStack>
        <XStack justify={'space-between'}>
          <YStack items={"center"} gap={"$1.5"} flex={1}>
            <Text>Entregado</Text>
            <>
              {
                visita.estado_entregado ? (
                  <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
                ) : null
              }
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />

          <YStack items={"center"} gap={"$1.5"} flex={1}>
            <Text >Sincronizado</Text>
            <>
              {
                visita.estado_sincronizado ? (
                  <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
                ) : null
              }
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />
          <YStack items={"center"} gap={"$1.5"} flex={1}>
            <Text >Error</Text>
            {
              visita.entregada_sincronizada_error ? (
                <>
                  <X size={"$1"} color={COLORES.ROJO_FUERTE} />
                </>
              ) : null
            }
          </YStack>
        </XStack>
        <View mt={8}>
            {
              visita.entregada_sincronizada_error_mensaje ? (
                <Text color={COLORES.ROJO_FUERTE}>Mensaje: {visita.entregada_sincronizada_error_mensaje}</Text>
              ) : null
            }
        </View>

      </YStack>
    </Card>
  );
};

export default ItemListaLog;
