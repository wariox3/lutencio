import { useAppDispatch } from "@/src/application/store/hooks";
import COLORES from "@/src/core/constants/colores.constant";
import CamaraLectorCodigo from "@/src/shared/components/comun/camara-lector-codigos";
import { Search, XCircle } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Card, Input, XStack } from "tamagui";
import { actualizarFiltros } from "../../../application/slice/entrega.slice";

const InputFiltros = () => {
  const dispatch = useAppDispatch();
  const [valorInput, setValorInput] = useState("");

  const filtrarVisitas = (valor: string) => {
    setValorInput(valor); // Actualiza el estado local
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
      p="$2"
      mx="$2"
      mt={"$2"}
      borderStyle={"dashed"}
      bordered
    >
      <XStack items={"center"} gap={"$2"} p={0} >
        <>
        <Search size={"$1.5"} opacity={0.5}></Search>
        <Input
          flex={1}
          placeholder="Buscar número o guía"
          keyboardType="number-pad"
          borderStyle="unset"
          borderColor={"transparent"}
          focusStyle={{ borderColor: "transparent" }}
          onChangeText={(valor) => filtrarVisitas(valor)}
          value={valorInput} // Asigna el valor del estado al input
        ></Input>
        </>

        {valorInput === "" ? (
          <CamaraLectorCodigo
            obtenerData={(data: string) => {
              setValorInput(data); // Actualiza el estado cuando se escanea
              filtrarVisitas(data);
            }}
          ></CamaraLectorCodigo>
        ) : (
          <Pressable
            onPress={() => {
              setValorInput(""), filtrarVisitas("");
            }}
          >
            <XCircle size={"$1.5"} color={COLORES.ROJO_FUERTE} />
          </Pressable>
        )}
      </XStack>
    </Card>
  );
};

export default InputFiltros;
