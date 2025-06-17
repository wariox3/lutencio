import { STORAGE_KEYS } from "@/src/core/constants";
import storageService from "@/src/core/services/storage.service";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Card, H4, H6, XStack } from "tamagui";

const OrdenEntregaInformacion = () => {
  const [despacho, setDespacho] = useState<string | null>(null);
  const [ordenEntrega, setOrdenEntrega] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      obtenerInformacion();
    }, [])
  );

  const obtenerInformacion = async () => {
    const valorOrdenEntrega = await storageService.getItem(
      STORAGE_KEYS.ordenEntrega
    ) as string;
    const valorDespacho = await storageService.getItem(
      STORAGE_KEYS.despacho
    ) as string;
    setOrdenEntrega(valorOrdenEntrega);
    setDespacho(valorDespacho);
  };

  if (despacho === null) return null;

  return (
    <Card
      p="$3"
      mx="$3"
      my={"$2"}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.30)",
      }}
    >
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

export default OrdenEntregaInformacion;
