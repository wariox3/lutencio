import { useAppDispatch } from "@/src/application/store/hooks";
import { ScanQrCode, Search } from "@tamagui/lucide-icons";
import React from "react";
import { Card, Input, XStack } from "tamagui";
import { actualizarFiltros } from "../../../application/slice/entrega.slice";

const InputFiltros = () => {
  const dispatch = useAppDispatch();

  const filtrarVisitas = (valor: string) => {
    console.log(valor);

    dispatch(
      actualizarFiltros({
        guia: Number(valor) || 0,
        numero: Number(valor) || 0,
      })
    );
  };

  return (
    <Card
      position="relative"
      z={99}
      p="$3"
      mx="$2"
      mt={"$2"}
      bg={"white"}
      borderStyle={"dashed"}
      bordered
    >
      <XStack
        bg={"white"}
        items={"center"}
        gap={"$2"}
      >
        <Search size={"$1.5"} opacity={0.5}></Search>
        <Input
          flex={1}
          placeholder="Buscar numero o guía"
          unstyled
          keyboardType="number-pad"
          onChangeText={(valor) => filtrarVisitas(valor)}
        ></Input>
        <ScanQrCode size={"$1.5"}></ScanQrCode>
      </XStack>
    </Card>
  );
};

export default InputFiltros;
