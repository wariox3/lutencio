import COLORES from "@/src/core/constants/colores.constant";
import { Check, TimerReset, X as XIcon } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Button, Card, Dialog, H3, Image, ScrollView, Separator, Text, View, XStack, YStack } from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista-log";

const ItemListaLog: React.FC<ItemListaProps> = ({ visita }) => {

  console.log(visita);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );

  return (
    <Card p="$3" mx="$2" mt={"$2"} borderStyle={"dashed"} bordered>
      <YStack gap={"$1"}>
        <XStack justify={"space-between"}>
          <Text>ID: {visita.id}</Text>
          <Text>#{visita.numero}</Text>
        </XStack>
        <XStack justify={"space-between"}>
          <YStack items={"center"} gap={"$1.5"}>
            <Text>Entregado</Text>
            <>
              {visita.estado_entregado ? (
                <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
              ) : null}
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />
          <YStack items={"center"} gap={"$1.5"}>
            <Text>Novedad</Text>
            <>
              {visita.estado_novedad ? (
                <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
              ) : null}
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />
          <YStack items={"center"} gap={"$1.5"}>
            <Text fontSize={"$4"}>Sincronizado</Text>
            <>
              {visita.estado_sincronizado ? (
                <Check size={"$1"} color={COLORES.VERDE_FUERTE} />
              ) : (
                <>
                  {visita.estado_entrega === true &&
                    visita.estado_sinconizado === false ? (
                    <TimerReset size={"$1"} color={COLORES.VERDE_FUERTE} />
                  ) : null}
                </>
              )}
            </>
          </YStack>
          <Separator self="stretch" vertical mx={16} />
          <YStack items={"center"} gap={"$1.5"}>
            <Text>Error</Text>
            {visita.entregada_sincronizada_error ? (
              <>
                <XIcon size={"$1"} color={COLORES.ROJO_FUERTE} />
              </>
            ) : null}
          </YStack>
        </XStack>
        <View mt={8}>
          {visita.entregada_sincronizada_error_mensaje ? (
            <Text color={COLORES.ROJO_FUERTE}>
              Mensaje: {visita.entregada_sincronizada_error_mensaje}
            </Text>
          ) : null}
        </View>
        {
          visita.arrImagenes?.length > 0 ? (
            <XStack mt={8}>
              <Dialog modal>
                <Dialog.Trigger asChild>
                  <Text color={COLORES.AZUL_FUERTE} my={2}>
                    {visita?.arrImagenes
                      ? `Evidencia: imágenes ${visita.arrImagenes.length}`
                      : null}
                  </Text>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0.5 }}
                    exitStyle={{ opacity: 0.5 }}
                  />
                  <Dialog.Content
                    bordered
                    elevate
                    width="90%"
                    height="32%"
                  >
                    {/* Header del modal */}
                    <XStack justify="space-between" items="center" mb="$3">
                      <H3>Imágenes</H3>
                      <Dialog.Close asChild>
                        <Button size="$5" chromeless>
                          <XIcon size={'$5'} color={COLORES.ROJO_FUERTE} />
                        </Button>
                      </Dialog.Close>
                    </XStack>
                    {/* Galería scrollable horizontal */}
                    {visita?.arrImagenes?.length ? (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <XStack gap="$3">
                          {visita.arrImagenes.map((item: any, i: number) => (
                            <Image
                              key={i}
                              source={{ uri: item.uri }}
                              width={200}
                              height={200} />
                          ))}
                        </XStack>
                      </ScrollView>
                    ) : (
                      null
                    )}
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </XStack>
          ) : null
        }

      </YStack>
    </Card>
  );
};

export default ItemListaLog;
