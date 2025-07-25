import { tituloScreen } from "@/src/core/constants/titulo-screen.const";
import BtnMenuDrewer from "@/src/shared/components/navegacion/btn-menu-drewer";
import { useTemaVisual } from "@/src/shared/hooks/useTemaVisual";
import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  const { obtenerColor } = useTemaVisual();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: obtenerColor(
            "HEADER_BACKGROUND_COLOR_LIGHT",
            "HEADER_BACKGROUND_COLOR_DARK"
          ),
        },
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: obtenerColor("NEGRO", "BLANCO"),
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
