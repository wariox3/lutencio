import COLORES from "@/src/core/constants/colores.constant";
import {
  Check,
  DatabaseBackup,
  TimerReset,
  X as XIcon,
  LoaderCircle,
  Package,
  Eye,
  Trash2,
} from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Dialog,
  H3,
  Image,
  ScrollView,
  Separator,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { ItemListaProps } from "../../../domain/interfaces/visita-item-lista-log.interface";
import { Animated, Pressable } from "react-native";
import { useAppDispatch } from "@/src/application/store/hooks";
import useNetworkStatus from "@/src/shared/hooks/useNetworkStatus";
import { mostrarAlertHook } from "@/src/shared/hooks/useAlertaGlobal";
import {
  cambiarEstadoSincronizadoError,
  eliminarEntrega,
  entregasProcesadas,
} from "../../../application/slice/entrega.slice";
import MensajeFiltroAplicado from "../visita-filtros/mensaje-filtro-aplicado";
import { alertas } from "@/src/core/constants";

const ItemListaLog: React.FC<ItemListaProps> = ({ visita }) => {
  const dispatch = useAppDispatch();
  const isOnline = useNetworkStatus();
  const [cargando, setCargando] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;

  // 👇 efecto de rotación cuando cargando cambia
  useEffect(() => {
    if (cargando) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, // velocidad de giro
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [cargando]);

  // 👇 interpolación para convertir 0→1 en grados
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const sincronizarVisita = async () => {
    if (!isOnline) {
      mostrarAlertHook({
        titulo: "Error",
        mensaje: "No hay conexión a internet",
        onAceptar: () => {},
      });
      return;
    }

    if (!visita) return;

    try {
      setCargando(true);

      await dispatch(
        cambiarEstadoSincronizadoError({
          visitaId: visita.id,
          nuevoEstado: false,
          codigo: 0,
          mensaje: "",
        })
      );

      await dispatch(entregasProcesadas({ entregasIds: [visita.id] }));
    } finally {
      setCargando(false);
    }
  };

  const confirmarRetirarVisita = (id: number, numero: number) => {
    mostrarAlertHook({
      titulo: alertas.titulo.advertencia,
      mensaje: `${alertas.mensaje.accionIrreversible} Número de guía: ${numero}`,
      onAceptar: () => retirarDespacho(id),
    });
  };

  const retirarDespacho = async (id: number) => {
    dispatch(eliminarEntrega(id));
  };

  return (
    <Card
      py="$2"
      px="$3"
      mx="$2"
      mt="$1.5"
      borderRadius="$3"
      borderWidth={1}
      bg={undefined}
      borderColor={"$borderColor"}
      borderStyle={"solid"}
      bordered={false}
    >
      <YStack gap={"$1"}>
        <XStack justify={"space-between"}>
          <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
            <XStack justify={"center"} items="baseline">
              <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$2">
                ID: {visita.id}
              </Text>
            </XStack>
          </Card>

          <Card bg={COLORES.AZUL_FUERTE} borderRadius="$2" p="$1.5">
            <XStack items="center" gap="$1.5">
              <Package size="$1" color={COLORES.BLANCO} />
              <Text color={COLORES.BLANCO} fontWeight="bold" fontSize="$1">
                #{visita.numero}
              </Text>
            </XStack>
          </Card>
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
                  {visita.estado_entregado === true &&
                  visita.estado_sincronizado === false ? (
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
        <XStack justify={"space-between"} items="center">
          {visita.arrImagenes?.length > 0 ? (
            <XStack mt={8}>
              <Dialog modal>
                <Dialog.Trigger asChild>
                  <Card bg={COLORES.AZUL_FUERTE} my={2} p={"$2"}>
                    <XStack gap={"$2"} items={"center"}>
                      <Eye size={"$1"} color={COLORES.BLANCO}></Eye>
                      <Text color={COLORES.BLANCO} fontWeight={"bold"}>
                        {visita?.arrImagenes
                          ? `Imágenes: ${visita.arrImagenes.length}`
                          : null}
                      </Text>
                    </XStack>
                  </Card>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0.5 }}
                    exitStyle={{ opacity: 0.5 }}
                  />
                  <Dialog.Content bordered elevate width="90%" height="45%">
                    {/* Header del modal */}
                    <YStack gap={"$2"}>
                      <XStack justify="space-between" items="center" mb="$3">
                        <H3>Imágenes</H3>
                        <Dialog.Close asChild>
                          <Button size="$5" chromeless>
                            <XIcon size={"$5"} color={COLORES.ROJO_FUERTE} />
                          </Button>
                        </Dialog.Close>
                      </XStack>
                      <XStack justify={"space-between"}>
                        <Card
                          bg={COLORES.AZUL_FUERTE}
                          borderRadius="$2"
                          p="$1.5"
                        >
                          <XStack justify={"center"} items="baseline">
                            <Text
                              color={COLORES.BLANCO}
                              fontWeight="bold"
                              fontSize="$2"
                            >
                              ID: {visita.id}
                            </Text>
                          </XStack>
                        </Card>

                        <Card
                          bg={COLORES.AZUL_FUERTE}
                          borderRadius="$2"
                          p="$1.5"
                        >
                          <XStack items="center" gap="$1.5">
                            <Package size="$1" color={COLORES.BLANCO} />
                            <Text
                              color={COLORES.BLANCO}
                              fontWeight="bold"
                              fontSize="$1"
                            >
                              #{visita.numero}
                            </Text>
                          </XStack>
                        </Card>
                      </XStack>
                      {/* Galería scrollable horizontal */}
                      {visita?.arrImagenes?.length ? (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <XStack gap="$3">
                            {visita.arrImagenes.map((item: any, i: number) => (
                              <Image
                                key={i}
                                source={{ uri: item.uri }}
                                width={200}
                                height={200}
                              />
                            ))}
                          </XStack>
                        </ScrollView>
                      ) : null}
                    </YStack>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </XStack>
          ) : (
            <View />
          )}
          <XStack items="center" gap={"$7"}>
            {visita.entregada_sincronizada_error ? (
              <Pressable onPress={sincronizarVisita} disabled={cargando}>
                {cargando ? (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <LoaderCircle size={"$3"} color={COLORES.AZUL_FUERTE} />
                  </Animated.View>
                ) : (
                  <>
                    <DatabaseBackup size={"$3"} color={COLORES.AZUL_FUERTE} />
                  </>
                )}
              </Pressable>
            ) : (
              <View />
            )}
            {visita.entregada_sincronizada_codigo >= 400 &&
            visita.entregada_sincronizada_codigo <= 499 ? (
              <Pressable
                onPress={() => confirmarRetirarVisita(visita.id, visita.numero)}
              >
                <Trash2 size={"$3"} color={COLORES.ROJO_FUERTE} />
              </Pressable>
            ) : (
              <View />
            )}
          </XStack>
        </XStack>
        <View mt={8}>
          {visita.entregada_sincronizada_error_mensaje ? (
            <Text color={COLORES.ROJO_FUERTE}>
              Mensaje: {visita.entregada_sincronizada_error_mensaje}
            </Text>
          ) : null}
        </View>
      </YStack>
    </Card>
  );
};

export default ItemListaLog;
