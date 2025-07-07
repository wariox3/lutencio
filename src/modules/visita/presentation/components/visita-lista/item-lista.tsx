import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import {
  AlertTriangle,
  CircleUser,
  MapPin,
  Phone,
} from "@tamagui/lucide-icons";
import React from "react";
import { Linking, Platform } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista";

const ItemLista: React.FC<ItemListaProps> = ({ visita, onPress }) => {
  const llamarDestinatario = (telefono: string) => {
    let numeroTelefonico = telefono;
    if (Platform.OS !== "android") {
      numeroTelefonico = `telprompt:${telefono}`;
    } else {
      numeroTelefonico = `tel:${telefono}`;
    }
    Linking.canOpenURL(numeroTelefonico)
      .then((supported) => {
        if (!supported) {
          mostrarAlertHook({
            titulo: alertas.titulo.advertencia,
            mensaje: alertas.mensaje.numeroNoValido,
          });
        } else {
          return Linking.openURL(numeroTelefonico);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card
      p="$3"
      mx="$2"
      mt={"$2"}
      onPress={() => onPress(visita.id)}
      bg={visita.seleccionado ? COLORES.NARANJA_SUAVE : null}
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
        <>
          {visita.destinatario_telefono !== "None" &&
          visita.destinatario_telefono ? (
            <XStack items={"center"} gap={"$1"}>
              <Phone size={"$1"} color={COLORES.AZUL_FUERTE} />
              <Text
                flex={1}
                color={COLORES.AZUL_FUERTE}
                onPress={() => llamarDestinatario("+57"+visita.destinatario_telefono)}
              >
                {visita.destinatario_telefono}
              </Text>
            </XStack>
          ) : null}
        </>
      </YStack>
      {visita.estado_entregado ? <Text>Entregado</Text> : null}
      {visita.estado_novedad ? (
        <XStack items={"center"} gap={"$1"}>
          <AlertTriangle size={"$1"} />
          <Text theme={"yellow"} px={"$0.25"}>
            Novedad
          </Text>
        </XStack>
      ) : null}
    </Card>
  );
};

export default ItemLista;
