import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import {
  AlertTriangle,
  CheckCircle,
  CircleUser,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Phone,
} from "@tamagui/lucide-icons";
import React from "react";
import { Linking, Platform } from "react-native";
import { Button, Card, Separator, Text, View, XStack, YStack } from "tamagui";
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
      pt="$2"
      pb="$0"
      px="$3"
      mx="$2"
      mt="$2"
      onPress={() => onPress(visita.id)}
      bg={visita.seleccionado ? COLORES.NARANJA_SUAVE : null}
      borderRadius="$3"
      borderColor={visita.seleccionado ? COLORES.AZUL_FUERTE : "$borderColor"}
      borderWidth={1}
      borderStyle={visita.seleccionado ? "dashed" : "solid"}
      bordered={visita.seleccionado}
      elevate
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
    >
      {/* Encabezado con número y documento */}
      <XStack justify="space-between" items="center" mb="$1.5">
        <View bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
          <XStack items="center" gap="$1">
            <Package size="$1" color={COLORES.BLANCO} />
            <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">#{visita.numero}</Text>
          </XStack>
        </View>
        <Text fontSize="$2" color={COLORES.GRIS_OSCURO}>Doc: {visita.documento}</Text>
      </XStack>

      <Separator mb="$1.5" />

      {/* Información principal */}
      <YStack gap="$1">
        {/* Destinatario */}
        <XStack items="center" gap="$2">
          <CircleUser size="$1.5" color={COLORES.AZUL_FUERTE} />
          <Text flex={1} fontSize="$3" fontWeight="bold" color={COLORES.NEGRO}>
            {visita.destinatario}
          </Text>
        </XStack>

        {/* Dirección */}
        <XStack items="center" gap="$2">
          <MapPin size="$1.5" color={COLORES.VERDE_FUERTE} />
          <Text flex={1} fontSize="$2" color={COLORES.GRIS_OSCURO}>
            {visita.destinatario_direccion}
          </Text>
        </XStack>

        {/* Teléfono y cobro */}
        <XStack justify="space-between" items="center">
          {/* Teléfono */}
          {visita.destinatario_telefono !== "None" && visita.destinatario_telefono ? (
            <Button
              size="$2"
              bg={COLORES.AZUL_SUAVE}
              borderRadius="$2"
              p="$1"
              pressStyle={{ opacity: 0.7 }}
              onPress={() => llamarDestinatario("+57" + visita.destinatario_telefono)}
            >
              <XStack items="center" gap="$2">
                <Phone size="$1" color={COLORES.AZUL_FUERTE} />
                <Text color={COLORES.AZUL_FUERTE} fontSize="$2" fontWeight="500">
                  {visita.destinatario_telefono}
                </Text>
              </XStack>
            </Button>
          ) : (
            <View />
          )}

          {/* Cobro */}
          {visita.cobro > 0 && (
            <View
              bg={COLORES.ROJO_SUAVE}
              borderRadius="$2"
              p="$1"
            >
              <XStack items="center" gap="$1">
                <DollarSign size="$1" color={COLORES.ROJO_FUERTE} />
                <Text color={COLORES.ROJO_FUERTE} fontWeight="500">
                  {visita.cobro.toLocaleString()}
                </Text>
              </XStack>
            </View>
          )}
        </XStack>
      </YStack>

      {/* Estados y alertas */}
      <XStack mt="$3" gap="$2" flexWrap="wrap">
        {visita.estado_entregado && (
          <View bg={COLORES.VERDE_SUAVE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1">
              <Text color={COLORES.VERDE_FUERTE} fontSize="$2" fontWeight="500">Entregado</Text>
            </XStack>
          </View>
        )}
        
        {visita.estado_novedad && (
          <View bg={COLORES.NARANJA_SUAVE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1">
              {/* <AlertTriangle size="$1" color={'yellow'} /> */}
              <Text color={COLORES.NARANJA_FUERTE} fontSize="$2" fontWeight="500">Novedad</Text>
            </XStack>
          </View>
        )}
      </XStack>
    </Card>
  );
};

export default ItemLista;
