import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Card, H4, H6, XStack, YStack } from "tamagui";

const EntregaCardDespachoCargado = () => {
  const [despacho, setDespacho] = useState<string | null>(null);
  const [ordenEntrega, setOrdenEntrega] = useState<string | null>(null);
  const valorOrdenEntrega = async () => await AsyncStorage.getItem("ordenEntrega");
  const valorDespacho = async() => await AsyncStorage.getItem("despacho");

  valorOrdenEntrega().then((ordenEntrega) => setOrdenEntrega(ordenEntrega));
  valorDespacho().then((despacho) => setDespacho(despacho));

  if (despacho === null) return null;

  return (
    <Card p="$3" mx="$3" mb={"$2"}>
      <XStack justify="space-between" px="$3">
        <H4>Orden entrega</H4>
        <H6>{ordenEntrega}</H6>
      </XStack>
      <XStack justify="space-between" px="$3">
        <H4>Despacho</H4>
        <H6>{despacho}</H6>
      </XStack>
    </Card>
  );
};

export default EntregaCardDespachoCargado;
