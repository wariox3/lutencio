import React from "react";
import { H4, View } from "tamagui";
import { TituloProps } from "../../interface/comun";

const Titulo = ({ texto }: TituloProps) => {
  return (
    <View paddingInline={"$2"} mb={"$2"}>
      <H4>{texto}</H4>
    </View>
  );
};

export default Titulo;
