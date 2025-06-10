import React from "react";
import { Card, Text, XStack, YStack } from "tamagui";
import COLORES from "@/src/core/constants/colores.constant";
import { FilterX } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/application/store/hooks";
import { obtenerFiltroGuia, obtenerFiltroNumero } from "../../../application/slice/entrega.selector";
import { quitarFiltros } from "../../../application/slice/entrega.slice";

interface MensajeFiltroAplicado {
  resultado: number;
}

const MensajeFiltroAplicado = ({ resultado }: MensajeFiltroAplicado) => {

  const guia = useAppSelector(obtenerFiltroGuia)
  const numero = useAppSelector(obtenerFiltroNumero)
  const dispatch = useAppDispatch();

  const limpiarFiltros = () => {
    dispatch(quitarFiltros())
  }

  return (
    <Card
      backgroundColor={COLORES.AZUL_SUAVE}
      borderRadius="$4"
      padding="$3.5"
      marginTop={"$2"}
    >
      <XStack items="center" justify="space-between" gap={"$1"}>
        <YStack>
          <Text fontSize="$3" opacity={0.7}>
            Filtros activos ({resultado} resultados)
          </Text>
          <Text fontSize="$3" opacity={0.7}>
            Guía: {guia}
          </Text>
          <Text fontSize="$3" opacity={0.7}>
            Número: {numero}
          </Text>
        </YStack>
        <Pressable onPress={limpiarFiltros}>
          <FilterX></FilterX>
        </Pressable>
      </XStack>
    </Card>
  );
};

export default MensajeFiltroAplicado;
