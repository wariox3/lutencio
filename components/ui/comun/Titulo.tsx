import React from "react";
import { H4, View } from "tamagui";

interface TituloProps {
  texto: string; // Propiedad opcional para definir una ruta específica
}

const Titulo = ({ texto }: TituloProps) => {
  return (
    <View paddingInline={"$2"} mb={"$2"}>
      <H4>{texto}</H4>
    </View>
  );
};

export default Titulo;
