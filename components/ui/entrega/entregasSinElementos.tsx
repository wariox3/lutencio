import { rutasApp } from "@/src/core/constants/rutas.constant";
import { Car, ClipboardPlus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Card, H6, ListItem, Text, View, YGroup } from "tamagui";

const EntregasSinElementos = () => {
  const router = useRouter();

  const navegarCargar = () => {
    router.navigate(rutasApp.vistaCargar);
  };

  return (
    <>
      <Card flex={0.1} my={"$2"} theme={"blue"} padding={16} mx={"$4"}>
        <H6 mb="$2">Información</H6>
        <Text mb="$4">Vincular una orden de entrega</Text>
      </Card>
      <Card flex={0.1} my={"$2"} padding={16} mx={"$4"}>
        <YGroup width={"auto"} flex={1} size="$4" gap="$4">
          <H6>Orden de entrega</H6>
          <YGroup.Item>
            <ListItem
              hoverTheme
              icon={<ClipboardPlus size="$2" />}
              title="Vincular"
              subTitle="Vincular una orden de entrega"
              onPress={() => navegarCargar()}
            />
          </YGroup.Item>
        </YGroup>
      </Card>
    </>
  );
};

export default EntregasSinElementos;
