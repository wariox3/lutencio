import { alertas } from "@/src/core/constants";
import COLORES from "@/src/core/constants/colores.constant";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Package, Phone } from "@tamagui/lucide-icons";
import React, { useState, useCallback, useMemo } from "react";
import {
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Dialog,
  Button,
  YStack,
  XStack,
  Paragraph,
  Text,
  Separator,
  Card,
} from "tamagui";

const extraerNumeros = (texto: string) => {
  return texto.match(/\+?\d{7,15}/g) || [];
};

const cardTelefonoDestinatario = ({
  telefono,
  destinatario,
  numero,
}: {
  telefono: string;
  destinatario: string;
  numero: string;
}) => {
  const { obtenerColor } = useTemaVisual();
  const lista = extraerNumeros(telefono);

  // ✅ deduplicar y memorizar números
  const numerosUnicos = useMemo(() => [...new Set(lista)], [lista]);

  const [open, setOpen] = useState(false);

  const abrirLlamada = useCallback((numero: string) => {
    const phoneUrl = Platform.select({
      ios: `telprompt:${numero}`,
      android: `tel:${numero}`,
      default: `tel:${numero}`,
    });

    Linking.openURL(phoneUrl).catch((error) =>
      console.error("Error al intentar realizar la llamada:", error)
    );
  }, []);

  const llamarDestinatario = useCallback(() => {
    console.log(numerosUnicos);

    if (numerosUnicos.length === 0) {
      mostrarAlertHook({
        titulo: alertas.titulo.advertencia,
        mensaje: alertas.mensaje.numeroNoValido,
      });
      return;
    }

    if (numerosUnicos.length === 1) {
      abrirLlamada(numerosUnicos[0]);
      return;
    }

    setOpen(true);
  }, [numerosUnicos, abrirLlamada]);

  // ✅ mostrar un solo número o resumen
  const textoTelefono =
    numerosUnicos.length > 1
      ? `${numerosUnicos[0].slice(0, 10)} (+${numerosUnicos.length - 1})`
      : numerosUnicos[0];

  return (
    <>
      <TouchableOpacity
        style={styles.phoneButton}
        onPress={llamarDestinatario}
        activeOpacity={0.7}
      >
        <XStack items="center" gap="$2">
          <Phone size="$1" color={obtenerColor("AZUL_FUERTE", "BLANCO")} />
          <Text
            color={obtenerColor("AZUL_FUERTE", "BLANCO")}
            fontSize="$2"
            fontWeight="500"
          >
            {textoTelefono}
          </Text>
        </XStack>
      </TouchableOpacity>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="tooltip"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            key="content"
            animation="tooltip"
            enterStyle={{ y: -20, opacity: 0 }}
            exitStyle={{ y: 10, opacity: 0 }}
            bg={obtenerColor("BLANCO", "NEGRO")}
          >
            <YStack gap="$4">
              <Paragraph size="$7" fontWeight="bold" self={"center"}>
                Selecciona un número
              </Paragraph>
              <Separator my="$1" />
              <XStack>
                <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
                  <XStack items="center" gap="$1.5" self={"flex-start"}>
                    <Package size="$1" color={COLORES.BLANCO} />
                    <Text
                      color={COLORES.BLANCO}
                      fontWeight="bold"
                      fontSize="$1"
                    >
                      #{numero}
                    </Text>
                  </XStack>
                </Card>
              </XStack>
              <Text fontSize="$3" items="center" flexWrap="nowrap">
                {destinatario} tiene más de un número.
              </Text>
              <XStack>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}
                >
                  {numerosUnicos.map((num) => (
                    <Button
                      key={num}
                      onPress={() => {
                        setOpen(false);
                        abrirLlamada(num);
                      }}
                      size="$4"
                      theme="blue"
                      icon={
                        <Phone
                          size={16}
                          color={obtenerColor("AZUL_FUERTE", "AZUL_FUERTE")}
                        />
                      }
                      style={{ minWidth: 150 }}
                    >
                      {num}
                    </Button>
                  ))}
                </ScrollView>
              </XStack>

              <Dialog.Close asChild>
                <Button theme="red" size="$4">
                  Cancelar
                </Button>
              </Dialog.Close>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};

// estilos memoizados
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

export default React.memo(cardTelefonoDestinatario);
