import COLORES from "@/src/core/constants/colores.constant";
import { Stack } from "expo-router";
import React from "react";
import BtnMenuDrewer from "@/src/shared/components/btn-menu-drewer";
import { tituloScreen } from "@/src/core/constants/titulo-screen.const";

export default function ProfileLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORES.HEADER_BACKGROUND_COLOR,
      },
      headerLargeTitle: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: 'black'
    }}
  >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <BtnMenuDrewer />,
          title: tituloScreen.perfil.perfil,
        }}
      />
      <Stack.Screen
        name="terminos"
        options={{
          title: tituloScreen.perfil.terminos,
        }}
      />
      <Stack.Screen
        name="privacidad"
        options={{
          title: tituloScreen.perfil.privacidad,
        }}
      />
      <Stack.Screen
        name="eliminar-cuenta"
        options={{
          title: tituloScreen.perfil.eliminar,
        }}
      />
    </Stack>
  );
}
