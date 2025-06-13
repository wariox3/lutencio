import { useAppDispatch } from "@/src/application/store/hooks";
import CamaraLectorCodigo from "@/src/shared/components/comun/camara-lector-codigos";
import { Search, XCircle } from "@tamagui/lucide-icons";
import React from "react";
import { Button, Card, Input, XStack } from "tamagui";
import { actualizarFiltros } from "../../../application/slice/entrega.slice";
import { useState } from "react";

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
      p="$3"
      mx="$2"
      mt={"$2"}
      bg={"white"}
      borderStyle={"dashed"}
      bordered
    >
      <XStack bg={"white"} items={"center"} gap={"$2"}>
        <Search size={"$1.5"} opacity={0.5}></Search>
        <Input
          flex={1}
          placeholder="Buscar numero o guía"
          unstyled
          keyboardType="number-pad"
          onChangeText={(valor) => filtrarVisitas(valor)}
          value={valorInput} // Asigna el valor del estado al input
        ></Input>
        {valorInput === "" ? (
          <CamaraLectorCodigo
            obtenerData={(data: string) => {
              setValorInput(data); // Actualiza el estado cuando se escanea
              filtrarVisitas(data);
            }}
          ></CamaraLectorCodigo>
        ) : (
          <Button unstyled>
            <Button
              size="$4"
              circular
              icon={<XCircle size={"$1.5"} color={"$red10"} />}
              onPress={() => {setValorInput(""), filtrarVisitas("")}}
              theme={"red"}
            />
          </Button>
        )}
      </XStack>
    </Card>
  );
};

export default InputFiltros;
