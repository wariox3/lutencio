import COLORES from "@/src/core/constants/colores.constant";
import { CircleUser, MapPin, Phone } from "@tamagui/lucide-icons";
import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista";

const ItemLista: React.FC<ItemListaProps> = ({ visita, onPress }) => {
  return (
    <Card
      p="$3"
      mx="$2"
      mt={"$2"}
      onPress={() => onPress(visita.id)}
      bg={visita.seleccionado ? COLORES.NARANJA_SUAVE : "white"}
      borderStyle={"dashed"}
      bordered
    >
      <YStack gap={"$1"}>
        <Text>#{visita.numero}</Text>

        <XStack items={"center"} gap={"$1"}>
          <CircleUser size={"$1"} />
          <Text flex={1}>{visita.destinatario}</Text>
        </XStack>

        <XStack items={"center"} gap={"$1"}>
          <MapPin size={"$1"} />
          <Text flex={1}>{visita.destinatario_direccion}</Text>
        </XStack>
        <XStack items={"center"} gap={"$1"}>
          <Phone size={"$1"}  color={COLORES.AZUL_FUERTE}/>
          <Text flex={1} color={COLORES.AZUL_FUERTE}>{visita.destinatario_telefono}</Text>
        </XStack>
    
      </YStack>

      

      {visita.estado_entregado ? <Text>Entregado</Text> : null}
      {visita.estado_novedad ? (
        <Text theme={"yellow"} px={"$0.25"}>
          Novedad
        </Text>
      ) : null}

    </Card>
  );
};

export default ItemLista;
