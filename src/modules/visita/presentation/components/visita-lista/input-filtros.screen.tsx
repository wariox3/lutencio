import COLORES from "@/src/core/constants/colores.constant";
import CamaraLectorCodigo from "@/src/shared/components/comun/camara-lector-codigos";
import { Search, XCircle } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Card, Input, XStack } from "tamagui";

interface InputFiltrosProps {
  onFilterChange: (valor: string) => void;
  placeholder: string;
}

const InputFiltros: React.FC<InputFiltrosProps> = ({ onFilterChange, placeholder }) => {
  const [valorInput, setValorInput] = useState("");

  const filtrarVisitas = (valor: string) => {
    setValorInput(valor);
        
    // Llamar al callback con los nuevos valores de filtro
    onFilterChange(valor);
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
          placeholder={placeholder || "Buscar por número"}
          keyboardType="number-pad"
          borderStyle="unset"
          borderColor={"transparent"}
          focusStyle={{ borderColor: "transparent" }}
          onChangeText={(valor) => filtrarVisitas(valor)}
          value={valorInput}
        ></Input>
        </>

        {valorInput === "" ? (
          <CamaraLectorCodigo
            obtenerData={(data: string) => {
              setValorInput(data);
              filtrarVisitas(data);
            }}
          ></CamaraLectorCodigo>
        ) : (
          <Pressable
            onPress={() => {
              setValorInput("");
              filtrarVisitas("");
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
