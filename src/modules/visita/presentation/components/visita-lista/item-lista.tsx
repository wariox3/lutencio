import { alertas } from "@/src/core/constants/alertas.const";
import COLORES from "@/src/core/constants/colores.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import {
  CheckCircle,
  CircleAlert,
  CircleUser,
  DollarSign,
  MapPin,
  Package,
  Phone
} from "@tamagui/lucide-icons";
import React, { useCallback, useMemo } from "react";
import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card, Separator, Text, View, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista";
import { router } from "expo-router";

// Componente optimizado para evitar re-renders innecesarios
const ItemLista: React.FC<ItemListaProps> = ({ visita, onPress }) => {
  // Memoizar valores que se usan en la UI para evitar recálculos
  const isSelected = useMemo(() => visita.seleccionado, [visita.seleccionado]);
  const hasTelefono = useMemo(
    () =>
      visita.destinatario_telefono !== "None" && !!visita.destinatario_telefono,
    [visita.destinatario_telefono]
  );
  const hasCobro = useMemo(() => visita.cobro > 0, [visita.cobro]);
  const hasEstadoEntregado = useMemo(
    () => visita.estado_entregado,
    [visita.estado_entregado]
  );
  const hasEstadoNovedad = useMemo(
    () => visita.estado_novedad,
    [visita.estado_novedad]
  );
  const { obtenerColor } = useTemaVisual();

  // Memoizar la función para llamar al destinatario
  const llamarDestinatario = useCallback((telefono: string) => {
    // Validate phone number format
    const isValidPhoneNumber =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(telefono);

    if (!isValidPhoneNumber) {
      mostrarAlertHook({
        titulo: alertas.titulo.advertencia,
        mensaje: alertas.mensaje.numeroNoValido,
      });
      return;
    }

    // Create the appropriate URL scheme based on platform
    const phoneUrl = Platform.select({
      ios: `telprompt:${telefono}`,
      android: `tel:${telefono}`,
      default: `tel:${telefono}`,
    });

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        return Linking.openURL(phoneUrl);
      })
      .catch((error) => {
        console.error("Error al intentar realizar la llamada:", error);
        mostrarAlertHook({
          titulo: alertas.titulo.error,
          mensaje:
            "No se pudo realizar la llamada. Por favor intente más tarde.",
        });
      });
  }, []);

  // Memoizar la función para manejar el onPress
  const handlePress = useCallback(() => {
    onPress(visita.id);
  }, [visita.id, onPress]);

  const solucionNavegacion = useCallback(() => {
    router.push("/modal-novedad-solucion");
    //
  }, [visita.id]);

  // Memoizar el handler para llamar al teléfono del destinatario
  const handleCallPhone = useCallback(() => {
    if (visita.destinatario_telefono) {
      llamarDestinatario(visita.destinatario_telefono);
    }
  }, [visita.destinatario_telefono, llamarDestinatario]);

  return (
    <Card
      py="$2"
      px="$3"
      mx="$2"
      mt="$1.5"
      onPress={handlePress}
      borderRadius="$3"
      borderWidth={1}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      // Aplicar estilos condicionales directamente
      bg={isSelected ? COLORES.AZUL_SUAVE : undefined}
      borderColor={isSelected ? COLORES.AZUL_FUERTE : "$borderColor"}
      borderStyle={isSelected ? "dashed" : "solid"}
      bordered={isSelected}
    >
      {/* Encabezado con número y documento */}
      <XStack justify="space-between" items="center" mb="$1.5">
        <XStack mt="$1.5" gap="$1.5" flexWrap="wrap">
          <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1.5">
              <Package size="$1" color={COLORES.BLANCO} />
              <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                #{visita.numero}
              </Text>
            </XStack>
          </Card>
          {hasEstadoNovedad && (
            <Card bg={COLORES.NARANJA_FUERTE} borderRadius="$2" p="$1.5">
              <XStack items="center" gap="$1.5">
                <CircleAlert size="$1" color={COLORES.BLANCO} />
                <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                  Novedad
                </Text>
              </XStack>
            </Card>
          )}
        </XStack>

        <Text fontSize="$2" color={obtenerColor("GRIS_OSCURO", "BLANCO")}>
          Doc: {visita.documento}
        </Text>
      </XStack>

      <Separator mb="$1.5" />

      {/* Información principal */}
      <YStack gap="$1">
        {/* Destinatario */}
        <XStack items="center" gap="$2">
          <CircleUser size="$1.5" color={COLORES.AZUL_FUERTE} />
          <Text
            flex={1}
            fontSize="$3"
            fontWeight="bold"
            color={obtenerColor("NEGRO", "BLANCO")}
          >
            {visita.destinatario}
          </Text>
        </XStack>

        {/* Dirección */}
        <XStack items="center" gap="$2">
          <MapPin size="$1.5" color={COLORES.VERDE_FUERTE} />
          <Text
            flex={1}
            fontSize="$2"
            color={obtenerColor("GRIS_OSCURO", "BLANCO")}
          >
            {visita.destinatario_direccion}
          </Text>
        </XStack>

        {/* Teléfono y cobro */}
        <XStack justify="space-between" items="center">
          <XStack items="center" gap="$3">
            {/* Teléfono */}
            {hasTelefono ? (
              <TouchableOpacity
                style={styles.phoneButton}
                onPress={handleCallPhone}
                activeOpacity={0.7}
              >
                <XStack items="center" gap="$2">
                  <Phone
                    size="$1"
                    color={obtenerColor("AZUL_FUERTE", "BLANCO")}
                  />
                  <Text
                    color={obtenerColor("AZUL_FUERTE", "BLANCO")}
                    fontSize="$2"
                    fontWeight="500"
                  >
                    {visita.destinatario_telefono}
                  </Text>
                </XStack>
              </TouchableOpacity>
            ) : (
              <View />
            )}
            <YStack>
              <XStack gap={"$1.5"}>
                <Text
                  fontSize="$2"
                  fontWeight={"bold"}
                  color={obtenerColor("GRIS_OSCURO", "BLANCO")}
                >
                  Und
                </Text>
                <Text
                  fontSize="$2"
                  color={obtenerColor("GRIS_OSCURO", "BLANCO")}
                >
                  {visita.unidades}
                </Text>
              </XStack>
              <XStack gap={"$1.5"}>
                <Text
                  fontSize="$2"
                  fontWeight={"bold"}
                  color={obtenerColor("GRIS_OSCURO", "BLANCO")}
                >
                  Peso
                </Text>
                <Text
                  fontSize="$2"
                  color={obtenerColor("GRIS_OSCURO", "BLANCO")}
                >
                  {visita.peso}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Cobro */}
          {hasCobro && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <XStack items="center" gap="$1">
                <DollarSign
                  size="$1"
                  color={obtenerColor("ROJO_FUERTE", "BLANCO")}
                />
                <Text
                  color={obtenerColor("ROJO_FUERTE", "BLANCO")}
                  fontWeight="bold"
                >
                  {visita.cobro.toLocaleString()}
                </Text>
              </XStack>
            </View>
          )}
        </XStack>
      </YStack>
      <XStack justify="space-between" items="center" mb="$1.5">
        <XStack mt="$1.5" gap="$1.5" flexWrap="wrap">
          {hasEstadoNovedad && (
            <Button
              size="$3.5"
              theme="green"
              icon={CheckCircle}
              onPress={() => solucionNavegacion()}
            >
              Solucionar novedad
            </Button>
          )}
        </XStack>
      </XStack>
    </Card>
  );
};

// Definir estilos para componentes nativos - memoizados para evitar recreaciones
const styles = StyleSheet.create({
  phoneButton: {
    backgroundColor: COLORES.AZUL_SUAVE,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Función de comparación personalizada para React.memo
// Solo re-renderiza si cambian las propiedades importantes
const areEqual = (prevProps: ItemListaProps, nextProps: ItemListaProps) => {
  return (
    prevProps.visita.id === nextProps.visita.id &&
    prevProps.visita.seleccionado === nextProps.visita.seleccionado &&
    prevProps.visita.destinatario_telefono ===
      nextProps.visita.destinatario_telefono &&
    prevProps.visita.cobro === nextProps.visita.cobro &&
    prevProps.visita.estado_entregado === nextProps.visita.estado_entregado &&
    prevProps.visita.estado_novedad === nextProps.visita.estado_novedad
  );
};

// Exportar el componente con React.memo usando la función de comparación personalizada
export default React.memo(ItemLista, areEqual);
