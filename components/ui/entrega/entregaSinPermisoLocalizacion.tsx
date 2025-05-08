import React from "react";
import { Card, H4, H6, Text, View } from "tamagui";

const EntregaSinPermisoLocalizacion = () => {
  return (
    <Card flex={0.1} my={"$1"} theme={"red"} padding={16}>
      <H6 mb="$2">Información</H6>
      <Text mb="$4">No se cuenta con el permiso de la localización</Text>
    </Card>
  );
};

export default EntregaSinPermisoLocalizacion;
